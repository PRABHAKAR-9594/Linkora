import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserPosts from "./UserPosts";
import FriendsList from "./Friends";

interface ProfileTabsProps {
  userId: string;
  isOwnProfile: boolean;
}

const ProfileTabs = ({ userId }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="posts" className="w-full mt-6">
      <TabsList className="flex flex-start border-b border-border bg-transparent p-0">
        <TabsTrigger
          value="posts"
          className="pb-2 rounded-none text-muted-foreground
            data-[state=active]:bg-primary/20 
            hover:text-foreground"
        >
          Posts
        </TabsTrigger>

        <TabsTrigger
          value="friends"
          className="pb-2 rounded-none text-muted-foreground
          data-[state=active]:bg-primary/20 
          hover:text-foreground"
        >
          Friends
        </TabsTrigger>

        <TabsTrigger
          value="media"
          className="pb-2 rounded-none text-muted-foreground
            data-[state=active]:bg-primary/20 
            hover:text-foreground"
        >
          Media
        </TabsTrigger>

        <TabsTrigger
          value="videos"
          className="pb-2 rounded-none text-muted-foreground
          data-[state=active]:bg-primary/20 
          hover:text-foreground"
        >
          Videos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <UserPosts userId={userId} />
      </TabsContent>

      <TabsContent value="friends">
        <FriendsList userId={userId} />
      </TabsContent>

      <TabsContent value="media">
        <div className="p-4">Media content here</div>
      </TabsContent>

      <TabsContent value="videos">
        <div className="p-4">Videos content here</div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
