import { useState, useEffect, memo } from "react";
import {
  Drawer,
  Button,
  Tag,
  Rate,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Skeleton,
  Tooltip,
  Flex,
  Collapse,
} from "antd";
import {
  PlayCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";

import type { Movie } from "../../../models/movieModel";
import { useTheme } from "../../../context/ThemeContext";
import useResolvedGenres from '../../../hooks/useResolvedGenres';
import CastSection from "../cast-section/CastSection";
import ExpandableText from "../expandable-text/ExpandableText";
import useWatchlistStatus from '../../../hooks/useWatchlistStatus';
import { useTmdbMovieDetailQuery, useTmdbTvDetailQuery } from '../../../api/useTmdbQuery';
import "./MovieDetailDrawer.css";

const { Title, Text } = Typography;

interface MovieDetailDrawerProps {
  movie: Movie | null;
  open: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

function MovieDetailDrawerInner({
  movie,
  open,
  onClose,
  onPlay,
}: MovieDetailDrawerProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { colors, isDark } = useTheme();

  const resolvedGenres = useResolvedGenres(movie?.genre);

  const { inWatchlist, isPending, toggle: toggleWatchlist } = useWatchlistStatus(movie);

  const backdropSrc = movie?.backdrop || movie?.thumbnail || "";

  const rawId = movie?.id;
  const tmdbId = rawId != null && !isNaN(Number(rawId)) ? Number(rawId) : null;
  const isTV = movie?.mediaType === "tv";

  const { data: movieDetail } = useTmdbMovieDetailQuery(!isTV ? tmdbId : null);
  const { data: tvDetail }    = useTmdbTvDetailQuery(isTV ? tmdbId : null);

  const detail = isTV ? tvDetail : movieDetail;
  const studio    = detail?.production_companies?.[0]?.name ?? null;
  const country   = isTV
    ? (tvDetail?.production_countries?.[0]?.name ?? tvDetail?.origin_country?.[0] ?? null)
    : (movieDetail?.production_countries?.[0]?.name ?? null);
  const language  = detail?.spoken_languages?.[0]?.name ?? null;

  useEffect(() => {
    if (!open || !movie) return;

    setImgLoaded(false);

    if (!backdropSrc) {
      setImgLoaded(true);
      return;
    }

    const img = new Image();
    img.onload = () => setImgLoaded(true);
    img.onerror = () => setImgLoaded(true);
    img.src = backdropSrc;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [open, movie?.id, backdropSrc]);

  if (!movie) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      styles={{
        body: { background: colors.bgBase, padding: 0 },
        header: { textAlign: "center", fontWeight: "bold" },
        mask: { backdropFilter: "blur(4px)" },
      }}
      title={
        <Text strong style={{ fontSize: 16 }}>
          Movie Details
        </Text>
      }
    >
      <div
        className="detail-drawer__backdrop-wrap"
        style={{ background: colors.skeletonBg }}
      >
        {!imgLoaded && (
          <Skeleton.Image active className="detail-drawer__skeleton-img" />
        )}

        {backdropSrc && (
          <img
            src={backdropSrc}
            alt={`${movie.title} backdrop`}
            className="detail-drawer__backdrop-img"
            style={{ display: imgLoaded ? "block" : "none" }}
          />
        )}

        {imgLoaded && (
          <>
            <div
              className="detail-drawer__backdrop-gradient"
              style={{
                background: `linear-gradient(to top, ${colors.bgBase} 0%, transparent 60%)`,
              }}
              aria-hidden="true"
            />
            <Flex
              align="center"
              gap={8}
              className="detail-drawer__rating-badge"
              aria-label={`Rating: ${movie.rating} out of 10`}
            >
              <StarFilled
                style={{ color: colors.starRating, fontSize: 18 }}
                aria-hidden="true"
              />
              <Text className="detail-drawer__rating-value">
                {movie.rating}
              </Text>
              <Text style={{ color: isDark ? "#aaa" : "#666", fontSize: 14 }}>
                /10
              </Text>
            </Flex>
          </>
        )}
      </div>

      <div className="detail-drawer__body">
        {!imgLoaded ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <>
            <Title level={3} className="detail-drawer__title">
              {movie.title}
            </Title>

            <Space size={8} wrap className="detail-drawer__tags">
              {resolvedGenres.map((rg) => (
                <Tag key={rg.key} color={rg.color ?? "default"}>
                  {rg.label}
                </Tag>
              ))}
              {movie.newRelease && <Tag color="gold">New Release</Tag>}
              {movie.trending && <Tag color="red">Trending</Tag>}
            </Space>

            <Row gutter={24} className="detail-drawer__meta-row">
              <Col span={12}>
                <Space>
                  <CalendarOutlined
                    style={{ color: colors.textMuted }}
                    aria-hidden="true"
                  />
                  <Text style={{ color: colors.textSecondary }}>
                    {movie.year}
                  </Text>
                </Space>
              </Col>
              {movie.duration && movie.duration !== 'N/A' && (
                <Col span={12}>
                  <Space>
                    <ClockCircleOutlined
                      style={{ color: colors.textMuted }}
                      aria-hidden="true"
                    />
                    <Text style={{ color: colors.textSecondary }}>
                      {movie.duration}
                    </Text>
                  </Space>
                </Col>
              )}
            </Row>

            {(studio || country || language) && (
              <Flex vertical gap={6} className="detail-drawer__production">
                {studio && (
                  <Flex align="baseline" gap={8}>
                    <Text className="detail-drawer__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Studio</Text>
                    <Text className="detail-drawer__production-value" style={{ color: colors.textSecondary }}>{studio}</Text>
                  </Flex>
                )}
                {country && (
                  <Flex align="baseline" gap={8}>
                    <Text className="detail-drawer__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Country</Text>
                    <Text className="detail-drawer__production-value" style={{ color: colors.textSecondary }}>{country}</Text>
                  </Flex>
                )}
                {language && (
                  <Flex align="baseline" gap={8}>
                    <Text className="detail-drawer__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Language</Text>
                    <Text className="detail-drawer__production-value" style={{ color: colors.textSecondary }}>{language}</Text>
                  </Flex>
                )}
              </Flex>
            )}

            <Rate
              disabled
              allowHalf
              value={movie.rating / 2}
              className="detail-drawer__rate"
              aria-label={`${movie.rating / 2} out of 5 stars`}
            />

            <Divider />

            <Text
              strong
              className="detail-drawer__synopsis-label"
              style={{ color: colors.textMuted }}
            >
              Synopsis
            </Text>
            <ExpandableText
              text={movie.description || 'No synopsis available.'}
              collapsedLines={3}
              color={colors.textSecondary}
              lineHeight={1.7}
            />

            <Divider />

            {tmdbId && (
              <>
                <CastSection tmdbId={tmdbId} mediaType={movie.mediaType} />
                <Divider />
              </>
            )}

            {isTV && tvDetail?.seasons && tvDetail.seasons.length > 0 && (
              <>
                <Collapse
                  ghost
                  size="small"
                  items={[{
                    key: 'seasons',
                    label: <Text strong style={{ color: colors.textMuted }}>Seasons ({tvDetail.seasons.length})</Text>,
                    children: (
                      <Flex vertical gap={6}>
                        {tvDetail.seasons.map((s) => (
                          <Flex key={s.id} justify="space-between" align="center">
                            <Text style={{ color: colors.textSecondary }}>{s.name}</Text>
                            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                              {s.episode_count} ep{s.episode_count !== 1 ? 's' : ''}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                    ),
                  }]}
                />
                <Divider />
              </>
            )}

            <Space orientation="vertical" size={10} style={{ width: "100%" }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<PlayCircleOutlined aria-hidden="true" />}
                className="detail-drawer__play-btn"
                aria-label={`Play ${movie.title}`}
                onClick={() => {
                  onPlay(movie);
                  onClose();
                }}
              >
                Play Now
              </Button>

              <Tooltip title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}>
                <Button
                  size="large"
                  block
                  loading={isPending}
                  icon={inWatchlist ? <HeartFilled style={{ color: colors.accent }} aria-hidden="true" /> : <HeartOutlined aria-hidden="true" />}
                  onClick={toggleWatchlist}
                  aria-label={inWatchlist ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
                >
                  {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
              </Tooltip>
            </Space>
          </>
        )}
      </div>
    </Drawer>
  );
}

export default memo(MovieDetailDrawerInner);
