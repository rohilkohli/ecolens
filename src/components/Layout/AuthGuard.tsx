import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';
import Spinner from '../ui/Spinner';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Spinner label="Checking authentication..." />
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to auth page and save the attempted url
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
