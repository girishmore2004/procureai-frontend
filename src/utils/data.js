import { formatDistanceToNow as fnsFormatDistanceToNow } from 'date-fns';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Safe wrapper around date-fns formatDistanceToNow.
 * Returns a fallback string instead of throwing when the value is
 * missing or not a parseable date.
 */
export function safeFormatDistanceToNow(value, options = { addSuffix: true }, fallback = '—') {
  if (!value) return fallback;
  const d = new Date(value);
  if (!isValidDate(d)) return fallback;
  return fnsFormatDistanceToNow(d, options);
}

/**
 * Safe wrapper around Date#toLocaleDateString.
 */
export function safeToLocaleDateString(value, locale = 'en-IN', fallback = '—') {
  if (!value) return fallback;
  const d = new Date(value);
  if (!isValidDate(d)) return fallback;
  return d.toLocaleDateString(locale);
}

/**
 * Safe wrapper around Date#toLocaleString.
 */
export function safeToLocaleString(value, locale = 'en-IN', fallback = '—') {
  if (!value) return fallback;
  const d = new Date(value);
  if (!isValidDate(d)) return fallback;
  return d.toLocaleString(locale);
}
