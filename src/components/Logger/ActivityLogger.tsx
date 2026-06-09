import { useState, useEffect, useRef } from 'react';
import type { Category } from '../../types';
import { EMISSION_FACTORS } from '../../services/emissionFactors';
import CategoryPicker from './CategoryPicker';
import Button from '../ui/Button';
import Card from '../ui/Card';

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

export default function ActivityLogger({ onAdd }: ActivityLoggerProps) {
  const [category, setCategory] = useState<Category>('transport');
  const [subType, setSubType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const options = Object.keys(EMISSION_FACTORS[category]);
    setSubType(options[0] ?? '');
  }, [category]);

  function getUnit(): string {
    if (!subType) return '';
    return EMISSION_FACTORS[category]?.[subType]?.unit ?? '';
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

    const unit = getUnit();
    try {
      await onAdd({ category, subType, quantity: qty, unit, note });
      setQuantity('');
      setNote('');
      setQuantityError('');
      showToast('Activity logged successfully!');
    } catch (err: any) {
      setQuantityError(err.message || 'Failed to save. Please try again.');
    }
  }

  const subTypeOptions = Object.entries(EMISSION_FACTORS[category]);
  const selectedFactor = EMISSION_FACTORS[category]?.[subType];

  return (
    <div className="relative">
      <Card variant="elevated">
        <form onSubmit={handleSubmit} noValidate aria-label="Activity log form">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Log an Activity</h2>

          {/* Category Picker */}
          <div className="mb-6">
            <CategoryPicker selected={category} onChange={cat => { setCategory(cat); setQuantityError(''); }} />
          </div>

          {/* Activity Type */}
          <div className="mb-5">
            <label htmlFor="activity-type" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Activity Type
            </label>
            <select
              id="activity-type"
              value={subType}
              onChange={e => setSubType(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-3
                         text-sm text-[var(--text-primary)] min-h-11
                         focus:border-leaf focus:ring-2 focus:ring-leaf/10 focus:outline-none
                         transition-all duration-200 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394A3B8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
              aria-label="Activity type"
            >
              {subTypeOptions.map(([key, factor]) => (
                <option key={key} value={key}>{factor.label}</option>
              ))}
            </select>
            {selectedFactor && (
              <p className="mt-1.5 text-xs text-[var(--text-muted)]">{selectedFactor.description}</p>
            )}
          </div>

          {/* Quantity + Unit row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
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
                aria-describedby={quantityError ? 'quantity-error' : undefined}
                className={`w-full rounded-xl border px-4 py-3 text-sm text-[var(--text-primary)] min-h-11
                            transition-all duration-200
                            focus:ring-2 focus:outline-none
                            ${quantityError
                              ? 'border-danger bg-danger/5 focus:border-danger focus:ring-danger/10'
                              : 'border-[var(--border-color)] bg-[var(--input-bg)] focus:border-leaf focus:ring-leaf/10'
                            }`}
              />
            </div>
            <div>
              <label htmlFor="unit-display" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Unit
              </label>
              <input
                id="unit-display"
                type="text"
                value={getUnit()}
                readOnly
                aria-label="Unit (read only)"
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-hover)] px-4 py-3
                           text-sm text-[var(--text-muted)] min-h-11 cursor-default"
              />
            </div>
          </div>

          {/* Quantity error */}
          {quantityError && (
            <div
              id="quantity-error"
              role="alert"
              aria-live="polite"
              className="mb-5 flex items-center gap-2 rounded-xl bg-danger/5 border border-danger/15 px-4 py-3 animate-scale-in"
            >
              <svg className="w-4 h-4 text-danger flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-danger font-medium">{quantityError}</p>
            </div>
          )}

          {/* Estimated emission preview */}
          {quantity && parseFloat(quantity) > 0 && selectedFactor && (
            <div className="mb-5 rounded-xl bg-leaf/5 border border-leaf/15 px-4 py-3 flex items-center gap-3 animate-scale-in">
              <div className="w-8 h-8 rounded-lg gradient-leaf flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-white" aria-hidden="true">🌱</span>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)]">Estimated emission</p>
                <p className="text-sm text-leaf font-bold tabular-nums">
                  {(selectedFactor.co2e_per_unit * parseFloat(quantity)).toFixed(3)} kg CO₂e
                </p>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mb-6">
            <label htmlFor="activity-note" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Note <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              id="activity-note"
              type="text"
              maxLength={200}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Drove to office"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-3
                         text-sm text-[var(--text-primary)] min-h-11
                         focus:border-leaf focus:ring-2 focus:ring-leaf/10 focus:outline-none
                         transition-all duration-200"
            />
            <p className="mt-1.5 text-xs text-[var(--text-muted)] text-right tabular-nums">{note.length}/200</p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Log Activity
          </Button>
        </form>
      </Card>

      {/* Toast notification */}
      {toast.visible && (
        <div
          aria-live="polite"
          aria-atomic="true"
          role="status"
          className="fixed bottom-20 md:bottom-6 right-4 z-50 gradient-leaf text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-leaf/20
                     animate-slide-in-right flex items-center gap-3"
        >
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
