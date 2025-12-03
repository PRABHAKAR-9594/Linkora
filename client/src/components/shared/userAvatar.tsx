import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallbackText?: string;
  size?: string; // "sm" | "md" | "lg"
  ring?: boolean; // true/false
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = "User Avatar",
  fallbackText = "U",
  size = "md",
  ring = true,
  className = "",
}) => {
  return (
    <Avatar
      className={`${sizeClasses[size]} ${
        ring ? "ring-2 ring-white shadow-sm" : ""
      } ${className}`}
    >
      <AvatarImage src={src} alt={alt} className="object-cover" />
      <AvatarFallback className="bg-gray-200 text-gray-600 font-medium">
        {fallbackText.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
