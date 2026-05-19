import { Avatar, Skeleton, Tooltip, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTmdbMovieCreditsQuery, useTmdbTvCreditsQuery } from "../../../api/useTmdbQuery";
import { useTheme } from "../../../context/ThemeContext";
import "./CastSection.css";

const { Text } = Typography;

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
const MAX_CAST = 20;

interface CastSectionProps {
  tmdbId:    number | null | undefined;
  mediaType: "movie" | "tv" | undefined;
  label?:    string;
}

export default function CastSection({ tmdbId, mediaType, label = "Cast" }: CastSectionProps) {
  const { colors } = useTheme();
  const isTV = mediaType === "tv";

  const movieCredits = useTmdbMovieCreditsQuery(!isTV && tmdbId ? tmdbId : null);
  const tvCredits    = useTmdbTvCreditsQuery(isTV && tmdbId ? tmdbId : null);

  const credits = isTV ? tvCredits : movieCredits;
  const cast    = (credits.data?.cast ?? []).slice(0, MAX_CAST);

  if (!tmdbId) return null;

  return (
    <div className="cast-section">
      <Text
        strong
        className="cast-section__label"
        style={{ color: colors.textMuted }}
      >
        {label}
      </Text>

      {credits.isLoading ? (
        <div className="cast-section__row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="cast-section__card">
              <Skeleton.Avatar active size={64} shape="circle" />
              <Skeleton
                active
                title={{ width: 56 }}
                paragraph={false}
                style={{ marginTop: 6 }}
              />
            </div>
          ))}
        </div>
      ) : cast.length > 0 ? (
        <div className="cast-section__row">
          {cast.map((member) => (
            <Tooltip
              key={member.id}
              title={member.character ? `as ${member.character}` : undefined}
              placement="top"
            >
              <div className="cast-section__card">
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
                  style={{ color: colors.textSecondary }}
                  ellipsis
                >
                  {member.name}
                </Text>
                {member.character && (
                  <Text
                    className="cast-section__character"
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
    </div>
  );
}
