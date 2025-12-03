import http from "http";
import { app } from "./app";
import { connectToDatabase } from "./config/database.config";
import { initRedis } from "./config/redis.config";
import dotenv from "dotenv";
import { initSocket } from "./socket/socket";
dotenv.config();

const PORT = process.env.PORT || 5000;

// To run on all device within same network
const hostAddress = "192.168.0.100";

// Database connection
connectToDatabase().then(async () => {
  //Redis connnection
  await initRedis();

  // server setup
  const server = http.createServer(app);

  // socket.io setup
  const io = initSocket(server);
  app.set("io", io); // make io available globally

  // run app and listen to port
  server.listen(Number(PORT), () => {
    console.log(`Server is running on ${PORT}`);
    // console.log(`http://${hostAddress}:${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
});
