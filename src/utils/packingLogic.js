/**
 * packingLogic.js
 * Pure functions that generate packing suggestions based on
 * weather data and trip type. Each item has:
 *   id, emoji, name, category, tag ('essential' | 'weather' | 'trip')
 */

/* ───── Category constants ───── */
export const CATEGORIES = {
  ESSENTIALS: { id: 'essentials', label: 'Essentials', icon: '🎒' },
  CLOTHING: { id: 'clothing', label: 'Clothing', icon: '👕' },
  FOOTWEAR: { id: 'footwear', label: 'Footwear', icon: '👟' },
  TOILETRIES: { id: 'toiletries', label: 'Toiletries', icon: '🧴' },
  TECH: { id: 'tech', label: 'Tech & Gadgets', icon: '🔌' },
  HEALTH: { id: 'health', label: 'Health & Safety', icon: '💊' },
  EXTRAS: { id: 'extras', label: 'Extras', icon: '✨' },
};

const C = CATEGORIES;

/* ───── Static item pools ───── */

const ALWAYS_ESSENTIALS = [
  { id: 'passport', emoji: '🛂', name: 'Passport / ID', category: C.ESSENTIALS.id, tag: 'essential' },
  { id: 'tickets', emoji: '✈️', name: 'Travel tickets / Bookings', category: C.ESSENTIALS.id, tag: 'essential' },
  { id: 'wallet', emoji: '👛', name: 'Wallet & cards', category: C.ESSENTIALS.id, tag: 'essential' },
  { id: 'phone', emoji: '📱', name: 'Smartphone', category: C.TECH.id, tag: 'essential' },
  { id: 'charger', emoji: '🔌', name: 'Phone charger / Power bank', category: C.TECH.id, tag: 'essential' },
  { id: 'toothbrush', emoji: '🪥', name: 'Toothbrush & toothpaste', category: C.TOILETRIES.id, tag: 'essential' },
  { id: 'shampoo', emoji: '🧴', name: 'Shampoo & body wash', category: C.TOILETRIES.id, tag: 'essential' },
  { id: 'medicines', emoji: '💊', name: 'Personal medicines', category: C.HEALTH.id, tag: 'essential' },
  { id: 'firstaid', emoji: '🩹', name: 'Basic first-aid kit', category: C.HEALTH.id, tag: 'essential' },
  { id: 'headphones', emoji: '🎧', name: 'Earphones / Headphones', category: C.TECH.id, tag: 'essential' },
  { id: 'camera', emoji: '📷', name: 'Camera / Extra SD card', category: C.TECH.id, tag: 'essential' },
  { id: 'adaptor', emoji: '🔋', name: 'Travel adaptor', category: C.TECH.id, tag: 'essential' },
  { id: 'underpants', emoji: '👙', name: 'Underwear & socks (multiple)', category: C.CLOTHING.id, tag: 'essential' },
];

/* ── Temperature-based clothing ── */
const HOT_ITEMS = [ // > 25°C
  { id: 'tshirts', emoji: '👕', name: 'Light T-shirts (×4)', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'shorts', emoji: '🩳', name: 'Shorts / light trousers', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'sunglasses', emoji: '🕶️', name: 'Sunglasses', category: C.EXTRAS.id, tag: 'weather' },
  { id: 'sunscreen', emoji: '🧴', name: 'Sunscreen SPF 50+', category: C.TOILETRIES.id, tag: 'weather' },
  { id: 'hat', emoji: '🧢', name: 'Sun hat / cap', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'flipflops', emoji: '🩴', name: 'Flip-flops / sandals', category: C.FOOTWEAR.id, tag: 'weather' },
  { id: 'waterbottle', emoji: '💧', name: 'Reusable water bottle', category: C.EXTRAS.id, tag: 'weather' },
  { id: 'lightdress', emoji: '👗', name: 'Light dress / linen shirt', category: C.CLOTHING.id, tag: 'weather' },
];

