import { Modal, Typography, Space, Tag, Rate, Button, Flex, Spin } from "antd";
import {
  PlayCircleOutlined,
  LinkOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import type { Movie } from "../../models/movieModel";
import { useTheme } from "../../context/ThemeContext";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import TvEpisodeSelector from "../../components/ui/tv-episode-selector/TvEpisodeSelector";
import { useTmdbTvDetailQuery } from "../../api/useTmdbQuery";
import useResolvedGenres from '../../hooks/useResolvedGenres';
import usePageTitle from '../../hooks/usePageTitle';
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
  const [server, setServer] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const { colors } = useTheme();

  const { data: tvDetail, isLoading: isTvLoading } = useTmdbTvDetailQuery(
    movie?.mediaType === "tv" ? Number(movie.id) : null
  );

  const resolvedGenres = useResolvedGenres(movie?.genre);

  const totalEpisodesForSeason =
    tvDetail?.seasons?.find((s) => s.season_number === season)?.episode_count ?? 30;

  useEffect(() => {
    if (!open) {
      setPlaying(false);
      setServer(0);
      setSeason(1);
      setEpisode(1);
    }
  }, [open, movie?.id]);

  usePageTitle(
    open ? movie?.title : null,
    movie?.mediaType,
    open && movie?.mediaType === "tv" ? season : undefined,
    open && movie?.mediaType === "tv" ? episode : undefined
  );

  const handlePlay = useCallback(() => setPlaying(true), []);

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
        body: { backgroundColor: colors.bgBase, padding: 0, overflow: "hidden" },
        mask: { backdropFilter: "blur(1px)", background: "rgba(0,0,0,0.85)" },
        container: {
          padding: 0,
          overflow: "hidden"
        },
      }}
      closeIcon={<span style={{ backgroundColor: colors.accent, color: colors.playerText }} className="player__close-icon"><CloseOutlined /></span>}
      destroyOnHidden
    >
      <div
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
                  {resolvedGenres.slice(0, 3).map((rg) => (
                    <Tag
                      key={rg.key}
                      color={rg.color || "default"}
                      style={{ fontSize: 11, margin: 0 }}
                    >
                      {rg.label}
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
        style={{ padding: "0 1rem" }}
      >
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
              type="primary"
              size="small"
              icon={<LinkOutlined />}
              onClick={() => {
                const url = movie.mediaType === "tv"
                  ? `/player/${movie.id}?type=tv&season=${season}&episode=${episode}`
                  : `/player/${movie.id}`;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
              style={{ fontSize: 11 }}
            >
              Open in new tab
            </Button>
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

        <Flex
          vertical
          style={{
            padding: "1rem 0",
          }}
        >
          <Text strong style={{ color: colors.textMuted }}>Synopsis</Text>
          <ExpandableText
            text={movie.description || 'No synopsis available.'}
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
