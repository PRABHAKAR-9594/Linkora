import React from "react";
import { useUserPostsQuery } from "@/features/profile/hooks/useProfile";
import CustomVideoPlayer from "@/components/Shared/CustomVideoPlayer";
import { useAppDispatch } from "@/hooks";
import { openPostViewModal } from "@/store/slices/postViewModal.slice";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ExploreGrid: React.FC = () => {
  const userId = "69105bcfb13305ede9dadfb3";
  const { data, isLoading } = useUserPostsQuery(userId);
  const dispatch = useAppDispatch();

  const handlePostClick = (post: any) => {
    dispatch(openPostViewModal(post));
  };

  const posts = data?.data?.posts || [];
  const repeatedPosts = posts.length
    ? Array.from({ length: 10 }, () => posts).flat()
    : [];

  if (isLoading) {
    return (
      <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 lg:gap-4 w-full px-2 sm:w-9/12 mx-auto mt-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-48 mb-3 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 gap-2 sm:gap-3 lg:gap-4 w-full px-2 sm:w-9/12 mx-auto mt-4 select-none">
      {repeatedPosts.map((post: any) => {
        const media = post.media?.[0];
        if (!media) return null;

        const isVideo = media.resource_type === "video";

        return (
          <Card
            key={post._id}
            onClick={() => handlePostClick(post)}
            className="relative mb-2 rounded-lg overflow-hidden cursor-pointer group break-inside-avoid shadow-none border-none"
          >
            {isVideo ? (
              <CustomVideoPlayer src={media.url} />
            ) : (
              <img
                src={media.url}
                alt="Explore"
                className="w-full h-auto rounded-lg object-cover group-hover:brightness-90 transition"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ExploreGrid;
