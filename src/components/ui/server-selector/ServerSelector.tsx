import { Button, Flex } from 'antd';
import { EMBED_SERVERS } from '../../../api/environments';

interface ServerSelectorProps {
  activeServer:   number;
  onServerChange: (server: number) => void;
}

export default function ServerSelector({ activeServer, onServerChange }: ServerSelectorProps) {
  return (
    <Flex gap="small" align="center" wrap="wrap">
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
  );
}
