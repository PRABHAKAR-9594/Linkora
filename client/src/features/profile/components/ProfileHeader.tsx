import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Calendar, Camera, CheckCircle, MapPin } from "lucide-react";

import ProfileTabs from "./ProfileTabs";

import { useUpdateProfileImageMutation } from "../hooks/useProfile";
import { useCloudinaryUpload } from "@/hooks";

interface ProfileHeaderProps {
  user: any;
  isOwnProfile: boolean;
}

const ProfileHeader = ({ user, isOwnProfile }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadToCloudinary } = useCloudinaryUpload();
  const { mutateAsync: updateDP } = useUpdateProfileImageMutation();

  const fullName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.userName;

  function getProfileBackground(seed: string = "default") {
    const styles = [
      `bg-[radial-gradient(circle_at_30%_30%,hsl(var(--primary)/0.3),transparent),radial-gradient(circle_at_70%_70%,hsl(var(--accent)/0.25),transparent)]`,
      `bg-[linear-gradient(135deg,hsl(var(--primary)/0.4),hsl(var(--accent)/0.4))]`,
      `bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.4),transparent_60%),linear-gradient(to_right,hsl(var(--accent)/0.3),transparent_70%)]`,
      `bg-[linear-gradient(to_bottom_right,hsl(var(--primary)/0.35),hsl(var(--accent)/0.35))] backdrop-blur-[2px]`,
      `bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.3),transparent),radial-gradient(circle_at_80%_20%,hsl(var(--accent)/0.3),transparent)]`,
    ];

    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash + seed.charCodeAt(i) * 31) % styles.length;
    }

    return styles[hash];
  }

  const bgStyle = getProfileBackground(user?.userName || "default");

  const handleDPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOwnProfile) return;

    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const { uploaded } = await uploadToCloudinary({ file, saveToDB: false });
      await updateDP(uploaded.secure_url);
    } catch (err) {
      console.error("DP update failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-border shadow-lg">
      <div
        className={`h-48 w-full bg-gradient-to-r from-primary via-accent to-primary ${bgStyle}`}
      />
      <CardContent className="relative p-6 pb-4">
        <div className="absolute -top-14 left-6">
          <div className="relative group">
            <Avatar
              className={`h-28 w-28 ring-4 ring-card overflow-hidden ${
                isOwnProfile ? "cursor-pointer" : ""
              }`}
              onClick={() => isOwnProfile && fileInputRef.current?.click()}
            >
              {!isUploading ? (
                <AvatarImage
                  src={user?.profileImage}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-black/40">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
                </div>
              )}
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                {fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {isOwnProfile && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 bg-primary text-primary-foreground h-8 w-8 flex items-center justify-center rounded-full shadow-md border border-white hover:bg-primary/90 transition"
                >
                  <Camera className="h-4 w-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDPChange}
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-[250px]">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                {fullName}
                <CheckCircle className="h-5 w-5 text-primary" />
              </h1>

              <p className="text-muted-foreground">
                {user?.friendsCount || 0} friends
              </p>

              {user?.about && (
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed max-w-3xl">
                  {user.about}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {user?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {user.location}
                  </span>
                )}

                {user?.joiningDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.joiningDate).toDateString()}
                  </span>
                )}
              </div>
            </div>

            {isOwnProfile && (
              <div className="shrink-0">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  onClick={() => navigate("/settings")}
                >
                  Edit profile
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6">
            <ProfileTabs userId={user._id} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
