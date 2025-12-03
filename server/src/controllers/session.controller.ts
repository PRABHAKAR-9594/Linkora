// controllers/session.controller.ts
import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import {
  getActiveSessions,
  revokeSessionById,
  logoutAllExceptCurrentService,
} from "../services/session.service";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { validateUserExists } from "../utils/helper/dbValidators";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../utils/helper/generateVerifyJwtToken";
import { SESSION_MESSAGES } from "../utils/constants";

export const getSessions = asyncHandler(async (req: Request, res: Response) => {
  const sessions = await getActiveSessions(req.currentUser.id);
  res.json(ApiResponse.success(sessions, SESSION_MESSAGES.SESSIONS_FETCHED));
});

export const deleteSession = asyncHandler(
  async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    await revokeSessionById(req.currentUser.id, sessionId);
    res.json(ApiResponse.success(null, SESSION_MESSAGES.SESSION_REVOKED));
  }
);

export const logoutAllExceptCurrent = asyncHandler(
  async (req: Request, res: Response) => {
    const currentSessionId = req.auth?.sessionId;
    const { id } = req.currentUser;
    
    const user = await validateUserExists(id);

    if (!currentSessionId) {
      throw ApiError.BadRequest(SESSION_MESSAGES.SESSION_ID_MISSING);
    }

    const { accessToken, refreshToken } = await logoutAllExceptCurrentService(
      currentSessionId,
      user._id,
      user.tokenVersion
    );
    res
      .cookie("linkora_access_token", accessToken, accessTokenCookieOptions)
      .cookie("linkora_refresh_token", refreshToken, refreshTokenCookieOptions)
      .json(ApiResponse.success(null, SESSION_MESSAGES.LOGGED_OUT_OTHER_DEVICES));
  }
);
