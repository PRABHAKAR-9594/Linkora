import { useCurrentUserQuery } from "@/hooks/api/useUser";
import { useParams } from "react-router-dom";
import { useProfileByUsernameQuery } from "../hooks/useProfile";
import ProfileHeader from "../components/ProfileHeader";
import About from "../components/About";
// import SavedMedia from "../components/SavedMedia";
import CreatePost from "@/components/shared/CreatePost";

const ProfilePage = () => {
  const { userName } = useParams();

  const { data: currentUserData, isLoading: loadingCurrent } =
    useCurrentUserQuery();
  const { data: searchedUserData, isLoading: loadingSearched } =
    useProfileByUsernameQuery(userName!);
    
  const isOwnProfile =
    !userName || currentUserData?.userName === userName;

  const user = isOwnProfile ? currentUserData : searchedUserData;

  if (!user || loadingCurrent || (userName && loadingSearched))
    return <p>Loading profile...</p>;

  return (
    <div className="w-full bg-background min-h-screen p-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[70%]">
            <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
          </div>

          <div className="hidden lg:block w-full lg:w-[30%] space-y-4">
            <About user={user} />
            {isOwnProfile && (
              <>
                <CreatePost />
                {/* <SavedMedia /> */}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
