import { Button, Flex } from "antd";
import { EMBED_SERVERS } from "../../../api/environments";

interface ServerSelectorProps {
  activeServer: number;
  onServerChange: (server: number) => void;
}

export default function ServerSelector({
  activeServer,
  onServerChange,
}: ServerSelectorProps) {
  return (
    <div
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        WebkitOverflowScrolling:
          "touch" as React.CSSProperties["WebkitOverflowScrolling"],
      }}
    >
      <Flex
        gap={6}
        style={{
          flexWrap: "nowrap",
          width: "max-content",
          paddingBottom: "0.3rem",
        }}
      >
        {EMBED_SERVERS.map((server, i) => (
          <Button
            key={server.label}
            size="small"
            type={activeServer === i ? "primary" : "default"}
            onClick={() => onServerChange(i)}
          >
            Server {i + 1}
          </Button>
        ))}
      </Flex>
    </div>
  );
}
