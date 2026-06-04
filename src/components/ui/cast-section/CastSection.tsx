import { Avatar, Skeleton, Tooltip, Typography, Flex } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTmdbMovieCreditsQuery, useTmdbTvCreditsQuery } from "../../../api/useTmdbQuery";
import { useTheme } from "../../../context/ThemeContext";
import "./CastSection.css";

const { Text } = Typography;

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
const MAX_CAST = 20;

interface CastSectionProps {
  tmdbId: number | null | undefined;
  mediaType: "movie" | "tv" | undefined;
  label?: string;
  labelColor?: string;
  nameColor?: string;
  charColor?: string;
}

export default function CastSection({ tmdbId, mediaType, label = "Cast", labelColor, nameColor, charColor }: CastSectionProps) {
  const { colors } = useTheme();
  const isTV = mediaType === "tv";

  const movieCredits = useTmdbMovieCreditsQuery(!isTV && tmdbId ? tmdbId : null);
  const tvCredits = useTmdbTvCreditsQuery(isTV && tmdbId ? tmdbId : null);

  const credits = isTV ? tvCredits : movieCredits;
  const cast = (credits.data?.cast ?? []).slice(0, MAX_CAST);

  if (!tmdbId) return null;

  return (
    <Flex vertical gap={4} className="cast-section">
      <Text
        strong
        className="cast-section__label"
        style={{ color: labelColor ?? colors.textMuted }}
      >
        {label}
      </Text>

      {credits.isLoading ? (
        <Flex gap={12} wrap="nowrap" className="cast-section__row">
          {Array.from({ length: 6 }).map((_, i) => (
            <Flex key={i} vertical align="center" gap={4} flex="0 0 72px" className="cast-section__card">
              <Skeleton.Avatar active size={64} shape="circle" />
              <Skeleton
                active
                title={{ width: 56 }}
                paragraph={false}
                style={{ marginTop: 6 }}
              />
            </Flex>
          ))}
        </Flex>
      ) : cast.length > 0 ? (
        <Flex gap={12} wrap="nowrap" className="cast-section__row">
          {cast.map((member) => (
            <Tooltip
              key={member.id}
              title={member.character ? `as ${member.character}` : undefined}
              placement="top"
              getPopupContainer={(trigger) => trigger.parentElement ?? document.body}
            >
              <Flex vertical align="center" gap={4} flex="0 0 72px" className="cast-section__card">
                <Avatar
                  size={64}
                  src={
                    member.profile_path
                      ? `${TMDB_IMAGE_BASE}${member.profile_path}`
                      : undefined
                  }
                  icon={!member.profile_path ? <UserOutlined /> : undefined}
                  style={{ flexShrink: 0, background: colors.skeletonBg }}
                />
                <Text
                  className="cast-section__name"
                  style={{ color: nameColor ?? colors.textSecondary }}
                  ellipsis

                >
                  {member.name}
                </Text>
                {member.character && (
                  <Text
                    className="cast-section__character"
                    style={{ color: charColor ?? colors.textMuted }}
                    ellipsis
                  >
                    {member.character}
                  </Text>
                )}
              </Flex>
            </Tooltip>
          ))}
        </Flex>
      ) : (
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>
          No cast information available.
        </Text>
      )}
    </Flex>
  );
}
