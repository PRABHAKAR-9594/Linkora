import { useState } from "react";
// import PostModal from "./PostModal";
import { MoreVertical, Trash, Edit } from "lucide-react";
import { useCurrentUserQuery } from "@/hooks/api/useUser";
import { useDeletePostMutation } from "@/features/post/hooks/usePost";
import FALLBACK_IMAGE from "@/assets/Images/marie-michele-bouchard-3U9BCWHMhUw-unsplash.jpg";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { openPostModal } from "@/store/slices/postEditorModal.slice";

interface PostMedia {
  _id: string;
  url: string;
  public_id?: string;
  format?: string;
  resource_type: "image" | "video";
}

interface PostUser {
  _id: string;
  userName: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
}

export interface Post {
  _id: string;
  userId: PostUser;
  description?: string;
  media: PostMedia[];
  likes: string[];
  comments: string[];
  createdAt: string;
  shares?: number;
}
interface PostsSectionProps {
  posts: Post[]; // 👈 Use correct type
  isOwner?: boolean;
}

const ProfilePostGrid = ({ posts, isOwner }: PostsSectionProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const dispatch = useDispatch();
  const { data } = useCurrentUserQuery();
  const currentUser = data?.data;

  const deleteMutation = useDeletePostMutation();

  const handleDelete = (postId: string) => {
    deleteMutation.mutate(postId);
    setMenuOpenIndex(null);
  };

  const getThumbnail = (media: Post["media"]): string => {
    if (!media[0]?.url) return FALLBACK_IMAGE;

    if (media[0].resource_type === "video" && media[0].public_id) {
      return `https://res.cloudinary.com/dl5w7xxf8/video/upload/so_0/${media[0].public_id}.jpg`;
    }
    return media[0].url;
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border rounded-lg bg-card shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-muted-foreground mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 9l9-6 9 6M4 10v10h16V10M10 14h4"
          />
        </svg>

        <h3 className="text-lg font-semibold text-foreground">No Posts Yet</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Looks like there are no posts to show right now.
        </p>
        <Button
          variant="default"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-3 gap-2">
        {posts.map((post, index) => {
          const thumbnail = getThumbnail(post.media);
          const isMyPost = currentUser?._id === post.userId._id;

          return (
            <div key={post._id} className="relative group">
              <img
                src={thumbnail}
                alt="Post Thumbnail"
                className="w-full h-full aspect-square object-cover rounded-md  select-none pointer-events-none cursor-pointer"
                onClick={() => {
                  setSelectedPost(post);
                  console.log("clicked on post")
                }}
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = FALLBACK_IMAGE)
                }
              />

              {isMyPost && isOwner && (
                <div className="absolute top-2 right-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenIndex(menuOpenIndex === index ? null : index);
                    }}
                    className="p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {menuOpenIndex === index && (
                    <div
                      className="absolute right-0 mt-2 bg-card rounded-md shadow-lg border w-28 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted w-full"
                        onClick={() => {
                          setSelectedPost(post);
                          dispatch(openPostModal(post));
                          setMenuOpenIndex(null);
                        }}
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>

                      <button
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-muted w-full"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* {selectedPost && <PostModal post={selectedPost} />} */}
    </div>
  );
};

export default ProfilePostGrid;
