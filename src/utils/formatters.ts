export function formatCO2(kg: number, decimals = 2): string {
  return `${kg.toFixed(decimals)} kg CO₂e`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
