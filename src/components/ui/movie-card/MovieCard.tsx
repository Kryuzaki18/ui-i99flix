import { useState, memo } from "react";
import {
  Badge,
  Card,
  Tag,
  Rate,
  Typography,
  Space,
  Button,
  Tooltip,
  Skeleton,
  Flex,
} from "antd";
import {
  PlayCircleOutlined,
  InfoCircleOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  PictureOutlined,
} from "@ant-design/icons";

import type { Movie } from "../../../models/movieModel";
import { useTheme } from "../../../context/ThemeContext";
import useResolvedGenres from "../../../hooks/useResolvedGenres";
import useWatchlistStatus from "../../../hooks/useWatchlistStatus";
import useWatchedStatus from "../../../hooks/useWatchedStatus";
import "./MovieCard.css";

const { Text, Paragraph } = Typography;

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onDetail: (movie: Movie) => void;
}

function MovieCardInner({ movie, onPlay, onDetail }: MovieCardProps) {
  const noImage = !movie.thumbnail;
  const [imgLoaded, setImgLoaded] = useState(noImage);
  const [imgError, setImgError] = useState(noImage);
  const { colors, isDark } = useTheme();
  const resolvedGenres = useResolvedGenres(movie.genre);
  const { inWatchlist, isPending, toggle } = useWatchlistStatus(movie);
  const { isWatched, lastSeason, lastEpisode } = useWatchedStatus(movie);

  const watchedLabel =
    movie.mediaType === "tv" && lastSeason && lastEpisode
      ? `S${lastSeason}-${lastEpisode}ep watched`
      : "Watched";

  const coverEl = (
    <div className="movie-card__cover">
      {!imgLoaded && (
        <Skeleton.Image active className="movie-card__skeleton-img" />
      )}

      {imgError ? (
        <div className="movie-card__img-placeholder" aria-hidden="true">
          <PictureOutlined
            style={{ fontSize: 32, color: "rgba(255,255,255,0.2)" }}
          />
        </div>
      ) : (
        <img
          alt={movie.title}
          src={movie.thumbnail}
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            setImgLoaded(true);
            setImgError(true);
          }}
          className="movie-card__img"
          style={{ display: imgLoaded ? "block" : "none" }}
        />
      )}

      {imgLoaded && (
        <Flex
          align="flex-end"
          justify="center"
          gap={8}
          className="movie-card__overlay"
          role="group"
          aria-label={`Actions for ${movie.title}`}
        >
          <Tooltip title="Play">
            <Button
              type="primary"
              shape="circle"
              icon={<PlayCircleOutlined />}
              size="large"
              aria-label={`Play ${movie.title}`}
              onClick={() => onPlay(movie)}
              style={{ background: colors.accent, borderColor: colors.accent }}
            />
          </Tooltip>
          <Tooltip title="More Info">
            <Button
              shape="circle"
              icon={<InfoCircleOutlined />}
              size="large"
              aria-label={`More info about ${movie.title}`}
              onClick={() => onDetail(movie)}
              className="movie-card__overlay-btn-info"
            />
          </Tooltip>
          <Tooltip
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            <Button
              shape="circle"
              icon={
                inWatchlist ? (
                  <HeartFilled style={{ color: colors.accent }} />
                ) : (
                  <HeartOutlined />
                )
              }
              size="large"
              loading={isPending}
              aria-label={
                inWatchlist
                  ? `Remove ${movie.title} from watchlist`
                  : `Add ${movie.title} to watchlist`
              }
              onClick={toggle}
              className="movie-card__overlay-btn-info"
            />
          </Tooltip>
        </Flex>
      )}

      {imgLoaded && (
        <Flex
          align="center"
          gap={4}
          className="movie-card__rating"
          aria-label={`Rating: ${movie.rating} out of 10`}
        >
          <StarFilled
            style={{ color: colors.starRating, fontSize: 12 }}
            aria-hidden="true"
          />
          <Text className="movie-card__rating-value">{movie.rating}</Text>
        </Flex>
      )}
    </div>
  );

  return (
    <Card
      hoverable
      className="movie-card"
      style={{
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
      }}
      styles={{ body: { padding: 0 } }}
      cover={
        isWatched ? (
          <Badge.Ribbon
            text={watchedLabel}
            style={{ fontSize: 11, marginLeft: 4, opacity: 0.8 }}
            color="green"
            placement="start"
          >
            {coverEl}
          </Badge.Ribbon>
        ) : (
          coverEl
        )
      }
    >
      <div className="movie-card__body">
        <Space orientation="vertical" size={6} style={{ width: "100%" }}>
          {!imgLoaded ? (
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: "80%" }} />
          ) : (
            <>
              <Text
                strong
                className="movie-card__title"
                style={{ color: colors.textPrimary }}
              >
                {movie.title}
              </Text>

              <Space size={4} wrap>
                {resolvedGenres.slice(0, 2).map((rg) => (
                  <Tag
                    key={rg.key}
                    color={rg.color || "default"}
                    className="movie-card__tag"
                  >
                    {rg.label}
                  </Tag>
                ))}
                <Text
                  className="movie-card__meta"
                  style={{ color: colors.textMuted }}
                >
                  {movie.year}
                  {movie.duration && movie.duration !== "N/A"
                    ? ` · ${movie.duration}`
                    : ""}
                </Text>
              </Space>

              <Paragraph
                className="movie-card__desc"
                style={{ color: isDark ? "#aaa" : "#555" }}
                ellipsis={{ rows: 2 }}
              >
                {movie.description}
              </Paragraph>

              <Rate
                disabled
                allowHalf
                defaultValue={movie.rating / 2}
                className="movie-card__rate"
                aria-label={`${movie.rating / 2} out of 5 stars`}
              />
            </>
          )}
        </Space>
      </div>
    </Card>
  );
}

export default memo(MovieCardInner);
