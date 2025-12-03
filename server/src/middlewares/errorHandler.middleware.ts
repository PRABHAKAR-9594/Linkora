import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import { COMMON_MESSAGES, HTTP_STATUS } from "../utils/constants";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is ApiError, extract its values properly
  const status = err instanceof ApiError ? err.status : HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err instanceof ApiError ? err.message : COMMON_MESSAGES.INTERNAL_SERVER_ERROR;

  if (err.meta?.clearCookies) {
    res.clearCookie("linkora_access_token");
    res.clearCookie("linkora_refresh_token");
  }

  const stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

  return res.status(status).json(
    new ApiResponse({
      status,
      message,
      data: stack ? { stack } : null,
      success: status < 400 ? true : false,
    })
  );
};

export default errorMiddleware;
