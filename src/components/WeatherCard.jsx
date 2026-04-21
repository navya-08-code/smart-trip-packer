/**
 * WeatherCard.jsx
 * Displays current weather data and a 5-day forecast strip.
 */
import { conditionToEmoji, tempColorClass, formatDay } from '../utils/helpers';

export default function WeatherCard({ weather, forecast, dateRange }) {
  if (!weather) return null;

  const emoji  = conditionToEmoji(weather.condition, weather.icon);
  const tClass = tempColorClass(weather.temp);

  return (
    <div className="weather-card" role="region" aria-label="Weather Summary">
      {/* Header */}
      <div className="weather-header">
        <div className="weather-location">
          <h3>📍 {weather.city}, {weather.country}</h3>
          <p>{dateRange} · {weather.description}</p>
        </div>
        <div className="weather-icon-big" title={weather.condition}>{emoji}</div>
      </div>

      {/* Stats grid */}
      <div className="weather-stats">
        <div className="weather-stat">
          <span className={`stat-val ${tClass}`}>{weather.temp}°C</span>
          <span className="stat-label">Temp</span>
        </div>
        <div className="weather-stat">
          <span className="stat-val">{weather.humidity}%</span>
          <span className="stat-label">Humidity</span>
        </div>
        <div className="weather-stat">
          <span className="stat-val">{weather.windSpeed}</span>
          <span className="stat-label">km/h Wind</span>
        </div>
      </div>

      {/* 5-day forecast strip */}
      {forecast && forecast.length > 0 && (
        <div className="forecast-strip" role="list" aria-label="5-day forecast">
          {forecast.map((day) => (
            <div key={day.date} className="forecast-item" role="listitem">
              <div className="fc-day">{formatDay(day.date)}</div>
              <span className="fc-icon">{conditionToEmoji(day.condition, day.icon)}</span>
              <div className={`fc-temp ${tempColorClass(day.temp)}`}>{day.temp}°C</div>
              {day.pop > 20 && (
                <div style={{ fontSize: '0.6rem', color: '#56cef7', marginTop: 2 }}>
                  💧 {day.pop}%
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
