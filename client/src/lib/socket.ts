import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : // : "http://192.168.0.100:4000";
      "http://localhost:4000";

export const socket = io(BACKEND_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true, // Auto-reconnect after disconnections
  reconnectionAttempts: 5, // Retry 5 times
  reconnectionDelay: 2000, // 2 sec delay
});

export const registerSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};
