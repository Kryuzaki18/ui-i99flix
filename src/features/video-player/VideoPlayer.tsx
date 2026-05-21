import { Modal, Typography, Space, Tag, Rate, Button, Tooltip, Flex, Spin } from "antd";
import {
  PlayCircleOutlined,
  ExpandOutlined,
  CompressOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import type { Movie } from "../../models/movie";
import { useTheme } from "../../context/ThemeContext";
import { useFullscreen } from "../../hooks/useFullscreen";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import TvEpisodeSelector from "../../components/ui/tv-episode-selector/TvEpisodeSelector";
import CastSection from "../../components/ui/cast-section/CastSection";
import { useTmdbTvDetailQuery } from "../../api/useTmdbQuery";
import { GENRE_COLORS } from "../../constants/genres";
import ExpandableText from "../../components/ui/expandable-text/ExpandableText";
import "./VideoPlayer.css";

const { Title, Text } = Typography;

interface VideoPlayerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ movie, open, onClose }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [server, setServer] = useState(1);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const { colors } = useTheme();
  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  const { data: tvDetail, isLoading: isTvLoading } = useTmdbTvDetailQuery(
    movie?.mediaType === "tv" ? Number(movie.id) : null
  );

  const totalEpisodesForSeason =
    tvDetail?.seasons?.find((s) => s.season_number === season)?.episode_count ?? 30;

  useEffect(() => {
    if (!open) {
      setPlaying(false);
      setServer(1);
      setSeason(1);
      setEpisode(1);
    }
  }, [open, movie?.id]);

  const handlePlay = useCallback(() => setPlaying(true), []);

  if (!movie) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(900px, 95vw)"
      centered
      style={{ padding: 0 }}
      styles={{
        body: { backgroundColor: colors.bgBase, padding: 0, borderRadius: 12, overflow: "hidden" },
        mask: { backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.85)" },
      }}
      closeIcon={<span style={{ backgroundColor: colors.bgBase, color: colors.textPrimary }} className="player__close-icon">✕</span>}
      destroyOnHidden
    >
      <div
        ref={fullscreenRef}
        className={`player__fullscreen-root${isFullscreen ? " player__fullscreen-root--active" : ""}`}
        onDoubleClick={toggleFullscreen}
      >
        <div className="player__video-area"
          style={{ backgroundColor: colors.bgBase }}
        >
          {!playing && (
            <div className="player__poster-gate" onClick={handlePlay}>
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="player__backdrop"
              />
              <div className="player__vignette" />
              <div className="player__overlay">
                <PlayCircleOutlined className="player__play-icon" />
              </div>
              <div className="player__title-overlay">
                <div className="player__title-genres">
                  {movie.genre.slice(0, 3).map((g) => (
                    <Tag
                      key={g}
                      color={GENRE_COLORS[g] || "default"}
                      style={{ fontSize: 11, margin: 0 }}
                    >
                      {g}
                    </Tag>
                  ))}
                </div>
                <Title level={4} className="player__title">{movie.title}</Title>
                <div className="player__title-meta">
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={movie.rating / 2}
                    className="player__title-rate"
                  />
                  <Text className="player__title-rating">{movie.rating}/10</Text>
                  <Text className="player__title-year">{movie.year}</Text>
                  {movie.duration && movie.duration !== 'N/A' && (
                    <Text className="player__title-duration">{movie.duration}</Text>
                  )}
                </div>
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

      <Flex
        vertical
        gap="small"
        align="center"
        justify="space-between"
        wrap={true}
        style={{ backgroundColor: colors.bgBase, padding: "0.5rem 0" }}
      >
        <Space size={8}>
          <Button
            size="small"
            icon={<LinkOutlined />}
            onClick={() => {
              const url = movie.mediaType === "tv"
                ? `/player/${movie.id}?type=tv&season=${season}&episode=${episode}`
                : `/player/${movie.id}`;
              window.open(url, "_blank", "noopener,noreferrer");
            }}
          >
            Open in new tab
          </Button>
          <Tooltip title={isFullscreen ? "Exit fullscreen (F · double-click)" : "Fullscreen (F · double-click)"} placement="top">
            <Button
              size="small"
              icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            />
          </Tooltip>
        </Space>
        {movie.mediaType === "tv" && (
          <>
            {isTvLoading ? (
              <Spin size="small" style={{ margin: "1rem 0" }} />
            ) : (
              <TvEpisodeSelector
                season={season}
                episode={episode}
                onSeasonChange={setSeason}
                onEpisodeChange={setEpisode}
                totalSeasons={tvDetail?.number_of_seasons ?? 20}
                totalEpisodes={totalEpisodesForSeason}
              />
            )}
          </>
        )}

      </Flex>

      <ServerSelector activeServer={server} onServerChange={setServer} />

      {/* <Text strong style={{ color: colors.textPrimary }}>{movie.title} ({movie.year})</Text>
      {movie.genre.map((g) => (
        <Tag key={g} color={GENRE_COLORS[g] ?? 'default'} className="player__genre-tag">{g}</Tag>
      ))} */}

      <Flex
        gap="small"
        vertical
        style={{ backgroundColor: colors.bgBase, padding: "1rem 0" }}
      >
        <Text strong style={{ color: colors.textPrimary }}>Synopsis</Text>
        <ExpandableText
          text={movie.description || 'No synopsis available.'}
          collapsedLines={3}
          lineHeight={1.7}
          fontSize={13}
          color={colors.playerTextMuted}
        />
      </Flex>

      {typeof movie.id === "number" && (
        <Flex
          vertical
          style={{
            backgroundColor: colors.bgBase,
            padding: "0.5rem 0.75rem 0.75rem",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <CastSection
            tmdbId={movie.id}
            mediaType={movie.mediaType}
            labelColor={colors.textMuted}
            nameColor={colors.textPrimary}
            charColor={colors.textMuted}
          />
        </Flex>
      )}
    </Modal>
  );
}
