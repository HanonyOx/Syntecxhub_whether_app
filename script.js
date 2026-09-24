const $ = s => document.querySelector(s);
const state = { place: null, data: null, unit: "C" };

// Weather code → [label, icon, sky theme]
function describe(code, isDay = 1) {
  if (code === 0) return isDay ? ["Clear", "☀️", "clear"] : ["Clear", "🌙", "clear-night"];
  if (code === 1) return isDay ? ["Mostly clear", "🌤️", "clear"] : ["Mostly clear", "🌙", "clear-night"];
  if (code === 2) return ["Partly cloudy", "⛅", "cloud"];
  if (code === 3) return ["Overcast", "☁️", "cloud"];
  if (code === 45 || code === 48) return ["Fog", "🌫️", "fog"];
  if (code >= 51 && code <= 57) return ["Drizzle", "🌦️", "rain"];
  if (code >= 61 && code <= 67) return ["Rain", "🌧️", "rain"];
  if (code >= 71 && code <= 77) return ["Snow", "❄️", "snow"];
  if (code >= 80 && code <= 82) return ["Rain showers", "🌦️", "rain"];
  if (code === 85 || code === 86) return ["Snow showers", "🌨️", "snow"];
  if (code >= 95) return ["Thunderstorm", "⛈️", "storm"];
  return ["Unknown", "🌡️", "cloud"];
}

const toUnit = c => Math.round(state.unit === "C" ? c : c * 9 / 5 + 32);
const speed = k => state.unit === "C" ? Math.round(k) + " km/h" : Math.round(k * 0.621) + " mph";
const say = t => $("#msg").textContent = t || "";

async function getJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Request failed (" + r.status + ")");
  return r.json();
}

async function loadWeather(place) {
  say("Loading weather…");
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + place.lat + "&longitude=" + place.lon +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
      "&hourly=temperature_2m,weather_code,is_day" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max" +
      "&timezone=auto&forecast_days=7";
    state.data = await getJSON(url);
    say("");
  } catch (e) {
    state.data = demoData();
    say("Couldn't reach the weather service, so this is sample data. Check your connection and search again.");
  }
  state.place = place;
  render();
}

async function searchCity(name) {
  say("Searching…");
  try {
    const res = await getJSON("https://geocoding-api.open-meteo.com/v1/search?count=1&name=" + encodeURIComponent(name));
    if (!res.results || !res.results.length) return say("No city found for “" + name + "”. Try a different spelling.");
    const r = res.results[0];
    loadWeather({ name: r.name + (r.country ? ", " + r.country : ""), lat: r.latitude, lon: r.longitude });
  } catch (e) {
    say("Search failed. Check your connection and try again.");
  }
}

function render() {
  const { data, place } = state;
  const c = data.current;
  const [label, icon, sky] = describe(c.weather_code, c.is_day);
  document.body.dataset.sky = sky;

  $("#place").textContent = place.name;
  $("#temp").innerHTML = toUnit(c.temperature_2m) + "<sup>°" + state.unit + "</sup>";
  $("#cond").innerHTML = "<span>" + icon + "</span>" + label;
  $("#unit").textContent = state.unit === "C" ? "°F" : "°C";

  $("#stats").innerHTML = [
    ["Feels like", toUnit(c.apparent_temperature) + "°"],
    ["Humidity", c.relative_humidity_2m + "%"],
    ["Wind", speed(c.wind_speed_10m)],
    ["UV today", Math.round(data.daily.uv_index_max[0])]
  ].map(s => '<div class="stat"><small>' + s[0] + "</small><b>" + s[1] + "</b></div>").join("");

  // Hourly: start at the current hour
  const h = data.hourly;
  let start = h.time.findIndex(t => t >= c.time.slice(0, 13));
  if (start < 0) start = 0;
  let html = "";
  for (let i = start; i < Math.min(start + 24, h.time.length); i++) {
    const hr = new Date(h.time[i]).toLocaleTimeString([], { hour: "numeric" });
    html += '<div class="hour"><div>' + (i === start ? "Now" : hr) + "</div><div>" +
      describe(h.weather_code[i], h.is_day[i])[1] + "</div><div>" + toUnit(h.temperature_2m[i]) + "°</div></div>";
  }
  $("#hourly").innerHTML = html;

  // Daily with range bars
  const d = data.daily;
  const lo = Math.min(...d.temperature_2m_min), hi = Math.max(...d.temperature_2m_max);
  const span = hi - lo || 1;
  $("#days").innerHTML = d.time.map((t, i) => {
    const name = i === 0 ? "Today" : new Date(t + "T12:00").toLocaleDateString([], { weekday: "short" });
    const left = (d.temperature_2m_min[i] - lo) / span * 100;
    const width = Math.max(6, (d.temperature_2m_max[i] - d.temperature_2m_min[i]) / span * 100);
    const p = d.precipitation_probability_max[i];
    return '<div class="day"><span>' + name + "</span><span>" + describe(d.weather_code[i])[1] +
      '</span><span class="rain">' + (p >= 20 ? p + "%" : "") + '</span>' +
      '<div class="track"><i style="left:' + left + "%;width:" + width + '%"></i></div>' +
      '<span class="hi">' + toUnit(d.temperature_2m_max[i]) + "°</span></div>";
  }).join("");
}

// Sample data shown only if the API can't be reached
function demoData() {
  const now = new Date(), pad = n => String(n).padStart(2, "0");
  const iso = d => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  const hourly = { time: [], temperature_2m: [], weather_code: [], is_day: [] };
  for (let i = 0; i < 48; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), i);
    hourly.time.push(iso(d) + "T" + pad(d.getHours()) + ":00");
    hourly.temperature_2m.push(16 + 6 * Math.sin((d.getHours() - 9) / 24 * 2 * Math.PI));
    hourly.weather_code.push(i % 9 < 5 ? 2 : 61);
    hourly.is_day.push(d.getHours() > 6 && d.getHours() < 19 ? 1 : 0);
  }
  const daily = { time: [], weather_code: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_probability_max: [], uv_index_max: [] };
  [2, 61, 3, 0, 1, 80, 2].forEach((code, i) => {
    daily.time.push(iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)));
    daily.weather_code.push(code);
    daily.temperature_2m_max.push(20 + (i % 3) * 2);
    daily.temperature_2m_min.push(11 + (i % 4));
    daily.precipitation_probability_max.push(code >= 61 ? 70 : 10);
    daily.uv_index_max.push(4);
  });
  return {
    current: { time: iso(now) + "T" + pad(now.getHours()) + ":00", temperature_2m: 18, apparent_temperature: 17,
      relative_humidity_2m: 62, weather_code: 2, wind_speed_10m: 14, is_day: 1 },
    hourly, daily
  };
}

// Events
$("#search").addEventListener("submit", e => {
  e.preventDefault();
  const q = $("#q").value.trim();
  if (q) searchCity(q);
});
$("#unit").addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  if (state.data) render();
});
$("#geo").addEventListener("click", () => {
  if (!navigator.geolocation) return say("Your browser doesn't support location.");
  say("Finding your location…");
  navigator.geolocation.getCurrentPosition(
    p => loadWeather({ name: "Your location", lat: p.coords.latitude, lon: p.coords.longitude }),
    () => say("Location access was blocked. Search for a city instead.")
  );
});

// First load
searchCity("London");