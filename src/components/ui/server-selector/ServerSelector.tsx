import { Button, Flex } from 'antd';

interface ServerSelectorProps {
  activeServer: number;
  onServerChange: (server: number) => void;
}

export default function ServerSelector({ activeServer, onServerChange }: ServerSelectorProps) {
  return (
    <Flex gap="small" align="center">
      <Button
        size="small"
        onClick={() => onServerChange(1)}
        type={activeServer === 1 ? 'primary' : 'default'}
      >
        Server 1
      </Button>
      <Button
        size="small"
        onClick={() => onServerChange(2)}
        type={activeServer === 2 ? 'primary' : 'default'}
      >
        Server 2
      </Button>
      <Button
        size="small"
        onClick={() => onServerChange(3)}
        type={activeServer === 3 ? 'primary' : 'default'}
      >
        Server 3
      </Button>
      <Button
        size="small"
        onClick={() => onServerChange(4)}
        type={activeServer === 4 ? 'primary' : 'default'}
      >
        Server 4
      </Button>
    </Flex>
  );
}
