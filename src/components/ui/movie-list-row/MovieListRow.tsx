import { memo } from "react";
import { Space, Tag, Typography, Button, Tooltip, Flex } from "antd";
import type { TooltipProps } from "antd";
import { PlayCircleOutlined, InfoCircleOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";

import type { Movie } from "../../../models/movieModel";
import { useTheme } from "../../../context/ThemeContext";
import useResolvedGenres from "../../../hooks/useResolvedGenres";
import useWatchlistStatus from "../../../hooks/useWatchlistStatus";
import "./MovieListRow.css";

const { Text } = Typography;

const TOOLTIP_TRIGGER: TooltipProps["trigger"] =
  window.matchMedia("(hover: none) and (pointer: coarse)").matches ? [] : ["hover"];

interface MovieListRowProps {
  movie:    Movie;
  onPlay:   (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

function MovieListRowInner({ movie, onPlay, onDetail }: MovieListRowProps) {
  const { colors } = useTheme();
  const resolvedGenres = useResolvedGenres(movie.genre);
  const { inWatchlist, isPending, toggle } = useWatchlistStatus(movie);

  return (
    <Flex
      align="stretch"
      className="movie-list-row"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <Flex align="stretch" className="movie-list-row__media">
        <img src={movie.thumbnail || undefined} alt={movie.title} className="movie-list-row__thumb" />

        <Flex align="center" className="movie-list-row__body">
          <Flex vertical gap={3} className="movie-list-row__info">
            <Space size={6} wrap className="movie-list-row__meta">
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{movie.year}</Text>
              {movie.duration && movie.duration !== "N/A" && (
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{movie.duration}</Text>
              )}
              {resolvedGenres.map((rg, i) => (
                <Tag
                  key={rg.key}
                  color={rg.color ?? "default"}
                  className={i >= 3 ? "movie-list-row__tag--hide-mobile" : undefined}
                  style={{ margin: 0, fontSize: 11 }}
                >
                  {rg.label}
                </Tag>
              ))}
            </Space>

            <Text strong className="movie-list-row__title">{movie.title}</Text>

            <Text className="movie-list-row__desc" style={{ color: colors.textMuted }}>
              {movie.description}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex vertical align="center" justify="center" gap={6} className="movie-list-row__actions">
        <Text className="movie-list-row__rating">★ {movie.rating}</Text>
        <Space size={8}>
          <Tooltip title="Play" trigger={TOOLTIP_TRIGGER}>
            <Button
              size="middle"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => onPlay(movie)}
              aria-label={`Play ${movie.title}`}
              style={{ background: colors.accent, borderColor: colors.accent }}
            />
          </Tooltip>
          <Tooltip title="More Info" trigger={TOOLTIP_TRIGGER}>
            <Button
              size="middle"
              icon={<InfoCircleOutlined />}
              onClick={() => onDetail(movie)}
              aria-label={`More info about ${movie.title}`}
              className="movie-list-row__btn-gray"
            />
          </Tooltip>
          <Tooltip
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            trigger={TOOLTIP_TRIGGER}
          >
            <Button
              size="middle"
              loading={isPending}
              icon={inWatchlist
                ? <HeartFilled style={{ color: colors.accent }} />
                : <HeartOutlined />
              }
              onClick={toggle}
              aria-label={inWatchlist
                ? `Remove ${movie.title} from watchlist`
                : `Add ${movie.title} to watchlist`
              }
              className="movie-list-row__btn-gray"
            />
          </Tooltip>
        </Space>
      </Flex>
    </Flex>
  );
}

export default memo(MovieListRowInner);
