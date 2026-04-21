/**
 * TripForm.jsx
 * - Destination input
 * - Date range picker (start / end)
 * - Trip type selector (pills)
 * - Submit button with loading state
 */
import { useState } from 'react';
import { todayStr } from '../utils/helpers';

const TRIP_TYPES = [
  { id: 'beach',    label: 'Beach',    icon: '🏖️' },
  { id: 'trekking', label: 'Trek',     icon: '🥾' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'casual',   label: 'Casual',   icon: '🎒' },
];

export default function TripForm({ onSubmit, loading }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate]     = useState('');
  const [endDate, setEndDate]         = useState('');
  const [tripType, setTripType]       = useState('');

  const today = todayStr();

  function handleSubmit(e) {
    e.preventDefault();
    if (!destination.trim() || !startDate) return;
    onSubmit({ destination: destination.trim(), startDate, endDate, tripType });
  }

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h2>✦ Plan Your Trip</h2>

      {/* Destination */}
      <div className="field-group">
        <label htmlFor="destination">
          <span className="label-icon">📍</span>Destination City
        </label>
        <div className="input-wrap">
          <input
            id="destination"
            type="text"
            placeholder="e.g. Paris, Manali, New York…"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            autoComplete="off"
            spellCheck="false"
          />
        </div>
      </div>

      {/* Date range */}
      <div className="field-group">
        <label><span className="label-icon">📅</span>Travel Dates</label>
        <div className="date-row">
          <div className="input-wrap">
            <input
              id="start-date"
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => {
                setStartDate(e.target.value);
                // Ensure endDate >= startDate
                if (endDate && endDate < e.target.value) setEndDate(e.target.value);
              }}
              required
            />
          </div>
          <div className="input-wrap">
            <input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Trip type */}
      <div className="field-group">
        <label><span className="label-icon">🧭</span>Trip Type <span style={{color:'var(--text-muted)', fontWeight:400}}>(optional)</span></label>
        <div className="trip-type-grid">
          {TRIP_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              id={`trip-type-${t.id}`}
              className={`trip-type-btn${tripType === t.id ? ' active' : ''}`}
              onClick={() => setTripType(tripType === t.id ? '' : t.id)}
              aria-pressed={tripType === t.id}
            >
              <span className="type-icon">{t.icon}</span>
              <span className="type-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        id="pack-submit-btn"
        type="submit"
        className="btn-primary"
        disabled={loading || !destination.trim() || !startDate}
      >
        {loading && <span className="btn-spinner" />}
        {loading ? 'Fetching weather…' : '🔍 Get Packing List'}
      </button>
    </form>
  );
}
