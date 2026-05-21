import { EMBED_SERVERS } from '../../../api/environments';

interface ServerIframeProps {
  server:     number;
  mediaId:    number | string;
  mediaType?: 'movie' | 'tv';
  season?:    number;
  episode?:   number;
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
  const embedServer = EMBED_SERVERS.find((s) => s.id === server) ?? EMBED_SERVERS[0];

  const src = mediaType === 'tv'
    ? embedServer.tv(mediaId, season, episode)
    : embedServer.movie(mediaId);

  return (
    <iframe
      key={`${server}-${mediaId}-${season}-${episode}`}
      src={src}
      className={className}
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
