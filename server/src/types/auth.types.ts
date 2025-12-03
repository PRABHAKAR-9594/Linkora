import { Types } from "mongoose";
import { Location } from "./model.types";

export type JWTTokenPayload = {
  id: string;
  iat: number;
  exp: number;
  sessionId: string;
  tokenVersion: number;
};

export type JWTTVerificationokenPayload = {
  id: string;
  iat: number;
  exp: number;
};

export type VerificationTokenPayload = {
  id: Types.ObjectId;
};

export type TokenPayload = {
  id: Types.ObjectId;
  sessionId: string;
  tokenVersion: number;
};

export type RegisterUserInput = {
  userName: string;
  email: string;
  password: string;
};

export type DeviceMeta = {
  deviceName?: string;
  ipAddress?: string;
  broswerInfo?: string;
  osInfo?: string;
  userAgent?: string;
  location?: Location;
};
