import { RefreshTokenModel } from "../models/refreshToken.model";
import { redisClient } from "../config/redis.config";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { SESSION_MESSAGES } from "../utils/constants";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/helper/generateVerifyJwtToken";
import { Types } from "mongoose";

export const getActiveSessions = async (userId: string) => {
  const sessions = await RefreshTokenModel.find({
    userId,
    revoked: false,
  }).select(
    "sessionId deviceName ipAddress  osInfo userAgent location createdAt"
  );
  
  return sessions;
};

export const revokeSessionById = async (userId: string, sessionId: string) => {
  const session = await redisClient.get(`session:${sessionId}`);

  if (!session) {
    throw ApiError.NotFound(SESSION_MESSAGES. SESSION_NOT_FOUND_OR_LOGGED_OUT);
  }

  const parsed = JSON.parse(session);
  if (parsed.userId !== userId.toString()) {
    throw ApiError.Forbidden(SESSION_MESSAGES.NOT_AUTHORIZED_TO_REVOKE);
  }

  await redisClient.del(`session:${sessionId}`);

  await RefreshTokenModel.updateOne({ sessionId }, { revoked: true });
};

export const logoutAllExceptCurrentService = async (
  currentSessionId: string,
  userId: Types.ObjectId,
  tokenVersion: number
) => {
  const sessions = await redisClient.keys(`session:*`);

  for (const key of sessions) {
    const session = await redisClient.get(key);
    if (session) {
      const parsed = JSON.parse(session);
      if (
        parsed.userId === userId.toString() &&
        !key.includes(currentSessionId)
      ) {
        await redisClient.del(key);
      }
    }
  }

  const payload = {
    id: userId,
    sessionId: currentSessionId,
    tokenVersion: tokenVersion,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
};
