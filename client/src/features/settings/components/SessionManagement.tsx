import React from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  useFetchSessions,
  // useLogOutAllSessions,
  useSessionLogOutMutation,
} from "../hooks/useSettings";
import {  formatTimeAgo } from "@/utils/formatDate";
import LoaderScreen from "@/components/feedback/LoaderScreen";

interface Location {
  country: string | null;
  region: string | null;
  city: string | null;
  lat: string | null;
  lon: string | null;
}

interface Session {
  id: string;
  sessionId: string;
  deviceName: string;
  ipAddress: string;
  osInfo: string;
  userAgent: string;
  location: Location;
  createdAt: string;
  isCurrentSession: boolean;
}

const SessionManagement: React.FC = () => {
  const { data, isLoading } = useFetchSessions();
  const sessions = data?.data?.data;

  const { mutate: deleteSession, isPending: deleteSessionPending } =
    useSessionLogOutMutation();
  // const { mutate: deleteAllSessions, isPending: deleteAllSessionsPending } =
  //   useLogOutAllSessions();
  if (isLoading) {
    return <LoaderScreen message="Retrieving session, please wait..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Active Sessions</h1>

          {/* <div className="flex items-center gap-3 text-primary/80">
            <p className="font-medium">Logout all</p>

            <Button
              size="icon"
              variant="destructive"
              onClick={() => deleteAllSessions()}
              disabled={deleteAllSessionsPending}
              className={
                deleteAllSessionsPending ? "cursor-not-allowed opacity-70" : ""
              }
            >
              {deleteAllSessionsPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
            </Button>
          </div> */}
        </div>

        {sessions.map((session: Session) => (
          <Card key={session.id} className="mb-4">
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="font-medium">
                  {session.deviceName}{" "}
                  {session.isCurrentSession && (
                    <Badge variant="default" className="ml-2">
                      Current
                    </Badge>
                  )}
                </p>
                <p className="text-sm text-slate-600">
                  IP: {session.ipAddress}
                </p>
                <p className="text-sm text-slate-600">
                  Location: {session.location?.city || "Unknown"},{" "}
                  {session.location?.country || ""}
                </p>

                <div className="mt-2 text-sm text-slate-700">
                  <Separator className="my-2" />
                  <p>
                    <strong>Login Time:</strong>{" "}
                    {formatTimeAgo(session.createdAt)}
                  </p>
                  <p>
                    <strong>OS:</strong> {session.osInfo}
                  </p>
                  <p className="break-all">
                    <strong>User Agent:</strong> {session.userAgent}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-start">
                {!session.isCurrentSession && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() =>
                      deleteSession({
                        sessionId: session.sessionId,
                        deviceName: session.deviceName,
                      })
                    }
                    className={
                      deleteSessionPending
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }
                    disabled={deleteSessionPending}
                  >
                    {deleteSessionPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-5 h-5" />
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SessionManagement;
