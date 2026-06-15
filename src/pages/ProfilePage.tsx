import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DemoBanner from '../components/auth/DemoBanner';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] pb-24 md:pb-8">
      <DemoBanner />

      <div className="max-w-lg mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="pt-6 pb-4 border-b border-[var(--border-color)]">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">Profile</h1>
        </div>

        <div className="pt-5 space-y-4">
          {/* User card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'var(--accent)', color: 'var(--accent-text)', opacity: 0.9 }}>
                {currentUser?.isAnonymous ? '👤' : '🌿'}
              </div>
              <div>
                <p className="font-semibold text-base text-[var(--text-primary)]">
                  {currentUser?.isAnonymous ? 'Guest User' : (currentUser?.email ?? 'User')}
                </p>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">
                  {currentUser?.isAnonymous ? 'Demo mode — data not saved to cloud' : 'Registered account'}
                </p>
              </div>
            </div>

            {currentUser?.isAnonymous && (
              <button
                onClick={() => navigate('/auth')}
                className="w-full font-semibold rounded-xl py-3 text-sm transition-colors"
                style={{ background: 'var(--accent)', color: 'var(--accent-text)' }}
              >
                Create Free Account — Save Your Data
              </button>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-3">Preferences</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Theme</span>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>

          {/* App info */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <h2 className="text-[var(--text-muted)] text-[10px] font-semibold uppercase tracking-wider mb-3">About EcoLens</h2>
            <div className="space-y-2">
              {[
                { label: 'Version', value: '2.0.0' },
                { label: 'AI Model', value: 'Gemini 2.5 Flash' },
                { label: 'Emission Data', value: 'CEA 2023 / IPCC AR6' },
                { label: 'Maps', value: 'Google Maps Platform' },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[var(--text-muted)] text-sm">{item.label}</span>
                  <span className="text-[var(--text-secondary)] text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] rounded-xl py-3 text-sm hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/5 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
