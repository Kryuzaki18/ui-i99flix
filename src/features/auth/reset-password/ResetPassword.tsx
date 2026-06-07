import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, Form, Input, Button, Typography, Alert, Flex } from "antd";
import {
  LockOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useResetPasswordMutation } from "../../../api/auth/useAuthQuery";
import { ApiError } from "../../../services/apiService";

const { Title, Text } = Typography;

interface ResetPasswordForm {
  password: string;
  confirm: string;
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

function IconBadge({ icon, bg }: { icon: React.ReactNode; bg: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: bg }}
    >
      {icon}
    </Flex>
  );
}

export default function ResetPassword() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm<ResetPasswordForm>();
  const { colors, isDark } = useTheme();
  const resetMutation = useResetPasswordMutation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const primaryBtn: React.CSSProperties = {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
  };

  const handleSubmit = (values: ResetPasswordForm) => {
    setError("");
    resetMutation.mutate(
      { token, password: values.password },
      {
        onSuccess: () => setDone(true),
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

  if (!token) {
    return (
      <>
        <Flex
          vertical
          align="center"
          gap={16}
          style={{ width: "100%", textAlign: "center", padding: "8px 0" }}
        >
          <IconBadge
            bg="rgba(229,9,20,0.12)"
            icon={
              <CloseCircleFilled
                style={{ fontSize: 38, color: colors.accent }}
              />
            }
          />
          <Flex vertical gap={6} align="center">
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Invalid reset link
            </Title>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              This link is missing a reset token. Please request a new one.
            </Text>
          </Flex>
          <Link to="/forgot-password">
            <Button
              type="primary"
              size="large"
              style={{ ...primaryBtn, paddingInline: 32 }}
            >
              Request new link
            </Button>
          </Link>
        </Flex>
      </>
    );
  }

  if (done) {
    return (
      <>
        <Flex
          vertical
          align="center"
          gap={16}
          style={{ width: "100%", textAlign: "center", padding: "8px 0" }}
        >
          <IconBadge
            bg="rgba(82,196,26,0.12)"
            icon={
              <CheckCircleFilled style={{ fontSize: 38, color: "#52c41a" }} />
            }
          />
          <Flex vertical gap={6} align="center">
            <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
              Password updated
            </Title>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              Your password has been changed. You can now sign in with your new
              credentials.
            </Text>
          </Flex>
          <Link to="/login">
            <Button
              type="primary"
              size="large"
              style={{ ...primaryBtn, paddingInline: 40 }}
            >
              Sign in
            </Button>
          </Link>
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
          Set new password
        </Title>
        <Text
          style={{ color: colors.textMuted, textAlign: "center", fontSize: 14 }}
        >
          Choose a strong password — at least 7 characters.
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
          backgroundColor: isDark ? "rgba(255,255,255,0.04)" : colors.bgCard,
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
            name="password"
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 7, message: "Password must be at least 7 characters" },
            ]}
            style={{ marginBottom: 14 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textMuted }} />}
              placeholder="New password"
              size="large"
              style={{ borderRadius: 10 }}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value)
                    return Promise.resolve();
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            style={{ marginBottom: 20 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textMuted }} />}
              placeholder="Confirm new password"
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
              loading={resetMutation.isPending}
              style={primaryBtn}
            >
              Update password
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <BackToSignIn color={colors.accent} />
    </>
  );
}
