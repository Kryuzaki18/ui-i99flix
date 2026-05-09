import { Drawer, Menu, Space, Typography, Avatar, Divider } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  HeartOutlined,
  HistoryOutlined,
  SettingOutlined,
  LoginOutlined,
  PlayCircleFilled,
  UserOutlined,
  StarOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useTheme } from '../../../context/ThemeContext';

const { Text } = Typography;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();

  const menuItems: MenuProps['items'] = [
    { key: '/',       icon: <HomeOutlined />,      label: 'Home' },
    { key: '/browse', icon: <AppstoreOutlined />,  label: 'Browse' },
    { type: 'divider' },
    { key: 'trending',  icon: <FireOutlined />,    label: 'Trending' },
    { key: 'top-rated', icon: <StarOutlined />,    label: 'Top Rated' },
    { key: 'watchlist', icon: <HeartOutlined />,   label: 'My Watchlist' },
    { key: 'history',   icon: <HistoryOutlined />, label: 'Watch History' },
    { type: 'divider' },
    { key: 'settings', icon: <SettingOutlined />,  label: 'Settings' },
    {
      key: '/login',
      icon: <LoginOutlined />,
      label: 'Sign In',
      danger: true,
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('/')) {
      navigate(key);
      onClose();
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="left"
      width={260}
      styles={{
        body: { background: colors.bgBase, padding: 0 },
        header: { display: 'none' },
        mask: { backdropFilter: 'blur(4px)' },
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Space align="center" size={8} style={{ marginBottom: 16 }}>
          <PlayCircleFilled style={{ fontSize: 26, color: '#e50914' }} />
          <Text strong style={{ fontSize: 18, letterSpacing: -0.5 }}>
            Lorem<span style={{ color: '#e50914' }}>Flix</span>
          </Text>
        </Space>

        {/* User info */}
        <Space align="center" size={10}>
          <Avatar
            style={{ background: '#e50914', flexShrink: 0 }}
            icon={<UserOutlined />}
            size={40}
          />
          <div>
            <Text strong style={{ display: 'block', fontSize: 14 }}>
              Lorem Ipsum
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              lorem@ipsum.com
            </Text>
          </div>
        </Space>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ background: 'transparent', border: 'none', padding: '8px 0' }}
        theme={isDark ? 'dark' : 'light'}
      />

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px',
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <Divider style={{ margin: '0 0 12px' }} />
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>
          © 2024 LoremFlix. All rights reserved.
        </Text>
        <br />
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>
          Lorem ipsum dolor sit amet.
        </Text>
      </div>
    </Drawer>
  );
}
