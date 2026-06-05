import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert, Divider, Typography, Flex } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  type AuthProvider,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useSocialSigninMutation } from '../../api/auth/useAuthQuery';
import { ApiError } from '../../services/apiService';

const { Text } = Typography;

function XIcon() {
  return (
    <img src="/x-icon.svg" width={14} height={14} aria-hidden="true" style={{ display: 'block' }} />
  );
}

const PROVIDER_CONFIGS = [
  {
    id: 'google',
    label: 'Google',
    icon: <GoogleOutlined />,
    getProvider: () => new GoogleAuthProvider(),
  },
  {
    id: 'x',
    label: 'x.com',
    icon: <XIcon />,
    getProvider: () => new TwitterAuthProvider(),
  },
] as const;

interface SocialLoginButtonsProps {
  mode?: 'signin' | 'signup';
  rememberMe?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export default function SocialLoginButtons({
  mode = 'signin',
  rememberMe = false,
  onLoadingChange,
}: SocialLoginButtonsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const socialMutation = useSocialSigninMutation();

  const setLoading = (id: string | null) => {
    setLoadingId(id);
    onLoadingChange?.(id !== null);
  };

  const handleSocialLogin = async (
    providerId: string,
    getProvider: () => AuthProvider,
  ) => {
    setError('');
    setLoading(providerId);

    try {
      const result = await signInWithPopup(auth, getProvider());
      const idToken = await result.user.getIdToken();

      socialMutation.mutate(
        { idToken, rememberMe },
        {
          onSuccess: () => navigate('/'),
          onError: (err) => {
            setLoading(null);
            if (import.meta.env.DEV) console.error('[SocialLogin] backend error:', err);
            setError(err instanceof ApiError ? err.message : 'Social sign-in failed. Please try again.');
          },
        },
      );
    } catch (err: unknown) {
      setLoading(null);

      const code = (err as { code?: string }).code ?? '';
      const message = (err as { message?: string }).message ?? '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return;
      }

      if (import.meta.env.DEV) console.error('[SocialLogin] Firebase error:', code, message);

      if (code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in with your original method.');
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorised. Add it in Firebase Console → Authentication → Authorised domains.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('This sign-in method is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Check your connection and try again.');
      } else {
        setError(
          import.meta.env.DEV
            ? `Sign-in failed (${code || 'unknown'}): ${message}`
            : 'Social sign-in failed. Please try again.',
        );
      }
    }
  };

  return (
    <>
      <Divider>
        <Text style={{ fontSize: 12, color: 'inherit' }}>
          {mode === 'signup' ? 'or sign up with' : 'or continue with'}
        </Text>
      </Divider>

      {error && (
        <Alert
          description={error}
          type="error"
          showIcon
          closable
          style={{ marginBottom: 16 }}
          onClose={() => setError('')}
        />
      )}

      <Flex justify="center" gap={12} wrap="wrap">
        {PROVIDER_CONFIGS.map(({ id, label, icon, getProvider }) => (
          <Button
            key={id}
            shape="round"
            icon={icon}
            loading={loadingId === id}
            disabled={loadingId !== null && loadingId !== id}
            onClick={() => handleSocialLogin(id, getProvider)}
            aria-label={`Continue with ${label}`}
            style={{ paddingInline: 20 }}
          >
            {label}
          </Button>
        ))}
      </Flex>
    </>
  );
}
