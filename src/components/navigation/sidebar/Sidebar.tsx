import { Drawer, Menu, Space, Typography, Avatar, Divider } from 'antd';
import {
  HomeOutlined, AppstoreOutlined, HeartOutlined, HistoryOutlined,
  SettingOutlined, LoginOutlined, UserOutlined,
  StarOutlined, FireOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { useTheme } from '../../../context/ThemeContext';
import { useSignoutMutation } from '../../../api/useAuthQuery';
import './Sidebar.css';

const { Text } = Typography;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location              = useLocation();
  const navigate              = useNavigate();
  const { colors, isDark }    = useTheme();
  const signoutMutation       = useSignoutMutation();

  const handleSignout = () => {
    signoutMutation.mutate(undefined, {
      onSuccess: () => { onClose(); navigate('/login'); },
    });
  };

  const menuItems: MenuProps['items'] = [
    { key: '/',         icon: <HomeOutlined />,      label: 'Home' },
    { key: '/browse',   icon: <AppstoreOutlined />,  label: 'Browse' },
    { type: 'divider' },
    { key: 'trending',  icon: <FireOutlined />,      label: 'Trending' },
    { key: 'top-rated', icon: <StarOutlined />,      label: 'Top Rated' },
    { key: 'watchlist', icon: <HeartOutlined />,     label: 'My Watchlist' },
    { key: 'history',   icon: <HistoryOutlined />,   label: 'Watch History' },
    { type: 'divider' },
    { key: 'settings',  icon: <SettingOutlined />,   label: 'Settings' },
    { key: 'signout',   icon: <LoginOutlined />,     label: 'Sign Out', danger: true },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'signout') { handleSignout(); return; }
    if (key.startsWith('/')) { navigate(key); onClose(); }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="left"
      styles={{
        section: { width: 260 },
        body:    { background: colors.bgBase, padding: 0 },
        header:  { display: 'none' },
        mask:    { backdropFilter: 'blur(4px)' },
      }}
    >
      <div
        className="sidebar__header"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <Space align="center" size={10}>
          <Avatar className="sidebar__avatar" icon={<UserOutlined />} size={40} />
          <div>
            <Text strong className="sidebar__user-name">Lorem Ipsum</Text>
            <Text className="sidebar__user-email" style={{ color: colors.textMuted }}>
              lorem@ipsum.com
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
        theme={isDark ? 'dark' : 'light'}
      />

      <div
        className="sidebar__footer"
        style={{ borderTop: `1px solid ${colors.border}` }}
      >
        <Divider className="sidebar__footer-divider" />
        <Text className="sidebar__footer-text" style={{ color: colors.textMuted }}>
          © 2026 i99flix. All rights reserved.
        </Text>
      </div>
    </Drawer>
  );
}
