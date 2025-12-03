import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { AUTH_MESSAGES, HTTP_STATUS } from "../utils/constants";
import asyncHandler from "./asyncHandler.middleware";
import {
  JWTTokenPayload,
  JWTTVerificationokenPayload,
} from "../types/auth.types";
import { validateUserExists } from "../utils/helper/dbValidators";
import { redisClient } from "../config/redis.config";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;

export const authenticateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.linkora_access_token;

    if (!token) {
      throw ApiError.Unauthorized(AUTH_MESSAGES.MISSING_TOKEN);
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JWTTokenPayload;

    const { id: userId, sessionId, tokenVersion } = decoded;

    if (!userId || !sessionId) {
      throw ApiError.Unauthorized(AUTH_MESSAGES.INVALID_TOKEN_PAYLOAD);
    }

    const user = await validateUserExists(userId.toString());

    if (user.tokenVersion !== tokenVersion) {
      throw ApiError.Unauthorized(AUTH_MESSAGES.SESSION_EXPIRED_GLOBAL, {
        clearCookies: true,
      });
    }

    const sessionData = await redisClient.get(`session:${sessionId}`);
    if (!sessionData) {
      throw ApiError.Unauthorized(AUTH_MESSAGES.SESSION_EXPIRED_DEVICE, {
        clearCookies: true,
      });
    }
    
    req.currentUser = {
      id: decoded.id,
      iat: decoded.iat,
      exp: decoded.exp,
    };
 
    req.auth = {
      sessionId: sessionId,
    };

    next();
  }
);

const JWT_VERIFICATION_SECRET = process.env.JWT_VERIFICATION_SECRET as string;

export const verifyAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.verification_token;

    if (!token) {
      throw ApiError.Unauthorized(AUTH_MESSAGES.MISSING_TOKEN);
    }

    // Check the JWTTokenPayload cause an error or not while verification in decoded
    const decoded = jwt.verify(
      token,
      JWT_VERIFICATION_SECRET
    ) as JWTTVerificationokenPayload;

    if (!decoded?.id) {
      throw ApiError.Unauthorized(AUTH_MESSAGES.INVALID_TOKEN_PAYLOAD);
    }
    const user = await validateUserExists(decoded.id.toString());

    req.currentUser = decoded;

    next();
  }
);
