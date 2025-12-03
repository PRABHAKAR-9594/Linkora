import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import mongoose, { Types } from "mongoose";
import { randomUUID } from "crypto";

import { User } from "../models/user.model";
import { Otp } from "../models/otp.model";
import { RefreshTokenModel } from "../models/refreshToken.model";

import { ApiError } from "../utils/apiResponseHandler/apiError";
import { AUTH_MESSAGES, USER_MESSAGES } from "../utils/constants";
import { redisClient } from "../config/redis.config";

import {
  DeviceMeta,
  RegisterUserInput,
  TokenPayload,
  VerificationTokenPayload,
} from "../types/auth.types";

import {
  generateVerificationToken,
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/helper/generateVerifyJwtToken";
import { normalizeLocation } from "../utils/helper/locationValidator";

export const registerNewUser = async ({
  userName,
  email,
  password,
}: RegisterUserInput) => {
  if (await User.findOne({ email }))
    throw ApiError.Conflict(USER_MESSAGES.EMAIL_EXISTS);

  if (await User.findOne({ userName }))
    throw ApiError.Conflict(USER_MESSAGES.USERNAME_EXISTS);

  const hash = await bcrypt.hash(password, 10);
  const profileImage = `https://api.dicebear.com/9.x/initials/svg?seed=${email[0]}&radius=50`;

  const user = await User.create({
    userName,
    email,
    password: hash,
    profileImage,
  });

  const token = generateVerificationToken({ id: user._id });

  return { user, token };
};

export const handleSendOtp = async (
  userId: Types.ObjectId,
  email: string,
  userName: string
) => {
  const otpNumber = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await Otp.create({ userId, otp: otpNumber });

  console.log("Generated OTP:", otpNumber); // Replace with email sending
};

export const handleVerifyOtp = async (userId: string, otpNumber: number) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);

  if (user.verified) throw ApiError.Conflict(USER_MESSAGES.EMAIL_EXISTS);

  const otpRecord = await Otp.findOne({ userId }).sort({ createdAt: -1 });
  if (!otpRecord) throw ApiError.BadRequest(AUTH_MESSAGES.OTP_NOT_FOUND);

  if (otpRecord.expiresAt < new Date()) {
    await otpRecord.deleteOne();
    throw ApiError.BadRequest(AUTH_MESSAGES.OTP_EXPIRED);
  }

  if (otpRecord.otp !== Number(otpNumber)) {
    throw ApiError.BadRequest(AUTH_MESSAGES.WRONG_OTP);
  }

  user.verified = true;
  await user.save();
  await otpRecord.deleteOne();

  return { success: true, message: AUTH_MESSAGES.OTP_VERIFIED };
};

export const handleResendOtp = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);
  if (user.verified)
    throw ApiError.Conflict(AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED);

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  await Otp.create({ userId, otp });
  console.log("Resent OTP:", otp);
};

export const handleUserLogin = async (
  usernameOrEmail: string,
  password: string,
  meta: DeviceMeta
) => {
  const query = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail)
    ? { email: usernameOrEmail }
    : { userName: usernameOrEmail };

  const user = await User.findOne(query).select("+password");
  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);

  if (!(await bcrypt.compare(password, user.password)))
    throw ApiError.Unauthorized(AUTH_MESSAGES.INVALID_PASSWORD);

  const sessionId = randomUUID();
  const payload: TokenPayload = {
    id: user._id,
    sessionId,
    tokenVersion: user.tokenVersion,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const decoded: any = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  );
  const userId = user._id;
  const tokenDoc = await RefreshTokenModel.create({
    userId: user._id,
    token: refreshToken,
    sessionId,
    deviceName: meta.deviceName,
    ipAddress: meta.ipAddress,
    broswerInfo: meta.broswerInfo,
    osInfo: meta.osInfo,
    userAgent: meta.userAgent,
    location: normalizeLocation(meta.location),
    revoked: false,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  await redisClient.setEx(
    `session:${sessionId}`,
    ttl,
    JSON.stringify({
      userId: user._id.toString(),
      tokenId: tokenDoc._id.toString(),
    })
  );

  return { accessToken, refreshToken, userId };
};

export async function verifyAndRotateRefreshToken(oldToken: string) {
  const secret = process.env.JWT_REFRESH_SECRET!;
  const payload = verifyToken(oldToken, secret) as TokenPayload;

  const sessionData = await redisClient.get(`session:${payload.sessionId}`);
  if (!sessionData)
    throw ApiError.Unauthorized(AUTH_MESSAGES.SESSION_EXPIRED_DEVICE);

  const newPayload = {
    id: payload.id,
    sessionId: payload.sessionId,
    tokenVersion: payload.tokenVersion,
  };

  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  const decoded = jwt.decode(newRefreshToken) as any;
  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  await redisClient.expire(`session:${payload.sessionId}`, ttl);

  return { newAccessToken, newRefreshToken };
}

export const handleLogout = async (userId: string, sessionId: string) => {
  await RefreshTokenModel.updateOne(
    { userId, sessionId, revoked: false },
    { revoked: true }
  );

  await redisClient.del(`session:${sessionId}`);

  await redisClient.del(`user:${userId}`);
};

export const handleSendPasswordResetEmail = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);

  const token = generateVerificationToken({ id: user._id });
  user.verificationToken = token;
  await user.save();

  console.log("Password reset link:", token);
};

export const handleResetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword)
    throw ApiError.BadRequest(AUTH_MESSAGES.INVALID_PASSWORD);

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);

  user.password = await bcrypt.hash(password, 10);
  await user.save();
};

export const getUserById = async (userId: string) => {
  const cached = await redisClient.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        userName: 1,
        email: 1,
        phoneNumber: 1,
        dob: 1,
        profileImage: 1,
        about: 1,
        location: 1,
        joiningDate: 1,
        friendsCount: { $size: "$friends" },
      },
    },
  ]);

  if (!user) throw ApiError.NotFound(USER_MESSAGES.NOT_FOUND);

  await redisClient.setEx(`user:${userId}`, 1800, JSON.stringify(user[0]));
  return user[0];
};
