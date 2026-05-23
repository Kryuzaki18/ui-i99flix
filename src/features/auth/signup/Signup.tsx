import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Steps, Alert, Flex } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import { useSignupMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthLayout from '../AuthLayout';
import SocialLoginButtons from '../../../components/auth/SocialLoginButtons';

const { Title, Text } = Typography;

interface SignupForm {
  name: string;
  email: string;
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

export default function Signup() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm<SignupForm>();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const handleNext = async () => {
    try {
      if (step === 0) await form.validateFields(['name', 'email']);
      else if (step === 1) await form.validateFields(['password', 'confirm']);
      setStep((s) => s + 1);
    } catch { /* validation failed — Ant Design shows inline errors */ }
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue(true) as SignupForm;
    setError('');
    signupMutation.mutate(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => {
          if (err instanceof ApiError && err.statusCode === 409) {
            setError('An account with this email already exists.');
            setStep(0);
          } else {
            setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
          }
        },
      },
    );
  };

  return (
    <AuthLayout>
      {!done ? (
        <>
          <Flex vertical style={{ width: '100%' }} align='center'>
            <Title level={2} style={{ color: colors.textPrimary, marginBottom: 6 }}>
              Create account
            </Title>

            <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 20 }}>
              Start watching in minutes
            </Text>

            {error && <Alert description={error} type="error" showIcon style={{ marginBottom: 20, fontSize: 12, width: "100%", paddingTop: 10, paddingBottom: 10 }} />}
            <Steps
              current={step}
              size="small"
              style={{ marginBottom: 12 }}
              items={[
                { title: <Text style={{ fontSize: 12 }}>Account</Text> },
                { title: <Text style={{ fontSize: 12 }}>Security</Text> },
              ]}
            />
          </Flex>

          <Form form={form} layout="vertical" autoComplete="off" style={{ width: "100%" }}>

            {step === 0 && (
              <>
                <Form.Item
                  name="name"
                  rules={[
                    { required: true, message: 'Please enter your name' },
                    { min: 4, message: "Name must be at least 4 characters" },
                    { max: 50, message: "Name must be at most 50 characters" },
                  ]}
                  style={{ marginBottom: 24 }}

                >
                  <Input
                    prefix={<UserOutlined style={{ color: colors.textMuted }} />}
                    placeholder="Full name"
                    size="large"
                    style={{ borderRadius: 8 }}
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                  style={{ marginBottom: 24 }}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: colors.textMuted }} />}
                    placeholder="Email address"
                    size="large"
                    style={{ borderRadius: 8 }}
                    autoComplete="new-password"
                  />
                </Form.Item>
                <Form.Item style={{ marginBottom: 5 }}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={handleNext}
                    style={submitBtnStyle}
                  >
                    Continue
                  </Button>
                </Form.Item>
              </>
            )}

            {step === 1 && (
              <>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please enter a password' },
                    { min: 7, message: 'Password must be at least 7 characters' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: colors.textMuted }} />}
                    placeholder="Password"
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
                    placeholder="Confirm password"
                    size="large"
                    style={{ borderRadius: 8 }}
                    autoComplete="new-password"
                  />
                </Form.Item>

                <Flex gap={12} justify='space-between' style={{ width: '100%' }}>
                  <Button
                    size="large"
                    type="link"
                    onClick={() => setStep(0)}
                    style={{ height: 48, padding: 0, color: colors.textMuted }}
                    icon={<ArrowLeftOutlined />}
                  >
                    Back
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={signupMutation.isPending}
                    style={{ ...submitBtnStyle, width: '50%' }}
                    icon={<ArrowRightOutlined style={{ fontSize: 18 }} />}
                    iconPlacement='end'
                  >
                    Sign up
                  </Button>
                </Flex>
              </>
            )}
          </Form>

          <SocialLoginButtons mode="signup" />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text style={{ color: colors.textMuted }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: ACCENT, fontWeight: 600 }}>
                Sign in
              </Link>
            </Text>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16, display: 'block' }} />
          <Title level={3} style={{ color: colors.textPrimary, marginBottom: 8 }}>
            Welcome to i99flix!
          </Title>
          <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 28 }}>
            Your account is ready. Sign in to start watching.
          </Text>
          <Button
            type="primary"
            size="large"
            style={{ ...submitBtnStyle, paddingInline: 32 }}
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>
      )
      }
    </AuthLayout >
  );
}
