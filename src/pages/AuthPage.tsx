import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<{ confirm: (code: string) => Promise<unknown> } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Signup extra fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('');

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, setupRecaptcha, sendPhoneCode, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/app');
    setupRecaptcha('recaptcha-container');
  }, [currentUser, navigate, setupRecaptcha]);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
        await signUpWithEmail(email, password);
        // TODO: Save profile (name, age, gender, country, city) to Firestore after signup
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneSend() {
    setError('');
    setLoading(true);
    try {
      const result = await sendPhoneCode(phone);
      setConfirmationResult(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setLoading(false);
    }
  }

  async function handlePhoneVerify() {
    setError('');
    setLoading(true);
    try {
      await confirmationResult!.confirm(code);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-[var(--bg)] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-15%] left-[-5%] w-[450px] h-[450px] rounded-full animate-gradient" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[350px] h-[350px] rounded-full animate-gradient" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)', filter: 'blur(70px)', animationDelay: '2s', animationDirection: 'reverse' }} />
        <div className="absolute top-[30%] right-[15%] w-[250px] h-[250px] rounded-full animate-gradient" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)', filter: 'blur(60px)', animationDelay: '4s' }} />
        {/* Floating leaf particles */}
        <div className="absolute top-[15%] left-[10%] text-2xl animate-float opacity-40">🍃</div>
        <div className="absolute top-[50%] right-[8%] text-xl animate-float opacity-30" style={{ animationDelay: '1s' }}>🌱</div>
        <div className="absolute bottom-[20%] left-[20%] text-lg animate-float opacity-25" style={{ animationDelay: '2s' }}>🌿</div>
        <div className="absolute top-[70%] right-[30%] text-xl animate-float opacity-20" style={{ animationDelay: '1.5s' }}>☘️</div>
        <div className="absolute top-[8%] right-[40%] text-sm animate-float opacity-30" style={{ animationDelay: '3s' }}>🍀</div>
        {/* Grid mesh */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg shadow-lg mb-4 animate-float" style={{ boxShadow: '0 8px 30px rgba(16,185,129,0.3)' }}>
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            {mode === 'login' ? 'Welcome back to ' : 'Join '}
            <span className="gradient-text">EcoLens</span>
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            {mode === 'login' ? 'Track your carbon footprint' : 'Start your sustainability journey'}
          </p>
        </div>

        {/* Card */}
        <div className="liquid-glass p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm flex items-center gap-2 animate-scale-in" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Google + Phone side by side */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="btn-glass !py-3 !text-sm !font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
            <button
              onClick={() => {
                if (!confirmationResult && phone) handlePhoneSend();
                else if (!phone) setError('Enter phone number below first');
              }}
              disabled={loading}
              className="btn-glass !py-3 !text-sm !font-medium flex items-center justify-center gap-2"
            >
              📱 Phone
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-[var(--text-muted)]">or with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {/* Signup extra fields */}
            {mode === 'signup' && (
              <div className="space-y-3 animate-slide-down">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="input-glass" required />
                <div className="grid grid-cols-2 gap-3">
                  <input value={age} onChange={e => setAge(e.target.value)} placeholder="Age" type="number" min="10" max="100" className="input-glass" />
                  <select value={gender} onChange={e => setGender(e.target.value)} className="input-glass">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={country} onChange={e => setCountry(e.target.value)} className="input-glass">
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="Japan">Japan</option>
                    <option value="Brazil">Brazil</option>
                    <option value="France">France</option>
                    <option value="Other">Other</option>
                  </select>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="input-glass" />
                </div>
              </div>
            )}

            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" className="input-glass"
            />
            <input
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" className="input-glass" minLength={6}
            />

            {/* Phone number field (inline) */}
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="Phone (optional, e.g. +91...)" className="input-glass"
            />

            {/* OTP field appears when code sent */}
            {confirmationResult && (
              <div className="animate-scale-in">
                <input
                  type="text" value={code} onChange={e => setCode(e.target.value)}
                  placeholder="Enter OTP code" className="input-glass tracking-widest text-center text-lg"
                />
                <button type="button" onClick={handlePhoneVerify} disabled={loading} className="btn-primary w-full mt-2 !text-sm">
                  Verify OTP
                </button>
              </div>
            )}

            <div id="recaptcha-container" />

            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</span>
              ) : (
                mode === 'login' ? 'Log In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle login/signup */}
          <p className="text-center text-sm text-[var(--text-muted)] mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
