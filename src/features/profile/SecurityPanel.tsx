import { useState } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Alert,
  Divider,
  Flex,
  Tag,
} from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
} from "@ant-design/icons";

import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import {
  useChangePasswordMutation,
  useForgotPasswordMutation,
} from "../../api/auth/useAuthQuery";
import { ApiError } from "../../services/apiService";
import messageService from "../../services/messageService";

const { Title, Text } = Typography;

interface ChangePasswordForm {
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SecurityPanel() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const isSocial         = (user?.social?.length ?? 0) > 0;
  const hasPassword      = user?.hasPassword ?? true;
  const settingFirstPassword = isSocial && !hasPassword;

  const [changeError, setChangeError] = useState("");
  const [changeForm] = Form.useForm<ChangePasswordForm>();

  const changeMutation = useChangePasswordMutation();
  const forgotMutation = useForgotPasswordMutation();

  const handleChangePassword = (values: ChangePasswordForm) => {
    setChangeError("");
    changeMutation.mutate(
      {
        oldPassword: settingFirstPassword ? undefined : values.oldPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          messageService.success(
            settingFirstPassword ? "Password set successfully." : "Password updated successfully.",
          );
          changeForm.resetFields();
        },
        onError: (err: unknown) => {
          setChangeError(
            err instanceof ApiError ? err.message : "Failed to update password. Please try again.",
          );
        },
      },
    );
  };

  return (
    <div className="profile__panel">
      <Title level={4} style={{ marginTop: 0, marginBottom: 4 }}>
        {settingFirstPassword ? "Set Password" : "Change Password"}
      </Title>
      <Text style={{ color: colors.textMuted, display: "block", marginBottom: 16 }}>
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
              icon={
                p === "google"
                  ? <GoogleOutlined />
                  : <img src="/x-icon.svg" width={11} height={11} style={{ marginRight: 4, verticalAlign: "middle" }} />
              }
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
            style={{ backgroundColor: colors.accent, borderColor: colors.accent, fontWeight: 600 }}
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
                    onError: (err: unknown) =>
                      messageService.error(
                        err instanceof ApiError ? err.message : "Failed to send reset link.",
                      ),
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
}