const MILD_ITEMS = [ // 10–25°C
  { id: 'lightjacket', emoji: '🧥', name: 'Light jacket / cardigan', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'fullsleevetop', emoji: '👚', name: 'Full-sleeve tops (×3)', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'jeans', emoji: '👖', name: 'Jeans / chinos', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'sneakers', emoji: '👟', name: 'Comfortable sneakers', category: C.FOOTWEAR.id, tag: 'weather' },
  { id: 'layertop', emoji: '🧤', name: 'Light scarf / muffler', category: C.CLOTHING.id, tag: 'weather' },
];

const COLD_ITEMS = [ // < 10°C
  { id: 'heavyjacket', emoji: '🧥', name: 'Heavy winter jacket', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'thermalwear', emoji: '🩱', name: 'Thermal inner-wear', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'sweater', emoji: '🧶', name: 'Woollen sweater (×2)', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'gloves', emoji: '🧤', name: 'Gloves', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'beanie', emoji: '🎩', name: 'Beanie / woollen cap', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'scarf', emoji: '🧣', name: 'Warm scarf', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'boots', emoji: '🥾', name: 'Insulated boots', category: C.FOOTWEAR.id, tag: 'weather' },
  { id: 'thicksocks', emoji: '🧦', name: 'Thick woollen socks', category: C.CLOTHING.id, tag: 'weather' },
];

const RAIN_ITEMS = [
  { id: 'umbrella', emoji: '☂️', name: 'Compact umbrella', category: C.EXTRAS.id, tag: 'weather' },
  { id: 'raincoat', emoji: '🧥', name: 'Waterproof rain jacket / poncho', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'waterproofshoes', emoji: '👢', name: 'Waterproof shoes / boots', category: C.FOOTWEAR.id, tag: 'weather' },
  { id: 'plasticbags', emoji: '🛍️', name: 'Ziplock / dry bags', category: C.EXTRAS.id, tag: 'weather' },
];

const SNOW_ITEMS = [
  { id: 'snowboots', emoji: '🥾', name: 'Snow boots', category: C.FOOTWEAR.id, tag: 'weather' },
  { id: 'snowjacket', emoji: '🧥', name: 'Waterproof snow jacket', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'snowpants', emoji: '🎿', name: 'Insulated snow pants', category: C.CLOTHING.id, tag: 'weather' },
  { id: 'handwarmers', emoji: '🔥', name: 'Hand warmers (disposable)', category: C.EXTRAS.id, tag: 'weather' },
  { id: 'lipbalm', emoji: '💋', name: 'Lip balm & moisturiser', category: C.TOILETRIES.id, tag: 'weather' },
];

/* ── Trip-type specific items ── */
const TRIP_ITEMS = {
  beach: [
    { id: 'swimwear', emoji: '🩱', name: 'Swimwear / bikini', category: C.CLOTHING.id, tag: 'trip' },
    { id: 'beachtowel', emoji: '🏖️', name: 'Beach towel', category: C.EXTRAS.id, tag: 'trip' },
    { id: 'afrafter', emoji: '🧴', name: 'After-sun lotion', category: C.TOILETRIES.id, tag: 'trip' },
    { id: 'watersports', emoji: '🤿', name: 'Snorkel / watersport gear', category: C.EXTRAS.id, tag: 'trip' },
    { id: 'beachbag', emoji: '👜', name: 'Beach bag', category: C.EXTRAS.id, tag: 'trip' },
  ],
  trekking: [
    { id: 'trekpole', emoji: '🪄', name: 'Trekking poles', category: C.EXTRAS.id, tag: 'trip' },
    { id: 'backpack', emoji: '🎒', name: 'Hiking backpack (30L+)', category: C.ESSENTIALS.id, tag: 'trip' },
    { id: 'hikingshoes', emoji: '🥾', name: 'Hiking / trail shoes', category: C.FOOTWEAR.id, tag: 'trip' },
    { id: 'energybars', emoji: '🍫', name: 'Energy bars / trail snacks', category: C.HEALTH.id, tag: 'trip' },
    { id: 'compass', emoji: '🧭', name: 'Compass / GPS device', category: C.EXTRAS.id, tag: 'trip' },
    { id: 'headlamp', emoji: '🔦', name: 'Headlamp with extra batteries', category: C.EXTRAS.id, tag: 'trip' },
    { id: 'insectrepel', emoji: '🦟', name: 'Insect repellent', category: C.HEALTH.id, tag: 'trip' },
  ],
  business: [
    { id: 'suit', emoji: '👔', name: 'Formal suit / blazer', category: C.CLOTHING.id, tag: 'trip' },
    { id: 'dresshirt', emoji: '👕', name: 'Dress shirts (×3)', category: C.CLOTHING.id, tag: 'trip' },
    { id: 'formaltie', emoji: '👞', name: 'Formal shoes', category: C.FOOTWEAR.id, tag: 'trip' },
    { id: 'laptop', emoji: '💻', name: 'Laptop & accessories', category: C.TECH.id, tag: 'trip' },
    { id: 'businesscards', emoji: '📇', name: 'Business cards', category: C.ESSENTIALS.id, tag: 'trip' },
    { id: 'notepad', emoji: '📓', name: 'Notebook & pens', category: C.ESSENTIALS.id, tag: 'trip' },
    { id: 'portfoliobag', emoji: '💼', name: 'Portfolio / laptop bag', category: C.ESSENTIALS.id, tag: 'trip' },
  ],
  casual: [
    { id: 'casualshirts', emoji: '👕', name: 'Casual shirts / tees (×3)', category: C.CLOTHING.id, tag: 'trip' },
    { id: 'casualshoes', emoji: '👟', name: 'Everyday sneakers', category: C.FOOTWEAR.id, tag: 'trip' },
    { id: 'foldingbag', emoji: '🎒', name: 'Day-trip folding bag', category: C.EXTRAS.id, tag: 'trip' },
    { id: 'guidebook', emoji: '📖', name: 'Travel guidebook / maps', category: C.EXTRAS.id, tag: 'trip' },
  ],
};

