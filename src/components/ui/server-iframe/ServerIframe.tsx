import { useEffect } from "react";
import { EMBED_SERVERS } from "../../../api/environments";
import "./ServerIframe.css";

interface ServerIframeProps {
  server: number;
  mediaId: number | string;
  mediaType?: "movie" | "tv";
  season?: number;
  episode?: number;
  className?: string;
}

export default function ServerIframe({
  server,
  mediaId,
  mediaType = "movie",
  season = 1,
  episode = 1,
  className = "player__iframe",
}: ServerIframeProps) {
  const embedServer = EMBED_SERVERS[server];
  const src =
    mediaType === "tv"
      ? embedServer.tv(mediaId, season, episode)
      : embedServer.movie(mediaId);

  useEffect(() => {
    const handleBlur = () => {
      setTimeout(() => window.focus(), 50);
    };
    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, []);

  return (
    <>
      <iframe
        key={`${server}-${mediaId}-${season}-${episode}`}
        src={src}
        className={className}
        referrerPolicy="no-referrer"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <div className="ad-shield-top" />
      <div className="ad-shield-corner ad-shield-corner--tl" />
      <div className="ad-shield-corner ad-shield-corner--tr" />
      <div className="ad-shield-side-right" />
    </>
  );
}
