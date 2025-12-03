import CreatePost from "@/components/shared/CreatePost";
import PostFeed from "@/features/post/components/PostFeed";
import StoryBar from "../components/StoryBar";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background w-full flex justify-center">
      <div className="w-full max-w-[370px] sm:max-w-full px-2 sm:px-4 md:px-6">
        <StoryBar />
        <CreatePost />
        <PostFeed />
      </div>
    </div>
  );
};

export default HomePage;
