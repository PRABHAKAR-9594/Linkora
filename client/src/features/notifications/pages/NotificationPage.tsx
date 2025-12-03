import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, UserPlus } from "lucide-react";
import {
  useNotificationSocket,
  useNotificationsQuery,
  type Notification,
} from "../hooks/useNotifications";

const NotificationPage = () => {
  const { data: notifications, isLoading } = useNotificationsQuery();

  useNotificationSocket();

  if (isLoading) {
    return (
      <Card className="mt-4 w-full mx-auto shadow-lg">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card className="mt-4 w-full mx-auto shadow-lg">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No notifications yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 w-[80%] mx-auto shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          {notifications?.map((n: Notification) => (
            <div
              key={n._id}
              className="flex justify-between items-center p-4 rounded-xl hover:bg-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-border">
                  <AvatarImage src={n.sender?.avatar} alt={n.sender?.name} />
                  <AvatarFallback>
                    {n.sender?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-foreground font-medium">{n.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                {n.type === "friend_request" && (
                  <Badge className="bg-primary/10 text-primary border border-primary/20">
                    <UserPlus className="w-4 h-4 mr-1" /> Friend Request
                  </Badge>
                )}

                {n.type === "friend_accept" && (
                  <Badge className="bg-green-100 text-green-600 border border-green-300">
                    <CheckCircle className="w-4 h-4 mr-1" /> Friend Accepted
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPage;
