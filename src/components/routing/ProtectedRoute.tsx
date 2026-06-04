import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  if (isCheckingAuth) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
