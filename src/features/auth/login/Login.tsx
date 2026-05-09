import { Form, Input, Button, Typography, Divider, Checkbox, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useSigninMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthShowcase from '../AuthShowcase';
import './Login.css';

const { Title, Text } = Typography;

interface LoginForm {
  email:    string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [error, setError]  = useState('');
  const [form]             = Form.useForm<LoginForm>();
  const { colors, isDark } = useTheme();
  const navigate           = useNavigate();
  const signinMutation     = useSigninMutation();

  const handleSubmit = (values: LoginForm) => {
    setError('');
    signinMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => navigate('/'),
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
                99<span className="auth-panel__logo-accent">Flix</span>
              </Title>
            </Space>
          </div>

          <Title level={2} className="auth-panel__heading" style={{ color: colors.textPrimary }}>
            Welcome back
          </Title>
          <Text className="auth-panel__subheading" style={{ color: colors.textMuted }}>
            Sign in to continue watching
          </Text>

          {error && (
            <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: colors.textMuted }} />}
                placeholder="Email address"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: colors.textMuted }} />}
                placeholder="Password"
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="#" className="auth-panel__forgot">Forgot password?</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={signinMutation.isPending}
                className="auth-panel__submit-btn"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>or continue with</Text>
          </Divider>

          <Space style={{ width: '100%', justifyContent: 'center' }} size={12}>
            {['Google', 'GitHub', 'Apple'].map((provider) => (
              <Button key={provider} className="auth-panel__social-btn">{provider}</Button>
            ))}
          </Space>

          <div className="auth-panel__footer">
            <Text style={{ color: colors.textMuted }}>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-panel__link">Sign up free</Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
