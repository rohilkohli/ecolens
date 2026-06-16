import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Spinner from './components/ui/Spinner';
import Navbar from './components/Layout/Navbar';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LogPage from './pages/LogPage';
import ProfilePage from './pages/ProfilePage';
import EcoChatbot from './components/Chatbot/EcoChatbot';

const InsightsPage   = lazy(() => import('./pages/InsightsPage'));
const ChallengePage  = lazy(() => import('./pages/ChallengePage'));

/** Allows both anonymous AND registered users — blocks only unauthenticated */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthState();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <Spinner label="Loading..." />
      </div>
    );
  }
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function useAuthState() {
  const { currentUser, loading } = useAuth();
  return { user: currentUser, loading };
}

export default function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <Spinner label="Initialising..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
              <Spinner label="Loading page..." />
            </div>
          }
        >
          <Routes>
            {/* Public: Landing page */}
            <Route
              path="/"
              element={currentUser ? <Navigate to="/app" replace /> : <LandingPage />}
            />

            {/* Public: Auth page */}
            <Route
              path="/auth"
              element={currentUser ? <Navigate to="/app" replace /> : <AuthPage />}
            />

            {/* Protected app routes (anonymous or registered) */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/log"
              element={
                <ProtectedRoute>
                  <LogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/insights"
              element={
                <ProtectedRoute>
                  <InsightsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/challenges"
              element={
                <ProtectedRoute>
                  <ChallengePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Legacy route redirects */}
            <Route path="/log"        element={<Navigate to="/app/log"        replace />} />
            <Route path="/insights"   element={<Navigate to="/app/insights"   replace />} />
            <Route path="/challenges" element={<Navigate to="/app/challenges" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {currentUser && <EcoChatbot />}
    </BrowserRouter>
  );
}
