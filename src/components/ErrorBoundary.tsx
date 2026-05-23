import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) return fallback(error, this.reset);

      return (
        <div
          role="alert"
          style={{
            minHeight: '60dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 32,
            textAlign: 'center',
          }}
        >
          <WarningOutlined style={{ fontSize: 48, color: '#e50914' }} />
          <Title level={3} style={{ margin: 0 }}>Something went wrong</Title>
          <Text type="secondary" style={{ maxWidth: 400 }}>
            An unexpected error occurred. Try refreshing the page.
          </Text>
          <Button type="primary" onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }

    return children;
  }
}
