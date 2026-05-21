import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Checkbox, Alert, Tooltip } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import { useSigninMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthLayout from '../AuthLayout';
import SocialLoginButtons from '../../../components/auth/SocialLoginButtons';

const { Title, Text } = Typography;

interface LoginForm {
  email:    string;
  password: string;
  remember: boolean;
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

export default function Login() {
  const [error, setError]           = useState('');
  const [socialBusy, setSocialBusy] = useState(false);
  const [form]                      = Form.useForm<LoginForm>();
  const { colors }                  = useTheme();
  const navigate                    = useNavigate();
  const signinMutation              = useSigninMutation();

  const isBusy = signinMutation.isPending || socialBusy;

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
      <Title level={2} style={{ color: colors.textPrimary, marginBottom: 6 }}>
        Welcome back
      </Title>
      <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 28 }}>
        Sign in to continue watching
      </Text>

      {error && <Alert description={error} type="error" showIcon style={{ marginBottom: 20 }} />}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
        autoComplete="off"
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
            autoComplete="new-password"
            disabled={isBusy}
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
            autoComplete="new-password"
            disabled={isBusy}
          />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox disabled={isBusy}>
                Remember me
                <Tooltip title="Keeps you signed in for 30 days.">
                  <InfoCircleOutlined style={{ marginLeft: 6, color: colors.textMuted, fontSize: 13 }} />
                </Tooltip>
              </Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: ACCENT, fontSize: 13 }}>
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={signinMutation.isPending}
            disabled={isBusy}
            style={submitBtnStyle}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <SocialLoginButtons
        mode="signin"
        rememberMe={form.getFieldValue('remember') as boolean}
        onLoadingChange={setSocialBusy}
      />

      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text style={{ color: colors.textMuted }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: ACCENT, fontWeight: 600 }}>
            Sign up free
          </Link>
        </Text>
      </div>
    </AuthLayout>
  );
}
