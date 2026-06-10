import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DemoBanner from '../components/auth/DemoBanner';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pb-24">
      <DemoBanner />

      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-white/7">
        <h1 className="text-xl font-semibold text-white">Profile</h1>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {/* User card */}
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#2DC878]/15 border border-[#2DC878]/20 flex items-center justify-center text-2xl">
              {currentUser?.isAnonymous ? '👤' : '🌿'}
            </div>
            <div>
              <p className="text-white font-semibold text-base">
                {currentUser?.isAnonymous ? 'Guest User' : (currentUser?.email ?? 'User')}
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                {currentUser?.isAnonymous ? 'Demo mode — data not saved' : 'Registered account'}
              </p>
            </div>
          </div>

          {currentUser?.isAnonymous && (
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-[#2DC878] text-[#0B1A12] font-semibold rounded-xl py-3 text-sm hover:bg-[#25B066] transition-colors active:scale-[0.98]"
            >
              Create free account — save your data
            </button>
          )}
        </div>

        {/* App info */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
          <h2 className="text-white/40 text-[10px] uppercase tracking-wider font-medium mb-3">About EcoLens</h2>
          <div className="space-y-2">
            {[
              { label: 'Version', value: '2.0.0' },
              { label: 'AI Model', value: 'Gemini 2.5 Flash' },
              { label: 'Emission Data', value: 'CEA 2023 / IPCC AR6' },
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <span className="text-white/50 text-sm">{item.label}</span>
                <span className="text-white/70 text-sm">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white/[0.04] border border-white/[0.07] text-white/60 rounded-xl py-3 text-sm hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/5 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
