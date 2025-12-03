import jwt from "jsonwebtoken";
import { TokenPayload, VerificationTokenPayload } from "../../types/auth.types";

const JWT_VERIFICATION_SECRET = process.env.JWT_VERIFICATION_SECRET as string;
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
// ===========================
//  TOKEN DURATIONS
// ===========================
export const ACCESS_EXPIRES_IN = "15m"; // 15 minutes
export const REFRESH_EXPIRES_IN = "7d"; // 7 days
export const VERIFICATION_EXPIRES_IN = "10m"; // 10 minutes

// ===========================
//  COOKIE CONFIGS
// ===========================

// For access tokens (short-lived)
export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 15 * 60 * 1000, // 15 minutes
};

// For refresh tokens (long-lived)
export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// For verification tokens (OTP/send-password email)
export const verificationCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 10 * 60 * 1000, // 10 minutes
};

// ===========================
// TOKEN GENERATORS
// ===========================
export function generateAccessToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function generateRefreshToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

export function generateVerificationToken(payload: VerificationTokenPayload) {
  return jwt.sign(payload, JWT_VERIFICATION_SECRET, {
    expiresIn: VERIFICATION_EXPIRES_IN,
  });
}

// ===========================
//  TOKEN VERIFIER
// ===========================
export function verifyToken(token: string, secret: string) {
  return jwt.verify(token, secret) as TokenPayload;
}
