import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [usePhone, setUsePhone] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    setupRecaptcha,
    sendPhoneCode,
    currentUser
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/log');
    }
    setupRecaptcha('recaptcha-container');
  }, [currentUser, navigate, setupRecaptcha]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (usePhone) {
        if (!confirmationResult) {
          const result = await sendPhoneCode(phone);
          setConfirmationResult(result);
        } else {
          await confirmationResult.confirm(code);
        }
      } else {
        if (isLogin) {
          await signInWithEmail(email, password);
        } else {
          await signUpWithEmail(email, password);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSignIn(providerFunction: () => Promise<void>) {
    setError('');
    setLoading(true);
    try {
      await providerFunction();
    } catch (err: any) {
      setError(err.message || 'Provider login failed');
    } finally {
      setLoading(false);
    }
  }

  function handleUnavailableProvider(providerName: string) {
    alert(`${providerName} login requires custom OIDC configuration in Google Cloud Identity Platform. This is not natively available in Firebase out-of-the-box.`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 gradient-leaf-radial">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-leaf shadow-lg shadow-leaf/20 mb-5 animate-float">
            <span className="text-4xl" aria-hidden="true">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Welcome to <span className="gradient-text">EcoLens</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm">
            Track your carbon footprint and make a difference
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          {error && (
            <div className="mb-5 p-3.5 bg-danger/5 border border-danger/20 text-danger text-sm rounded-xl flex items-center gap-2 animate-scale-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {usePhone ? (
              <>
                {!confirmationResult ? (
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-primary)] transition-all duration-200 focus:border-leaf focus:ring-2 focus:ring-leaf/10 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">SMS Verification Code</label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="123456"
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-primary)] transition-all duration-200 focus:border-leaf focus:ring-2 focus:ring-leaf/10 focus:outline-none tracking-widest text-center text-lg"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-primary)] transition-all duration-200 focus:border-leaf focus:ring-2 focus:ring-leaf/10 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--text-primary)] transition-all duration-200 focus:border-leaf focus:ring-2 focus:ring-leaf/10 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div id="recaptcha-container"></div>

            <Button type="submit" className="w-full justify-center" size="lg" loading={loading}>
              {usePhone
                ? (confirmationResult ? 'Verify Code' : 'Send SMS')
                : (isLogin ? 'Log In' : 'Create Account')
              }
            </Button>
          </form>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setUsePhone(!usePhone);
                setConfirmationResult(null);
                setError('');
              }}
              className="text-sm text-leaf font-medium hover:underline underline-offset-2 transition-colors"
            >
              {usePhone ? 'Use Email instead' : 'Use Phone instead'}
            </button>
            {!usePhone && (
              <>
                <span className="text-[var(--text-muted)]">·</span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {isLogin ? "Create an account" : 'Sign in instead'}
                </button>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex-1 h-px bg-[var(--border-color)]"></span>
            <span className="text-xs text-[var(--text-muted)] font-medium">or continue with</span>
            <span className="flex-1 h-px bg-[var(--border-color)]"></span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 stagger-children">
            <Button variant="secondary" onClick={() => handleProviderSignIn(signInWithGoogle)} className="w-full justify-center">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </Button>
            <Button variant="secondary" onClick={() => handleProviderSignIn(signInWithApple)} className="w-full justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </Button>
            <Button variant="secondary" onClick={() => handleProviderSignIn(signInWithFacebook)} className="w-full justify-center">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </Button>
            <Button variant="secondary" onClick={() => handleUnavailableProvider('Instagram')} className="w-full justify-center">
              <svg className="w-4 h-4" fill="url(#ig-gradient)" viewBox="0 0 24 24"><defs><linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFDC80"/><stop offset="25%" stopColor="#F77737"/><stop offset="50%" stopColor="#E1306C"/><stop offset="75%" stopColor="#C13584"/><stop offset="100%" stopColor="#833AB4"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
