import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import avatar1 from "@/assets/Dummy/Images/Broken Playstation 3 Controller HD Wallpapers.jpg";
import avatar3 from "@/assets/Dummy/Images/e1532520016e4f8d4b5f0fa770008724.jpeg";
import avatar2 from "@/assets/Dummy/Images/Broken Playstation 3 Controller HD Wallpapers.jpg";
import avatar4 from "@/assets/Dummy/Images/Kaneki Kenn Tokyo Ghoul.png";

interface Friend {
  image: string;
  name: string;
  viewed: boolean;
}

const friends: Friend[] = [
  { image: avatar1, name: "Emma Wilson", viewed: false },
  { image: avatar2, name: "Alex Chen", viewed: false },
  { image: avatar3, name: "Sofia Garcia", viewed: true },
  { image: avatar4, name: "Marcus Johnson", viewed: false },
  { image: avatar1, name: "Luna Park", viewed: true },
  { image: avatar2, name: "Ryan Foster", viewed: false },
  { image: avatar3, name: "Zara Khan", viewed: true },
  { image: avatar4, name: "Kai Anderson", viewed: false },
  { image: avatar1, name: "Maya Patel", viewed: false },
  { image: avatar2, name: "Diego Silva", viewed: true },
  { image: avatar3, name: "Aria Kim", viewed: false },
  { image: avatar4, name: "Noah Brooks", viewed: true },
];

const StoryBar: React.FC = () => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex gap-4">
        {/* Add Story Button */}
        <div className="flex-shrink-0">
          <button
            className="group relative flex flex-col items-center gap-2 transition-smooth hover:scale-105"
            aria-label="Add your story"
          >
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-border">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                  <Plus className="h-6 w-6 text-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-md ring-2 ring-background">
                <Plus className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xs font-medium text-foreground/80 max-w-[72px] truncate">
              Your Story
            </span>
          </button>
        </div>

        {/* Friends Stories */}
        <ScrollArea className="flex-1">
          <div className="flex gap-4 pb-2">
            {friends.map((friend, index) => (
              <button
                key={index}
                className="group flex-shrink-0 flex flex-col items-center gap-2 transition-smooth hover:scale-105"
                aria-label={`View ${friend.name}'s story`}
              >
                <div
                  className={`relative ${
                    friend.viewed ? "story-viewed" : "story-ring"
                  } rounded-full`}
                >
                  <Avatar className="h-16 w-16 ring-4 ring-background">
                    <AvatarImage
                      src={friend.image}
                      alt={friend.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-muted">
                      {friend.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs font-medium text-foreground/80 max-w-[72px] truncate">
                  {friend.name}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default StoryBar;
