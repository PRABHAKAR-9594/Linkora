import React, { useState } from "react";
import { formatDate } from "@/utils";
import { PersonAvatar } from "@/components/layout";
import PostActionsBar from "./PostAction";
import Media from "./Media";
import { formatTimeAgo } from "@/utils/formatDate";

interface PostProps {
  post: any;
}

const PostCard: React.FC<PostProps> = ({ post }) => {
  if (!post) return null;

  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 200;
  const description = post.description || "";
  const shouldTruncate = description.length > MAX_LENGTH;

  const displayedText =
    !isExpanded && shouldTruncate
      ? description.slice(0, MAX_LENGTH) + "..."
      : description;

  return (
    <div className="bg-card w-full max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto my-3 sm:my-4 p-3 sm:p-4 md:p-6 rounded-xl shadow-md flex flex-col gap-3 sm:gap-4 font-sans border border-border">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <PersonAvatar image={post?.userId?.profileImage} view={false} />
        <div className="min-w-0">
          <p className="text-foreground font-semibold text-sm sm:text-base truncate">
            {post?.userId?.userName || "Unknown User"}{" "}
            <span className="text-muted-foreground font-normal text-xs sm:text-sm">
              • {post?.createdAt ? formatTimeAgo(post.createdAt) : "Recently"}
            </span>
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm truncate">
            {post?.userId?.firstName} {post?.userId?.lastName || "Member"}
          </p>
        </div>
      </div>

      {post.description && (
        <p className="text-foreground text-sm sm:text-base leading-relaxed break-words">
          {displayedText}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary cursor-pointer hover:underline ml-1 font-medium"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </p>
      )}

      <Media media={post.media} post={post} />

      <PostActionsBar
        postId={post._id}
        likes={post.likes}
        comments={post.comment}
      />
    </div>
  );
};

export default PostCard;
