import { Server } from "socket.io";
import { Types } from "mongoose";
import { redisClient } from "../config/redis.config";
import { Notification } from "../models/notification.model";

type Notification = {
  userId: Types.ObjectId;
  type: "chat" | "call" | "friend_request" | "post" | "system";
  content: string;
  relatedId: Types.ObjectId;
  relatedModel: "chat" | "call" | "friend_request" | "post" | "system";
};

export const sendNotification = async (io: Server, data: Notification) => {
  const { userId, type, content, relatedId, relatedModel } = data;

  const notification = await Notification.create({
    userId,
    type,
    content,
    relatedId,
    relatedModel,
  });

  const socketId = await redisClient.get(`online:${userId}`);

  if (socketId) {
    io.to(socketId).emit("notification", notification);
  }

  return notification;
};
