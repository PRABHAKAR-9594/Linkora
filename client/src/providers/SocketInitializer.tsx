import { registerSocket, socket } from "@/lib/socket";
import { useEffect } from "react";

const SocketInitializer = () => {
  useEffect(() => {
    registerSocket();
    console.log(`Socket connected for user`);

    return () => {
      if (socket.connected) {
        socket.disconnect();
        console.log(" Socket disconnected");
      }
    };
  }, []);

  return null;
};

export default SocketInitializer;
