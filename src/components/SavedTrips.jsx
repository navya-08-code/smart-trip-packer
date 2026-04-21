/**
 * SavedTrips.jsx
 * Shows a list of trips saved to localStorage.
 * User can click a saved trip to reload its state,
 * or delete it.
 */
import { formatDateLong } from '../utils/helpers';
import { conditionToEmoji } from '../utils/helpers';

export default function SavedTrips({ trips, onLoad, onDelete }) {
  if (!trips || trips.length === 0) return null;

  return (
    <section className="saved-trips-section" aria-label="Saved Trips">
      <h2>🕐 Recent Trips</h2>
      {trips.map((trip) => {
        const weatherEmoji = trip.weather
          ? conditionToEmoji(trip.weather.condition, trip.weather.icon)
          : '🌍';
        return (
          <div
            key={trip.id}
            className="saved-trip-card"
            role="article"
            id={`saved-trip-${trip.id}`}
            onClick={() => onLoad(trip)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onLoad(trip)}
            tabIndex={0}
          >
            <span className="saved-trip-icon">{weatherEmoji}</span>
            <div className="saved-trip-info">
              <h4>{trip.destination}</h4>
              <p>
                {formatDateLong(trip.startDate)}
                {trip.endDate && trip.endDate !== trip.startDate && ` → ${formatDateLong(trip.endDate)}`}
                {trip.tripType && ` · ${trip.tripType.charAt(0).toUpperCase() + trip.tripType.slice(1)}`}
              </p>
            </div>
            <button
              className="saved-trip-delete"
              id={`delete-trip-${trip.id}`}
              title="Remove trip"
              aria-label={`Delete trip to ${trip.destination}`}
              onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }}
            >
              🗑️
            </button>
          </div>
        );
      })}
    </section>
  );
}
