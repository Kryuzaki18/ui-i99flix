import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import { useResetPasswordMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthLayout from '../AuthLayout';

const { Title, Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirm: string;
}

const ACCENT = '#e50914';

const submitBtnStyle: React.CSSProperties = {
  background: ACCENT,
  borderColor: ACCENT,
  fontWeight: 600,
  height: 48,
  borderRadius: 8,
  fontSize: 15,
};

const iconWrapStyle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: '50%',
  background: 'rgba(229,9,20,0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
};

export default function ResetPassword() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm<ResetPasswordForm>();
  const { colors } = useTheme();
  const resetMutation = useResetPasswordMutation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const handleSubmit = (values: ResetPasswordForm) => {
    setError('');
    resetMutation.mutate(
      { token, password: values.password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => {
          setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
        },
      },
    );
  };

  if (!token) {
    return (
      <AuthLayout>
        <Result
          status="error"
          title={
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Invalid reset link
            </Title>
          }
          subTitle={
            <Text style={{ color: colors.textMuted }}>
              This link is missing a reset token. Please request a new one.
            </Text>
          }
          extra={
            <Link to="/forgot-password">
              <Button type="primary" size="large" style={submitBtnStyle}>
                Request new link
              </Button>
            </Link>
          }
        />
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <Result
          icon={
            <div style={iconWrapStyle}>
              <CheckCircleOutlined style={{ fontSize: 32, color: ACCENT }} />
            </div>
          }
          title={
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Password updated
            </Title>
          }
          subTitle={
            <Text style={{ color: colors.textMuted }}>
              Your password has been changed. You can now sign in with your new credentials.
            </Text>
          }
          extra={
            <Link to="/login">
              <Button type="primary" size="large" style={{ ...submitBtnStyle, width: '100%' }}>
                Sign in
              </Button>
            </Link>
          }
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Title level={2} style={{ color: colors.textPrimary, marginBottom: 6 }}>
        Set new password
      </Title>
      <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 28 }}>
        Choose a strong password — at least 7 characters.
      </Text>

      {error && <Alert description={error} type="error" showIcon style={{ marginBottom: 20, fontSize: 12, width: "100%", paddingTop: 10, paddingBottom: 10 }} />}

      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" style={{ width: "100%" }}>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter a new password' },
            { min: 7, message: 'Password must be at least 7 characters' },
          ]}
          style={{ marginBottom: 24 }}

        >
          <Input.Password
            prefix={<LockOutlined style={{ color: colors.textMuted }} />}
            placeholder="New password"
            size="large"
            style={{ borderRadius: 8 }}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
          style={{ marginBottom: 24 }}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: colors.textMuted }} />}
            placeholder="Confirm new password"
            size="large"
            style={{ borderRadius: 8 }}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={resetMutation.isPending}
            style={submitBtnStyle}
          >
            Update password
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Link to="/login" style={{ color: ACCENT, fontSize: 14 }}>
          <ArrowLeftOutlined style={{ marginRight: 6 }} />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
