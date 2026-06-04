import { Drawer, Menu, Space, Typography, Avatar, Divider } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  HeartOutlined,
  LoginOutlined,
  UserOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { useTheme } from "../../../context/ThemeContext";
import { useSignoutMutation } from "../../../api/useAuthQuery";
import { useAuthStore } from "../../../store/authStore";
import "./Sidebar.css";

const { Text } = Typography;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();
  const signoutMutation = useSignoutMutation();
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : undefined;

  const handleSignout = () => {
    signoutMutation.mutate(undefined, {
      onSuccess: () => {
        onClose();
        navigate("/login");
      },
    });
  };

  const menuItems: MenuProps["items"] = [
    { key: "/", icon: <HomeOutlined />, label: "Home" },
    { key: "/browse", icon: <AppstoreOutlined />, label: "Browse" },
    { type: "divider" },
    { key: "trending", icon: <FireOutlined />, label: "Trending" },
    {
      key: "new-releases",
      icon: <ThunderboltOutlined />,
      label: "New Releases",
    },
    { key: "top-rated", icon: <StarOutlined />, label: "Top Rated" },
    { key: "/watchlist", icon: <HeartOutlined />, label: "My Watchlist" },
    { key: "/profile",   icon: <UserOutlined />,  label: "My Profile" },
    { type: "divider" },
    {
      key: "signout",
      icon: <LoginOutlined />,
      label: "Sign Out",
      danger: true,
    },
  ];

  const SECTION_KEYS = ["trending", "new-releases", "top-rated"];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 70;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "signout") {
      handleSignout();
      return;
    }
    if (SECTION_KEYS.includes(key)) {
      onClose();
      if (location.pathname === "/") {
        scrollToSection(key);
      } else {
        navigate("/", { state: { scrollTo: key } });
      }
      return;
    }
    if (key.startsWith("/")) {
      navigate(key);
      onClose();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="left"
      size={260}
      mask={{ blur: true }}
      closable={false}
      styles={{
        body: { background: colors.bgBase, padding: 0 },
      }}
    >
      <div
        className="sidebar__header"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <Space align="center" size={10}>
          <Avatar
            className="sidebar__avatar"
            src={user?.avatarUrl}
            icon={!user?.avatarUrl && !initials ? <UserOutlined /> : undefined}
            size={40}
            style={{ flexShrink: 0 }}
          >
            {!user?.avatarUrl && initials}
          </Avatar>
          <div>
            <Text strong className="sidebar__user-name">
              {user?.name ?? "—"}
            </Text>
            <Text
              className="sidebar__user-email"
              style={{ color: colors.textMuted }}
            >
              {user?.email ?? "—"}
            </Text>
          </div>
        </Space>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="sidebar__menu"
        theme={isDark ? "dark" : "light"}
      />

      <div className="sidebar__footer">
        <Divider className="sidebar__footer-divider" />
        <Text
          className="sidebar__footer-text"
          style={{ color: colors.textMuted }}
        >
          © 2026 i99flix. All rights reserved.
        </Text>
      </div>
    </Drawer>
  );
}
