import { Form, Input, Button, Typography, Divider, Space, Steps, Select, Alert } from 'antd';
import {
  UserOutlined, LockOutlined, MailOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { PLANS, SIGNUP_FEATURES } from '../../../constants';
import { useSignupMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthShowcase from '../AuthShowcase';
import '../login/Login.css';   // shared auth-layout / auth-panel / auth-showcase styles
import './Signup.css';

const { Title, Text } = Typography;

interface SignupForm {
  name:     string;
  email:    string;
  password: string;
  confirm:  string;
  plan:     string;
}

export default function Signup() {
  const [step, setStep]    = useState(0);
  const [done, setDone]    = useState(false);
  const [error, setError]  = useState('');
  const [form]             = Form.useForm<SignupForm>();
  const { colors, isDark } = useTheme();
  const navigate           = useNavigate();
  const signupMutation     = useSignupMutation();

  const handleNext = async () => {
    try {
      if (step === 0) await form.validateFields(['name', 'email']);
      else if (step === 1) await form.validateFields(['password', 'confirm']);
      setStep((s) => s + 1);
    } catch { /* validation failed — Ant Design shows inline errors */ }
  };

  const handleSubmit = (values: SignupForm) => {
    setError('');
    signupMutation.mutate(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => {
          if (err instanceof ApiError && err.statusCode === 409) {
            setError('An account with this email already exists.');
            setStep(0);
          } else if (err instanceof ApiError) {
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

          {!done ? (
            <>
              <Title level={2} className="auth-panel__heading" style={{ color: colors.textPrimary }}>
                Create account
              </Title>
              <Text className="auth-panel__subheading" style={{ color: colors.textMuted }}>
                Start watching in minutes
              </Text>

              {error && (
                <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
              )}

              <Steps
                current={step}
                size="small"
                className="auth-panel__steps"
                items={[
                  { title: <Text style={{ fontSize: 12 }}>Account</Text> },
                  { title: <Text style={{ fontSize: 12 }}>Security</Text> },
                  { title: <Text style={{ fontSize: 12 }}>Plan</Text> },
                ]}
              />

              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* Step 0 — Account */}
                {step === 0 && (
                  <>
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: colors.textMuted }} />}
                        placeholder="Full name"
                        size="large"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Enter a valid email' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: colors.textMuted }} />}
                        placeholder="Email address"
                        size="large"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={handleNext}
                      className="auth-panel__submit-btn"
                    >
                      Continue
                    </Button>
                  </>
                )}

                {/* Step 1 — Password */}
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
                      />
                    </Form.Item>
                    <Space style={{ width: '100%' }} size={12}>
                      <Button
                        size="large"
                        onClick={() => setStep(0)}
                        className="auth-panel__btn-back"
                      >
                        Back
                      </Button>
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleNext}
                        className="auth-panel__submit-btn"
                        style={{ flex: 2 }}
                      >
                        Continue
                      </Button>
                    </Space>
                  </>
                )}

                {/* Step 2 — Plan */}
                {step === 2 && (
                  <>
                    <Form.Item
                      name="plan"
                      initialValue="standard"
                      rules={[{ required: true, message: 'Please select a plan' }]}
                    >
                      <Select size="large" options={PLANS} style={{ width: '100%' }} />
                    </Form.Item>
                    <div
                      className="auth-panel__features"
                      style={{
                        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {SIGNUP_FEATURES.map((feature) => (
                        <div key={feature} className="auth-panel__feature-row">
                          <CheckCircleOutlined className="auth-panel__feature-icon" />
                          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{feature}</Text>
                        </div>
                      ))}
                    </div>
                    <Space style={{ width: '100%' }} size={12}>
                      <Button
                        size="large"
                        onClick={() => setStep(1)}
                        className="auth-panel__btn-back"
                      >
                        Back
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={signupMutation.isPending}
                        className="auth-panel__submit-btn"
                        style={{ flex: 2 }}
                      >
                        Create Account
                      </Button>
                    </Space>
                  </>
                )}
              </Form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="auth-panel__success">
              <CheckCircleOutlined className="auth-panel__success-icon" />
              <Title level={3} className="auth-panel__success-title" style={{ color: colors.textPrimary }}>
                Welcome to 99Flix!
              </Title>
              <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 28 }}>
                Your account is ready. Sign in to start watching.
              </Text>
              <Button
                type="primary"
                size="large"
                className="auth-panel__success-btn"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          )}

          {!done && (
            <>
              <Divider />
              <div className="auth-panel__footer">
                <Text style={{ color: colors.textMuted }}>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-panel__link">Sign in</Link>
                </Text>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
