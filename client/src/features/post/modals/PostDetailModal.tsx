import React from "react";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import type { PostModalProps } from "../types";

const PostDetailModal: React.FC<PostModalProps> = ({ post }) => {
  if (!post) {
    return (
      <div className="text-center text-muted-foreground p-6">
        Post data is not available.
      </div>
    );
  }

  return (
    <div className="bg-card max-w-3xl mx-auto mt-4 p-6 rounded-xl shadow-md border border-border flex flex-col gap-4 font-sans">
      <div className="flex gap-4 items-center">
        <div>
          <p className="text-foreground font-semibold text-base">
            {post.userId?.userName || "Unknown User"}{" "}
            <span className="text-muted-foreground text-sm">
              ·{" "}
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : ""}
            </span>
          </p>
        </div>
      </div>

      <div className="text-foreground text-base">
        <p>{post.description}</p>
      </div>

      {post.media?.url && (
        <div className="rounded-lg overflow-hidden shadow-sm">
          {post.media.resource_type === "image" ? (
            <ImageZoom>
              <img
                src={post.media.url}
                alt="Post"
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            </ImageZoom>
          ) : (
            <video
              src={post.media.url}
              controls
              className="w-full max-h-[500px] rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetailModal;
