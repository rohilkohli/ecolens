import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import DashboardPage from './pages/DashboardPage';
import LogPage from './pages/LogPage';
import Spinner from './components/ui/Spinner';
import AuthGuard from './components/Layout/AuthGuard';
import AuthPage from './pages/AuthPage';

const InsightsPage  = lazy(() => import('./pages/InsightsPage'));
const ChallengePage = lazy(() => import('./pages/ChallengePage'));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<Spinner label="Loading page..." />}>
          <Routes>
            {/* Public route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><DashboardPage /></AuthGuard>} />
            <Route path="/log" element={<AuthGuard><LogPage /></AuthGuard>} />
            <Route path="/insights" element={<AuthGuard><InsightsPage /></AuthGuard>} />
            <Route path="/challenges" element={<AuthGuard><ChallengePage /></AuthGuard>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
