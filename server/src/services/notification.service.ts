import { Notification } from "../models/notification.model";
import { ApiError } from "../utils/apiResponseHandler/apiError";
import { NOTIFICATION_MESSAGES } from "../utils/constants";

export const handleGetNotifications = async (userId: string) => {
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });

  if (!notifications || notifications.length === 0) {
    throw ApiError.NotFound(NOTIFICATION_MESSAGES.NONE);
  }

  return notifications;
};
