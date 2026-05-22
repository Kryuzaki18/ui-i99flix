import { useRef, useEffect } from 'react';
import {
  Typography, Row, Col, Input, Select, Space, Empty,
  Segmented, Pagination, Skeleton, Tabs,
} from 'antd';
import {
  SearchOutlined, AppstoreOutlined, BarsOutlined,
  CalendarOutlined, VideoCameraOutlined, PlaySquareOutlined,
} from '@ant-design/icons';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import MovieListRow from '../../components/ui/movie-list-row/MovieListRow';
import { useBrowseStore } from '../../store/browseStore';
import { usePlayerStore } from '../../store/playerStore';
import { useBrowseQuery } from '../../api/useBrowseQuery';
import { GENRES, TV_GENRES, YEAR_RANGES, PAGE_SIZE_OPTIONS } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import type { MediaType } from '../../store/browseStore';
import './Browse.css';

const { Title, Text } = Typography;

// TMDB returns 20 results per page — pageSize selector controls display only
const TMDB_PAGE_SIZE = 20;

// ── Main Browse component ─────────────────────────────────────────────────────

export default function Browse() {
  const { colors } = useTheme();

  const {
    mediaType, setMediaType,
    selectedGenre, setGenre,
    selectedYear, setYear,
    searchQuery, setSearch,
    page, setPage,
    pageSize, setPageSize,
    layout, setLayout,
  } = useBrowseStore();

  const { playMovie, openDetail } = usePlayerStore();

  const result = useBrowseQuery();
  const items = result.data?.movies ?? [];
  const total = result.data?.total ?? 0;
  const totalPages = result.data?.totalPages ?? 1;
  const isLoading = result.isLoading;
  const isFetching = result.isFetching;

  // Genre list depends on active tab
  const genres = mediaType === 'movie' ? GENRES : TV_GENRES;

  // ── Sticky pagination sentinel ────────────────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        paginationRef.current?.classList.toggle('is-stuck', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-65px 0px 0px 0px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const displayItems = pageSize < TMDB_PAGE_SIZE ? items.slice(0, pageSize) : items;
  const cappedTotal = Math.min(total, totalPages * TMDB_PAGE_SIZE);
  const skeletonCols = Array.from({ length: Math.min(pageSize, 8) });
  const isMovie = mediaType === 'movie';

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    if (ps !== pageSize) setPageSize(ps);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (key: string) => {
    setMediaType(key as MediaType);
  };

  const filterBar = (
    <div
      className="browse-filters"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8} lg={8}>
          <Input
            placeholder={isMovie ? 'Search movies…' : 'Search TV series…'}
            prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
            value={searchQuery}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            allowClear
            style={{ borderRadius: 8 }}
          />
        </Col>
        <Col xs={24} sm={12} md={7} lg={7}>
          <Select
            value={selectedGenre}
            onChange={(v) => { setGenre(v); setPage(1); }}
            style={{ width: '100%' }}
            options={genres}
            placeholder="Select genre"
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Select
            value={selectedYear}
            onChange={(v) => { setYear(v); setPage(1); }}
            style={{ width: '100%' }}
            placeholder={isMovie ? 'Release year' : 'Air year'}
            suffixIcon={<CalendarOutlined style={{ color: colors.textMuted }} />}
            options={YEAR_RANGES.map((r) => ({ label: r.label, value: r.value }))}
          />
        </Col>
        <Col xs={24} sm={12} md={3} lg={4} className="browse-filters__layout-col">
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
  );

  const genrePills = (
    <div className="browse-genre-pills">
      {genres.map((g) => (
        <button
          key={g.value}
          className="browse-genre-pill"
          onClick={() => { setGenre(g.value); setPage(1); }}
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
    </div>
  );

  const resultContent = isLoading ? (
    <Row gutter={[16, 20]}>
      {skeletonCols.map((_, i) => (
        <Col key={i} xs={24} sm={12} md={8} lg={6}>
          <Skeleton.Image active style={{ width: '100%', height: 180 }} />
          <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 8 }} />
        </Col>
      ))}
    </Row>
  ) : items.length === 0 ? (
    <Empty
      description={
        <Text style={{ color: colors.textMuted }}>
          No {isMovie ? 'movies' : 'TV series'} found. Try a different search or filter.
        </Text>
      }
      style={{ padding: '60px 0' }}
    />
  ) : layout === 'grid' ? (
    <Row gutter={[16, 20]}>
      {displayItems.map((item) => (
        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
          <MovieCard movie={item} onPlay={playMovie} onDetail={openDetail} />
        </Col>
      ))}
    </Row>
  ) : (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      {displayItems.map((item) => (
        <MovieListRow key={item.id} movie={item} onPlay={playMovie} onDetail={openDetail} />
      ))}
    </Space>
  );

  const pagination = (
    <>
      <div ref={sentinelRef} style={{ height: 1, marginBottom: -1 }} />
      <div ref={paginationRef} className="browse-pagination">
        {cappedTotal > 0 && (
          <Text className="browse-pagination__total" style={{ color: colors.textMuted }}>
            {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, cappedTotal)} of{' '}
            <Text strong style={{ color: colors.textPrimary }}>{cappedTotal.toLocaleString()}</Text>
            {' '}{isMovie ? 'movies' : 'series'}
            {searchQuery && (
              <> for "<Text style={{ color: '#e50914' }}>{searchQuery}</Text>"</>
            )}
          </Text>
        )}
        <Pagination
          current={page}
          pageSize={pageSize}
          total={cappedTotal}
          onChange={handlePageChange}
          onShowSizeChange={(_, ps) => { setPageSize(ps); setPage(1); }}
          showSizeChanger
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          disabled={total === 0 || isFetching}
          responsive
        />
      </div>
    </>
  );

  return (
    <div>
      <div className="browse-header">
        <Title level={2} style={{ marginBottom: 4 }}>Browse</Title>
        <Text style={{ color: colors.textMuted }}>
          Discover movies and TV series — search, filter by genre or year.
        </Text>
      </div>

      <Tabs
        activeKey={mediaType}
        onChange={handleTabChange}
        className="browse-tabs"
        items={[
          {
            key: 'movie',
            label: (
              <Space size={6}>
                <VideoCameraOutlined />
                Movies
              </Space>
            ),
            children: (
              <>
                {filterBar}
                {genrePills}
                {pagination}
                {resultContent}
              </>
            ),
          },
          {
            key: 'tv',
            label: (
              <Space size={6}>
                <PlaySquareOutlined />
                TV Series
              </Space>
            ),
            children: (
              <>
                {filterBar}
                {genrePills}
                {pagination}
                {resultContent}
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
