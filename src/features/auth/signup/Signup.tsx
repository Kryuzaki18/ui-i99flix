import { Form, Input, Button, Typography, Divider, Space, Steps, Select } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PlayCircleFilled,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const { Title, Text } = Typography;

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
  plan: string;
}

const PLANS = [
  { value: 'basic',    label: 'Basic — Lorem ipsum (Free)' },
  { value: 'standard', label: 'Standard — Dolor sit amet ($9.99/mo)' },
  { value: 'premium',  label: 'Premium — Consectetur ($14.99/mo)' },
];

export default function Signup() {
  const [step, setStep]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [form]              = Form.useForm<SignupForm>();
  const { colors, isDark }  = useTheme();

  const handleNext = async () => {
    try {
      if (step === 0) await form.validateFields(['name', 'email']);
      else if (step === 1) await form.validateFields(['password', 'confirm']);
      setStep((s) => s + 1);
    } catch { /* validation failed */ }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
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
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 80% 50%, rgba(229,9,20,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99,0,255,0.07) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 460,
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
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Space align="center">
            <PlayCircleFilled style={{ fontSize: 32, color: '#e50914' }} />
            <Title level={2} style={{ margin: 0, letterSpacing: -1 }}>
              Lorem<span style={{ color: '#e50914' }}>Flix</span>
            </Title>
          </Space>
          <Text style={{ color: colors.textMuted, display: 'block', marginTop: 6 }}>
            Create your account
          </Text>
        </div>

        {!done ? (
          <>
            <Steps
              current={step}
              size="small"
              style={{ marginBottom: 28 }}
              items={[
                { title: <Text style={{ fontSize: 12 }}>Account</Text> },
                { title: <Text style={{ fontSize: 12 }}>Security</Text> },
                { title: <Text style={{ fontSize: 12 }}>Plan</Text> },
              ]}
            />

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              {/* Step 0 */}
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
                    style={{
                      background: '#e50914',
                      borderColor: '#e50914',
                      fontWeight: 600,
                      height: 48,
                      borderRadius: 8,
                    }}
                  >
                    Continue
                  </Button>
                </>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter a password' },
                      { min: 8, message: 'Password must be at least 8 characters' },
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
                          if (!value || getFieldValue('password') === value)
                            return Promise.resolve();
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
                      style={{ flex: 1, borderRadius: 8 }}
                    >
                      Back
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleNext}
                      style={{
                        flex: 2,
                        background: '#e50914',
                        borderColor: '#e50914',
                        fontWeight: 600,
                        height: 48,
                        borderRadius: 8,
                      }}
                    >
                      Continue
                    </Button>
                  </Space>
                </>
              )}

              {/* Step 2 */}
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
                    style={{
                      background: colors.bgBase,
                      borderRadius: 8,
                      padding: 16,
                      marginBottom: 20,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {[
                      'Unlimited lorem ipsum streaming',
                      'Dolor sit amet in HD & 4K',
                      'Consectetur adipiscing on all devices',
                      'Sed do eiusmod offline downloads',
                    ].map((feature) => (
                      <div key={feature} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <CheckCircleOutlined style={{ color: '#e50914', marginTop: 2 }} />
                        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                          {feature}
                        </Text>
                      </div>
                    ))}
                  </div>
                  <Space style={{ width: '100%' }} size={12}>
                    <Button
                      size="large"
                      onClick={() => setStep(1)}
                      style={{ flex: 1, borderRadius: 8 }}
                    >
                      Back
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={loading}
                      style={{
                        flex: 2,
                        background: '#e50914',
                        borderColor: '#e50914',
                        fontWeight: 600,
                        height: 48,
                        borderRadius: 8,
                      }}
                    >
                      Create Account
                    </Button>
                  </Space>
                </>
              )}
            </Form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
            <Title level={3} style={{ marginBottom: 8 }}>
              Welcome to LoremFlix!
            </Title>
            <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 24 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Your account is ready.
            </Text>
            <Link to="/">
              <Button
                type="primary"
                size="large"
                style={{
                  background: '#e50914',
                  borderColor: '#e50914',
                  fontWeight: 600,
                  height: 48,
                  paddingInline: 32,
                }}
              >
                Start Watching
              </Button>
            </Link>
          </div>
        )}

        {!done && (
          <>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: colors.textMuted }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#e50914', fontWeight: 600 }}>
                  Sign in
                </Link>
              </Text>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
