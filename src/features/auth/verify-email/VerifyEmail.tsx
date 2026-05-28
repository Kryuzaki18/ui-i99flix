import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button, Typography, Spin, Result } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import { useVerifyEmailMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/apiService';
import AuthLayout from '../AuthLayout';

const { Title, Text } = Typography;

const ACCENT = '#e50914';

const iconWrapStyle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
};

const btnStyle: React.CSSProperties = {
  background: ACCENT,
  borderColor: ACCENT,
  fontWeight: 600,
  height: 48,
  borderRadius: 8,
  fontSize: 15,
};

export default function VerifyEmail() {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const verifyMutation = useVerifyEmailMutation();
  const hasVerified = useRef(false);

  const token = searchParams.get('token') ?? '';

  useEffect(() => {
    if (!token || hasVerified.current) return;
    hasVerified.current = true;
    verifyMutation.mutate(token);
  }, [token]);

  if (!token) {
    return (
      <AuthLayout>
        <Result
          icon={
            <div style={{ ...iconWrapStyle, background: 'rgba(229,9,20,0.12)' }}>
              <CloseCircleOutlined style={{ fontSize: 32, color: ACCENT }} />
            </div>
          }
          title={
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Invalid verification link
            </Title>
          }
          subTitle={
            <Text style={{ color: colors.textMuted }}>
              This link is missing a verification token. Please use the link from your email.
            </Text>
          }
          extra={
            <Link to="/login">
              <Button type="primary" size="large" style={btnStyle}>
                <ArrowLeftOutlined /> Back to sign in
              </Button>
            </Link>
          }
        />
      </AuthLayout>
    );
  }

  if (verifyMutation.isPending) {
    return (
      <AuthLayout>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <Title level={4} style={{ color: colors.textPrimary, marginTop: 24 }}>
            Verifying your email…
          </Title>
          <Text style={{ color: colors.textMuted }}>Just a moment, please.</Text>
        </div>
      </AuthLayout>
    );
  }

  if (verifyMutation.isSuccess) {
    return (
      <AuthLayout>
        <Result
          icon={
            <div style={{ ...iconWrapStyle, background: 'rgba(229,9,20,0.12)' }}>
              <CheckCircleOutlined style={{ fontSize: 32, color: ACCENT }} />
            </div>
          }
          title={
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Email verified
            </Title>
          }
          subTitle={
            <Text style={{ color: colors.textMuted }}>
              Your account is now active. Sign in to start watching.
            </Text>
          }
          extra={
            <Link to="/login">
              <Button type="primary" size="large" style={{ ...btnStyle, minWidth: 180 }}>
                Sign in
              </Button>
            </Link>
          }
        />
      </AuthLayout>
    );
  }

  const errorMsg =
    verifyMutation.error instanceof ApiError
      ? verifyMutation.error.message
      : 'Something went wrong. Please try again.';

  return (
    <AuthLayout>
      <Result
        icon={
          <div style={{ ...iconWrapStyle, background: 'rgba(229,9,20,0.12)' }}>
            <CloseCircleOutlined style={{ fontSize: 32, color: ACCENT }} />
          </div>
        }
        title={
          <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
            Verification failed
          </Title>
        }
        subTitle={
          <Text style={{ color: colors.textMuted }}>{errorMsg}</Text>
        }
        extra={
          <Link to="/login">
            <Button type="primary" size="large" style={{ ...btnStyle, minWidth: 180 }}>
              <ArrowLeftOutlined /> Back to sign in
            </Button>
          </Link>
        }
      />
    </AuthLayout>
  );
}
