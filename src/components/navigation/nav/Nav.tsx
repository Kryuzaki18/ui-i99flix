import {
  Layout,
  Space,
  Button,
  Avatar,
  Dropdown,
  Typography,
  Tooltip,
  Flex,
} from "antd";
import {
  UserOutlined,
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  LoginOutlined,
  SunOutlined,
  MoonOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { useTheme } from "../../../context/ThemeContext";
import { useSignoutMutation } from "../../../api/useAuthQuery";
import { useAuthStore } from "../../../store/authStore";
import "./Nav.css";

const { Header } = Layout;
const { Text } = Typography;

interface NavProps {
  onMenuOpen: () => void;
}

const NAV_LINKS = [
  { path: "/", label: "Home", icon: <HomeOutlined aria-hidden="true" /> },
  {
    path: "/browse",
    label: "Browse",
    icon: <AppstoreOutlined aria-hidden="true" />,
  },
] as const;

function NavInner({ onMenuOpen }: NavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle, colors } = useTheme();
  const signoutMutation = useSignoutMutation();
  const { user } = useAuthStore();

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : undefined;

  const handleSignout = () => {
    signoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: <Text>My Profile</Text>, icon: <UserOutlined />, onClick: () => navigate("/profile") },
    {
      key: "watchlist",
      label: <Text>My Watchlist</Text>,
      icon: <HeartOutlined />,
      onClick: () => navigate("/watchlist"),
    },
    { type: "divider" },
    {
      key: "logout",
      label: <Text style={{ color: colors.accent }}>Sign Out</Text>,
      icon: <LoginOutlined style={{ color: colors.accent }} />,
      onClick: handleSignout,
    },
  ];

  return (
    <Header
      className="nav-header"
      role="banner"
      style={{
        background: colors.bgNav,
        borderBottom: `1px solid ${colors.borderSubtle}`,
        boxShadow: isDark ? "none" : "0 1px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Flex align="center" justify="space-between" style={{ height: "100%" }}>
      <Space size={24} align="center">
        <Button
          type="text"
          icon={
            <MenuOutlined
              style={{ color: colors.textPrimary, fontSize: 18 }}
              aria-hidden="true"
            />
          }
          onClick={onMenuOpen}
          className="nav-hamburger"
          aria-label="Open navigation menu"
          aria-haspopup="true"
        />

        <Link to="/" aria-label="i99flix home">
          <img src="/i99flix-logo.png" alt="i99flix logo" width={100} style={{ display: "block" }} />
        </Link>

        <nav aria-label="Main navigation">
          <Space size={4} className="nav-links">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    type="text"
                    icon={link.icon}
                    className={`nav-link-btn ${active ? "nav-link-btn--active" : "nav-link-btn--inactive"}`}
                    style={{
                      color: active ? colors.textPrimary : colors.textMuted,
                    }}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </Space>
        </nav>
      </Space>

      <Space size={10} align="center">
        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <Button
            type="text"
            onClick={toggle}
            className="nav-theme-toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            icon={
              isDark ? (
                <SunOutlined
                  style={{ fontSize: 18, color: colors.starRating }}
                  aria-hidden="true"
                />
              ) : (
                <MoonOutlined
                  style={{ fontSize: 18, color: colors.accent }}
                  aria-hidden="true"
                />
              )
            }
          />
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            className="nav-avatar"
            src={user?.avatarUrl}
            icon={!user?.avatarUrl && !initials ? <UserOutlined aria-hidden="true" /> : undefined}
            size={34}
            aria-label="User menu"
            aria-haspopup="true"
            style={{ cursor: "pointer" }}
          >
            {!user?.avatarUrl && initials}
          </Avatar>
        </Dropdown>
      </Space>
      </Flex>
    </Header>
  );
}

export default memo(NavInner);
