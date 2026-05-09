import { Form, Input, Button, Typography, Divider, Checkbox, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined, PlayCircleFilled } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

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
    <div
      style={{
        minHeight: '100vh',
        background: colors.authBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(229,9,20,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,0,255,0.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: colors.authCard,
          borderRadius: 16,
          padding: 'clamp(24px, 5vw, 40px)',
          border: `1px solid ${colors.border}`,
          backdropFilter: 'blur(20px)',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.6)'
            : '0 8px 40px rgba(0,0,0,0.12)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Space align="center">
            <PlayCircleFilled style={{ fontSize: 36, color: '#e50914' }} />
            <Title level={2} style={{ margin: 0, letterSpacing: -1 }}>
              Lorem<span style={{ color: '#e50914' }}>Flix</span>
            </Title>
          </Space>
          <Text style={{ color: colors.textMuted, display: 'block', marginTop: 8 }}>
            Sign in to continue watching
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20 }}
          />
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
              <a href="#" style={{ color: '#e50914', fontSize: 13 }}>
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                background: '#e50914',
                borderColor: '#e50914',
                fontWeight: 600,
                height: 48,
                borderRadius: 8,
                fontSize: 16,
              }}
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
            <Button
              key={provider}
              style={{ borderRadius: 8, flex: 1 }}
            >
              {provider}
            </Button>
          ))}
        </Space>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: colors.textMuted }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#e50914', fontWeight: 600 }}>
              Sign up free
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>
            Demo: demo@lorem.com / password
          </Text>
        </div>
      </div>
    </div>
  );
}
