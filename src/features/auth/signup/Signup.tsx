import { Form, Input, Button, Typography, Divider, Space, Steps, Select } from 'antd';
import {
  UserOutlined, LockOutlined, MailOutlined,
  PlayCircleFilled, CheckCircleOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import './Signup.css';

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

const FEATURES = [
  'Unlimited lorem ipsum streaming',
  'Dolor sit amet in HD & 4K',
  'Consectetur adipiscing on all devices',
  'Sed do eiusmod offline downloads',
];

export default function Signup() {
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [form]                = Form.useForm<SignupForm>();
  const { colors, isDark }    = useTheme();

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
    <div className="signup-page" style={{ background: colors.authBg }}>
      <div className="signup-page__glow" />

      <div
        className="signup-card"
        style={{
          background: colors.authCard,
          border: `1px solid ${colors.border}`,
          boxShadow: isDark ? '0 24px 64px rgba(0,0,0,0.6)' : '0 8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Logo */}
        <div className="signup-card__logo">
          <Space align="center">
            <PlayCircleFilled className="signup-card__logo-icon" />
            <Title level={2} className="signup-card__logo-title">
              Lorem<span className="signup-card__logo-accent">Flix</span>
            </Title>
          </Space>
          <Text className="signup-card__subtitle" style={{ color: colors.textMuted }}>
            Create your account
          </Text>
        </div>

        {!done ? (
          <>
            <Steps
              current={step}
              size="small"
              className="signup-card__steps"
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
                  <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                    <Input prefix={<UserOutlined style={{ color: colors.textMuted }} />} placeholder="Full name" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Enter a valid email' }]}>
                    <Input prefix={<MailOutlined style={{ color: colors.textMuted }} />} placeholder="Email address" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Button type="primary" size="large" block onClick={handleNext} className="signup-card__btn-primary">
                    Continue
                  </Button>
                </>
              )}

              {/* Step 1 — Password */}
              {step === 1 && (
                <>
                  <Form.Item name="password" rules={[{ required: true, message: 'Please enter a password' }, { min: 8, message: 'Password must be at least 8 characters' }]}>
                    <Input.Password prefix={<LockOutlined style={{ color: colors.textMuted }} />} placeholder="Password" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) return Promise.resolve();
                          return Promise.reject(new Error('Passwords do not match'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password prefix={<LockOutlined style={{ color: colors.textMuted }} />} placeholder="Confirm password" size="large" style={{ borderRadius: 8 }} />
                  </Form.Item>
                  <Space style={{ width: '100%' }} size={12}>
                    <Button size="large" onClick={() => setStep(0)} className="signup-card__btn-back">Back</Button>
                    <Button type="primary" size="large" onClick={handleNext} className="signup-card__btn-primary" style={{ flex: 2 }}>Continue</Button>
                  </Space>
                </>
              )}

              {/* Step 2 — Plan */}
              {step === 2 && (
                <>
                  <Form.Item name="plan" initialValue="standard" rules={[{ required: true, message: 'Please select a plan' }]}>
                    <Select size="large" options={PLANS} style={{ width: '100%' }} />
                  </Form.Item>
                  <div
                    className="signup-card__features"
                    style={{ background: colors.bgBase, border: `1px solid ${colors.border}` }}
                  >
                    {FEATURES.map((feature) => (
                      <div key={feature} className="signup-card__feature-row">
                        <CheckCircleOutlined className="signup-card__feature-icon" />
                        <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{feature}</Text>
                      </div>
                    ))}
                  </div>
                  <Space style={{ width: '100%' }} size={12}>
                    <Button size="large" onClick={() => setStep(1)} className="signup-card__btn-back">Back</Button>
                    <Button type="primary" htmlType="submit" size="large" loading={loading} className="signup-card__btn-primary" style={{ flex: 2 }}>
                      Create Account
                    </Button>
                  </Space>
                </>
              )}
            </Form>
          </>
        ) : (
          <div className="signup-card__success">
            <CheckCircleOutlined className="signup-card__success-icon" />
            <Title level={3} className="signup-card__success-title">Welcome to LoremFlix!</Title>
            <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 24 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Your account is ready.
            </Text>
            <Link to="/">
              <Button type="primary" size="large" className="signup-card__success-btn">
                Start Watching
              </Button>
            </Link>
          </div>
        )}

        {!done && (
          <>
            <Divider />
            <div className="signup-card__footer">
              <Text style={{ color: colors.textMuted }}>
                Already have an account?{' '}
                <Link to="/login" className="signup-card__signin-link">Sign in</Link>
              </Text>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
