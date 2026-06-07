import { useState } from "react";
import {
  Typography,
  Menu,
  Flex,
  Row,
  Col,
  Avatar,
  Space,
} from "antd";
import {
  LockOutlined,
  WarningOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import SecurityPanel from "./SecurityPanel";
import DangerPanel from "./DangerPanel";
import "./Profile.css";

const { Title, Text } = Typography;

type ProfileSection = "security" | "danger";

const MENU_ITEMS: MenuProps["items"] = [
  { key: "security", icon: <LockOutlined />, label: "Security" },
  { key: "danger",   icon: <WarningOutlined />, label: "Danger Zone", danger: true },
];

export default function Profile() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const [section, setSection] = useState<ProfileSection>("security");

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : undefined;

  return (
    <div className="profile">
      <Flex
        align="center"
        gap={20}
        wrap="wrap"
        className="profile__hero"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <Avatar
          src={user?.avatarUrl}
          icon={!user?.avatarUrl && !initials ? <UserOutlined /> : undefined}
          size={64}
          className="profile__avatar"
          style={{ flexShrink: 0 }}
        >
          {!user?.avatarUrl && initials}
        </Avatar>
        <Space orientation="vertical" size={2}>
          <Title level={3} style={{ margin: 0 }}>{user?.name ?? "—"}</Title>
          <Text style={{ color: colors.textMuted }}>{user?.email ?? "—"}</Text>
        </Space>
      </Flex>

      <Row className="profile__body" gutter={[0, 24]}>
        <Col xs={24} sm={7} md={6} className="profile__sidebar">
          <Menu
            mode="inline"
            selectedKeys={[section]}
            items={MENU_ITEMS}
            onClick={({ key }) => setSection(key as ProfileSection)}
            className="profile__menu"
            style={{ backgroundColor: "transparent", border: "none" }}
          />
        </Col>

        <Col xs={24} sm={17} md={18} className="profile__content">
          {section === "security" ? <SecurityPanel /> : <DangerPanel />}
        </Col>
      </Row>
    </div>
  );
}
