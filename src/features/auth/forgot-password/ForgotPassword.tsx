import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Alert, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTheme } from '../../../context/ThemeContext';
import { useForgotPasswordMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthLayout from '../AuthLayout';

const { Title, Text } = Typography;

interface ForgotPasswordForm {
  email: string;
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

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');
  const [form]                    = Form.useForm<ForgotPasswordForm>();
  const { colors }                = useTheme();
  const forgotMutation            = useForgotPasswordMutation();

  const handleSubmit = (values: ForgotPasswordForm) => {
    setError('');
    forgotMutation.mutate(
      { email: values.email },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => {
          setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
        },
      },
    );
  };

  const backToSignIn = (
    <Link to="/login" style={{ color: ACCENT, fontSize: 14 }}>
      <ArrowLeftOutlined style={{ marginRight: 6 }} />
      Back to sign in
    </Link>
  );

  return (
    <AuthLayout>
      {submitted ? (
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
              <MailOutlined style={{ fontSize: 32, color: ACCENT }} />
            </div>
          }
          title={
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Check your inbox
            </Title>
          }
          subTitle={
            <Text style={{ color: colors.textMuted }}>
              If an account exists for{' '}
              <strong style={{ color: colors.textSecondary }}>
                {form.getFieldValue('email')}
              </strong>
              , you'll receive a reset link shortly. Check your spam folder if it doesn't arrive.
            </Text>
          }
          extra={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <Button
                type="primary"
                size="large"
                style={{ ...submitBtnStyle, width: '100%' }}
                onClick={() => { setSubmitted(false); form.resetFields(); }}
              >
                Try a different email
              </Button>
              <div style={{ textAlign: 'center', marginTop: 8 }}>{backToSignIn}</div>
            </div>
          }
        />
      ) : (
        <>
          <Title level={2} style={{ color: colors.textPrimary, marginBottom: 6 }}>
            Forgot password?
          </Title>
          <Text style={{ color: colors.textMuted, display: 'block', marginBottom: 28 }}>
            Enter your email and we'll send you a reset link.
          </Text>

          {error && <Alert description={error} type="error" showIcon style={{ marginBottom: 20 }} />}

          <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
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
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={forgotMutation.isPending}
                style={submitBtnStyle}
              >
                Send reset link
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 8 }}>{backToSignIn}</div>
        </>
      )}
    </AuthLayout>
  );
}
