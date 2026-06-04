import { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Alert,
  Flex,
  Tooltip,
} from "antd";
import {
  LockOutlined,
  WarningOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  CopyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";
import { useDeleteAccountMutation } from "../../api/useAuthQuery";
import { ApiError } from "../../services/apiService";
import messageService from "../../services/messageService";

const { Title, Text, Paragraph } = Typography;

const DELETE_PHRASE = "delete my account";

export default function DangerPanel() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const hasPassword = user?.hasPassword ?? true;

  const [deleteError, setDeleteError]     = useState("");
  const [deleteInput, setDeleteInput]     = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const deleteMutation = useDeleteAccountMutation();

  const isDeleteConfirmed = deleteInput.toLowerCase() === DELETE_PHRASE;

  const handleDeleteAccount = () => {
    setDeleteError("");
    deleteMutation.mutate(hasPassword ? deletePassword : "", {
      onSuccess: () => {
        messageService.success("Your account has been deleted.");
        navigate("/login");
      },
      onError: (err) => {
        setDeleteError(
          err instanceof ApiError ? err.message : "Failed to delete account. Please try again.",
        );
      },
    });
  };

  return (
    <div className="profile__panel">
      <Title level={4} style={{ marginTop: 0, marginBottom: 4, color: colors.danger }}>
        Danger Zone
      </Title>
      <Text style={{ color: colors.textMuted, display: "block", marginBottom: 24 }}>
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
          This will permanently delete your account, watchlist, and all associated data. This action{" "}
          <strong style={{ color: colors.textPrimary }}>cannot be undone</strong>.
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
}
