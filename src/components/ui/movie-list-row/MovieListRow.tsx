import { Space, Tag, Typography, Button, Tooltip } from 'antd';
import type { TooltipProps } from 'antd';
import { memo } from 'react';
import { PlayCircleOutlined, InfoCircleOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import type { Movie } from '../../../models/movieModel';
import { useTheme } from '../../../context/ThemeContext';
import useResolvedGenres from '../../../hooks/useResolvedGenres';
import { useWatchlistQuery, useAddToWatchlistMutation, useRemoveFromWatchlistMutation } from '../../../api/useWatchlistQuery';
import './MovieListRow.css';

const { Text } = Typography;

const TOOLTIP_TRIGGER: TooltipProps['trigger'] = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  ? []
  : ['hover'];

interface MovieListRowProps {
  movie:    Movie;
  onPlay:   (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

function MovieListRowInner({ movie, onPlay, onDetail }: MovieListRowProps) {
  const { colors } = useTheme();
  const resolvedGenres = useResolvedGenres(movie.genre);

  const { data: watchlistItems = [] } = useWatchlistQuery();
  const addMutation    = useAddToWatchlistMutation();
  const removeMutation = useRemoveFromWatchlistMutation();

  const movieId     = String(movie.id);
  const inWatchlist = watchlistItems.some((w) => w.movieId === movieId);
  const isPending   = addMutation.isPending || removeMutation.isPending;

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) removeMutation.mutate(movieId);
    else             addMutation.mutate(movie);
  };

  return (
    <div
      className="movie-list-row"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <div className="movie-list-row__media">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="movie-list-row__thumb"
        />

        <div className="movie-list-row__body">
          <div className="movie-list-row__info">
            <Space size={6} wrap className="movie-list-row__meta">
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {movie.year}
              </Text>
              {movie.duration && movie.duration !== 'N/A' && (
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {movie.duration}
                </Text>
              )}
              {resolvedGenres.map((rg, i) => (
                <Tag
                  key={rg.key}
                  color={rg.color ?? 'default'}
                  className={i >= 3 ? 'movie-list-row__tag--hide-mobile' : undefined}
                  style={{ margin: 0, fontSize: 11 }}
                >
                  {rg.label}
                </Tag>
              ))}
            </Space>

            <Text strong className="movie-list-row__title">
              {movie.title}
            </Text>

            <Text className="movie-list-row__desc" style={{ color: colors.textMuted }}>
              {movie.description}
            </Text>
          </div>
        </div>
      </div>

      <div className="movie-list-row__actions">
        <Text className="movie-list-row__rating">★ {movie.rating}</Text>
        <Space size={8}>
          <Tooltip title="Play" trigger={TOOLTIP_TRIGGER}>
            <Button
              size="middle"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => onPlay(movie)}
              aria-label={`Play ${movie.title}`}
              style={{ background: '#e50914', borderColor: '#e50914' }}
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
          <Tooltip title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'} trigger={TOOLTIP_TRIGGER}>
            <Button
              size="middle"
              loading={isPending}
              icon={inWatchlist ? <HeartFilled style={{ color: '#e50914' }} /> : <HeartOutlined />}
              onClick={handleWatchlistToggle}
              aria-label={inWatchlist ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
              className="movie-list-row__btn-gray"
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
}

export default memo(MovieListRowInner);
