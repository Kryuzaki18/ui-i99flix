import { Form, Input, Button, Typography, Divider, Checkbox, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, PlayCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import './Login.css';

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form]                = Form.useForm<LoginForm>();
  const { colors, isDark }    = useTheme();

  const handleSubmit = (values: LoginForm) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (values.email === 'demo@lorem.com' && values.password === 'password') {
        window.location.href = '/';
      } else {
        setError('Invalid credentials. Try demo@lorem.com / password');
      }
    }, 1200);
  };

  return (
    <div className="login-page" style={{ background: colors.authBg }}>
      <div className="login-page__glow" />

      <div
        className="login-card"
        style={{
          background: colors.authCard,
          border: `1px solid ${colors.border}`,
          boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.6)' : '0 8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Logo */}
        <div className="login-card__logo">
          <Space align="center">
            <PlayCircleFilled className="login-card__logo-icon" />
            <Title level={2} className="login-card__logo-title">
              Lorem<span className="login-card__logo-accent">Flix</span>
            </Title>
          </Space>
          <Text className="login-card__subtitle" style={{ color: colors.textMuted }}>
            Sign in to continue watching
          </Text>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}

        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ remember: true }}>
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
              <a href="#" className="login-card__forgot">Forgot password?</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="login-card__submit-btn"
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
            <Button key={provider} className="login-card__social-btn">{provider}</Button>
          ))}
        </Space>

        <div className="login-card__footer">
          <Text style={{ color: colors.textMuted }}>
            Don't have an account?{' '}
            <Link to="/signup" className="login-card__signup-link">Sign up free</Link>
          </Text>
        </div>

        <div className="login-card__demo-hint">
          <Text style={{ color: colors.textMuted }}>Demo: demo@lorem.com / password</Text>
        </div>
      </div>
    </div>
  );
}
