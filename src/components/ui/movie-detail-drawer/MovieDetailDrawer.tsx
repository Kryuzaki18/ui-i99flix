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
  Avatar,
  Tooltip,
} from "antd";
import {
  PlayCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";

import type { Movie } from "../../../models/movie";
import { useTheme } from "../../../context/ThemeContext";
import { GENRE_COLORS } from "../../../constants/genres";
import { useTmdbMovieCreditsQuery, useTmdbTvCreditsQuery } from "../../../api/useTmdbQuery";
import "./MovieDetailDrawer.css";

const { Title, Paragraph, Text } = Typography;

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
const MAX_CAST        = 10;

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

  const backdropSrc = movie?.backdrop || movie?.thumbnail || "";

  // Only fetch credits for numeric TMDB ids
  const tmdbId = typeof movie?.id === "number" ? movie.id : null;
  const isTV   = movie?.mediaType === "tv";

  const movieCredits = useTmdbMovieCreditsQuery(!isTV ? tmdbId : null);
  const tvCredits    = useTmdbTvCreditsQuery(isTV ? tmdbId : null);

  const credits      = isTV ? tvCredits : movieCredits;
  const cast         = (credits.data?.cast ?? []).slice(0, MAX_CAST);

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
            <div
              className="detail-drawer__rating-badge"
              aria-label={`Rating: ${movie.rating} out of 10`}
            >
              <StarFilled
                style={{ color: "#fadb14", fontSize: 18 }}
                aria-hidden="true"
              />
              <Text className="detail-drawer__rating-value">
                {movie.rating}
              </Text>
              <Text style={{ color: isDark ? "#aaa" : "#666", fontSize: 14 }}>
                /10
              </Text>
            </div>
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
              {movie.genre.map((g) => (
                <Tag key={g} color={GENRE_COLORS[g] ?? "default"}>
                  {g}
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
            <Paragraph
              className="detail-drawer__synopsis-text"
              style={{ color: colors.textSecondary }}
            >
              {movie.description || "No synopsis available."}
            </Paragraph>

            <Divider />

            {/* ── Cast ──────────────────────────────────────────────── */}
            {tmdbId && (
              <>
                <Text
                  strong
                  className="detail-drawer__synopsis-label"
                  style={{ color: colors.textMuted }}
                >
                  Cast
                </Text>

                {credits.isLoading ? (
                  <div className="detail-drawer__cast-row">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="detail-drawer__cast-card">
                        <Skeleton.Avatar active size={64} shape="circle" />
                        <Skeleton active title={{ width: 56 }} paragraph={false} style={{ marginTop: 6 }} />
                      </div>
                    ))}
                  </div>
                ) : cast.length > 0 ? (
                  <div className="detail-drawer__cast-row">
                    {cast.map((member) => (
                      <Tooltip
                        key={member.id}
                        title={member.character ? `as ${member.character}` : undefined}
                        placement="top"
                      >
                        <div className="detail-drawer__cast-card">
                          <Avatar
                            size={64}
                            src={member.profile_path ? `${TMDB_IMAGE_BASE}${member.profile_path}` : undefined}
                            icon={!member.profile_path ? <UserOutlined /> : undefined}
                            style={{ flexShrink: 0, background: colors.skeletonBg }}
                          />
                          <Text
                            className="detail-drawer__cast-name"
                            style={{ color: colors.textSecondary }}
                            ellipsis
                          >
                            {member.name}
                          </Text>
                          {member.character && (
                            <Text
                              className="detail-drawer__cast-character"
                              style={{ color: colors.textMuted }}
                              ellipsis
                            >
                              {member.character}
                            </Text>
                          )}
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                ) : (
                  <Text style={{ color: colors.textMuted, fontSize: 13 }}>
                    No cast information available.
                  </Text>
                )}

                <Divider />
              </>
            )}

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
          </>
        )}
      </div>
    </Drawer>
  );
}

export default memo(MovieDetailDrawerInner);
