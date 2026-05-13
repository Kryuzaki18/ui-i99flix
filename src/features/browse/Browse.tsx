import { useRef, useEffect } from 'react';
import { Typography, Row, Col, Input, Select, Space, Empty, Segmented, Pagination, Skeleton } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined, CalendarOutlined } from '@ant-design/icons';
import MovieCard from '../../components/ui/movie-card/MovieCard';
import { useBrowseStore }  from '../../store/browseStore';
import { usePlayerStore }  from '../../store/playerStore';
import { useBrowseQuery }  from '../../api/useBrowseQuery';
import { GENRES, YEAR_RANGES, PAGE_SIZE_OPTIONS } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import './Browse.css';

const { Title, Text } = Typography;

// TMDB returns 20 results per page — page size selector controls display only
const TMDB_PAGE_SIZE = 20;

export default function Browse() {
  const { colors } = useTheme();

  // ── Store ─────────────────────────────────────────────────────────────────
  const {
    selectedGenre, setGenre,
    selectedYear,  setYear,
    searchQuery,   setSearch,
    page,          setPage,
    pageSize,      setPageSize,
    layout,        setLayout,
  } = useBrowseStore();

  const { playMovie, openDetail } = usePlayerStore();

  // ── Data ──────────────────────────────────────────────────────────────────
  const result = useBrowseQuery();
  const movies     = result.data?.movies     ?? [];
  const total      = result.data?.total      ?? 0;
  const totalPages = result.data?.totalPages ?? 1;
  const isLoading  = result.isLoading;
  const isFetching = result.isFetching;

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

  // ── Pagination ────────────────────────────────────────────────────────────
  // TMDB paginates server-side (20/page). We slice client-side only when
  // pageSize < TMDB_PAGE_SIZE so the size selector still feels responsive.
  const displayMovies = pageSize < TMDB_PAGE_SIZE
    ? movies.slice(0, pageSize)
    : movies;

  // Total for the Ant Design Pagination — cap at TMDB's 500-page limit
  const cappedTotal = Math.min(total, totalPages * TMDB_PAGE_SIZE);

  const handlePageChange = (p: number, ps: number) => {
    setPage(p);
    if (ps !== pageSize) setPageSize(ps);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Skeleton placeholder rows ─────────────────────────────────────────────
  const skeletonCols = Array.from({ length: Math.min(pageSize, 8) });

  return (
    <div>
      {/* ── Header ── */}
      <div className="browse-header">
        <Title level={2}>Browse Movies</Title>
        <Text style={{ color: colors.textMuted }}>
          Discover movies from TMDB — search, filter by genre or year.
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
              placeholder="Search movies..."
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
              options={GENRES}
              placeholder="Select genre"
            />
          </Col>
          <Col xs={24} sm={12} md={5} lg={5}>
            <Select
              value={selectedYear}
              onChange={(v) => { setYear(v); setPage(1); }}
              style={{ width: '100%' }}
              placeholder="Year"
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

      {/* ── Genre quick-filter pills ── */}
      <Space size={8} className="browse-genre-pills">
        {GENRES.map((g) => (
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

      {/* ── Sentinel ── */}
      <div ref={sentinelRef} style={{ height: 1, marginBottom: -1 }} />

      {/* ── Sticky pagination ── */}
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
              <Text strong style={{ color: colors.textPrimary }}>{t.toLocaleString()}</Text> movies
              {searchQuery && (
                <> for "<Text style={{ color: '#e50914' }}>{searchQuery}</Text>"</>
              )}
            </Text>
          )}
          disabled={total === 0 || isFetching}
        />
      </div>

      {/* ── Grid / List ── */}
      {isLoading ? (
        <Row gutter={[16, 20]}>
          {skeletonCols.map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Skeleton.Image active style={{ width: '100%', height: 180 }} />
              <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 8 }} />
            </Col>
          ))}
        </Row>
      ) : movies.length === 0 ? (
        <Empty
          description={
            <Text style={{ color: colors.textMuted }}>
              No movies found. Try a different search or filter.
            </Text>
          }
          style={{ padding: '60px 0' }}
        />
      ) : layout === 'grid' ? (
        <Row gutter={[16, 20]}>
          {displayMovies.map((movie) => (
            <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <MovieCard movie={movie} onPlay={playMovie} onDetail={openDetail} />
            </Col>
          ))}
        </Row>
      ) : (
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {displayMovies.map((movie) => (
            <div
              key={movie.id}
              className="browse-list-row"
              style={{ background: colors.bgCard, border: `1px solid ${colors.border}` }}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="browse-list-row__thumb"
              />
              <div className="browse-list-row__body">
                <Row justify="space-between" align="top">
                  <Col flex="auto">
                    <Text strong className="browse-list-row__title">{movie.title}</Text>
                    <Space size={6} className="browse-list-row__meta" wrap>
                      {movie.genre.map((g) => (
                        <Text key={g} style={{ color: colors.textMuted, fontSize: 12 }}>{g}</Text>
                      ))}
                      <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                        · {movie.year} · {movie.duration}
                      </Text>
                    </Space>
                    <Text className="browse-list-row__desc" style={{ color: colors.textMuted }}>
                      {movie.description}
                    </Text>
                  </Col>
                  <Col className="browse-list-row__actions">
                    <Space direction="vertical" size={6} align="end">
                      <Text className="browse-list-row__rating">★ {movie.rating}</Text>
                      <Space size={6}>
                        <button className="browse-list-btn-play" onClick={() => playMovie(movie)}>
                          Play
                        </button>
                        <button
                          className="browse-list-btn-info"
                          onClick={() => openDetail(movie)}
                          style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}
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
