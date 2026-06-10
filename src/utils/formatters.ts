/** Formats a number as a CO₂e string with specified decimal precision. */
export function formatCO2(kg: number, decimals = 2): string {
  return `${kg.toFixed(decimals)} kg CO₂e`;
}

/** Formats an ISO timestamp as a localised date string (e.g. "10 Jun 2026"). */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Formats an ISO timestamp as a short date (e.g. "10 Jun"). */
export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Formats an ISO timestamp as a 2-digit time (e.g. "14:30"). */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/** Combines a numeric quantity with its unit label. */
export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

/** Capitalises the first character of a string. */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Returns a human-readable day label ("Today", "Yesterday", or a short date). */
export function getDayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
