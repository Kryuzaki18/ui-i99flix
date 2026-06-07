import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Alert,
  Tooltip,
  Flex,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useSigninMutation } from "../../../api/auth/useAuthQuery";
import { ApiError } from "../../../services/apiService";
import SocialLoginButtons from "../../../components/auth/SocialLoginButtons";

const { Title, Text } = Typography;

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [error, setError] = useState("");
  const [socialBusy, setSocialBusy] = useState(false);
  const [form] = Form.useForm<LoginForm>();
  const rememberMe = Form.useWatch("remember", form) as boolean;
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();
  const signinMutation = useSigninMutation();

  const isBusy = signinMutation.isPending || socialBusy;

  const handleSubmit = (values: LoginForm) => {
    setError("");
    signinMutation.mutate(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.remember,
      },
      {
        onSuccess: () => navigate("/"),
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
          Welcome back
        </Title>
        <Text
          style={{ color: colors.textMuted, textAlign: "center", fontSize: 14 }}
        >
          Sign in to continue watching
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
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
            style={{ marginBottom: 14 }}
          >
            <Input
              prefix={<MailOutlined style={{ color: colors.textMuted }} />}
              placeholder="Email address"
              size="large"
              style={{ borderRadius: 10 }}
              autoComplete="new-password"
              disabled={isBusy}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 7, message: "Password must be at least 7 characters" },
            ]}
            style={{ marginBottom: 18 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textMuted }} />}
              placeholder="Password"
              size="large"
              style={{ borderRadius: 10 }}
              autoComplete="new-password"
              disabled={isBusy}
            />
          </Form.Item>

          <Flex
            align="center"
            justify="space-between"
            style={{ marginBottom: 22 }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox disabled={isBusy}>
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                  Remember me
                </Text>
                <Tooltip
                  title="Keeps you signed in for 30 days."
                  placement="right"
                >
                  <InfoCircleOutlined
                    style={{
                      marginLeft: 5,
                      color: colors.textMuted,
                      fontSize: 12,
                    }}
                  />
                </Tooltip>
              </Checkbox>
            </Form.Item>
            <Link
              to="/forgot-password"
              style={{ color: colors.accent, fontSize: 13, fontWeight: 500 }}
            >
              Forgot password?
            </Link>
          </Flex>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={signinMutation.isPending}
              disabled={isBusy}
              icon={
                !signinMutation.isPending ? <ArrowRightOutlined /> : undefined
              }
              iconPlacement="end"
              style={{
                backgroundColor: colors.accent,
                borderColor: colors.accent,
                height: 50,
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <SocialLoginButtons
        mode="signin"
        rememberMe={rememberMe ?? true}
        onLoadingChange={setSocialBusy}
      />

      <Flex justify="center" style={{ marginTop: 20 }}>
        <Text style={{ color: colors.textMuted, fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: colors.accent, fontWeight: 700 }}>
            Sign up free
          </Link>
        </Text>
      </Flex>
    </>
  );
}
