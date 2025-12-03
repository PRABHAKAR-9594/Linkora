import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useUserFriendsQuery } from "@/hooks/api/useUser";

interface FriendsListProps {
  userId: string;
}

const FriendsList = ({ userId }: FriendsListProps) => {
  const { data, isLoading } = useUserFriendsQuery(userId!);
  const friends = data?.data;

  if (isLoading) {
    return (
      <Card className="mt-4 w-full mx-auto shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6">Friends</h2>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <Card className="mt-4 w-full mx-auto shadow-lg">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No friends found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 w-full mx-auto shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Friends</h2>

        <div className="space-y-4">
          {friends?.map((friend: any) => (
            <div
              key={friend._id}
              className="flex justify-between items-center p-4 rounded-xl hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 ring-2 ring-border">
                  <AvatarImage
                    src={friend.profileImage}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {friend.firstName?.[0] || friend.userName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold text-foreground">
                    {friend.firstName} {friend.lastName}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {friend.about || "No bio available"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {!userId && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20"
                  >
                    Remove
                  </Button>
                )}

                <Button
                  size="sm"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                >
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>

        {!userId && (
          <Button className="w-full mt-6 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
            Load more Friends
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsList;
