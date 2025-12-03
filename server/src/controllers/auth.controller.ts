import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import {
  HTTP_STATUS,
  AUTH_MESSAGES,
  COMMON_MESSAGES,
  USER_MESSAGES,
  SESSION_MESSAGES,
} from "../utils/constants";
import {
  registerNewUser,
  handleUserLogin,
  handleSendPasswordResetEmail,
  handleResetPassword,
  handleSendOtp,
  handleVerifyOtp,
  handleResendOtp,
  getUserById,
  handleLogout,
  verifyAndRotateRefreshToken,
} from "../services/auth.service";

import {
  verificationCookieOptions,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/helper/generateVerifyJwtToken";

export const registerUser = [
  body("userName").isLength({ min: 3 }).withMessage("Username is too short"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password too short"),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw ApiError.BadRequest(errors.array()[0].msg);

    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);

    const { user, token } = await registerNewUser({
      userName,
      email,
      password,
    });
    await handleSendOtp(user._id, email, userName);

    res
      .cookie("verification_token", token, verificationCookieOptions)
      .status(201)
      .json(ApiResponse.created({ user }, USER_MESSAGES.REGISTER_SUCCESS));
  }),
];

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;
  if (!otp) throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);

  const { id } = req.currentUser;

  await handleVerifyOtp(id, otp);

  res.status(200).json(ApiResponse.success(null, AUTH_MESSAGES.OTP_VERIFIED));
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.currentUser;

  await handleResendOtp(id);

  res.status(200).json(ApiResponse.success(null, AUTH_MESSAGES.OTP_RESENT));
});

export const loginUser = [
  body("usernameOrEmail").notEmpty().withMessage("Email or username required"),
  body("password").notEmpty().withMessage("Password required"),
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw ApiError.BadRequest(errors.array()[0].msg);

    const { usernameOrEmail, password, meta } = req.body;
    const { userId, accessToken, refreshToken } = await handleUserLogin(
      usernameOrEmail,
      password,
      meta
    );

    res
      .cookie("linkora_access_token", accessToken, accessTokenCookieOptions)
      .cookie("linkora_refresh_token", refreshToken, refreshTokenCookieOptions)
      .status(200)
      .json(ApiResponse.success(AUTH_MESSAGES.LOGIN_SUCCESS));
  }),
];

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const oldToken = req.cookies.linkora_refresh_token;
    if (!oldToken) throw ApiError.Unauthorized(AUTH_MESSAGES.MISSING_TOKEN);

    const { newAccessToken, newRefreshToken } =
      await verifyAndRotateRefreshToken(oldToken);

    res
      .cookie("linkora_access_token", newAccessToken, accessTokenCookieOptions)
      .cookie(
        "linkora_refresh_token",
        newRefreshToken,
        refreshTokenCookieOptions
      )
      .status(200)
      .json(ApiResponse.success(null, AUTH_MESSAGES.TOKEN_REFRESHED));
  }
);

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.currentUser.id;
  const sessionId = req.auth?.sessionId;

  if (!sessionId) {
    throw ApiError.BadRequest(SESSION_MESSAGES.SESSION_ID_MISSING);
  }

  await handleLogout(userId, sessionId);

  res.clearCookie("linkora_access_token");
  res.clearCookie("linkora_refresh_token");

  res.status(200).json(ApiResponse.success(null, AUTH_MESSAGES.LOGOUT_SUCCESS));
});

export const sendPasswordResetEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw ApiError.BadRequest(AUTH_MESSAGES.EMAIL_REQUIRED);
    }

    await handleSendPasswordResetEmail(email);

    return res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(null, AUTH_MESSAGES.EMAIL_SENT));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.query.token as string;
    const { password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      throw ApiError.BadRequest(COMMON_MESSAGES.REQUIRED_FIELDS);
    }

    await handleResetPassword(token, password, confirmPassword);

    return res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(null, AUTH_MESSAGES.PASSWORD_UPDATED));
  }
);

export const getCurentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.currentUser;
    const user = await getUserById(id);

    res.status(200).json(ApiResponse.success(user, USER_MESSAGES.FOUND));
  }
);
