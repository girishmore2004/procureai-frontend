import { formatDistanceToNow as fnsFormatDistanceToNow } from 'date-fns';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

export function safeFormatDistanceToNow(value, options = { addSuffix: true }, fallback = '—') {
  if (!value) return fallback;
  const d = new Date(value);
  if (!isValidDate(d)) return fallback;
  return fnsFormatDistanceToNow(d, options);
}

export function safeToLocaleDateString(value, locale = 'en-IN', fallback = '—') {
  if (!value) return fallback;
  const d = new Date(value);
  if (!isValidDate(d)) return fallback;
  return d.toLocaleDateString(locale);
}

export function safeToLocaleString(value, locale = 'en-IN', fallback = '—') {
  if (!value) return fallback;
  const d = new Date(value);
  if (!isValidDate(d)) return fallback;
  return d.toLocaleString(locale);
}
