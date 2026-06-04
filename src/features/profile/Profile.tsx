import { useState } from "react";
import {
  Typography,
  Menu,
  Form,
  Input,
  Button,
  Alert,
  Divider,
  Flex,
  Row,
  Col,
  Avatar,
  Space,
  Tooltip,
  Tag,
} from "antd";
import {
  LockOutlined,
  WarningOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CopyOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";

import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useForgotPasswordMutation,
} from "../../api/useAuthQuery";
import { ApiError } from "../../services/apiService";
import messageService from "../../services/messageService";
import "./Profile.css";

const { Title, Text, Paragraph } = Typography;

type ProfileSection = "security" | "danger";

interface ChangePasswordForm {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}


const DELETE_PHRASE = "delete my account";

export default function Profile() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isSocial = (user?.social?.length ?? 0) > 0;
  const hasPassword = user?.hasPassword ?? true;
  const settingFirstPassword = isSocial && !hasPassword;

  const [section, setSection] = useState<ProfileSection>("security");
  const [changeError, setChangeError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteInput, setDeleteInput]       = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const [changeForm] = Form.useForm<ChangePasswordForm>();

  const changeMutation = useChangePasswordMutation();
  const deleteMutation = useDeleteAccountMutation();
  const forgotMutation = useForgotPasswordMutation();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : undefined;

  const menuItems: MenuProps["items"] = [
    { key: "security", icon: <LockOutlined />, label: "Security" },
    {
      key: "danger",
      icon: <WarningOutlined />,
      label: "Danger Zone",
      danger: true,
    },
  ];

  const handleChangePassword = (values: ChangePasswordForm) => {
    setChangeError("");
    changeMutation.mutate(
      {
        oldPassword: settingFirstPassword ? undefined : values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          messageService.success(settingFirstPassword ? "Password set successfully." : "Password updated successfully.");
          changeForm.resetFields();
        },
        onError: (err) => {
          setChangeError(
            err instanceof ApiError
              ? err.message
              : "Failed to update password. Please try again.",
          );
        },
      },
    );
  };

  const handleDeleteAccount = () => {
    setDeleteError("");
    deleteMutation.mutate(hasPassword ? deletePassword : "", {
      onSuccess: () => {
        messageService.success("Your account has been deleted.");
        navigate("/login");
      },
      onError: (err) => {
        setDeleteError(
          err instanceof ApiError
            ? err.message
            : "Failed to delete account. Please try again.",
        );
      },
    });
  };

  const isDeleteConfirmed = deleteInput.toLowerCase() === DELETE_PHRASE;

  const securityPanel = (
    <div className="profile__panel">
      <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
        {settingFirstPassword ? "Set Password" : "Change Password"}
      </Title>
      <Text
        style={{ color: colors.textMuted, display: "block", marginBottom: 16 }}
      >
        {settingFirstPassword
          ? "Set a password to sign in with your email and password in addition to your social account."
          : "Update your password to keep your account secure."}
      </Text>

      {isSocial && (
        <Flex align="center" gap={8} style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Connected via:</Text>
          {user!.social.map((p) => (
            <Tag
              key={p}
              icon={p === "google" ? <GoogleOutlined /> : <img src="/x-icon.svg" width={11} height={11} style={{ marginRight: 4, verticalAlign: "middle" }} />}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              {p === "google" ? "Google" : "X"}
            </Tag>
          ))}
        </Flex>
      )}

      {changeError && (
        <Alert
          message={changeError}
          type="error"
          showIcon
          closable
          onClose={() => setChangeError("")}
          style={{ marginBottom: 20 }}
        />
      )}

      <Form
        form={changeForm}
        layout="vertical"
        onFinish={handleChangePassword}
        autoComplete="off"
        style={{ maxWidth: 440 }}
      >
        {!settingFirstPassword && (
          <Form.Item
            name="oldPassword"
            label="Current password"
            rules={[{ required: true, message: "Enter your current password" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: colors.textMuted }} />}
              placeholder="Current password"
              iconRender={(v) => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item
          name="newPassword"
          label="New password"
          rules={[
            { required: true, message: "Enter a new password" },
            { min: 7, message: "Password must be at least 7 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: colors.textMuted }} />}
            placeholder="New password"
            iconRender={(v) => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm new password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: colors.textMuted }} />}
            placeholder="Confirm new password"
            iconRender={(v) => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={changeMutation.isPending}
            style={{
              background: colors.accent,
              borderColor: colors.accent,
              fontWeight: 600,
            }}
          >
            {settingFirstPassword ? "Set password" : "Update password"}
          </Button>
        </Form.Item>
      </Form>

      {!settingFirstPassword && (
        <>
          <Divider />
          <Text style={{ color: colors.textMuted }}>
            Forgot your current password?{" "}
            <Button
              type="link"
              size="small"
              loading={forgotMutation.isPending}
              disabled={forgotMutation.isSuccess}
              style={{ color: colors.accent, padding: 0, height: "auto" }}
              onClick={() =>
                forgotMutation.mutate(
                  { email: user!.email },
                  {
                    onSuccess: () => messageService.success("Password reset link sent to your email."),
                    onError: (err) => messageService.error(err instanceof ApiError ? err.message : "Failed to send reset link."),
                  },
                )
              }
            >
              {forgotMutation.isSuccess ? "Reset link sent" : "Reset it here"}
            </Button>
          </Text>
        </>
      )}
    </div>
  );

  const dangerPanel = (
    <div className="profile__panel">
      <Title
        level={4}
        style={{ marginTop: 0, marginBottom: 4, color: colors.danger }}
      >
        Danger Zone
      </Title>
      <Text
        style={{ color: colors.textMuted, display: "block", marginBottom: 24 }}
      >
        Irreversible actions. Proceed with caution.
      </Text>

      <div
        className="profile__danger-card"
        style={{ border: `1px solid ${colors.danger}`, borderRadius: 10 }}
      >
        <Flex align="center" gap={10} className="profile__danger-header">
          <WarningOutlined style={{ color: colors.danger, fontSize: 18 }} />
          <Title level={5} style={{ margin: 0, color: colors.danger }}>
            Delete account
          </Title>
        </Flex>
        <Paragraph style={{ color: colors.textMuted, marginBottom: 20 }}>
          This will permanently delete your account, watchlist, and all
          associated data. This action{" "}
          <strong style={{ color: colors.textPrimary }}>
            cannot be undone
          </strong>
          .
        </Paragraph>

        {deleteError && (
          <Alert
            message={deleteError}
            type="error"
            showIcon
            closable
            onClose={() => setDeleteError("")}
            style={{ marginBottom: 16 }}
          />
        )}

        <Flex vertical gap={16}>
          <div>
            <Text style={{ color: colors.textMuted, display: "block", marginBottom: 6 }}>
              Type{" "}
              <Text code style={{ color: colors.danger }}>
                {DELETE_PHRASE}
              </Text>
              <Tooltip title="Copy">
                <CopyOutlined
                  style={{ marginLeft: 6, cursor: "pointer", color: colors.textMuted }}
                  onClick={() => {
                    navigator.clipboard.writeText(DELETE_PHRASE);
                    messageService.success("Copied to clipboard");
                  }}
                />
              </Tooltip>
              {" "}to confirm
            </Text>
            <Input
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder={DELETE_PHRASE}
              size="large"
              status={deleteInput && !isDeleteConfirmed ? "error" : undefined}
            />
          </div>

          {hasPassword && (
            <div>
              <Text style={{ color: colors.textMuted, display: "block", marginBottom: 6 }}>
                Enter your password to confirm
              </Text>
              <Input.Password
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                prefix={<LockOutlined style={{ color: colors.textMuted }} />}
                placeholder="Your password"
                iconRender={(v) => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                size="large"
              />
            </div>
          )}

          <Button
            danger
            type="primary"
            size="large"
            disabled={!isDeleteConfirmed || (hasPassword && !deletePassword)}
            loading={deleteMutation.isPending}
            onClick={handleDeleteAccount}
          >
            Delete my account
          </Button>
        </Flex>
      </div>
    </div>
  );

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
          <Title level={3} style={{ margin: 0 }}>
            {user?.name ?? "—"}
          </Title>
          <Text style={{ color: colors.textMuted }}>{user?.email ?? "—"}</Text>
        </Space>
      </Flex>

      <Row className="profile__body" gutter={[0, 24]}>
        <Col xs={24} sm={7} md={6} className="profile__sidebar">
          <Menu
            mode="inline"
            selectedKeys={[section]}
            items={menuItems}
            onClick={({ key }) => setSection(key as ProfileSection)}
            className="profile__menu"
            style={{ background: "transparent", border: "none" }}
          />
        </Col>

        <Col xs={24} sm={17} md={18} className="profile__content">
          {section === "security" ? securityPanel : dangerPanel}
        </Col>
      </Row>
    </div>
  );
}
