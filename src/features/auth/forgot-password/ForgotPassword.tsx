import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, Form, Input, Button, Typography, Alert, Flex } from "antd";
import {
  MailOutlined,
  ArrowLeftOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useForgotPasswordMutation } from "../../../api/useAuthQuery";
import { ApiError } from "../../../services/apiService";

const { Title, Text } = Typography;

interface ForgotPasswordForm {
  email: string;
}

function BackToSignIn({ color }: { color: string }) {
  return (
    <Flex justify="center" style={{ marginTop: 20 }}>
      <Link to="/login" style={{ color, fontSize: 14, fontWeight: 500 }}>
        <ArrowLeftOutlined style={{ marginRight: 6 }} />
        Back to sign in
      </Link>
    </Flex>
  );
}

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm<ForgotPasswordForm>();
  const { colors, isDark } = useTheme();
  const forgotMutation = useForgotPasswordMutation();

  const primaryBtn: React.CSSProperties = {
    background: colors.accent,
    borderColor: colors.accent,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
  };

  const handleSubmit = (values: ForgotPasswordForm) => {
    setError("");
    forgotMutation.mutate(
      { email: values.email },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => {
          setError(
            err instanceof ApiError
              ? err.message
              : "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  if (submitted) {
    return (
      <>
        <Flex
          vertical
          align="center"
          gap={16}
          style={{ width: "100%", textAlign: "center", padding: "8px 0" }}
        >
          <Flex
            align="center"
            justify="center"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(229,9,20,0.12)",
            }}
          >
            <MailOutlined style={{ fontSize: 36, color: colors.accent }} />
          </Flex>

          <Flex vertical gap={6} align="center">
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Check your inbox
            </Title>
            <Text
              style={{ color: colors.textMuted, fontSize: 14, maxWidth: 320 }}
            >
              If an account exists for{" "}
              <Text strong style={{ color: colors.textSecondary }}>
                {form.getFieldValue("email")}
              </Text>
              , you'll receive a reset link shortly. Check your spam folder too.
            </Text>
          </Flex>

          <Button
            type="primary"
            size="large"
            style={{ ...primaryBtn, width: "100%" }}
            onClick={() => {
              setSubmitted(false);
              form.resetFields();
            }}
          >
            Try a different email
          </Button>

          <BackToSignIn color={colors.accent} />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Flex
        vertical
        align="center"
        gap={6}
        style={{ width: "100%", marginBottom: 28 }}
      >
        <Title
          level={2}
          style={{
            color: colors.textPrimary,
            margin: 0,
            textAlign: "center",
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          Forgot password?
        </Title>
        <Text
          style={{ color: colors.textMuted, textAlign: "center", fontSize: 14 }}
        >
          Enter your email and we'll send you a reset link.
        </Text>
      </Flex>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          style={{
            marginBottom: 16,
            borderRadius: 10,
            width: "100%",
            fontSize: 13,
          }}
        />
      )}

      <Card
        style={{
          width: "100%",
          background: isDark ? "rgba(255,255,255,0.04)" : colors.bgCard,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.45)"
            : "0 2px 20px rgba(0,0,0,0.08)",
        }}
        styles={{ body: { padding: "28px 28px 20px" } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
            style={{ marginBottom: 20 }}
          >
            <Input
              prefix={<MailOutlined style={{ color: colors.textMuted }} />}
              placeholder="Email address"
              size="large"
              style={{ borderRadius: 10 }}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={forgotMutation.isPending}
              icon={<SendOutlined />}
              iconPlacement="end"
              style={primaryBtn}
            >
              Send reset link
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <BackToSignIn color={colors.accent} />
    </>
  );
}
