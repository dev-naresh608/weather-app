const myApiKey = "1c268ea3279447158e863804261203";
const searchBtn = document.getElementById("searchButton");
const cityInput = document.getElementById("cityInput");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");
const weatherCard = document.getElementById("weatherCard");

function getWeatherIcon(code, isDay) {
  if (code === 1000) return isDay ? "☀️" : "🌕";
  if ([1003, 1006].includes(code)) return isDay ? "⛅" : "🌥️";
  if ([1009, 1030].includes(code)) return "☁️";
  if (
    [
      1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198,
      1201, 1240, 1243, 1246,
    ].includes(code)
  )
    return "🌧️";
  if (
    [1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(
      code,
    )
  )
    return "🌨️";
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return "⛈️";
  if ([1135, 1147].includes(code)) return "🌫️";
  return "🌡️";
}

async function getData(cityName) {
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${myApiKey}&q=${encodeURIComponent(cityName)}&aqi=no`,
  );
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

function formatTime(localtime) {
  const [, time] = localtime.split(" ");
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

async function doSearch() {
  const value = cityInput.value.trim();
  if (!value) {
    cityInput.focus();
    return;
  }

  loading.classList.add("show");
  errorBox.classList.remove("show");
  weatherCard.classList.remove("show");

  try {
    const result = await getData(value);
    const { name, region, localtime } = result.location;
    const { temp_c, condition, is_day } = result.current;

    document.getElementById("cityNameEl").textContent = name;
    document.getElementById("regionEl").textContent =
      region || result.location.country;
    document.getElementById("tempEl").textContent = Math.round(temp_c);
    document.getElementById("timeEl").textContent = formatTime(localtime);
    document.getElementById("weatherIcon").textContent = getWeatherIcon(
      condition.code,
      is_day,
    );

    // Force re-animation
    weatherCard.classList.remove("show");
    void weatherCard.offsetWidth;
    weatherCard.classList.add("show");
  } catch {
    errorBox.classList.add("show");
  } finally {
    loading.classList.remove("show");
  }
}

searchBtn.addEventListener("click", doSearch);
// cityInput.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });