import { Flex, Modal, Spin, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

const { Text } = Typography;

interface TrailerModalProps {
  open: boolean;
  title: string;
  trailerKey: string | null;
  loading: boolean;
  onClose: () => void;
}

export default function TrailerModal({
  open,
  title,
  trailerKey,
  loading,
  onClose,
}: TrailerModalProps) {
  const { colors } = useTheme();
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width="80vw"
      style={{ maxHeight: "80vh", padding: 0 }}
      styles={{
        body: {
          backgroundColor: "#000",
          padding: 0,
          overflow: "hidden",
        },
        mask: {
          backdropFilter: "blur(1px)",
          backgroundColor: "rgba(0,0,0,0.85)",
        },
        container: {
          padding: 0,
          overflow: "hidden",
        },
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
        {loading ? (
          <Flex
            align="center"
            justify="center"
            style={{ position: "absolute", inset: 0 }}
          >
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
            title={title}
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            style={{ position: "absolute", inset: 0 }}
          >
            <Text style={{ color: "#888" }}>No trailer available for this title.</Text>
          </Flex>
        )}
      </div>
    </Modal>
  );
}
