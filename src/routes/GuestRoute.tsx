import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
