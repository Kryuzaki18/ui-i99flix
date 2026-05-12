/**
 * ResetPassword — lets users set a new password using the token from
 * the reset link (e.g. /reset-password?token=<hex>).
 *
 * States:
 *  - invalid/missing token → error prompt
 *  - form → user enters + confirms new password
 *  - success → confirmation with link back to login
 */

import { Form, Input, Button, Typography, Space, Alert, Result } from 'antd';
import { LockOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useResetPasswordMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthShowcase from '../AuthShowcase';
import '../../auth/login/Login.css';

const { Title, Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirm:  string;
}

export default function ResetPassword() {
  const [done, setDone]    = useState(false);
  const [error, setError]  = useState('');
  const [form]             = Form.useForm<ResetPasswordForm>();
  const { colors, isDark } = useTheme();
  const resetMutation      = useResetPasswordMutation();
  const [searchParams]     = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const handleSubmit = (values: ResetPasswordForm) => {
    setError('');
    resetMutation.mutate(
      { token, password: values.password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => {
          if (err instanceof ApiError) {
            setError(err.message);
          } else {
            setError('Something went wrong. Please try again.');
          }
        },
      },
    );
  };

  return (
    <div
      className="auth-layout"
      style={{ background: isDark ? '#0d0d1a' : '#f0f2f5' }}
    >
      {/* ── Left: animated showcase ── */}
      <AuthShowcase />

      {/* ── Right: form panel ── */}
      <div
        className="auth-panel"
        style={{ background: isDark ? '#0d0d1a' : '#f0f2f5' }}
      >
        <div className="auth-panel__inner">

          {/* Mobile-only logo */}
          <div className="auth-panel__logo">
            <Space align="center">
              <span style={{ fontSize: 28, color: '#e50914' }}>▶</span>
              <Title level={3} className="auth-panel__logo-title" style={{ margin: 0 }}>
                i99<span className="auth-panel__logo-accent">flix</span>
              </Title>
            </Space>
          </div>

          {/* ── Missing / invalid token (no token in URL) ── */}
          {!token ? (
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
                  <Button type="primary" size="large" className="auth-panel__submit-btn">
                    Request new link
                  </Button>
                </Link>
              }
            />
          ) : done ? (
            /* ── Success state ── */
            <Result
              icon={
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    background: 'rgba(229,9,20,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#e50914' }} />
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
                  <Button
                    type="primary"
                    size="large"
                    className="auth-panel__submit-btn"
                    style={{ width: '100%' }}
                  >
                    Sign in
                  </Button>
                </Link>
              }
            />
          ) : (
            /* ── Reset form ── */
            <>
              <Title level={2} className="auth-panel__heading" style={{ color: colors.textPrimary }}>
                Set new password
              </Title>
              <Text className="auth-panel__subheading" style={{ color: colors.textMuted }}>
                Choose a strong password — at least 7 characters.
              </Text>

              {error && (
                <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter a new password' },
                    { min: 7, message: 'Password must be at least 7 characters' },
                  ]}
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
                    className="auth-panel__submit-btn"
                  >
                    Update password
                  </Button>
                </Form.Item>
              </Form>

              <div className="auth-panel__footer">
                <Link to="/login" style={{ color: '#e50914', fontSize: 14 }}>
                  <ArrowLeftOutlined style={{ marginRight: 6 }} />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
