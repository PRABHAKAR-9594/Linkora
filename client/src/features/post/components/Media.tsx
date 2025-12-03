import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch } from "@/hooks";
import { openPostViewModal } from "@/store/slices/postViewModal.slice";
import CustomVideoPlayer from "@/components/Shared/CustomVideoPlayer";

export interface PostMedia {
  url: string;
  resource_type: "image" | "video";
}

export interface MediaProps {
  media: PostMedia[];
  post: any;
}

const Media: React.FC<MediaProps> = ({ media, post }) => {
  const dispatch = useAppDispatch();
  const handlePostClick = (post: any) => {
    dispatch(openPostViewModal(post));
  };
  if (!media) return <>Post Media not available</>;

  if (!Array.isArray(media) || media.length === 0) {
    return <>No media available</>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const safeIndex = Math.min(currentIndex, media.length - 1);
  const currentMedia: PostMedia = media[safeIndex];

  if (!currentMedia) return <>Invalid media format</>;

  const isSingleMedia = media.length === 1;

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, media.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const isImage = currentMedia.resource_type === "image";
  const isVideo = currentMedia.resource_type === "video";

  return (
    <div className="relative w-full">
      <div
        className={`relative w-full overflow-hidden rounded-xl bg-black flex items-center justify-center ${
          isSingleMedia ? "max-h-[600px]" : "aspect-[4/3]"
        }`}
      >
        <div onClick={() => handlePostClick(post)}>
          {isImage ? (
            <img
              src={currentMedia.url}
              alt="Post media"
              className="w-full h-full object-contain transition-opacity duration-300"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : isVideo ? (
            <CustomVideoPlayer src={currentMedia.url} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-sm">
                Unsupported media type
              </p>
            </div>
          )}
        </div>
        
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              aria-label="Previous media"
              className={`absolute top-1/2 left-3 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm text-foreground p-2.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg border border-border/50 ${
                safeIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>

            <button
              onClick={handleNext}
              disabled={safeIndex === media.length - 1}
              aria-label="Next media"
              className={`absolute top-1/2 right-3 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm text-foreground p-2.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg border border-border/50 ${
                safeIndex === media.length - 1
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </>
        )}

        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-background/80 backdrop-blur-sm rounded-full border border-border/50">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to media ${index + 1}`}
                className={`transition-all duration-200 rounded-full ${
                  index === safeIndex
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
