import { Button, Flex } from 'antd';
import { EMBED_SERVERS } from '../../../api/environments';

interface ServerSelectorProps {
  activeServer: number;
  onServerChange: (server: number) => void;
}

export default function ServerSelector({ activeServer, onServerChange }: ServerSelectorProps) {
  return (
    <div
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
      }}
    >
      <Flex gap={6} style={{ flexWrap: 'nowrap', width: 'max-content', paddingBottom: "0.3rem" }}>
        {EMBED_SERVERS.map((server) => (
          <Button
            key={server.id}
            size="small"
            type={activeServer === server.id ? 'primary' : 'default'}
            onClick={() => onServerChange(server.id)}
          >
            Server {server.id}
          </Button>
        ))}
      </Flex>
    </div>
  );
}
