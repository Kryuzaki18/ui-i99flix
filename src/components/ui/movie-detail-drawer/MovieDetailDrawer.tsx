import { useState } from 'react';
import { Drawer, Button, Tag, Rate, Typography, Space, Divider, Row, Col, Skeleton } from 'antd';
import {
  PlayCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  StarFilled,
} from '@ant-design/icons';
import type { Movie } from '../../../models/movie';
import { useTheme } from '../../../context/ThemeContext';

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

export default function MovieDetailDrawer({
  movie,
  open,
  onClose,
  onPlay,
}: MovieDetailDrawerProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors, isDark } = useTheme();

  // Reset on movie change
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
        body: { background: colors.bgBase, padding: 0 },
        header: {
          background: colors.bgBase,
          borderBottom: `1px solid ${colors.border}`,
        },
        mask: { backdropFilter: 'blur(4px)' },
      }}
      title={
        <Text strong style={{ fontSize: 16 }}>
          Movie Details
        </Text>
      }
    >
      {/* ── Backdrop with skeleton ── */}
      <div style={{ position: 'relative', height: 220, background: colors.skeletonBg }}>
        {!imgLoaded && (
          <Skeleton.Image
            active
            style={{ width: '100%', height: 220, borderRadius: 0 }}
          />
        )}
        <img
          src={movie.backdrop}
          alt={movie.title}
          onLoad={() => setImgLoaded(true)}
          style={{
            width: '100%',
            height: 220,
            objectFit: 'cover',
            display: imgLoaded ? 'block' : 'none',
          }}
        />
        {imgLoaded && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to top, ${colors.bgBase} 0%, transparent 60%)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <StarFilled style={{ color: '#fadb14', fontSize: 18 }} />
              <Text style={{ color: '#fadb14', fontSize: 20, fontWeight: 700 }}>
                {movie.rating}
              </Text>
              <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 14 }}>/10</Text>
            </div>
          </>
        )}
      </div>

      <div style={{ padding: '20px 24px' }}>
        {!imgLoaded ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <Title level={3} style={{ margin: '0 0 8px' }}>
              {movie.title}
            </Title>

            <Space size={8} wrap style={{ marginBottom: 16 }}>
              {movie.genre.map((g) => (
                <Tag key={g} color={genreColors[g] || 'default'}>
                  {g}
                </Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending && <Tag color="red">Trending</Tag>}
            </Space>

            <Row gutter={24} style={{ marginBottom: 16 }}>
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
              style={{ fontSize: 16, color: '#fadb14', marginBottom: 16 }}
            />

            <Divider style={{ margin: '12px 0' }} />

            <Text
              strong
              style={{
                color: colors.textMuted,
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Synopsis
            </Text>
            <Paragraph style={{ color: colors.textSecondary, marginTop: 8, lineHeight: 1.7 }}>
              {movie.description}
            </Paragraph>
            <Paragraph style={{ color: colors.textMuted, lineHeight: 1.7 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Paragraph>

            <Divider style={{ margin: '12px 0' }} />

            <Button
              type="primary"
              size="large"
              block
              icon={<PlayCircleOutlined />}
              onClick={() => {
                onPlay(movie);
                onClose();
              }}
              style={{
                background: '#e50914',
                borderColor: '#e50914',
                fontWeight: 600,
                height: 48,
                fontSize: 16,
              }}
            >
              Play Now
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
}
