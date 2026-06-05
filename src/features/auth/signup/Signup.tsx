import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Steps,
  Alert,
  Flex,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  CheckCircleFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useSignupMutation } from "../../../api/auth/useAuthQuery";
import { ApiError } from "../../../services/apiService";
import SocialLoginButtons from "../../../components/auth/SocialLoginButtons";

const { Title, Text } = Typography;

function SignupSuccess({ onSignIn }: { onSignIn: () => void }) {
  const { colors } = useTheme();
  const primaryBtn: React.CSSProperties = {
    background: colors.accent,
    borderColor: colors.accent,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
  };
  return (
    <Flex vertical align="center" gap={16} style={{ width: "100%", textAlign: "center", padding: "8px 0" }}>
      <Flex
        align="center"
        justify="center"
        style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(82,196,26,0.12)" }}
      >
        <CheckCircleFilled style={{ fontSize: 38, color: "#52c41a" }} />
      </Flex>
      <Flex vertical gap={6} align="center">
        <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
          Welcome to i99flix!
        </Title>
        <Text style={{ color: colors.textMuted, fontSize: 14 }}>
          Your account is ready. Sign in to start watching.
        </Text>
      </Flex>
      <Button type="primary" size="large" style={{ ...primaryBtn, paddingInline: 40 }} onClick={onSignIn}>
        Sign In
      </Button>
    </Flex>
  );
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}

export default function Signup() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm<SignupForm>();
  const { colors, isDark } = useTheme();
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const primaryBtn: React.CSSProperties = {
    background: colors.accent,
    borderColor: colors.accent,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
  };

  const handleNext = async () => {
    try {
      if (step === 0) await form.validateFields(["name", "email"]);
      else if (step === 1) await form.validateFields(["password", "confirm"]);
      setStep((s) => s + 1);
    } catch {
      /* validation shows inline errors */
    }
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue(true) as SignupForm;
    setError("");
    signupMutation.mutate(
      { name: values.name, email: values.email, password: values.password },
      {
        onSuccess: () => setDone(true),
        onError: (err) => {
          if (err instanceof ApiError && err.statusCode === 409) {
            setError("An account with this email already exists.");
            setStep(0);
          } else {
            setError(
              err instanceof ApiError
                ? err.message
                : "Something went wrong. Please try again.",
            );
          }
        },
      },
    );
  };

  if (done) {
    return <SignupSuccess onSignIn={() => navigate("/login")} />;
  }

  return (
    <>
      <Flex
        vertical
        align="center"
        gap={6}
        style={{ width: "100%", marginBottom: 24 }}
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
          Create account
        </Title>
        <Text
          style={{ color: colors.textMuted, textAlign: "center", fontSize: 14 }}
        >
          Start watching in minutes
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

      <Steps
        current={step}
        size="small"
        style={{ marginBottom: 20, width: "100%" }}
        items={[
          { title: <Text style={{ fontSize: 12 }}>Account</Text> },
          { title: <Text style={{ fontSize: 12 }}>Security</Text> },
        ]}
      />

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
        <Form form={form} layout="vertical" autoComplete="off">
          {step === 0 && (
            <>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please enter your name" },
                  { min: 4, message: "Name must be at least 4 characters" },
                  { max: 50, message: "Name must be at most 50 characters" },
                ]}
                style={{ marginBottom: 14 }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: colors.textMuted }} />}
                  placeholder="Full name"
                  size="large"
                  style={{ borderRadius: 10 }}
                  autoComplete="new-password"
                  disabled={signupMutation.isPending}
                />
              </Form.Item>

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
                  disabled={signupMutation.isPending}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleNext}
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  style={primaryBtn}
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
                  { required: true, message: "Please enter a password" },
                  { min: 7, message: "Password must be at least 7 characters" },
                ]}
                style={{ marginBottom: 14 }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: colors.textMuted }} />}
                  placeholder="Password"
                  size="large"
                  style={{ borderRadius: 10 }}
                  autoComplete="new-password"
                  disabled={signupMutation.isPending}
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
                      return Promise.reject(
                        new Error("Passwords do not match"),
                      );
                    },
                  }),
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: colors.textMuted }} />}
                  placeholder="Confirm password"
                  size="large"
                  style={{ borderRadius: 10 }}
                  autoComplete="new-password"
                  disabled={signupMutation.isPending}
                />
              </Form.Item>

              <Flex gap={12} style={{ width: "100%" }}>
                <Button
                  size="large"
                  onClick={() => setStep(0)}
                  icon={<ArrowLeftOutlined />}
                  style={{ height: 50, borderRadius: 10, flex: "0 0 auto" }}
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  loading={signupMutation.isPending}
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  style={{ ...primaryBtn, flex: 1 }}
                >
                  Create account
                </Button>
              </Flex>
            </>
          )}
        </Form>
      </Card>

      {step === 0 && <SocialLoginButtons mode="signup" />}

      <Flex justify="center" style={{ marginTop: 20 }}>
        <Text style={{ color: colors.textMuted, fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: colors.accent, fontWeight: 700 }}>
            Sign in
          </Link>
        </Text>
      </Flex>
    </>
  );
}
