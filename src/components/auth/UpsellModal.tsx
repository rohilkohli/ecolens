import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpsellModalProps {
  onDismiss: () => void;
}

export default function UpsellModal({ onDismiss }: UpsellModalProps) {
  const navigate = useNavigate();

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onDismiss();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onDismiss}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl p-6 animate-scale-in">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#2DC878]/15 border border-[#2DC878]/20 flex items-center justify-center text-3xl mx-auto mb-4">
          🤖
        </div>

        <h2 id="upsell-title" className="text-lg font-semibold text-white text-center mb-2">
          AI insights need an account
        </h2>
        <p className="text-white/50 text-sm text-center mb-6 leading-relaxed">
          Create a free account to get Gemini AI-powered tips personalised to your actual footprint data.
        </p>

        <button
          onClick={() => navigate('/auth')}
          className="w-full bg-[#2DC878] text-[#0B1A12] font-semibold rounded-xl py-3 mb-3 hover:bg-[#25B066] transition-colors active:scale-[0.98]"
        >
          Create free account
        </button>
        <button
          onClick={onDismiss}
          className="w-full text-white/40 text-sm py-2 hover:text-white/60 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
