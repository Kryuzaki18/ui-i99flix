import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space, Alert, Divider, Typography } from 'antd';
import { GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  type AuthProvider,
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useSocialSigninMutation } from '../../api/useAuthQuery';
import { ApiError } from '../../services/internalApiClient';

const { Text } = Typography;

/** X (Twitter) logo as an inline SVG */
function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const PROVIDER_CONFIGS = [
  {
    id:          'google',
    label:       'Google',
    icon:        <GoogleOutlined />,
    getProvider: () => new GoogleAuthProvider(),
  },
  {
    id:          'facebook',
    label:       'Facebook',
    icon:        <FacebookOutlined />,
    getProvider: () => new FacebookAuthProvider(),
  },
  {
    id:          'x',
    label:       'X',
    icon:        <XIcon />,
    getProvider: () => new TwitterAuthProvider(),
  },
] as const;

interface SocialLoginButtonsProps {
  mode?: 'signin' | 'signup';
  rememberMe?: boolean;
}

export default function SocialLoginButtons({
  mode = 'signin',
  rememberMe = false,
}: SocialLoginButtonsProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError]         = useState('');
  const navigate                  = useNavigate();
  const socialMutation            = useSocialSigninMutation();

  const handleSocialLogin = async (
    providerId: string,
    getProvider: () => AuthProvider,
  ) => {
    setError('');
    setLoadingId(providerId);

    try {
      const result  = await signInWithPopup(auth, getProvider());
      const idToken = await result.user.getIdToken();

      socialMutation.mutate(
        { idToken, rememberMe },
        {
          onSuccess: () => navigate('/'),
          onError: (err) => {
            setLoadingId(null);
            if (import.meta.env.DEV) console.error('[SocialLogin] backend error:', err);
            setError(err instanceof ApiError ? err.message : 'Social sign-in failed. Please try again.');
          },
        },
      );
      // loading stays on until onSuccess navigates away or onError clears it
    } catch (err: unknown) {
      setLoadingId(null);

      const code    = (err as { code?: string }).code ?? '';
      const message = (err as { message?: string }).message ?? '';

      // Silently ignore user-dismissed popup — no error shown, no console noise
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

      <Space style={{ width: '100%', justifyContent: 'center' }} size={12}>
        {PROVIDER_CONFIGS.map(({ id, label, icon, getProvider }) => (
          <Button
            key={id}
            shape="round"
            icon={icon}
            loading={loadingId === id}
            disabled={loadingId !== null && loadingId !== id}
            onClick={() => handleSocialLogin(id, getProvider)}
            aria-label={`Continue with ${label}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, paddingInline: 16 }}
          >
            {label}
          </Button>
        ))}
      </Space>
    </>
  );
}
