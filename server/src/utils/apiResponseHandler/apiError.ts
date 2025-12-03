class ApiError extends Error {
  status: number;
  success: boolean;
  meta?: Record<string, any>; // Optional metadata (clearCookies)

  constructor(status: number, message: string, meta?: Record<string, any>) {
    super(message);
    this.status = status;
    this.success = false;
    this.meta = meta;
  }

  static BadRequest(msg: string, meta?: Record<string, any>) {
    return new ApiError(400, msg, meta);
  }
  static Unauthorized(msg: string, meta?: Record<string, any>) {
    return new ApiError(401, msg, meta);
  }
  static Forbidden(msg: string, meta?: Record<string, any>) {
    return new ApiError(403, msg, meta);
  }
  static NotFound(msg: string, meta?: Record<string, any>) {
    return new ApiError(404, msg, meta);
  }
  static Conflict(msg: string, meta?: Record<string, any>) {
    return new ApiError(409, msg, meta);
  }
  static ServerError(msg = "Something went wrong", meta?: Record<string, any>) {
    return new ApiError(500, msg, meta);
  }
}

export { ApiError };
