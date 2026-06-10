import { useState, useEffect, useRef } from 'react';
import type { Category } from '../../types';
import { EMISSION_FACTORS, calculateEmission } from '../../services/emissionFactors';

interface ActivityLoggerProps {
  onAdd: (params: {
    category: Category;
    subType: string;
    quantity: number;
    unit: string;
    note: string;
  }) => void | Promise<void>;
}

interface ToastState {
  visible: boolean;
  message: string;
}

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'food',      label: 'Food',      icon: '🍽️' },
  { id: 'energy',    label: 'Energy',    icon: '⚡' },
  { id: 'shopping',  label: 'Shopping',  icon: '🛍️' },
];

export default function ActivityLogger({ onAdd }: ActivityLoggerProps) {
  const [category, setCategory] = useState<Category>('transport');
  const [subType, setSubType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const options = Object.keys(EMISSION_FACTORS[category]);
    setSubType(options[0] ?? '');
    setQuantityError('');
  }, [category]);

  function getUnit(): string {
    if (!subType) return '';
    return EMISSION_FACTORS[category]?.[subType]?.unit ?? '';
  }

  function getLiveEstimate(): number {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0 || !subType) return 0;
    return calculateEmission(category, subType, qty);
  }

  function showToast(message: string) {
    setToast({ visible: true, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuantityError('');

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setQuantityError('Please enter a quantity greater than 0.');
      return;
    }

    setSubmitting(true);
    const unit = getUnit();
    try {
      await onAdd({ category, subType, quantity: qty, unit, note });
      setQuantity('');
      setNote('');
      showToast('Activity logged! 🌱');
    } catch (err: any) {
      setQuantityError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const subTypeOptions = Object.entries(EMISSION_FACTORS[category]);
  const liveEstimate = getLiveEstimate();

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} noValidate aria-label="Activity log form">

        {/* Category chips — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide" role="group" aria-label="Category">
          {CATEGORIES.map(cat => {
            const isActive = cat.id === category;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0
                  ${isActive
                    ? 'bg-[#2DC878]/15 border-[#2DC878]/40 text-[#2DC878]'
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70 hover:bg-white/8'
                  }`}
                aria-pressed={isActive}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Activity Type */}
        <div className="mb-4">
          <label htmlFor="activity-type" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
            Activity type
          </label>
          <select
            id="activity-type"
            value={subType}
            onChange={e => setSubType(e.target.value)}
            className="w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-3
                       text-sm text-white min-h-11
                       focus:border-[#2DC878]/40 focus:ring-2 focus:ring-[#2DC878]/10 focus:outline-none
                       transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.3)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
            }}
            aria-label="Activity type"
          >
            {subTypeOptions.map(([key, factor]) => (
              <option key={key} value={key} style={{ background: '#111827', color: '#fff' }}>
                {factor.label}
              </option>
            ))}
          </select>
          {subType && EMISSION_FACTORS[category]?.[subType] && (
            <p className="mt-1.5 text-[11px] text-white/30">
              {EMISSION_FACTORS[category][subType].description}
            </p>
          )}
        </div>

        {/* Quantity + Unit */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label htmlFor="quantity" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={e => { setQuantity(e.target.value); setQuantityError(''); }}
              placeholder="e.g. 15"
              aria-invalid={!!quantityError}
              className={`w-full rounded-xl border px-4 py-3 text-sm text-white min-h-11
                          bg-white/[0.06] transition-all duration-200
                          focus:ring-2 focus:outline-none
                          ${quantityError
                            ? 'border-red-400/40 focus:border-red-400/60 focus:ring-red-400/10'
                            : 'border-white/[0.12] focus:border-[#2DC878]/40 focus:ring-[#2DC878]/10'
                          }`}
            />
          </div>
          <div>
            <label htmlFor="unit-display" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
              Unit
            </label>
            <input
              id="unit-display"
              type="text"
              value={getUnit()}
              readOnly
              aria-label="Unit (read only)"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3
                         text-sm text-white/40 min-h-11 cursor-default"
            />
          </div>
        </div>

        {/* Quantity error */}
        {quantityError && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-4 flex items-center gap-2 rounded-xl bg-red-400/8 border border-red-400/20 px-3 py-2.5 animate-scale-in"
          >
            <span className="text-red-400 text-xs">⚠️</span>
            <p className="text-xs text-red-400">{quantityError}</p>
          </div>
        )}

        {/* Live CO₂e preview */}
        {liveEstimate > 0 && (
          <div className="bg-[#2DC878]/8 border border-[#2DC878]/20 rounded-xl p-3 mb-4 animate-scale-in">
            <p className="text-white/35 text-[9px] mb-1 uppercase tracking-wider">Estimated emission</p>
            <p className="text-2xl font-bold text-[#2DC878]">
              {liveEstimate.toFixed(3)}
              <span className="text-sm font-normal text-white/40 ml-1">kg CO₂e</span>
            </p>
          </div>
        )}

        {/* Note */}
        <div className="mb-5">
          <label htmlFor="activity-note" className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
            Note <span className="text-white/25 font-normal normal-case">(optional)</span>
          </label>
          <input
            id="activity-note"
            type="text"
            maxLength={200}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Drove to office"
            className="w-full rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-3
                       text-sm text-white min-h-11
                       focus:border-[#2DC878]/40 focus:ring-2 focus:ring-[#2DC878]/10 focus:outline-none
                       transition-all duration-200 placeholder:text-white/25"
          />
          <p className="mt-1 text-[10px] text-white/25 text-right">{note.length}/200</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#2DC878] text-[#0B1A12] font-semibold rounded-xl py-3.5 text-sm
                     hover:bg-[#25B066] transition-colors active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? 'Saving...' : 'Log Activity'}
        </button>
      </form>

      {/* Toast */}
      {toast.visible && (
        <div
          aria-live="polite"
          aria-atomic="true"
          role="status"
          className="fixed bottom-24 left-4 right-4 z-50 bg-[#1a2e20] border border-[#2DC878]/30 text-white px-4 py-3 rounded-xl
                     animate-slide-up flex items-center gap-3 shadow-xl"
        >
          <div className="w-6 h-6 bg-[#2DC878]/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[#2DC878] text-xs">✓</span>
          </div>
          <span className="text-sm font-medium text-[#2DC878]">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
