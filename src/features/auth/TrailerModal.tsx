import { Flex, Modal, Spin, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";
import { useShowcaseTrailerQuery } from "../../api/tmdb/useTmdbQuery";
import type { Movie } from "../../models/movieModel";
import type { TmdbVideo } from "../../models/tmdbModel";

const { Text } = Typography;

function pickTrailerKey(results: TmdbVideo[]): string | null {
  return (
    results.find((v) => v.site === "YouTube" && v.type === "Trailer")?.key ??
    results.find((v) => v.site === "YouTube" && v.type === "Teaser")?.key ??
    results.find((v) => v.site === "YouTube")?.key ??
    null
  );
}

interface TrailerModalProps {
  open: boolean;
  movie: Movie | null;
  onClose: () => void;
}

export default function TrailerModal({ open, movie, onClose }: TrailerModalProps) {
  const { colors } = useTheme();
  const { data, isLoading } = useShowcaseTrailerQuery(open && movie ? Number(movie.id) : null);

  const trailerKey = data ? pickTrailerKey(data.results) : null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="80vw"
      style={{ maxHeight: "80vh", padding: 0 }}
      styles={{
        body: { backgroundColor: "#000", padding: 0, overflow: "hidden" },
        mask: { backdropFilter: "blur(1px)", backgroundColor: "rgba(0,0,0,0.85)" },
        container: { padding: 0, overflow: "hidden" },
      }}
      closeIcon={
        <Flex
          component="span"
          align="center"
          justify="center"
          style={{ backgroundColor: colors.accent, color: colors.playerText }}
          className="player__close-icon"
        >
          <CloseOutlined />
        </Flex>
      }
      destroyOnHidden
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "min(56.25%, calc(90vh - 60px))",
          backgroundColor: "#000",
        }}
      >
        {isLoading ? (
          <Flex align="center" justify="center" style={{ position: "absolute", inset: 0 }}>
            <Spin size="large" />
          </Flex>
        ) : trailerKey ? (
          <iframe
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
            }}
            src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&controls=1&cc_load_policy=1&iv_load_policy=3&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={movie?.title ?? "Trailer"}
          />
        ) : (
          <Flex align="center" justify="center" style={{ position: "absolute", inset: 0 }}>
            <Text style={{ color: "#888" }}>No trailer available for this title.</Text>
          </Flex>
        )}
      </div>
    </Modal>
  );
}
