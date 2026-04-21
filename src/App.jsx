/**
 * App.jsx
 * Root component that orchestrates all state:
 *  - Trip form submission
 *  - Weather API calls
 *  - Packing list generation
 *  - Checked state (localStorage)
 *  - Saved trips (localStorage)
 */
import { useState, useCallback } from 'react';
import TripForm      from './components/TripForm';
import WeatherCard   from './components/WeatherCard';
import PackingList   from './components/PackingList';
import PackScore     from './components/PackScore';
import SavedTrips    from './components/SavedTrips';

import { fetchCurrentWeather, fetchForecast } from './utils/weatherService';
import { generatePackingList }                from './utils/packingLogic';
import { ls, formatDateLong }                  from './utils/helpers';

/* ── localStorage keys ── */
const LS_TRIPS   = 'stp_saved_trips';
const LS_CHECKED = 'stp_checked';

export default function App() {
  /* ── Trip data state ── */
  const [weather,      setWeather]      = useState(null);
  const [forecast,     setForecast]     = useState([]);
  const [packingItems, setPackingItems] = useState([]);
  const [tripMeta,     setTripMeta]     = useState(null); // { destination, startDate, endDate, tripType }

  /* ── UI state ── */
  const [loading,   setLoading]  = useState(false);
  const [error,     setError]    = useState('');

  /* ── Persistent state ── */
  const [checkedState, setCheckedState] = useState(() => ls.get(LS_CHECKED, {}));
  const [savedTrips,   setSavedTrips]   = useState(() => ls.get(LS_TRIPS, []));

  /* ════════════════════
     FORM SUBMIT HANDLER
     ════════════════════ */
  const handleFormSubmit = useCallback(async ({ destination, startDate, endDate, tripType }) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);
    setPackingItems([]);

    try {
      const currentWeather = await fetchCurrentWeather(destination);
      let forecastData = [];
      try { forecastData = await fetchForecast(destination); }
      catch (fErr) { console.warn('Forecast skipped:', fErr.message); }

      const items = generatePackingList(currentWeather, forecastData, tripType);
      setWeather(currentWeather);
      setForecast(forecastData);
      setPackingItems(items);
      setTripMeta({ destination, startDate, endDate, tripType });
      const freshChecked = {};
      setCheckedState(freshChecked);
      ls.set(LS_CHECKED, freshChecked);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ════════════════════
     TOGGLE ITEM CHECKED
     ════════════════════ */
  const handleToggleItem = useCallback((itemId) => {
    setCheckedState((prev) => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      ls.set(LS_CHECKED, next);
      return next;
    });
  }, []);

  /* ════════════════════
     SAVE TRIP
     ════════════════════ */
  const handleSaveTrip = useCallback(() => {
    if (!tripMeta || !weather) return;

    const newTrip = {
      id:          Date.now().toString(),
      ...tripMeta,
      weather:     { condition: weather.condition, icon: weather.icon, temp: weather.temp },
      savedAt:     new Date().toISOString(),
      checkedState,
      packingItems,
    };

    setSavedTrips((prev) => {
      // Keep max 10 saved trips
      const updated = [newTrip, ...prev].slice(0, 10);
      ls.set(LS_TRIPS, updated);
      return updated;
    });
  }, [tripMeta, weather, checkedState, packingItems]);

  /* ════════════════════
     LOAD SAVED TRIP
     ════════════════════ */
  const handleLoadTrip = useCallback((trip) => {
    setWeather(trip.weather ? {
      ...trip.weather,
      humidity: 0, windSpeed: 0, description: trip.weather.condition,
      city: trip.destination, country: '',
    } : null);
    setForecast([]);
    setPackingItems(trip.packingItems || []);
    setTripMeta({
      destination: trip.destination,
      startDate:   trip.startDate,
      endDate:     trip.endDate,
      tripType:    trip.tripType,
    });
    const savedChecked = trip.checkedState || {};
    setCheckedState(savedChecked);
    ls.set(LS_CHECKED, savedChecked);
    // Scroll to results
    setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, []);

  /* ════════════════════
     DELETE SAVED TRIP
     ════════════════════ */
  const handleDeleteTrip = useCallback((id) => {
    setSavedTrips((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      ls.set(LS_TRIPS, updated);
      return updated;
    });
  }, []);

  /* ── Date range label ── */
  const dateRange = tripMeta
    ? `${formatDateLong(tripMeta.startDate)}${
        tripMeta.endDate && tripMeta.endDate !== tripMeta.startDate
          ? ` – ${formatDateLong(tripMeta.endDate)}`
          : ''
      }`
    : '';

  const hasResults = packingItems.length > 0;

  /* ════════════════════
          RENDER
     ════════════════════ */
  return (
    <div className="app-wrapper">
      {/* ── App Header ── */}
      <header className="app-header">
        <span className="logo-icon" aria-hidden="true">🧳</span>
        <h1>Smart Trip Packer</h1>
        <p>Weather-based packing suggestions for every adventure</p>
      </header>

      {/* ── Trip Form ── */}
      <TripForm onSubmit={handleFormSubmit} loading={loading} />

      {/* ── Error Banner ── */}
      {error && (
        <div className="error-banner" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* ── Results section ── */}
      {hasResults && (
        <div id="results-section">
          {/* Weather summary */}
          <WeatherCard
            weather={weather}
            forecast={forecast}
            dateRange={dateRange}
          />

          {/* Pack Score */}
          <PackScore
            checkedState={checkedState}
            items={packingItems}
          />

          {/* Save trip button */}
          <button
            id="save-trip-btn"
            className="btn-secondary"
            onClick={handleSaveTrip}
            title="Save this trip"
          >
            💾 Save This Trip
          </button>

          {/* Packing checklist */}
          <PackingList
            items={packingItems}
            checkedState={checkedState}
            onToggle={handleToggleItem}
          />
        </div>
      )}

      {/* ── Empty state (first load, no trip searched yet) ── */}
      {!hasResults && !loading && !error && (
        <div className="empty-state">
          <div className="empty-icon">🌍</div>
          <p>Enter your destination and travel dates above<br />to get a personalised packing list based on<br />real-time weather conditions.</p>
        </div>
      )}

      <hr className="divider" />

      {/* ── Saved Trips ── */}
      <SavedTrips
        trips={savedTrips}
        onLoad={handleLoadTrip}
        onDelete={handleDeleteTrip}
      />
    </div>
  );
}
