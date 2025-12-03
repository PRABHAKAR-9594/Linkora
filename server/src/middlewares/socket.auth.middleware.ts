import dotenv from "dotenv";
import { Socket } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { JWTTokenPayload } from "../types/auth.types";
import { SOCKET_AUTH_MESSAGES } from "../utils/constants";

dotenv.config();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

// Socket authentication middleware
export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) {
    return next(new Error(SOCKET_AUTH_MESSAGES.NO_COOKIES));
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.linkora_access_token;

  if (!token) {
    return next(new Error(SOCKET_AUTH_MESSAGES.NO_TOKEN));
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as JWTTokenPayload;
    socket.data.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Invalid or expired token");
    next(new Error(SOCKET_AUTH_MESSAGES.INVALID_TOKEN));
  }
};
