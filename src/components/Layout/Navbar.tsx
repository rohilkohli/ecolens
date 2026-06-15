import { NavLink, type NavLinkRenderProps } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const NAV_ITEMS = [
  { path: '/app',            label: 'Home',       icon: '📊' },
  { path: '/app/log',        label: 'Log',        icon: '✏️' },
  { path: '/app/insights',   label: 'Insights',   icon: '✨' },
  { path: '/app/challenges', label: 'Challenges', icon: '🏆' },
  { path: '/app/profile',    label: 'Profile',    icon: '👤' },
] as const;

export default function Navbar() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!currentUser) return null;

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:block sticky top-0 z-40 glass border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <span className="font-bold gradient-text">EcoLens</span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }: NavLinkRenderProps) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                   ${isActive ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover, #F3F4F6)]'}`
                }
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-card-hover, #F3F4F6)] transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-[var(--border)] pb-safe"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-14">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }: NavLinkRenderProps) =>
                `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl min-w-[52px] transition-colors
                 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`
              }
            >
              {({ isActive }: NavLinkRenderProps) => (
                <>
                  <span className={`text-lg ${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
                  <span className="text-[9px] font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
