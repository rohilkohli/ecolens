import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';
import Spinner from '../ui/Spinner';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex justify-center items-center">
        <Spinner label="Checking authentication..." />
      </div>
    );
  }

  if (!currentUser) {
    // Not signed in at all (not even anonymously) — go to landing
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
