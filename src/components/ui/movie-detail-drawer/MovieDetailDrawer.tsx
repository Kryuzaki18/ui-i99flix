import { useState } from 'react';
import { Drawer, Button, Tag, Rate, Typography, Space, Divider, Row, Col, Skeleton } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';
import './MovieDetailDrawer.css';

const { Title, Paragraph, Text } = Typography;

interface MovieDetailDrawerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
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

export default function MovieDetailDrawer({ movie, open, onClose, onPlay }: MovieDetailDrawerProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors, isDark }        = useTheme();

  const handleAfterOpenChange = (visible: boolean) => {
    if (visible) setImgLoaded(false);
  };

  if (!movie) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      afterOpenChange={handleAfterOpenChange}
      width="min(520px, 100vw)"
      styles={{
        body:   { background: colors.bgBase, padding: 0 },
        header: { background: colors.bgBase, borderBottom: `1px solid ${colors.border}` },
        mask:   { backdropFilter: 'blur(4px)' },
      }}
      title={<Text strong style={{ fontSize: 16 }}>Movie Details</Text>}
    >
      {/* Backdrop */}
      <div
        className="detail-drawer__backdrop-wrap"
        style={{ background: colors.skeletonBg }}
      >
        {!imgLoaded && (
          <Skeleton.Image active className="detail-drawer__skeleton-img" />
        )}
        <img
          src={movie.backdrop}
          alt={movie.title}
          onLoad={() => setImgLoaded(true)}
          className="detail-drawer__backdrop-img"
          style={{ display: imgLoaded ? 'block' : 'none' }}
        />
        {imgLoaded && (
          <>
            <div
              className="detail-drawer__backdrop-gradient"
              style={{ background: `linear-gradient(to top, ${colors.bgBase} 0%, transparent 60%)` }}
            />
            <div className="detail-drawer__rating-badge">
              <StarFilled style={{ color: '#fadb14', fontSize: 18 }} />
              <Text className="detail-drawer__rating-value">{movie.rating}</Text>
              <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 14 }}>/10</Text>
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="detail-drawer__body">
        {!imgLoaded ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <Title level={3} className="detail-drawer__title">{movie.title}</Title>

            <Space size={8} wrap className="detail-drawer__tags">
              {movie.genre.map((g) => (
                <Tag key={g} color={genreColors[g] || 'default'}>{g}</Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending   && <Tag color="red">Trending</Tag>}
            </Space>

            <Row gutter={24} className="detail-drawer__meta-row">
              <Col span={12}>
                <Space>
                  <CalendarOutlined style={{ color: colors.textMuted }} />
                  <Text style={{ color: colors.textSecondary }}>{movie.year}</Text>
                </Space>
              </Col>
              <Col span={12}>
                <Space>
                  <ClockCircleOutlined style={{ color: colors.textMuted }} />
                  <Text style={{ color: colors.textSecondary }}>{movie.duration}</Text>
                </Space>
              </Col>
            </Row>

            <Rate
              disabled
              allowHalf
              defaultValue={movie.rating / 2}
              className="detail-drawer__rate"
            />

            <Divider />

            <Text
              strong
              className="detail-drawer__synopsis-label"
              style={{ color: colors.textMuted }}
            >
              Synopsis
            </Text>
            <Paragraph
              className="detail-drawer__synopsis-text"
              style={{ color: colors.textSecondary }}
            >
              {movie.description}
            </Paragraph>
            <Paragraph
              className="detail-drawer__extra-text"
              style={{ color: colors.textMuted }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>

            <Divider />

            <Button
              type="primary"
              size="large"
              block
              icon={<PlayCircleOutlined />}
              className="detail-drawer__play-btn"
              onClick={() => { onPlay(movie); onClose(); }}
            >
              Play Now
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
}
