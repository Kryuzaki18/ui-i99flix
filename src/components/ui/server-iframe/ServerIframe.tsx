interface ServerIframeProps {
  server: number;
  movieId: number | string;
  className?: string;
}

export default function ServerIframe({ server, movieId, className = 'player__iframe' }: ServerIframeProps) {
  const iframeSources = {
    1: `https://ezvidapi.com/embed/movie/${movieId}?provider=vidsrc`,
    2: `https://vidlink.pro/movie/${movieId}`,
    3: `https://vidsrc.fyi/embed/movie/${movieId}`,
    4: `https://www.2embed.stream/embed/movie/${movieId}`,
  };

  return (
    <iframe
      src={iframeSources[server as keyof typeof iframeSources]}
      className={className}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
