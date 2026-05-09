import { useState } from 'react';
import { Card, Tag, Rate, Typography, Space, Button, Tooltip, Skeleton } from 'antd';
import { PlayCircleOutlined, InfoCircleOutlined, StarFilled } from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';
import './MovieCard.css';

const { Text, Paragraph } = Typography;

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

const genreColors: Record<string, string> = {
  Action: 'red',
  Drama: 'blue',
  Comedy: 'gold',
  Thriller: 'purple',
  'Sci-Fi': 'cyan',
  Horror: 'volcano',
  Romance: 'pink',
  Animation: 'green',
};

export default function MovieCard({ movie, onPlay, onDetail }: MovieCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors, isDark } = useTheme();

  return (
    <Card
      hoverable
      className="movie-card"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
      }}
      styles={{ body: { padding: 0 } }}
      cover={
        <div className="movie-card__cover">
          {/* Skeleton until image loads */}
          {!imgLoaded && (
            <Skeleton.Image active className="movie-card__skeleton-img" />
          )}

          <img
            alt={movie.title}
            src={movie.thumbnail}
            onLoad={() => setImgLoaded(true)}
            className="movie-card__img"
            style={{ display: imgLoaded ? 'block' : 'none' }}
          />

          {/* Hover overlay */}
          {imgLoaded && (
            <div className="movie-card__overlay">
              <Tooltip title="Play">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<PlayCircleOutlined />}
                  size="large"
                  onClick={() => onPlay(movie)}
                  style={{ background: '#e50914', borderColor: '#e50914' }}
                />
              </Tooltip>
              <Tooltip title="More Info">
                <Button
                  shape="circle"
                  icon={<InfoCircleOutlined />}
                  size="large"
                  onClick={() => onDetail(movie)}
                  className="movie-card__overlay-btn-info"
                />
              </Tooltip>
            </div>
          )}

          {/* Rating badge */}
          {imgLoaded && (
            <div className="movie-card__rating">
              <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
              <Text className="movie-card__rating-value">{movie.rating}</Text>
            </div>
          )}
        </div>
      }
    >
      <div className="movie-card__body">
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          {!imgLoaded ? (
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '80%' }} />
          ) : (
            <>
              <Text
                strong
                className="movie-card__title"
                style={{ color: colors.textPrimary }}
              >
                {movie.title}
              </Text>

              <Space size={4} wrap>
                {movie.genre.slice(0, 2).map((g) => (
                  <Tag
                    key={g}
                    color={genreColors[g] || 'default'}
                    className="movie-card__tag"
                  >
                    {g}
                  </Tag>
                ))}
                <Text className="movie-card__meta" style={{ color: colors.textMuted }}>
                  {movie.year} · {movie.duration}
                </Text>
              </Space>

              <Paragraph
                className="movie-card__desc"
                style={{ color: isDark ? '#aaa' : '#555' }}
                ellipsis={{ rows: 2 }}
              >
                {movie.description}
              </Paragraph>

              <Rate
                disabled
                allowHalf
                defaultValue={movie.rating / 2}
                className="movie-card__rate"
              />
            </>
          )}
        </Space>
      </div>
    </Card>
  );
}
