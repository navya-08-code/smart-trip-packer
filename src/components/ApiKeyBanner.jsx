/**
 * ApiKeyBanner.jsx
 * A collapsible banner where the user can paste their
 * OpenWeatherMap API key. Key is saved to localStorage.
 */
import { useState } from 'react';
import { saveApiKey, getStoredApiKey } from '../utils/weatherService';

export default function ApiKeyBanner({ onKeySaved }) {
  const existing = getStoredApiKey();
  const [open, setOpen]   = useState(!existing); // auto-open if no key stored
  const [key, setKey]     = useState(existing);
  const [saved, setSaved] = useState(!!existing);

  function handleSave() {
    if (!key.trim()) return;
    saveApiKey(key.trim());
    setSaved(true);
    setOpen(false);
    onKeySaved && onKeySaved();
  }

  return (
    <div className="api-key-banner">
      {/* Header row */}
      <button
        className="api-key-toggle"
        id="api-key-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{saved ? '🔑 API Key configured ✓' : '🔑 Setup API Key  (required)'}</span>
        <span className={`api-chevron${open ? ' open' : ''}`}>▼</span>
      </button>

      {/* Expandable body */}
      {open && (
        <div className="api-key-body">
          <p className="api-key-hint">
            Paste your free{' '}
            <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">
              OpenWeatherMap
            </a>{' '}
            API key below. It is saved only to <em>your browser</em> (localStorage).
          </p>
          <div className="api-key-row">
            <input
              id="api-key-input"
              type="password"
              placeholder="e.g. a1b2c3d4e5f6789..."
              value={key}
              onChange={(e) => { setKey(e.target.value); setSaved(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              id="api-key-save-btn"
              className="api-key-save-btn"
              onClick={handleSave}
              disabled={!key.trim()}
            >
              Save
            </button>
          </div>
          {saved && (
            <p className="api-key-saved-msg">✅ Key saved! You can now search for any city.</p>
          )}
        </div>
      )}
    </div>
  );
}
