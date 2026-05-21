import { Row, Col, Space, Tag, Typography, Button } from 'antd';
import { memo } from 'react';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';
import { GENRE_COLORS } from '../../../constants/genres';
import './MovieListRow.css';

const { Text } = Typography;

interface MovieListRowProps {
  movie:    Movie;
  onPlay:   (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

function MovieListRowInner({ movie, onPlay, onDetail }: MovieListRowProps) {
  const { colors } = useTheme();

  return (
    <div
      className="movie-list-row"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <img
        src={movie.thumbnail}
        alt={movie.title}
        className="movie-list-row__thumb"
      />
      <div className="movie-list-row__body">
        <Row justify="space-between" align="top" wrap={false}>
          <Col flex="auto" style={{ minWidth: 0, paddingRight: 16 }}>
            <Text strong className="movie-list-row__title">
              {movie.title}
            </Text>
            <Space size={8} className="movie-list-row__meta" wrap>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {movie.year}
              </Text>
              {movie.duration && movie.duration !== 'N/A' && (
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {movie.duration}
                </Text>
              )}
              {movie.genre.slice(0, 3).map((g) => (
                <Tag
                  key={g}
                  color={GENRE_COLORS[g] ?? 'default'}
                  style={{ margin: 0, fontSize: 11 }}
                >
                  {g}
                </Tag>
              ))}
            </Space>
            <Text
              className="movie-list-row__desc"
              style={{ color: colors.textMuted }}
            >
              {movie.description}
            </Text>
          </Col>
          <Col className="movie-list-row__actions">
            <Space direction="vertical" size={6} align="end">
              <Text className="movie-list-row__rating">★ {movie.rating}</Text>
              <Space size={6}>
                <Button size="small" type="primary" onClick={() => onPlay(movie)}>
                  Play
                </Button>
                <Button size="small" onClick={() => onDetail(movie)}>
                  Info
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default memo(MovieListRowInner);
