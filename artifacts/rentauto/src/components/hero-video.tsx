import { useEffect, useRef } from "react";
import { heroContent } from "@/lib/site-content";

type HeroVideoProps = {
  className?: string;
};

export function HeroVideo({ className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay may be blocked until user interaction.
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={heroContent.video}
      poster={heroContent.poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label={heroContent.videoAlt}
    />
  );
}
