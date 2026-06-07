import { Suspense } from "react";
import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import AuthShowcase from "./AuthShowcase";
import { Button, Flex } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
import "./auth.css";

const FOOTER_LINKS = [
  { label: "About", to: "/about" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms of Service", to: "/terms-of-service" },
];

export default function AuthLayout() {
  const { colors, isDark, toggle } = useTheme();

  return (
    <Flex className="auth-layout" style={{ backgroundColor: colors.bgBase }}>
      <AuthShowcase />

      <Flex
        vertical
        align="center"
        justify="space-between"
        className="auth-panel"
        style={{ flexShrink: 0 }}
      >
        <Button
          type="text"
          onClick={toggle}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="auth-panel__theme-toggle"
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

        <Flex
          className="auth-panel__inner"
          justify="center"
          align="center"
          vertical
          flex={1}
        >
          <img
            src="/i99flix-logo.png"
            alt="i99flix logo"
            width={150}
            style={{ marginBottom: 8 }}
          />

          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </Flex>

        <footer className="auth-panel__footer">
          <Flex
            justify="center"
            wrap="wrap"
            gap="6px 20px"
            className="auth-panel__footer-links"
          >
            {FOOTER_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                style={{ color: colors.textMuted }}
                className="auth-panel__footer-link"
              >
                {label}
              </Link>
            ))}
          </Flex>
          <p
            className="auth-panel__footer-copy"
            style={{ color: colors.textMuted }}
          >
            © 2026 i99flix
          </p>
        </footer>
      </Flex>
    </Flex>
  );
}
