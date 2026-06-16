import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useActivities } from '../hooks/useActivities';
import DemoBanner from '../components/auth/DemoBanner';
import { getDocument, createDocument } from '../lib/firestore';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  country: string;
  city: string;
}

const CHALLENGE_BADGES = [
  { id: 'zero-meat-monday', emoji: '🥗', label: 'Meat-Free Monday' },
  { id: 'public-transit-week', emoji: '🚌', label: 'Transit Hero' },
  { id: 'cold-shower', emoji: '🚿', label: 'Cold Warrior' },
  { id: 'local-produce', emoji: '🥬', label: 'Local Eater' },
  { id: 'no-car-day', emoji: '🚶', label: 'Car-Free Champion' },
  { id: 'unplug-standby', emoji: '🔌', label: 'Energy Saver' },
  { id: 'secondhand-only', emoji: '♻️', label: 'Eco Shopper' },
  { id: 'carpool-week', emoji: '🚗', label: 'Carpool King' },
] as const;

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activities } = useActivities();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>({ name: '', age: '', gender: '', country: 'India', city: '' });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.isAnonymous) return;
    getDocument<UserProfile>(`users/${currentUser.uid}/data`, 'profile').then(doc => {
      if (doc) setProfile(doc);
      else if (currentUser.displayName) setProfile(p => ({ ...p, name: currentUser.displayName || '' }));
    }).catch(() => {});
    getDocument<{ completedIds: string[] }>(`users/${currentUser.uid}/data`, 'challenges').then(doc => {
      if (doc?.completedIds) setCompletedChallenges(doc.completedIds);
    }).catch(() => {});
  }, [currentUser]);

  async function handleSave() {
    if (!currentUser || currentUser.isAnonymous) return;
    setSaving(true);
    try {
      await createDocument(`users/${currentUser.uid}/data`, 'profile', profile);
      setEditing(false);
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  const totalEmissions = activities.reduce((s, a) => s + a.co2e_kg, 0);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 md:pb-8">
      <DemoBanner />

      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-xl font-bold text-[var(--text)]">Profile</h1>
        </div>

        <div className="pt-5 space-y-5 stagger">
          {/* User card */}
          <div className="liquid-glass p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-2xl shadow-md">
                {currentUser?.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : '🌿'}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-[var(--text)]">
                  {profile.name || currentUser?.displayName || currentUser?.email || 'Guest User'}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {currentUser?.isAnonymous ? 'Demo mode' : currentUser?.email}
                </p>
              </div>
              {!currentUser?.isAnonymous && (
                <button onClick={() => setEditing(!editing)} className="btn-glass !py-2 !px-3 !text-xs">
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              )}
            </div>

            {/* Editable fields */}
            {editing && (
              <div className="space-y-3 animate-slide-down mb-4">
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Name" className="input-glass" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={profile.age} onChange={e => setProfile(p => ({ ...p, age: e.target.value }))} placeholder="Age" type="number" className="input-glass" />
                  <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} className="input-glass">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={profile.country} onChange={e => setProfile(p => ({ ...p, country: e.target.value }))} placeholder="Country" className="input-glass" />
                  <input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="City" className="input-glass" />
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary w-full !py-3">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Quick stats */}
            {!editing && (
              <div className="grid grid-cols-3 gap-3">
                <div className="stat-glass !p-3 text-center">
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{activities.length}</p>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase">Activities</p>
                </div>
                <div className="stat-glass !p-3 text-center">
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{totalEmissions.toFixed(1)}</p>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase">Total kg</p>
                </div>
                <div className="stat-glass !p-3 text-center">
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{completedChallenges.length}</p>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase">Challenges</p>
                </div>
              </div>
            )}

            {currentUser?.isAnonymous && (
              <button onClick={() => navigate('/auth')} className="btn-primary w-full mt-4 !py-3">
                Create Free Account — Save Your Data
              </button>
            )}
          </div>

          {/* Badges */}
          <div className="liquid-glass p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-4">Challenge Badges</h2>
            <div className="grid grid-cols-4 gap-3">
              {CHALLENGE_BADGES.map(badge => {
                const isEarned = completedChallenges.includes(badge.id);
                return (
                  <div key={badge.id} className={`text-center p-2 rounded-xl transition-all ${isEarned ? 'stat-glass' : 'opacity-30'}`}>
                    <span className="text-2xl block mb-1">{badge.emoji}</span>
                    <p className="text-[8px] text-[var(--text-muted)] leading-tight">{badge.label}</p>
                  </div>
                );
              })}
            </div>
            {completedChallenges.length === 0 && (
              <p className="text-xs text-[var(--text-muted)] text-center mt-3">Complete challenges to earn badges!</p>
            )}
          </div>

          {/* Preferences */}
          <div className="card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Preferences</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">Theme</span>
              <button onClick={toggleTheme} className="btn-glass !py-1.5 !px-3 !text-xs">
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>

          {/* About */}
          <div className="card p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">About EcoLens</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Version', value: '2.0.0' },
                { label: 'AI Model', value: 'Gemini 2.5 Flash' },
                { label: 'Emission Data', value: 'IPCC AR6 / CEA 2023' },
                { label: 'Maps', value: 'Google Maps Platform' },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-[var(--text-muted)]">{item.label}</span>
                  <span className="text-[var(--text-secondary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full card !bg-transparent text-[var(--text-muted)] py-3 text-sm hover:text-red-500 hover:border-red-500/30 transition-colors text-center"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
