import { useRef, useState } from "react";

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-auto max-h-[450px] rounded-lg"
        controls={false} // hides default controls
        onContextMenu={(e) => e.preventDefault()} // disable right-click download
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />

      <button
        onClick={togglePlay}
        className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-md text-sm hover:bg-black/80 transition"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default CustomVideoPlayer;
