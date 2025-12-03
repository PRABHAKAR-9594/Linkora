import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler.middleware";
import { handleGetNotifications } from "../services/notification.service";
import { ApiResponse } from "../utils/apiResponseHandler/apiResponse";
import { HTTP_STATUS, NOTIFICATION_MESSAGES} from "../utils/constants";

export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.currentUser.id;

    const notifications = await handleGetNotifications(userId);

    res
      .status(HTTP_STATUS.OK)
      .json(ApiResponse.success(notifications, NOTIFICATION_MESSAGES.FOUND));
  }
);
