/**
 * weatherService.js
 * Handles all OpenWeatherMap API calls.
 * API key is read from Vite env: VITE_OWM_API_KEY.
 */

const BASE = 'https://api.openweathermap.org/data/2.5';
const API_KEY = (import.meta.env.VITE_OWM_API_KEY || '').trim();

function requireApiKey() {
  if (!API_KEY) {
    throw new Error('Missing API key. Add VITE_OWM_API_KEY in your environment.');
  }
  return API_KEY;
}

/**
 * Fetch current weather for a city name.
 * @param {string} city
 */
export async function fetchCurrentWeather(city) {
  const resolvedApiKey = requireApiKey();
  const res = await fetch(
    `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${resolvedApiKey}&units=metric`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Invalid API key. Please check your OpenWeatherMap key.');
    throw new Error(err.message || 'City not found. Please check the spelling.');
  }
  const data = await res.json();
  return normalizeCurrentWeather(data);
}

/**
 * Fetch 5-day forecast (3-hour intervals) for a city.
 * @param {string} city
 */
export async function fetchForecast(city) {
  const resolvedApiKey = requireApiKey();
  const res = await fetch(
    `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${resolvedApiKey}&units=metric&cnt=40`
  );
  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key.');
    throw new Error(`Forecast unavailable (status ${res.status}).`);
  }
  const data = await res.json();
  return normalizeForecast(data.list);
}

/* ───────── Normalizers ───────── */

function normalizeCurrentWeather(data) {
  return {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s → km/h
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    rainProb: data.rain ? data.rain['1h'] || 0 : 0,
    visibility: Math.round((data.visibility || 10000) / 1000),
  };
}

/**
 * Collapse 3-hour slots into one entry per day (prefers noon slot).
 */
function normalizeForecast(list) {
  const days = {};
  list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];
    const hour = parseInt(item.dt_txt.split(' ')[1]);
    if (!days[date] || Math.abs(hour - 12) < Math.abs(parseInt(days[date].dt_txt.split(' ')[1]) - 12)) {
      days[date] = item;
    }
  });
  return Object.values(days).slice(0, 5).map((item) => ({
    date: item.dt_txt.split(' ')[0],
    temp: Math.round(item.main.temp),
    condition: item.weather[0].main,
    icon: item.weather[0].icon,
    pop: Math.round((item.pop || 0) * 100),
  }));
}
