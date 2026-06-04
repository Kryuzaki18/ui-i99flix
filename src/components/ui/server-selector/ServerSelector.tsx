import { Button, Flex } from "antd";
import { EMBED_SERVERS } from "../../../api/environments";
import ScrollableRow from "../scrollable-row/ScrollableRow";

interface ServerSelectorProps {
  activeServer: number;
  onServerChange: (server: number) => void;
}

export default function ServerSelector({
  activeServer,
  onServerChange,
}: ServerSelectorProps) {
  return (
    <ScrollableRow>
      <Flex gap={6} style={{ flexWrap: "nowrap", width: "max-content", padding: "0.3rem 0" }}>
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
    </ScrollableRow>
  );
}
