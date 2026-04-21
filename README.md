live link:
https://smart-trip-packer-ai.onrender.com/

# 🧳 Smart Trip Packer

> A mobile-friendly web app that suggests what to pack for any trip based on **real-time weather** at your destination.

![Smart Trip Packer](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite) ![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-orange?style=flat)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌦️ Live Weather | Current conditions + 5-day forecast via OpenWeatherMap API |
| 🧳 Smart Packing | Items suggested based on temperature, rain, snow, wind |
| 🏖️ Trip Types | Beach · Trekking · Business · Casual — type-specific gear |
| ✅ Checklist | Tap items to check them off (saved to localStorage) |
| 📊 Pack Score | Visual progress bar showing how prepared you are |
| 💾 Save Trips | Save previous trips and reload them later |
| 📱 Mobile First | Optimised for small screens, works great on desktop too |

---

## 🚀 Quick Start

### 1. Get a Free OpenWeatherMap API Key
1. Sign up at [openweathermap.org/api](https://openweathermap.org/api)
2. Go to **My API Keys**
3. Copy your key (free tier supports 60 calls/min)

### 2. Configure the Key
Open the `.env` file in the project root:
```
VITE_OWM_API_KEY=your_actual_api_key_here
```

### 3. Install & Run
```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── TripForm.jsx       # Destination, dates, trip type inputs
│   ├── WeatherCard.jsx    # Current weather + 5-day forecast
│   ├── PackingList.jsx    # Grouped checklist with toggle
│   ├── PackScore.jsx      # Animated pack progress bar
│   └── SavedTrips.jsx     # Previously saved trip cards
├── utils/
│   ├── weatherService.js  # OpenWeatherMap API calls
│   ├── packingLogic.js    # Weather-based item suggestion engine
│   └── helpers.js         # Date formatting, emoji map, localStorage
├── App.jsx                # Root component / state management
├── main.jsx               # React entry point
└── index.css              # Global design system (CSS variables + styles)
```

---

## 🌡️ Packing Logic Rules

| Condition | Suggested Items |
|---|---|
| Temp < 10°C | Heavy jacket, thermals, gloves, beanie, boots |
| Temp 10–25°C | Light jacket, full-sleeve tops, jeans |
| Temp > 20°C | T-shirts, shorts, sunglasses, sunscreen, hat |
| Rain > 40% chance | Umbrella, raincoat, waterproof shoes |
| Snow forecast | Snow boots, insulated jacket, hand warmers |
| Beach trip | Swimwear, beach towel, after-sun lotion |
| Trekking | Hiking boots, poles, headlamp, energy bars |
| Business | Suit, laptop, business cards |

---

## 🏗️ Built With
- **React 18** + **Vite 5**
- **OpenWeatherMap API** (free tier)
- **Vanilla CSS** with CSS custom properties
- **localStorage** for persistence
- No external UI libraries (pure custom design)

---

## 📝 License
MIT — use freely for personal projects.
