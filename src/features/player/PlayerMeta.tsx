import { Typography, Space, Tag, Flex } from "antd";
import CastSection from "../../components/ui/cast-section/CastSection";
import ExpandableText from "../../components/ui/expandable-text/ExpandableText";
import { useTheme } from "../../context/ThemeContext";
import type { Movie } from "../../models/movieModel";

const { Title, Text } = Typography;

interface PlayerMetaProps {
  movie:          Movie;
  studio:         string | null;
  country:        string | null;
  language:       string | null;
  resolvedGenres: { key: string; label: string; color?: string }[];
  safeId:         number | null;
}

export default function PlayerMeta({
  movie,
  studio,
  country,
  language,
  resolvedGenres,
  safeId,
}: PlayerMetaProps) {
  const { colors } = useTheme();

  return (
    <div
      className="player-page__info"
      style={{ background: colors.bgBase, borderTop: `1px solid ${colors.border}`, flex: 1 }}
    >
      <div className="player-page__info-inner">
        <div className="player-page__info-main">
          <Title level={4} style={{ margin: "0 0 8px", color: colors.textPrimary }}>
            {movie.title}
          </Title>

          <Flex wrap="wrap" gap="16px 24px" className="player-page__info-meta">
            <Flex vertical gap={2} className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>Year</Text>
              <Text strong style={{ color: colors.textPrimary }}>{movie.year}</Text>
            </Flex>
            {movie.duration && movie.duration !== "N/A" && (
              <Flex vertical gap={2} className="player-page__meta-item">
                <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>Duration</Text>
                <Text strong style={{ color: colors.textPrimary }}>{movie.duration}</Text>
              </Flex>
            )}
            <Flex vertical gap={2} className="player-page__meta-item">
              <Text className="player-page__meta-label" style={{ color: colors.textMuted }}>Rating</Text>
              <Text strong style={{ color: colors.starRating }}>★ {movie.rating}</Text>
            </Flex>
          </Flex>

          <Space size={8} wrap style={{ marginBottom: 12 }}>
            {resolvedGenres.map((rg) => (
              <Tag key={rg.key} color={rg.color || "default"}>{rg.label}</Tag>
            ))}
            {movie.newRelease && <Tag color="gold">New Release</Tag>}
            {movie.trending  && <Tag color="red">Trending</Tag>}
          </Space>

          {(studio || country || language) && (
            <Flex vertical gap={6} className="player-page__production">
              {studio && (
                <Flex align="baseline" gap={8}>
                  <Text className="player-page__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Studio</Text>
                  <Text className="player-page__production-value" style={{ color: colors.textSecondary }}>{studio}</Text>
                </Flex>
              )}
              {country && (
                <Flex align="baseline" gap={8}>
                  <Text className="player-page__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Country</Text>
                  <Text className="player-page__production-value" style={{ color: colors.textSecondary }}>{country}</Text>
                </Flex>
              )}
              {language && (
                <Flex align="baseline" gap={8}>
                  <Text className="player-page__production-label" style={{ color: colors.textMuted, flexShrink: 0 }}>Language</Text>
                  <Text className="player-page__production-value" style={{ color: colors.textSecondary }}>{language}</Text>
                </Flex>
              )}
            </Flex>
          )}

          <ExpandableText
            text={movie.description || "No synopsis available."}
            collapsedLines={3}
            color={colors.textSecondary}
            lineHeight={1.7}
          />

          {safeId && (
            <div style={{ marginTop: 24 }}>
              <CastSection tmdbId={safeId} mediaType={movie.mediaType} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
