import { Layout, Space, Button, Input, Avatar, Dropdown, Badge, Typography, Tooltip } from 'antd';
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
} from '@ant-design/icons';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useTheme } from '../../../context/ThemeContext';

const { Header } = Layout;
const { Text } = Typography;

interface NavProps {
  onMenuOpen: () => void;
}

export default function Nav({ onMenuOpen }: NavProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggle, colors } = useTheme();

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <Text>Lorem Ipsum</Text>,
      icon: <UserOutlined />,
    },
    {
      key: 'watchlist',
      label: <Text>My Watchlist</Text>,
    },
    { type: 'divider' },
    {
      key: 'logout',
      label: <Text style={{ color: '#e50914' }}>Sign Out</Text>,
      icon: <LoginOutlined style={{ color: '#e50914' }} />,
    },
  ];

  const navLinks = [
    { path: '/', label: 'Home', icon: <HomeOutlined /> },
    { path: '/browse', label: 'Browse', icon: <AppstoreOutlined /> },
  ];

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: colors.bgNav,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${colors.borderSubtle}`,
        padding: '0 clamp(16px, 4vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        boxShadow: isDark
          ? 'none'
          : '0 1px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Left — hamburger + logo + nav links */}
      <Space size={24} align="center">
        {/* Mobile hamburger */}
        <Button
          type="text"
          icon={
            <MenuOutlined
              style={{ color: colors.textPrimary, fontSize: 18 }}
            />
          }
          onClick={onMenuOpen}
          style={{ display: 'none' }}
          className="nav-hamburger"
        />

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Space align="center" size={6}>
            <PlayCircleFilled style={{ fontSize: 28, color: '#e50914' }} />
            <span
              style={{
                color: colors.textPrimary,
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              Lorem<span style={{ color: '#e50914' }}>Flix</span>
            </span>
          </Space>
        </Link>

        {/* Desktop nav links */}
        <Space size={4} className="nav-links">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
                <Button
                  type="text"
                  icon={link.icon}
                  style={{
                    color: active ? colors.textPrimary : colors.textMuted,
                    fontWeight: active ? 600 : 400,
                    borderBottom: active
                      ? '2px solid #e50914'
                      : '2px solid transparent',
                    borderRadius: 0,
                    height: 64,
                    paddingInline: 12,
                  }}
                >
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </Space>
      </Space>

      {/* Right — search + theme toggle + notifications + user */}
      <Space size={4} align="center">
        {searchOpen ? (
          <Input
            autoFocus
            placeholder="Search movies..."
            prefix={<SearchOutlined style={{ color: colors.textMuted }} />}
            onBlur={() => setSearchOpen(false)}
            style={{
              background: colors.bgCard,
              borderColor: colors.border,
              color: colors.textPrimary,
              borderRadius: 20,
              width: 'clamp(160px, 20vw, 240px)',
            }}
            allowClear
          />
        ) : (
          <Button
            type="text"
            icon={
              <SearchOutlined
                style={{ color: colors.textMuted, fontSize: 18 }}
              />
            }
            onClick={() => setSearchOpen(true)}
          />
        )}

        {/* ── Theme toggle ── */}
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          <Button
            type="text"
            onClick={toggle}
            icon={
              isDark ? (
                <SunOutlined
                  style={{
                    fontSize: 18,
                    color: '#fadb14',
                    transition: 'transform 0.3s ease',
                  }}
                />
              ) : (
                <MoonOutlined
                  style={{
                    fontSize: 18,
                    color: '#6366f1',
                    transition: 'transform 0.3s ease',
                  }}
                />
              )
            }
            style={{
              background: isDark
                ? 'rgba(250,219,20,0.08)'
                : 'rgba(99,102,241,0.08)',
              borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(250,219,20,0.2)' : 'rgba(99,102,241,0.2)'}`,
            }}
          />
        </Tooltip>

        <Badge count={3} size="small" color="#e50914">
          <Button
            type="text"
            icon={
              <BellOutlined
                style={{ color: colors.textMuted, fontSize: 18 }}
              />
            }
          />
        </Badge>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
        >
          <Avatar
            style={{ background: '#e50914', cursor: 'pointer', flexShrink: 0 }}
            icon={<UserOutlined />}
            size={34}
          />
        </Dropdown>
      </Space>
    </Header>
  );
}
