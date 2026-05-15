/**
 * ForgotPassword — lets users request a password reset link.
 *
 * Step 1: User enters their email address.
 * Step 2: On success, a confirmation screen is shown.
 *
 * The API always returns 200 regardless of whether the email exists
 * (to prevent user enumeration), so we always show the success state.
 */

import { Form, Input, Button, Typography, Alert, Result } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useForgotPasswordMutation } from '../../../api/useAuthQuery';
import { ApiError } from '../../../services/internalApiClient';
import AuthLayout from '../AuthLayout';

const { Title, Text } = Typography;

interface ForgotPasswordForm {
  email: string;
}

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

  return (
    <AuthLayout>
      {submitted ? (
        <Result
          status="success"
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
              <MailOutlined style={{ fontSize: 32, color: '#e50914' }} />
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
                className="auth-panel__submit-btn"
                style={{ width: '100%' }}
                onClick={() => { setSubmitted(false); form.resetFields(); }}
              >
                Try a different email
              </Button>
              <div className="auth-panel__footer">
                <Link to="/login" style={{ color: '#e50914', fontSize: 14 }}>
                  <ArrowLeftOutlined style={{ marginRight: 6 }} />
                  Back to sign in
                </Link>
              </div>
            </div>
          }
        />
      ) : (
        <>
          <Title level={2} className="auth-panel__heading" style={{ color: colors.textPrimary }}>
            Forgot password?
          </Title>
          <Text className="auth-panel__subheading" style={{ color: colors.textMuted }}>
            Enter your email and we'll send you a reset link.
          </Text>

          {error && (
            <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />
          )}

          <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={forgotMutation.isPending}
                className="auth-panel__submit-btn"
              >
                Send reset link
              </Button>
            </Form.Item>
          </Form>

          <div className="auth-panel__footer">
            <Link to="/login" style={{ color: '#e50914', fontSize: 14 }}>
              <ArrowLeftOutlined style={{ marginRight: 6 }} />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
