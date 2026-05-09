import { useState } from 'react';
import { Typography, Row, Col, Input, Select, Space, Empty, Segmented, Pagination } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import { useBrowse } from '../../hooks/useBrowse';
import { GENRES } from '../../services/movieService';
import { useTheme } from '../../context/ThemeContext';
import type { Movie } from '../../models/movie';
import './Browse.css';

const { Title, Text } = Typography;

const PAGE_SIZE_OPTIONS = ['8', '12', '16', '24'];
const DEFAULT_PAGE_SIZE = 12;

interface BrowseProps {
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

export default function Browse({ onPlay, onDetail }: BrowseProps) {
  const { movies, selectedGenre, setSelectedGenre, searchQuery, setSearchQuery } = useBrowse();
  const [layout, setLayout]     = useState<'grid' | 'list'>('grid');
  const [page, setPage]         = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const { colors }              = useTheme();

  // Reset to page 1 whenever filters change
  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Slice movies for current page
  const totalMovies   = movies.length;
  const pagedMovies   = movies.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {/* ── Header ── */}
      <div className="browse-header">
        <Title level={2}>Browse Movies</Title>
        <Text style={{ color: colors.textMuted }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Text>
      </div>

      {/* ── Filters bar ── */}
      <div
        className="browse-filters"
        style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={10} lg={8}>
            <Input
              placeholder="Search movies, genres..."
              prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={16} md={10} lg={12}>
            <Select
              value={selectedGenre}
              onChange={handleGenreChange}
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

      {/* ── Genre quick-filter pills ── */}
      <Space size={8} className="browse-genre-pills">
        {GENRES.map((g) => (
          <button
            key={g.value}
            className="browse-genre-pill"
            onClick={() => handleGenreChange(g.value)}
            style={{
              border: `1px solid ${selectedGenre === g.value ? '#e50914' : colors.border}`,
              background: selectedGenre === g.value ? '#e50914' : 'transparent',
              color: selectedGenre === g.value ? '#fff' : colors.textMuted,
              fontWeight: selectedGenre === g.value ? 600 : 400,
            }}
          >
            {g.label}
          </button>
        ))}
      </Space>

      {/* ── Pagination (top) ── */}
      <div className="browse-pagination">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={totalMovies}
          onChange={(p, ps) => { setPage(p); if (ps !== pageSize) { setPageSize(ps); setPage(1); } }}
          onShowSizeChange={(_, ps) => { setPageSize(ps); setPage(1); }}
          showSizeChanger
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showTotal={(total, range) => (
            <Text style={{ color: colors.textMuted }}>
              {range[0]}–{range[1]} of{' '}
              <Text strong style={{ color: colors.textPrimary }}>{total}</Text> movies
              {searchQuery && (
                <> for "<Text style={{ color: '#e50914' }}>{searchQuery}</Text>"</>
              )}
            </Text>
          )}
          disabled={totalMovies === 0}
        />
      </div>

      {/* ── Grid / List ── */}
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
          {pagedMovies.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <MovieCard movie={movie} onPlay={onPlay} onDetail={onDetail} />
            </Col>
          ))}
        </Row>
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {pagedMovies.map((movie) => (
            <div
              key={movie.id}
              className="browse-list-row"
              style={{
                background: colors.bgCard,
                border: `1px solid ${colors.border}`,
              }}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="browse-list-row__thumb"
              />
              <div className="browse-list-row__body">
                <Row justify="space-between" align="top">
                  <Col flex="auto">
                    <Text strong className="browse-list-row__title">
                      {movie.title}
                    </Text>
                    <Space size={6} className="browse-list-row__meta" wrap>
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
                      className="browse-list-row__desc"
                      style={{ color: colors.textMuted }}
                    >
                      {movie.description}
                    </Text>
                  </Col>
                  <Col className="browse-list-row__actions">
                    <Space direction="vertical" size={6} align="end">
                      <Text className="browse-list-row__rating">★ {movie.rating}</Text>
                      <Space size={6}>
                        <button
                          className="browse-list-btn-play"
                          onClick={() => onPlay(movie)}
                        >
                          Play
                        </button>
                        <button
                          className="browse-list-btn-info"
                          onClick={() => onDetail(movie)}
                          style={{
                            border: `1px solid ${colors.border}`,
                            color: colors.textMuted,
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

      {/* ── Pagination (bottom) ── */}
      {totalMovies > 0 && (
        <div className="browse-pagination" style={{ marginTop: 32 }}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalMovies}
            onChange={(p, ps) => { setPage(p); if (ps !== pageSize) { setPageSize(ps); setPage(1); } }}
            onShowSizeChange={(_, ps) => { setPageSize(ps); setPage(1); }}
            showSizeChanger
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          />
        </div>
      )}
    </div>
  );
}
