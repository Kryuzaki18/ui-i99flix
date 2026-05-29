import { useState } from "react";
import { Typography, Segmented, Space, Flex } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useTheme } from "../../context/ThemeContext";

const { Title, Text } = Typography;

const TEMPLATES = [
  { key: "welcome", label: "Welcome" },
  { key: "verify-email", label: "Verify Email" },
  { key: "reset-password", label: "Reset Password" },
  { key: "password-changed", label: "Password Changed" },
] as const;

type TemplateKey = (typeof TEMPLATES)[number]["key"];

export default function EmailPreview() {
  const { colors } = useTheme();
  const [active, setActive] = useState<TemplateKey>("welcome");

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: colors.bgBase,
        padding: "32px 48px",
      }}
    >
      <Flex vertical justify="center" align="center" gap={10} style={{ marginBottom: 24 }}>
        <Space orientation="vertical" size={4}>
          <Space align="center" size={10}>
            <MailOutlined style={{ fontSize: 22, color: colors.accent }} />
            <Title level={3} style={{ margin: 0 }}>
              Email Template Preview
            </Title>
          </Space>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>
            Rendered with sample data — dev only
          </Text>
        </Space>

        <Segmented
          value={active}
          onChange={(v) => setActive(v as TemplateKey)}
          options={TEMPLATES.map((t) => ({ value: t.key, label: t.label }))}
        />
      </Flex>

      <div
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          overflow: "hidden",
          background: "#07070f",
        }}
      >
        <iframe
          key={active}
          src={`/dev/email-preview/${active}`}
          title={`Email preview: ${active}`}
          style={{
            width: "100%",
            height: "calc(100dvh - 200px)",
            minHeight: 600,
            border: "none",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
