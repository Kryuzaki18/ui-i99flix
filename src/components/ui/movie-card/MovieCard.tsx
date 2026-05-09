import { useState } from 'react';
import { Card, Tag, Rate, Typography, Space, Button, Tooltip, Skeleton } from 'antd';
import { PlayCircleOutlined, InfoCircleOutlined, StarFilled } from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';

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
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        overflow: 'hidden',
        height: '100%',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      styles={{
        body: { padding: '12px 14px' },
      }}
      cover={
        <div style={{ position: 'relative', overflow: 'hidden', height: 180 }}>
          {/* Skeleton shown until image loads */}
          {!imgLoaded && (
            <Skeleton.Image
              active
              style={{
                width: '100%',
                height: 180,
                borderRadius: 0,
              }}
            />
          )}

          <img
            alt={movie.title}
            src={movie.thumbnail}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: '100%',
              height: 180,
              objectFit: 'cover',
              display: imgLoaded ? 'block' : 'none',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')
            }
          />

          {/* Hover overlay — only visible when image is loaded */}
          {imgLoaded && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '12px',
                gap: 8,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
              className="card-overlay"
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.opacity = '1')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.opacity = '0')
              }
            >
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
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    borderColor: 'transparent',
                    color: '#fff',
                  }}
                />
              </Tooltip>
            </div>
          )}

          {/* Rating badge */}
          {imgLoaded && (
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'rgba(0,0,0,0.72)',
                borderRadius: 6,
                padding: '2px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                {movie.rating}
              </Text>
            </div>
          )}
        </div>
      }
    >
      <Space direction="vertical" size={6} style={{ width: '100%' }}>
        {/* Title skeleton */}
        {!imgLoaded ? (
          <Skeleton active paragraph={{ rows: 2 }} title={{ width: '80%' }} />
        ) : (
          <>
            <Text
              strong
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {movie.title}
            </Text>

            <Space size={4} wrap>
              {movie.genre.slice(0, 2).map((g) => (
                <Tag
                  key={g}
                  color={genreColors[g] || 'default'}
                  style={{ fontSize: 10, padding: '0 6px', margin: 0 }}
                >
                  {g}
                </Tag>
              ))}
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                {movie.year} · {movie.duration}
              </Text>
            </Space>

            <Paragraph
              style={{ color: isDark ? '#aaa' : '#555', fontSize: 12, margin: 0 }}
              ellipsis={{ rows: 2 }}
            >
              {movie.description}
            </Paragraph>

            <Rate
              disabled
              allowHalf
              defaultValue={movie.rating / 2}
              style={{ fontSize: 12, color: '#fadb14' }}
            />
          </>
        )}
      </Space>
    </Card>
  );
}
