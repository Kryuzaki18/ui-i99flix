import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Typography } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { darkColors } from '../constants/theme';

const { Title, Text } = Typography;

function ErrorFallback({ onReset }: { onReset: () => void }) {
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
      <WarningOutlined style={{ fontSize: 48, color: darkColors.accent }} />
      <Title level={3} style={{ margin: 0 }}>Something went wrong</Title>
      <Text type="secondary" style={{ maxWidth: 400 }}>
        An unexpected error occurred. Try refreshing the page.
      </Text>
      <Button type="primary" onClick={onReset}>
        Try again
      </Button>
    </div>
  );
}

class ErrorBoundaryClass extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }
  reset = () => this.setState({ hasError: false });
  render() {
    return this.state.hasError ? <ErrorFallback onReset={this.reset} /> : this.props.children;
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
}
