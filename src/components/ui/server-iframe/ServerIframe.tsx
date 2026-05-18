interface ServerIframeProps {
  server:    number;
  mediaId:   number | string;
  mediaType?: 'movie' | 'tv';
  season?:   number;
  episode?:  number;
  className?: string;
}

export default function ServerIframe({
  server,
  mediaId,
  mediaType = 'movie',
  season    = 1,
  episode   = 1,
  className = 'player__iframe',
}: ServerIframeProps) {
  const isTV = mediaType === 'tv';

  const sources: Record<number, string> = isTV
    ? {
        1: `https://ezvidapi.com/embed/tv/${mediaId}/${season}/${episode}?provider=vidsrc`,
        2: `https://vidlink.pro/tv/${mediaId}/${season}/${episode}`,
        3: `https://vidsrc.fyi/embed/tv/${mediaId}/${season}/${episode}`,
        4: `https://www.2embed.stream/embed/tv/${mediaId}&s=${season}&e=${episode}`,
      }
    : {
        1: `https://ezvidapi.com/embed/movie/${mediaId}?provider=vidsrc`,
        2: `https://vidlink.pro/movie/${mediaId}`,
        3: `https://vidsrc.fyi/embed/movie/${mediaId}`,
        4: `https://www.2embed.stream/embed/movie/${mediaId}`,
      };

  return (
    <iframe
      key={`${server}-${mediaId}-${season}-${episode}`}
      src={sources[server]}
      className={className}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}
