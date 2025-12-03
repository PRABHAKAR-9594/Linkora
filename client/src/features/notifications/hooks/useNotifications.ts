import { useEffect } from "react";
import { api } from "@/lib";
import { socket } from "@/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import notificationSound from "@/assets/audio/notification.wav";

export interface Notification {
  _id: string;
  type: "friend_request" | "friend_accept" | string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  isRead?: boolean;
}

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notification");
      return res.data.data as Notification[];
    },
    staleTime: 0,
    gcTime: 0,
  });
};

export const useNotificationSocket = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const audio = new Audio(notificationSound);
    const handleNotification = (notification: Notification) => {
      queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
        if (!old) return [notification];
        return [notification, ...old];
      });

      toast.info("You have a new notification.");
      audio.currentTime = 0;
      audio.play().catch((err) => {
        console.log("Audio autoplay blocked:", err);
      });
    };
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [queryClient]);
};
