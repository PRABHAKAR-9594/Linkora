import http from "http";
import { Server } from "socket.io";
import { redisClient } from "../config/redis.config";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middleware";

export const initSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;

    await redisClient.setEx(`online:${userId}`, 300, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);

    socket.on("disconnect", async () => {
      await redisClient.del(`online:${userId}`);
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};
