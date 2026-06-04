import { Link, useSearchParams } from "react-router-dom";
import { Button, Typography, Spin, Flex } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ArrowLeftOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../context/ThemeContext";
import { useVerifyEmailQuery } from "../../../api/useAuthQuery";
import { ApiError } from "../../../services/apiService";

const { Title, Text } = Typography;

function IconBadge({ icon, bg }: { icon: React.ReactNode; bg: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{ width: 80, height: 80, borderRadius: "50%", background: bg }}
    >
      {icon}
    </Flex>
  );
}

export default function VerifyEmail() {
  const { colors } = useTheme();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { isPending, isSuccess, error } = useVerifyEmailQuery(token);

  const primaryBtn: React.CSSProperties = {
    background: colors.accent,
    borderColor: colors.accent,
    height: 50,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
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
              Invalid verification link
            </Title>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              This link is missing a verification token. Please use the link
              from your email.
            </Text>
          </Flex>
          <Link to="/login">
            <Button
              type="primary"
              size="large"
              style={{ ...primaryBtn, paddingInline: 32 }}
            >
              <ArrowLeftOutlined /> Back to sign in
            </Button>
          </Link>
        </Flex>
      </>
    );
  }

  if (isPending) {
    return (
      <>
        <Flex
          vertical
          align="center"
          justify="center"
          gap={20}
          style={{ padding: "40px 0" }}
        >
          <Flex
            align="center"
            justify="center"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(229,9,20,0.08)",
            }}
          >
            <MailOutlined style={{ fontSize: 36, color: colors.accent }} />
          </Flex>
          <Spin size="large" />
          <Flex vertical align="center" gap={4}>
            <Title level={4} style={{ color: colors.textPrimary, margin: 0 }}>
              Verifying your email…
            </Title>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              Just a moment, please.
            </Text>
          </Flex>
        </Flex>
      </>
    );
  }

  if (isSuccess) {
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
              Email verified
            </Title>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>
              Your account is now active. Sign in to start watching.
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

  const errorMsg =
    error instanceof ApiError
      ? error.message
      : "Something went wrong. Please try again.";

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
            <CloseCircleFilled style={{ fontSize: 38, color: colors.accent }} />
          }
        />
        <Flex vertical gap={6} align="center">
          <Title level={3} style={{ color: colors.textPrimary, margin: 0 }}>
            Verification failed
          </Title>
          <Text style={{ color: colors.textMuted, fontSize: 14 }}>
            {errorMsg}
          </Text>
        </Flex>
        <Link to="/login">
          <Button
            type="primary"
            size="large"
            style={{ ...primaryBtn, paddingInline: 32 }}
          >
            <ArrowLeftOutlined /> Back to sign in
          </Button>
        </Link>
      </Flex>
    </>
  );
}
