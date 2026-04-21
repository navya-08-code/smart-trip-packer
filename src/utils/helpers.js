/**
 * helpers.js
 * Misc utility helpers used across the app.
 */

/**
 * Map an OWM weather condition to a display emoji.
 * @param {string} condition - e.g. 'Rain', 'Clear', 'Snow'
 * @param {string} icon      - e.g. '01d', '10n'
 */
export function conditionToEmoji(condition, icon) {
  const isNight = icon && icon.endsWith('n');
  const map = {
    Clear: isNight ? '🌙' : '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Dust: '💨',
    Sand: '💨',
    Ash: '🌋',
    Squall: '🌪️',
    Tornado: '🌪️',
  };
  return map[condition] || '🌡️';
}

/**
 * Get a CSS class suffix for temperature colouring.
 */
export function tempColorClass(temp) {
  if (temp >= 30) return 'temp-hot';
  if (temp >= 22) return 'temp-warm';
  if (temp >= 14) return 'temp-mild';
  if (temp >= 5)  return 'temp-cold';
  return 'temp-freeze';
}

/**
 * Format a YYYY-MM-DD date string to a short readable day label.
 * e.g., '2025-07-04' → 'Fri 4'
 */
export function formatDay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const day = d.getDate();
  return `${dayName} ${day}`;
}

/**
 * Compute a "Pack Score" based on how many items are checked.
 * @param {object} checkedState - { itemId: bool }
 * @param {Array}  items        - full item list
 * @returns {{ pct: number, message: string, emoji: string }}
 */
export function computePackScore(checkedState, items) {
  if (!items || items.length === 0) return { pct: 0, message: 'No items yet', emoji: '🎒' };

  const total = items.length;
  const checked = items.filter((i) => checkedState[i.id]).length;
  const pct = Math.round((checked / total) * 100);

  let message, emoji;
  if (pct === 0)       { message = 'Start checking items off your list!'; emoji = '😴'; }
  else if (pct < 25)   { message = 'Just getting started – keep going!'; emoji = '🙂'; }
  else if (pct < 50)   { message = 'Making progress, halfway there!'; emoji = '💪'; }
  else if (pct < 75)   { message = 'Looking good! Almost ready to go.'; emoji = '😎'; }
  else if (pct < 100)  { message = 'Almost fully packed – great job!'; emoji = '🤩'; }
  else                 { message = 'You\'re 100% packed – bon voyage! ✈️'; emoji = '🏆'; }

  return { pct, message, emoji };
}

/**
 * Format a date string as a readable range.
 * e.g., '2025-07-04' → '4 Jul 2025'
 */
export function formatDateLong(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/**
 * Return today's date as YYYY-MM-DD string.
 */
export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Local-storage helpers with safe JSON serialisation.
 */
export const ls = {
  get: (key, fallback = null) => {
    try {
      const v = localStorage.getItem(key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded – ignore */ }
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
  },
};
