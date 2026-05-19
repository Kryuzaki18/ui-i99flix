import { useRef, useEffect } from 'react';
import {
  Typography, Row, Col, Input, Select, Space, Empty,
  Segmented, Pagination, Skeleton, Button, Tabs, Tag,
} from 'antd';
import {
  SearchOutlined, AppstoreOutlined, BarsOutlined,
  CalendarOutlined, VideoCameraOutlined, PlaySquareOutlined,
} from '@ant-design/icons';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import { useBrowseStore }  from '../../store/browseStore';
import { usePlayerStore }  from '../../store/playerStore';
import { useBrowseQuery }  from '../../api/useBrowseQuery';
import { GENRES, TV_GENRES, GENRE_COLORS, YEAR_RANGES, PAGE_SIZE_OPTIONS } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import type { MediaType } from '../../store/browseStore';
import type { Movie } from '../../models/movie';
import './Browse.css';

const { Title, Text } = Typography;

// TMDB returns 20 results per page — pageSize selector controls display only
const TMDB_PAGE_SIZE = 20;

// ── List row item ─────────────────────────────────────────────────────────────

interface ListRowProps {
  movie:    Movie;
  onPlay:   (m: Movie) => void;
  onDetail: (m: Movie) => void;
}

function BrowseListRow({ movie, onPlay, onDetail }: ListRowProps) {
  const { colors } = useTheme();
  return (
    <div
      className="browse-list-row"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <img src={movie.thumbnail} alt={movie.title} className="browse-list-row__thumb" />
      <div className="browse-list-row__body">
        <Row justify="space-between" align="top" wrap={false}>
          <Col flex="auto" style={{ minWidth: 0, paddingRight: 16 }}>
            <Text strong className="browse-list-row__title">{movie.title}</Text>
            <Space size={8} className="browse-list-row__meta" wrap>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{movie.year}</Text>
              {movie.duration && movie.duration !== 'N/A' && (
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{movie.duration}</Text>
              )}
              {movie.genre.slice(0, 3).map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] ?? 'default'} style={{ margin: 0, fontSize: 11 }}>
                  {g}
                </Tag>
              ))}
            </Space>
            <Text className="browse-list-row__desc" style={{ color: colors.textMuted }}>
              {movie.description}
            </Text>
          </Col>
          <Col className="browse-list-row__actions">
            <Space direction="vertical" size={6} align="end">
              <Text className="browse-list-row__rating">★ {movie.rating}</Text>
              <Space size={6}>
                <Button size="small" type="primary" onClick={() => onPlay(movie)}>Play</Button>
                <Button size="small" onClick={() => onDetail(movie)}>Info</Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}

// ── Main Browse component ─────────────────────────────────────────────────────

export default function Browse() {
  const { colors } = useTheme();

  const {
    mediaType,     setMediaType,
    selectedGenre, setGenre,
    selectedYear,  setYear,
    searchQuery,   setSearch,
    page,          setPage,
    pageSize,      setPageSize,
    layout,        setLayout,
  } = useBrowseStore();

  const { playMovie, openDetail } = usePlayerStore();

  const result     = useBrowseQuery();
  const items      = result.data?.movies     ?? [];
  const total      = result.data?.total      ?? 0;
  const totalPages = result.data?.totalPages ?? 1;
  const isLoading  = result.isLoading;
  const isFetching = result.isFetching;

  // Genre list depends on active tab
  const genres = mediaType === 'movie' ? GENRES : TV_GENRES;

  // ── Sticky pagination sentinel ────────────────────────────────────────────
  const sentinelRef   = useRef<HTMLDivElement>(null);
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

  const displayItems  = pageSize < TMDB_PAGE_SIZE ? items.slice(0, pageSize) : items;
  const cappedTotal   = Math.min(total, totalPages * TMDB_PAGE_SIZE);
  const skeletonCols  = Array.from({ length: Math.min(pageSize, 8) });
  const isMovie       = mediaType === 'movie';

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    if (ps !== pageSize) setPageSize(ps);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (key: string) => {
    setMediaType(key as MediaType);
  };

  // ── Shared filter bar (used by both tabs) ─────────────────────────────────
  const filterBar = (
    <div
      className="browse-filters"
      style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={24} md={10} lg={8}>
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
        <Col xs={24} sm={12} md={5} lg={5}>
          <Select
            value={selectedYear}
            onChange={(v) => { setYear(v); setPage(1); }}
            style={{ width: '100%' }}
            placeholder={isMovie ? 'Release year' : 'Air year'}
            suffixIcon={<CalendarOutlined style={{ color: colors.textMuted }} />}
            options={YEAR_RANGES.map((r) => ({ label: r.label, value: r.value }))}
          />
        </Col>
        <Col xs={24} sm={24} md={2} lg={4} className="browse-filters__layout-col">
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

  // ── Genre quick-filter pills ──────────────────────────────────────────────
  const genrePills = (
    <Space size={8} className="browse-genre-pills">
      {genres.map((g) => (
        <button
          key={g.value}
          className="browse-genre-pill"
          onClick={() => { setGenre(g.value); setPage(1); }}
          style={{
            border:     `1px solid ${selectedGenre === g.value ? '#e50914' : colors.border}`,
            background: selectedGenre === g.value ? '#e50914' : 'transparent',
            color:      selectedGenre === g.value ? '#fff' : colors.textMuted,
            fontWeight: selectedGenre === g.value ? 600 : 400,
          }}
        >
          {g.label}
        </button>
      ))}
    </Space>
  );

  // ── Results grid / list ───────────────────────────────────────────────────
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
        <BrowseListRow key={item.id} movie={item} onPlay={playMovie} onDetail={openDetail} />
      ))}
    </Space>
  );

  // ── Shared pagination ─────────────────────────────────────────────────────
  const pagination = (
    <>
      <div ref={sentinelRef} style={{ height: 1, marginBottom: -1 }} />
      <div ref={paginationRef} className="browse-pagination">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={cappedTotal}
          onChange={handlePageChange}
          onShowSizeChange={(_, ps) => { setPageSize(ps); setPage(1); }}
          showSizeChanger
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showTotal={(t, range) => (
            <Text style={{ color: colors.textMuted }}>
              {range[0]}–{range[1]} of{' '}
              <Text strong style={{ color: colors.textPrimary }}>{t.toLocaleString()}</Text>
              {' '}{isMovie ? 'movies' : 'series'}
              {searchQuery && (
                <> for "<Text style={{ color: '#e50914' }}>{searchQuery}</Text>"</>
              )}
            </Text>
          )}
          disabled={total === 0 || isFetching}
        />
      </div>
    </>
  );

  return (
    <div>
      <div className="browse-header">
        <Title level={2} style={{ marginBottom: 4 }}>Browse</Title>
        <Text style={{ color: colors.textMuted }}>
          Discover movies and TV series from TMDB — search, filter by genre or year.
        </Text>
      </div>

      <Tabs
        activeKey={mediaType}
        onChange={handleTabChange}
        className="browse-tabs"
        items={[
          {
            key:   'movie',
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
            key:   'tv',
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
