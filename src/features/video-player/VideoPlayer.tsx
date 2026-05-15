import { Modal, Typography, Space, Tag, Button, Tooltip, Flex } from "antd";
import {
  PlayCircleOutlined,
  ExpandOutlined,
  CompressOutlined,
  LinkOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Movie } from "../../models/movie";
import { useTheme } from "../../context/ThemeContext";
import { useFullscreen } from "../../hooks/useFullscreen";
import { useTrailerKey } from "../../hooks/useTrailerKey";
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
  const [servers, setServers] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { colors } = useTheme();
  const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();

  const movieId = typeof movie?.id === "number" ? movie.id : null;
  const { trailerKey, isLoading: trailerLoading } = useTrailerKey(
    open ? movieId : null,
  );

  // Reset play state when modal closes or movie changes
  useEffect(() => {
    if (!open) setPlaying(false);
  }, [open, movie?.id]);

  // Pause iframe when modal closes
  useEffect(() => {
    if (!open && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "https://www.youtube.com",
      );
    }
  }, [open]);

  const handlePlay = useCallback(() => setPlaying(true), []);

  if (!movie) return null;

  const youtubeUrl = trailerKey
    ? `https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`
    : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="min(900px, 95vw)"
      centered
      style={{ padding: 0 }}
      styles={{
        body: {
          background: "#000",
          padding: 0,
          borderRadius: 12,
          overflow: "hidden",
        },
        mask: { backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.85)" },
      }}
      closeIcon={<span className="player__close-icon">✕</span>}
      destroyOnHidden
    >
      <div
        ref={fullscreenRef}
        className={`player__fullscreen-root${isFullscreen ? " player__fullscreen-root--active" : ""}`}
      >
        {/* ── Video area ── */}
        <div className="player__video-area">
          {/* Poster / play gate — shown before user clicks play */}
          {!playing && (
            <div className="player__poster-gate" onClick={handlePlay}>
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="player__backdrop"
              />
              <div className="player__poster-overlay" />
              <div className="player__overlay">
                {trailerLoading ? (
                  <LoadingOutlined className="player__play-icon" />
                ) : trailerKey ? (
                  <PlayCircleOutlined className="player__play-icon" />
                ) : (
                  <div className="player__no-trailer">
                    <PlayCircleOutlined className="player__play-icon player__play-icon--dim" />
                    <Text className="player__no-trailer-text">
                      No trailer available
                    </Text>
                  </div>
                )}
              </div>
              <div className="player__title-overlay">
                <Title level={5} className="player__title">
                  {movie.title}
                </Title>
              </div>
            </div>
          )}

          {playing && servers === 1 && (
            <iframe
              src={`https://ezvidapi.com/embed/movie/${movie.id}?provider=vidsrc`}
              className="player__iframe"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}

          {playing && servers === 2 && (
            <iframe
              src={`https://vidlink.pro/movie/${movie.id}`}
              className="player__iframe"
              allowFullScreen
            ></iframe>
          )}

          {playing && servers === 3 && (
            <iframe
              src={`https://vidsrc.fyi/embed/movie/${movie.id}`}
              className="player__iframe"
              allowFullScreen
            ></iframe>
          )}

          {playing && servers === 4 && (
            <iframe
              src={`https://www.2embed.stream/embed/movie/${movie.id}`}
              className="player__iframe"
              allowFullScreen
            ></iframe>
          )}

          {playing && !youtubeUrl && (
            <div className="player__no-trailer-full">
              <img
                src={movie.backdrop || movie.thumbnail}
                alt={movie.title}
                className="player__backdrop player__backdrop--dim"
              />
              <div className="player__poster-overlay" />
              <div className="player__overlay">
                <Text className="player__no-trailer-text player__no-trailer-text--lg">
                  No trailer available for this title
                </Text>
              </div>
            </div>
          )}
        </div>

        <Flex
          gap="medium"
          align="center"
          justify="space-between"
          style={{ background: colors.playerControls, padding: "0.5rem" }}
        >
          <Flex gap="small" align="center">
            <Button size="small" onClick={() => setServers(1)} type={servers === 1 ? "primary" : "default"}>
              Server 1
            </Button>
            <Button size="small" onClick={() => setServers(2)} type={servers === 2 ? "primary" : "default"}>
              Server 2
            </Button>
            <Button size="small" onClick={() => setServers(3)} type={servers === 3 ? "primary" : "default"}>
              Server 3
            </Button>
            <Button size="small" onClick={() => setServers(4)} type={servers === 4 ? "primary" : "default"}>
              Server 4
            </Button>
          </Flex>

          <Space size={8}>
            <Button
              size="small"
              icon={<LinkOutlined />}
              onClick={() =>
                window.open(
                  `/player/${movie.id}`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Open in new tab
            </Button>

            <Tooltip
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              placement="top"
            >
              <Button
                size="small"
                icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                onClick={toggleFullscreen}
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              />
            </Tooltip>
          </Space>
        </Flex>

        {/* ── Controls bar ── */}

        <Flex
          gap="small"
          align="center"
          style={{ background: colors.playerControls, padding: "0.5rem" }}
        >
          <Text>{movie.title} ({movie.year}) • {movie.duration}</Text>
          {movie.genre.map((g) => (
            <Tag key={g} className="player__genre-tag">
              {g}
            </Tag>
          ))}
        </Flex>
      </div>
    </Modal>
  );
}
