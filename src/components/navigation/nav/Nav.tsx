import {
  Layout,
  Space,
  Button,
  Input,
  Avatar,
  Dropdown,
  Badge,
  Typography,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  PlayCircleFilled,
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  LoginOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useState, memo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { useTheme } from "../../../context/ThemeContext";
import { useSignoutMutation } from "../../../api/useAuthQuery";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggle, colors } = useTheme();
  const signoutMutation = useSignoutMutation();

  const handleSignout = () => {
    signoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: <Text>My Profile</Text>, icon: <UserOutlined /> },
    { key: "watchlist", label: <Text>My Watchlist</Text> },
    { type: "divider" },
    {
      key: "logout",
      label: <Text style={{ color: "#e50914" }}>Sign Out</Text>,
      icon: <LoginOutlined style={{ color: "#e50914" }} />,
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
      {/* Left */}
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

        <Link to="/" className="nav-logo" aria-label="i99flix home">
          <img
            src="/i99flix-logo.png"
            alt="i99flix logo"
            width={100}
          />
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

      {/* Right */}
      <Space size={4} align="center">
        {searchOpen ? (
          <Input
            autoFocus
            placeholder="Search movies..."
            prefix={
              <SearchOutlined
                style={{ color: colors.textMuted }}
                aria-hidden="true"
              />
            }
            onBlur={() => setSearchOpen(false)}
            className="nav-search-input"
            style={{
              background: colors.bgCard,
              borderColor: colors.border,
              color: colors.textPrimary,
            }}
            allowClear
            aria-label="Search movies"
          />
        ) : (
          <Button
            type="text"
            icon={
              <SearchOutlined
                style={{ color: colors.textMuted, fontSize: 18 }}
                aria-hidden="true"
              />
            }
            onClick={() => setSearchOpen(true)}
            aria-label="Open search"
          />
        )}

        <Tooltip
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <Button
            type="text"
            onClick={toggle}
            className={`nav-theme-toggle ${isDark ? "nav-theme-toggle--dark" : "nav-theme-toggle--light"}`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            icon={
              isDark ? (
                <SunOutlined
                  style={{ fontSize: 18, color: "#fadb14" }}
                  aria-hidden="true"
                />
              ) : (
                <MoonOutlined
                  style={{ fontSize: 18, color: "#6366f1" }}
                  aria-hidden="true"
                />
              )
            }
          />
        </Tooltip>

        <Badge count={3} size="small" color="#e50914">
          <Button
            type="text"
            icon={
              <BellOutlined
                style={{ color: colors.textMuted, fontSize: 18 }}
                aria-hidden="true"
              />
            }
            aria-label="Notifications (3 unread)"
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar
            className="nav-avatar"
            icon={<UserOutlined aria-hidden="true" />}
            size={34}
            aria-label="User menu"
            aria-haspopup="true"
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      </Space>
    </Header>
  );
}

export default memo(NavInner);
