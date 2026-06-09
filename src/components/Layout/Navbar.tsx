import { useState } from 'react';
import { NavLink, useNavigate, type NavLinkRenderProps } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',           label: 'Dashboard',  icon: '📊', activeIcon: '📊' },
  { to: '/log',        label: 'Log',        icon: '✏️', activeIcon: '✏️' },
  { to: '/insights',   label: 'Insights',   icon: '✨', activeIcon: '✨' },
  { to: '/challenges', label: 'Challenges', icon: '🏆', activeIcon: '🏆' },
];

function desktopLinkClass({ isActive }: NavLinkRenderProps): string {
  return `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
   transition-all duration-300 min-h-11 min-w-11 group
   focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2
   ${isActive
     ? 'bg-leaf/10 text-leaf shadow-sm'
     : 'text-[var(--text-secondary)] hover:text-leaf hover:bg-leaf/5'
   }`;
}


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function closeMobile() {
    setMobileOpen(false);
  }

  async function handleLogout() {
    await logout();
    navigate('/auth');
    closeMobile();
  }

  return (
    <>
      {/* Desktop top nav */}
      <nav
        className="sticky top-0 z-40 glass border-b"
        style={{ borderColor: 'var(--border-color)' }}
        aria-label="Main navigation"
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2 rounded-xl group"
              aria-label="EcoLens Home"
            >
              <span className="text-2xl group-hover:animate-float transition-transform" aria-hidden="true">🌿</span>
              <span className="text-xl font-bold gradient-text">EcoLens</span>
            </NavLink>

            {/* Desktop nav */}
            {currentUser && (
              <div className="hidden md:flex items-center gap-1" role="list">
                {NAV_ITEMS.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    role="listitem"
                    className={desktopLinkClass}
                  >
                    {({ isActive }: NavLinkRenderProps) => (
                      <>
                        <span aria-hidden="true" className="text-base">{isActive ? item.activeIcon : item.icon}</span>
                        <span>{item.label}</span>
                        {isActive && (
                          <>
                            <span className="sr-only"> (current page)</span>
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-leaf rounded-full" aria-hidden="true" />
                          </>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}

                <div className="ml-2 pl-2 border-l border-[var(--border-color)] flex items-center gap-1">
                  <ThemeToggle />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 min-h-11 focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2 text-[var(--text-muted)] hover:text-danger hover:bg-danger/5"
                    aria-label="Log out"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {!currentUser && (
              <div className="hidden md:flex items-center">
                <ThemeToggle />
              </div>
            )}

            {/* Mobile hamburger (only visible above bottom nav for menu open) */}
            <div className="md:hidden flex items-center gap-1">
              <ThemeToggle />
              {currentUser && (
                <button
                  className="flex items-center justify-center w-11 h-11 rounded-xl
                             text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]
                             transition-colors duration-200
                             focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2"
                  onClick={() => setMobileOpen(prev => !prev)}
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-menu"
                  aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                >
                  <svg className="w-5 h-5 transition-transform duration-200" style={{ transform: mobileOpen ? 'rotate(90deg)' : 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    {mobileOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile overlay menu (for logout and extra options) */}
        {mobileOpen && currentUser && (
          <div
            id="mobile-menu"
            className="md:hidden border-t animate-slide-down"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)' }}
          >
            <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-12 focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2 text-danger hover:bg-danger/5 text-left"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile bottom navigation bar */}
      {currentUser && (
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t"
          style={{ borderColor: 'var(--border-color)' }}
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around h-16 px-2">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={closeMobile}
                className={({ isActive }: NavLinkRenderProps) => `
                  flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl
                  min-w-[60px] transition-all duration-200
                  focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2
                  ${isActive
                    ? 'text-leaf'
                    : 'text-[var(--text-muted)] hover:text-leaf'
                  }
                `}
              >
                {({ isActive }: NavLinkRenderProps) => (
                  <>
                    <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className={`text-[10px] font-semibold ${isActive ? 'text-leaf' : ''}`}>{item.label}</span>
                    {isActive && (
                      <>
                        <span className="sr-only"> (current page)</span>
                        <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-leaf rounded-full" aria-hidden="true" />
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
