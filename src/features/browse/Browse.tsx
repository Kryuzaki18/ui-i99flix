import { Typography, Row, Col, Input, Select, Space, Empty, Segmented } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import { useBrowse } from '../../hooks/useBrowse';
import { GENRES } from '../../core/services/movieService';
import { useTheme } from '../../context/ThemeContext';
import type { Movie } from '../../models/movie';
import { useState } from 'react';

const { Title, Text } = Typography;

interface BrowseProps {
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

export default function Browse({ onPlay, onDetail }: BrowseProps) {
  const { movies, selectedGenre, setSelectedGenre, searchQuery, setSearchQuery } = useBrowse();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const { colors } = useTheme();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: '0 0 8px' }}>
          Browse Movies
        </Title>
        <Text style={{ color: colors.textMuted }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </div>

      {/* Filters bar */}
      <div
        style={{
          background: colors.bgCard,
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 28,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={10} lg={8}>
            <Input
              placeholder="Search movies, genres..."
              prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={16} md={10} lg={12}>
            <Select
              value={selectedGenre}
              onChange={setSelectedGenre}
              style={{ width: '100%' }}
              options={GENRES}
              placeholder="Select genre"
            />
          </Col>
          <Col xs={24} sm={8} md={4} lg={4}>
            <Segmented
              value={layout}
              onChange={(v) => setLayout(v as 'grid' | 'list')}
              options={[
                { value: 'grid', icon: <AppstoreOutlined /> },
                { value: 'list', icon: <BarsOutlined /> },
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* Genre quick-filter pills */}
      <Space size={8} wrap style={{ marginBottom: 24 }}>
        {GENRES.map((g) => (
          <button
            key={g.value}
            onClick={() => setSelectedGenre(g.value)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: `1px solid ${selectedGenre === g.value ? '#e50914' : colors.border}`,
              background: selectedGenre === g.value ? '#e50914' : 'transparent',
              color: selectedGenre === g.value ? '#fff' : colors.textMuted,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: selectedGenre === g.value ? 600 : 400,
              transition: 'all 0.2s ease',
            }}
          >
            {g.label}
          </button>
        ))}
      </Space>

      {/* Results count */}
      <div style={{ marginBottom: 20 }}>
        <Text style={{ color: colors.textMuted }}>
          Showing{' '}
          <Text strong style={{ color: colors.textPrimary }}>
            {movies.length}
          </Text>{' '}
          movies
          {searchQuery && (
            <>
              {' '}for "
              <Text style={{ color: '#e50914' }}>{searchQuery}</Text>"
            </>
          )}
        </Text>
      </div>

      {/* Grid / List */}
      {movies.length === 0 ? (
        <Empty
          description={
            <Text style={{ color: colors.textMuted }}>
              No movies found. Try a different search.
            </Text>
          }
          style={{ padding: '60px 0' }}
        />
      ) : layout === 'grid' ? (
        <Row gutter={[16, 20]}>
          {movies.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <MovieCard movie={movie} onPlay={onPlay} onDetail={onDetail} />
            </Col>
          ))}
        </Row>
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                overflow: 'hidden',
                display: 'flex',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e50914';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 2px 12px rgba(229,9,20,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = colors.border;
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                style={{ width: 140, height: 90, objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ padding: '12px 16px', flex: 1, minWidth: 0 }}>
                <Row justify="space-between" align="top">
                  <Col flex="auto">
                    <Text strong style={{ fontSize: 15, display: 'block' }}>
                      {movie.title}
                    </Text>
                    <Space size={6} style={{ marginTop: 4 }} wrap>
                      {movie.genre.map((g) => (
                        <Text key={g} style={{ color: colors.textMuted, fontSize: 12 }}>
                          {g}
                        </Text>
                      ))}
                      <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                        · {movie.year} · {movie.duration}
                      </Text>
                    </Space>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontSize: 13,
                        display: 'block',
                        marginTop: 6,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {movie.description}
                    </Text>
                  </Col>
                  <Col style={{ paddingLeft: 12, flexShrink: 0 }}>
                    <Space direction="vertical" size={6} align="end">
                      <Text style={{ color: '#fadb14', fontWeight: 700 }}>
                        ★ {movie.rating}
                      </Text>
                      <Space size={6}>
                        <button
                          onClick={() => onPlay(movie)}
                          style={{
                            background: '#e50914',
                            border: 'none',
                            borderRadius: 6,
                            color: '#fff',
                            padding: '4px 12px',
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Play
                        </button>
                        <button
                          onClick={() => onDetail(movie)}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${colors.border}`,
                            borderRadius: 6,
                            color: colors.textMuted,
                            padding: '4px 12px',
                            cursor: 'pointer',
                            fontSize: 12,
                          }}
                        >
                          Info
                        </button>
                      </Space>
                    </Space>
                  </Col>
                </Row>
              </div>
            </div>
          ))}
        </Space>
      )}
    </div>
  );
}