/* ════════════════════════════════
   MAIN LOGIC FUNCTION
   Returns array of item objects.
   ════════════════════════════════ */
/**
 * @param {object} weather - normalized current weather
 * @param {Array}  forecast - array of forecast days
 * @param {string} tripType - 'beach' | 'trekking' | 'business' | 'casual' | ''
 * @returns {Array<object>} deduplicated list of packing items
 */
export function generatePackingList(weather, forecast, tripType) {
  const items = [...ALWAYS_ESSENTIALS];
  const addedIds = new Set(items.map((i) => i.id));

  const add = (list) => {
    list.forEach((item) => {
      if (!addedIds.has(item.id)) {
        items.push(item);
        addedIds.add(item.id);
      }
    });
  };

  // --- Temperature logic ---
  // Use the average temp across the forecast period to be more accurate
  const allTemps = forecast.length
    ? forecast.map((f) => f.temp)
    : [weather.temp];
  const avgTemp = allTemps.reduce((a, b) => a + b, 0) / allTemps.length;
  const minTemp = Math.min(...allTemps, weather.temp);

  if (minTemp < 10) {
    add(COLD_ITEMS);
    add(MILD_ITEMS); // still include mid-layer items
  } else if (avgTemp <= 25) {
    add(MILD_ITEMS);
  }

  if (avgTemp > 20) {
    add(HOT_ITEMS);
  }

  // --- Precipitation logic ---
  const hasRain =
    weather.condition === 'Rain' ||
    weather.condition === 'Drizzle' ||
    weather.rainProb > 0 ||
    forecast.some((f) => f.pop > 40 || f.condition === 'Rain');

  const hasSnow =
    weather.condition === 'Snow' || forecast.some((f) => f.condition === 'Snow');

  if (hasSnow) {
    add(SNOW_ITEMS);
    add(COLD_ITEMS); // implied by snow
  }
  if (hasRain) add(RAIN_ITEMS);

  // --- Trip type specific items ---
  if (tripType && TRIP_ITEMS[tripType]) {
    add(TRIP_ITEMS[tripType]);
  }

  return items;
}

/**
 * Group a flat item list by category id.
 * @param {Array} items
 * @returns {object} { categoryId: { meta, items[] } }
 */
export function groupByCategory(items) {
  const result = {};
  Object.values(CATEGORIES).forEach((cat) => {
    const catItems = items.filter((i) => i.category === cat.id);
    if (catItems.length > 0) {
      result[cat.id] = { meta: cat, items: catItems };
    }
  });
  return result;
}
