/**
 * mockData.js
 * Demo-mode mock weather data so the app works while
 * the API key activates (OWM new keys take ~2 hrs).
 */

export const MOCK_CITIES = {
  london: {
    weather: {
      city: 'London', country: 'GB',
      temp: 14, feelsLike: 12, humidity: 76,
      windSpeed: 20, condition: 'Rain',
      description: 'light rain', icon: '10d',
      rainProb: 2, visibility: 8,
    },
    forecast: [
      { date: '2026-04-22', temp: 13, condition: 'Rain',   icon: '10d', pop: 70 },
      { date: '2026-04-23', temp: 15, condition: 'Clouds', icon: '04d', pop: 30 },
      { date: '2026-04-24', temp: 17, condition: 'Clouds', icon: '03d', pop: 20 },
      { date: '2026-04-25', temp: 16, condition: 'Rain',   icon: '10d', pop: 55 },
      { date: '2026-04-26', temp: 14, condition: 'Clouds', icon: '04d', pop: 25 },
    ],
  },
  paris: {
    weather: {
      city: 'Paris', country: 'FR',
      temp: 18, feelsLike: 17, humidity: 62,
      windSpeed: 15, condition: 'Clouds',
      description: 'partly cloudy', icon: '03d',
      rainProb: 0, visibility: 10,
    },
    forecast: [
      { date: '2026-04-22', temp: 19, condition: 'Clear',  icon: '01d', pop: 5 },
      { date: '2026-04-23', temp: 21, condition: 'Clear',  icon: '01d', pop: 5 },
      { date: '2026-04-24', temp: 17, condition: 'Rain',   icon: '10d', pop: 60 },
      { date: '2026-04-25', temp: 16, condition: 'Rain',   icon: '10d', pop: 65 },
      { date: '2026-04-26', temp: 20, condition: 'Clouds', icon: '03d', pop: 10 },
    ],
  },
  mumbai: {
    weather: {
      city: 'Mumbai', country: 'IN',
      temp: 33, feelsLike: 38, humidity: 80,
      windSpeed: 18, condition: 'Clear',
      description: 'clear sky', icon: '01d',
      rainProb: 0, visibility: 9,
    },
    forecast: [
      { date: '2026-04-22', temp: 34, condition: 'Clear',  icon: '01d', pop: 5  },
      { date: '2026-04-23', temp: 33, condition: 'Clear',  icon: '01d', pop: 5  },
      { date: '2026-04-24', temp: 32, condition: 'Clouds', icon: '03d', pop: 20 },
      { date: '2026-04-25', temp: 31, condition: 'Rain',   icon: '10d', pop: 55 },
      { date: '2026-04-26', temp: 30, condition: 'Rain',   icon: '10d', pop: 65 },
    ],
  },
  manali: {
    weather: {
      city: 'Manali', country: 'IN',
      temp: 5, feelsLike: 1, humidity: 70,
      windSpeed: 12, condition: 'Snow',
      description: 'light snow', icon: '13d',
      rainProb: 0, visibility: 5,
    },
    forecast: [
      { date: '2026-04-22', temp: 4,  condition: 'Snow',   icon: '13d', pop: 70 },
      { date: '2026-04-23', temp: 6,  condition: 'Clouds', icon: '04d', pop: 30 },
      { date: '2026-04-24', temp: 8,  condition: 'Clear',  icon: '01d', pop: 10 },
      { date: '2026-04-25', temp: 7,  condition: 'Snow',   icon: '13d', pop: 60 },
      { date: '2026-04-26', temp: 5,  condition: 'Snow',   icon: '13d', pop: 75 },
    ],
  },
  'new york': {
    weather: {
      city: 'New York', country: 'US',
      temp: 22, feelsLike: 21, humidity: 55,
      windSpeed: 25, condition: 'Clear',
      description: 'sunny', icon: '01d',
      rainProb: 0, visibility: 10,
    },
    forecast: [
      { date: '2026-04-22', temp: 23, condition: 'Clear',  icon: '01d', pop: 5  },
      { date: '2026-04-23', temp: 20, condition: 'Clouds', icon: '03d', pop: 25 },
      { date: '2026-04-24', temp: 18, condition: 'Rain',   icon: '10d', pop: 60 },
      { date: '2026-04-25', temp: 21, condition: 'Clear',  icon: '01d', pop: 10 },
      { date: '2026-04-26', temp: 24, condition: 'Clear',  icon: '01d', pop: 5  },
    ],
  },
  dubai: {
    weather: {
      city: 'Dubai', country: 'AE',
      temp: 38, feelsLike: 42, humidity: 45,
      windSpeed: 22, condition: 'Clear',
      description: 'hot and sunny', icon: '01d',
      rainProb: 0, visibility: 10,
    },
    forecast: [
      { date: '2026-04-22', temp: 39, condition: 'Clear', icon: '01d', pop: 0 },
      { date: '2026-04-23', temp: 37, condition: 'Clear', icon: '01d', pop: 0 },
      { date: '2026-04-24', temp: 38, condition: 'Clear', icon: '01d', pop: 0 },
      { date: '2026-04-25', temp: 40, condition: 'Clear', icon: '01d', pop: 0 },
      { date: '2026-04-26', temp: 39, condition: 'Clear', icon: '01d', pop: 0 },
    ],
  },
};

/**
 * Look up mock data by city name (case-insensitive, partial match).
 * Returns null if city not in mock set.
 */
export function getMockData(city) {
  const key = city.toLowerCase().trim();
  // Exact match first
  if (MOCK_CITIES[key]) return MOCK_CITIES[key];
  // Partial match
  const found = Object.keys(MOCK_CITIES).find((k) => key.includes(k) || k.includes(key));
  return found ? MOCK_CITIES[found] : null;
}

/** City suggestions for demo mode placeholder */
export const DEMO_CITIES = Object.values(MOCK_CITIES).map((d) => d.weather.city);
