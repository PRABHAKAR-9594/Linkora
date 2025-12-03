import { useRef, useEffect } from "react";
import PostLayout from "./PostCard";
import { Loader2 } from "lucide-react";
import { useInfinitePosts } from "@/features/post/hooks/usePost";

const PostFeed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfinitePosts();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        <Loader2 className="animate-spin mx-auto h-6 w-6" />
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page) =>
        page.posts.map((post: any) => <PostLayout key={post._id} post={post} />)
      )}

      {isFetchingNextPage && (
        <div className="text-center py-4 text-muted-foreground">
          <Loader2 className="animate-spin mx-auto h-6 w-6" />
          <p>Loading more...</p>
        </div>
      )}
      {hasNextPage && <div ref={bottomRef} className="h-10" />}

      {!hasNextPage && (
        <p className="text-center py-4 text-muted-foreground">
          You’ve reached the end.
        </p>
      )}
    </div>
  );
};

export default PostFeed;
