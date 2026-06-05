import { Modal, Typography, Tag, Rate, Button, Flex, Spin } from "antd";
import {
  PlayCircleOutlined,
  LinkOutlined,
  CloseOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { useState, useCallback, useMemo, useEffect } from "react";
import type { Movie } from "../../models/movieModel";
import { useRecordWatchMutation, useWatchHistoryQuery } from "../../api/watch/useWatchQuery";
import { useTheme } from "../../context/ThemeContext";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import TvEpisodeSelector from "../../components/ui/tv-episode-selector/TvEpisodeSelector";
import { useTmdbTvDetailQuery } from "../../api/tmdb/useTmdbQuery";
import useResolvedGenres from "../../hooks/useResolvedGenres";
import usePageTitle from "../../hooks/usePageTitle";
import ExpandableText from "../../components/ui/expandable-text/ExpandableText";
import "./VideoPlayer.css";

const { Title, Text } = Typography;

interface VideoPlayerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoPlayer({
  movie,
  open,
  onClose,
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [server, setServer] = useState(0);
  const [manualSeason, setManualSeason]   = useState<number | null>(null);
  const [manualEpisode, setManualEpisode] = useState<number | null>(null);
  const { colors } = useTheme();
  const recordWatch = useRecordWatchMutation();

  const { data: watchHistory } = useWatchHistoryQuery();

  const watchEntry = useMemo(
    () => watchHistory?.find((e) => movie && e.movieId === String(movie.id)),
    [watchHistory, movie],
  );

  const watchedEpisodes = useMemo(() => {
    if (!watchEntry?.episodes?.length) return new Set<string>();
    return new Set(watchEntry.episodes.map((ep) => `${ep.season}-${ep.episode}`));
  }, [watchEntry]);

  const wasWatched = !!watchEntry;

  const lastWatched = useMemo(() => {
    if (!open || movie?.mediaType !== 'tv' || !watchEntry?.episodes?.length) return null;
    return watchEntry.episodes.reduce((latest, ep) =>
      ep.watchedAt > latest.watchedAt ? ep : latest
    );
  }, [open, movie?.mediaType, watchEntry]);

  const season  = manualSeason  ?? lastWatched?.season  ?? 1;
  const episode = manualEpisode ?? lastWatched?.episode ?? 1;

  const { data: tvDetail, isLoading: isTvLoading } = useTmdbTvDetailQuery(
    movie?.mediaType === "tv" ? Number(movie.id) : null,
  );

  const resolvedGenres = useResolvedGenres(movie?.genre);

  const totalEpisodesForSeason =
    tvDetail?.seasons?.find((s) => s.season_number === season)?.episode_count ??
    30;

  usePageTitle(
    open ? movie?.title : null,
    movie?.mediaType,
    open && movie?.mediaType === "tv" ? season : undefined,
    open && movie?.mediaType === "tv" ? episode : undefined,
  );

  const handlePlay = useCallback(() => {
    if (movie) {
      recordWatch.mutate({
        movieId:   String(movie.id),
        title:     movie.title,
        mediaType: movie.mediaType ?? "movie",
        thumbnail: movie.thumbnail,
        ...(movie.mediaType === "tv" ? { season, episode } : {}),
      });
    }
    setPlaying(true);
  }, [movie, season, episode, recordWatch]);

  const handleSeasonChange = useCallback((s: number) => {
    setManualSeason(s);
    if (playing && movie?.mediaType === "tv") {
      recordWatch.mutate({
        movieId:   String(movie.id),
        title:     movie.title,
        mediaType: "tv",
        thumbnail: movie.thumbnail,
        season:    s,
        episode,
      });
    }
  }, [playing, movie, episode, recordWatch]);

  const handleEpisodeChange = useCallback((ep: number) => {
    setManualEpisode(ep);
    if (playing && movie?.mediaType === "tv") {
      recordWatch.mutate({
        movieId:   String(movie.id),
        title:     movie.title,
        mediaType: "tv",
        thumbnail: movie.thumbnail,
        season,
        episode:   ep,
      });
    }
  }, [playing, movie, season, recordWatch]);

  useEffect(() => {
    if (!open) {
      setCountdown(null);
      setPlaying(false);
      return;
    }
    setServer(0);
    setPlaying(false);
    setCountdown(3);
  }, [open]);

  useEffect(() => {
    if (countdown === null || playing) return;
    if (countdown === 0) {
      handlePlay();
      return;
    }
    const t = setTimeout(
      () => setCountdown((c) => (c !== null ? c - 1 : null)),
      1000,
    );
    return () => clearTimeout(t);
  }, [countdown, playing, handlePlay]);

  if (!movie) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(900px, 95vw)"
      centered
      mask={{ closable: false }}
      style={{ padding: 0 }}
      styles={{
        body: {
          backgroundColor: colors.bgBase,
          padding: 0,
          overflow: "hidden",
        },
        mask: { backdropFilter: "blur(1px)", background: "rgba(0,0,0,0.85)" },
        container: {
          padding: 0,
          overflow: "hidden",
        },
      }}
      closeIcon={
        <Flex
          component="span"
          align="center"
          justify="center"
          style={{ backgroundColor: colors.accent, color: colors.playerText }}
          className="player__close-icon"
        >
          <CloseOutlined />
        </Flex>
      }
      destroyOnHidden
    >
      <div>
        <div
          className="player__video-area"
          style={{ backgroundColor: colors.bgBase }}
        >
          {!playing && (
            <div className="player__poster-gate">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="player__backdrop"
              />
              <div className="player__vignette" />

              {wasWatched && (
                <Tag
                  icon={<CheckCircleFilled />}
                  color="success"
                  style={{
                    position:     "absolute",
                    top:          12,
                    left:         12,
                    zIndex:       3,
                    borderRadius: 12,
                    fontWeight:   600,
                    fontSize:     12,
                    padding:      "2px 10px",
                  }}
                >
                  {movie.mediaType === "tv"
                    ? `${watchedEpisodes.size} episode${watchedEpisodes.size !== 1 ? "s" : ""} watched`
                    : "Watched"}
                </Tag>
              )}

              <Flex align="center" justify="center" className="player__overlay">
                {countdown !== null ? (
                  <span key={countdown} className="player__countdown-number">
                    {countdown}
                  </span>
                ) : (
                  <PlayCircleOutlined
                    className="player__play-icon"
                    onClick={handlePlay}
                  />
                )}
              </Flex>

              <div className="player__title-overlay">
                <Flex wrap="wrap" gap={4} className="player__title-genres">
                  {resolvedGenres.slice(0, 3).map((rg) => (
                    <Tag
                      key={rg.key}
                      color={rg.color || "default"}
                      style={{ fontSize: 11, margin: 0 }}
                    >
                      {rg.label}
                    </Tag>
                  ))}
                </Flex>
                <Title level={4} className="player__title">
                  {movie.title}
                </Title>
                <Flex align="center" wrap="wrap" gap="4px 10px">
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={movie.rating / 2}
                    className="player__title-rate"
                  />
                  <Text className="player__title-rating">
                    {movie.rating}/10
                  </Text>
                  <Text className="player__title-year">{movie.year}</Text>
                  {movie.duration && movie.duration !== "N/A" && (
                    <Text className="player__title-duration">
                      {movie.duration}
                    </Text>
                  )}
                </Flex>
              </div>
            </div>
          )}

          {playing && (
            <ServerIframe
              server={server}
              mediaId={movie.id}
              mediaType={movie.mediaType}
              season={season}
              episode={episode}
            />
          )}
        </div>
      </div>

      <Flex vertical style={{ padding: "0 1rem" }}>
        <Flex
          vertical
          gap="small"
          align="center"
          justify="space-between"
          wrap={true}
          style={{ backgroundColor: colors.bgBase, padding: "0.5rem 0" }}
        >
          <Button
            type="primary"
            size="small"
            icon={<LinkOutlined />}
            onClick={() => {
              const url =
                movie.mediaType === "tv"
                  ? `/player/${movie.id}?type=tv&season=${season}&episode=${episode}`
                  : `/player/${movie.id}`;
              window.open(url, "_blank", "noopener,noreferrer");
              setPlaying(false);
              setCountdown(null);
            }}
            style={{
              fontSize: 11,
              marginBottom: movie.mediaType === "tv" ? undefined : 7,
            }}
          >
            Open in new tab
          </Button>

          {movie.mediaType === "tv" && (
            <>
              {isTvLoading ? (
                <Spin size="small" style={{ margin: "1rem 0" }} />
              ) : (
                <TvEpisodeSelector
                  season={season}
                  episode={episode}
                  onSeasonChange={handleSeasonChange}
                  onEpisodeChange={handleEpisodeChange}
                  seasons={tvDetail?.seasons}
                  totalEpisodes={totalEpisodesForSeason}
                  watchedEpisodes={watchedEpisodes}
                />
              )}
            </>
          )}
        </Flex>

        <ServerSelector activeServer={server} onServerChange={setServer} />

        <Flex
          vertical
          style={{
            padding: "1rem 0",
          }}
        >
          <Text strong style={{ color: colors.textMuted }}>
            Synopsis
          </Text>
          <ExpandableText
            text={movie.description || "No synopsis available."}
            collapsedLines={3}
            lineHeight={1.7}
            fontSize={13}
            color={colors.textSecondary}
          />
        </Flex>
      </Flex>
    </Modal>
  );
}
