import { Tag, Flex } from "antd";
import { PlayCircleOutlined, CheckCircleFilled } from "@ant-design/icons";
import TvEpisodeSelector from "../../components/ui/tv-episode-selector/TvEpisodeSelector";
import ServerSelector from "../../components/ui/server-selector/ServerSelector";
import ServerIframe from "../../components/ui/server-iframe/ServerIframe";
import { useTheme } from "../../context/ThemeContext";
import type { Movie } from "../../models/movieModel";
import type { TmdbTvDetail } from "../../api/tmdb/tmdbApi";

interface PlayerVideoZoneProps {
  movie:                  Movie;
  playing:                boolean;
  onPlay:                 () => void;
  isTv:                   boolean;
  season:                 number;
  episode:                number;
  onSeasonChange:         (s: number) => void;
  onEpisodeChange:        (ep: number) => void;
  watchedEpisodes:        Set<string>;
  wasWatched:             boolean;
  tvDetail:               TmdbTvDetail | undefined;
  totalEpisodesForSeason: number;
  servers:                number;
  onServerChange:         (s: number) => void;
}

export default function PlayerVideoZone({
  movie,
  playing,
  onPlay,
  isTv,
  season,
  episode,
  onSeasonChange,
  onEpisodeChange,
  watchedEpisodes,
  wasWatched,
  tvDetail,
  totalEpisodesForSeason,
  servers,
  onServerChange,
}: PlayerVideoZoneProps) {
  const { colors } = useTheme();

  return (
    <>
      <Flex vertical className="player-page__video" style={{ flexShrink: 0 }}>
        {!playing && (
          <div className="player-page__video-clickzone">
            <img
              src={movie.backdrop || movie.thumbnail}
              alt={movie.title}
              className="player-page__backdrop"
            />
            <div className="player-page__vignette" />

            {wasWatched && (
              <Tag
                icon={<CheckCircleFilled />}
                color="success"
                style={{
                  position: "absolute", top: 12, left: 12, zIndex: 3,
                  borderRadius: 12, fontWeight: 600, fontSize: 12, padding: "2px 10px",
                }}
              >
                {isTv
                  ? `${watchedEpisodes.size} episode${watchedEpisodes.size !== 1 ? "s" : ""} watched`
                  : "Watched"}
              </Tag>
            )}

            <Flex align="center" justify="center" className="player-page__overlay">
              <Flex vertical align="center" gap={10}>
                <PlayCircleOutlined className="player-page__play-icon" onClick={onPlay} />
              </Flex>
            </Flex>
          </div>
        )}

        {playing && (
          <Flex vertical flex="1" className="player-page__iframe-wrap">
            <ServerIframe
              server={servers}
              mediaId={movie.id}
              mediaType={movie.mediaType}
              season={season}
              episode={episode}
              className="player-page__iframe"
            />
          </Flex>
        )}
      </Flex>

      <Flex
        gap="small"
        align="center"
        justify="space-between"
        style={{ background: colors.bgBase, padding: "0.5rem", position: "relative" }}
      >
        {isTv && (
          <TvEpisodeSelector
            season={season}
            episode={episode}
            onSeasonChange={onSeasonChange}
            onEpisodeChange={onEpisodeChange}
            watchedEpisodes={watchedEpisodes}
            seasons={tvDetail?.seasons}
            totalEpisodes={totalEpisodesForSeason}
          />
        )}
      </Flex>

      <div style={{ padding: "0 0.5rem 0.5rem" }}>
        <ServerSelector activeServer={servers} onServerChange={onServerChange} />
      </div>
    </>
  );
}
