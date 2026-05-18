import { Form, Input, Button, Typography, Divider, Checkbox, Space, Alert, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, InfoCircleOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useSigninMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthLayout from '../AuthLayout';

const { Title, Text } = Typography;

interface LoginForm {
  email:    string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [error, setError]  = useState('');
  const [form]             = Form.useForm<LoginForm>();
  const { colors }         = useTheme();
  const navigate           = useNavigate();
  const signinMutation     = useSigninMutation();

  const handleSubmit = (values: LoginForm) => {
    setError('');
    signinMutation.mutate(
      { email: values.email, password: values.password, rememberMe: values.remember },
      {
        onSuccess: () => navigate('/'),
        onError: (err) => {
          setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
        },
      },
    );
  };

  return (
    <AuthLayout>
      <Title level={2} className="auth-panel__heading" style={{ color: colors.textPrimary }}>
        Welcome back
      </Title>
      <Text className="auth-panel__subheading" style={{ color: colors.textMuted }}>
        Sign in to continue watching
      </Text>

      {error && (
        <Alert title={error} type="error" showIcon style={{ marginBottom: 20 }} />
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
              <Checkbox>
                Remember me
                <Tooltip title="Keeps you signed in for 30 days.">
                  <InfoCircleOutlined style={{ marginLeft: 6, color: colors.textMuted, fontSize: 13 }} />
                </Tooltip>
              </Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="auth-panel__forgot">Forgot password?</Link>
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

      <Space style={{ width: '100%', justifyContent: 'center' }} size={15}>
        <Button shape="circle" icon={<GoogleOutlined />} />
        <Button shape="circle" icon={<FacebookOutlined />} />
      </Space>

      <div className="auth-panel__footer">
        <Text style={{ color: colors.textMuted }}>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-panel__link">Sign up free</Link>
        </Text>
      </div>
    </AuthLayout>
  );
}
