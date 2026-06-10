import { NavLink, type NavLinkRenderProps } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/app',            icon: 'ti-home',        label: 'Home'       },
  { path: '/app/log',        icon: 'ti-plus',        label: 'Log'        },
  { path: '/app/insights',   icon: 'ti-bulb',        label: 'Insights'   },
  { path: '/app/challenges', icon: 'ti-trophy',      label: 'Challenges' },
  { path: '/app/profile',    icon: 'ti-user',        label: 'Profile'    },
];

export default function Navbar() {
  const { currentUser } = useAuth();

  // Don't render on public pages
  if (!currentUser) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] flex justify-around py-2 pb-safe"
      style={{ background: 'rgba(11,15,26,0.95)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      role="navigation"
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/app'}
          aria-label={item.label}
          className={({ isActive }: NavLinkRenderProps) =>
            `flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors min-w-[52px]
             ${isActive ? 'text-[#2DC878]' : 'text-white/30 hover:text-white/60'}`
          }
        >
          {({ isActive }: NavLinkRenderProps) => (
            <>
              <i
                className={`ti ${item.icon} text-[22px] leading-none ${isActive ? 'text-[#2DC878]' : ''}`}
                aria-hidden="true"
              />
              <span className={`text-[8px] font-medium tracking-wide ${isActive ? 'text-[#2DC878]' : ''}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
