import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { useRightSidebar } from "./useRightSidebar";

interface IFriend {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
}

export default function RightSideBar() {
  const { isCollapsed, toggleCollapse, friends, groups } = useRightSidebar();

  return (
    <div
      className={`hidden sm:mr-3 lg:flex fixed top-[73px] right-0 h-[calc(100vh-73px)] bg-card border-l border-border shadow-xl transition-all duration-300 z-30 flex-col
      ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <button
        onClick={toggleCollapse}
        className="absolute top-4 left-2 p-2 rounded-full border border-border bg-background shadow-md hover:bg-accent transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronLeft className="h-4 w-4 text-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-foreground" />
        )}
      </button>

      {isCollapsed ? (
        <ScrollArea className="mt-16 w-full h-full px-2">
          <div className="flex flex-col gap-4 items-center">
            {friends.map((c: IFriend) => (
              <div key={c._id} className="relative group">
                <Avatar className="h-10 w-10 cursor-pointer hover:scale-105 transition-transform ring-2 ring-border">
                  <AvatarImage src={c.profileImage} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                    {c.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={`h-3 w-3 absolute bottom-0 right-0 ${
                    c.profileImage
                      ? "text-green-500 fill-green-500"
                      : "text-muted fill-muted"
                  }`}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <Card className="h-full border-none shadow-none rounded-none mt-14 bg-transparent">
          <CardContent className="p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Contacts
            </h2>

            <Input
              placeholder="Search..."
              className="mb-4 bg-background border-border"
            />

            <ScrollArea className="pr-2 flex-1">
              <div className="space-y-2">
                {friends.map((c: IFriend) => (
                  <div
                    key={c._id}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-accent transition-colors"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-border">
                      <AvatarImage
                        src={c.profileImage}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                        {c.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {c.firstName} {c.lastName}
                      </p>
                    </div>

                    <Circle
                      className={`h-3 w-3 shrink-0 ${
                        c.profileImage
                          ? "text-green-500 fill-green-500"
                          : "text-muted fill-muted"
                      }`}
                    />
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Groups
                  </h3>

                  {groups?.map((g: any, i: any) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent rounded-xl transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {g}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
