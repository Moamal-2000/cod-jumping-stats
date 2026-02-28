import { COUNTRIES_WITH_THE, MONTHS } from "@/data/constants";
import { encode } from "@msgpack/msgpack";
import { Buffer } from "buffer";
import LZString from "lz-string";
import { decode } from "msgpackr";

export function formateReleaseDate(dateStr) {
  if (!dateStr) return "Unknown";
  const [year, month, day] = dateStr.split("-");
  return `${MONTHS[+month]} ${day}, ${year}`;
}

export function stripColorCodes(name) {
  if (!name) return "";
  // Remove color codes like ^1, ^2, etc. from player names
  return name.replace(/\^\d/g, "");
}

export function domainToCountryFlag(domain) {
  let country = domain.split(".")[0];
  if (country === "uk") country = "gb";
  return `/countryFlags/${country}.svg`;
}

export function getCountryName(countryCode) {
  if (!countryCode) return "Unknown Country";

  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode) || "Unknown Country";
  } catch (e) {
    return "Unknown Country";
  }
}

export function getFormattedCountryName(code) {
  const name = getCountryName(code);
  return COUNTRIES_WITH_THE.has(name) ? `the ${name}` : name;
}

export function getValueFromLocalStorage({ key, defaultValue }) {
  if (typeof window === "undefined") return defaultValue;

  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

export function formatDate(dateStr, fallback) {
  if (!dateStr) return fallback;

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return dateStr;
  }

  return date.toLocaleDateString();
}

export function cacheMapsLocally(mapsLocal) {
  if (typeof window === "undefined") return;

  const dataToCache = { maps: mapsLocal, timeStamp: Date.now() };

  const encoded = encode(dataToCache);
  const base64 = Buffer.from(encoded).toString("base64");
  const compressed = LZString.compressToUTF16(base64);

  localStorage.setItem("mapsData", compressed);
}

export function cachePlayersLocally(playersLocal, dataType) {
  if (typeof window === "undefined") return;

  const dataToCache = {
    allPlayersData: playersLocal,
    timeStamp: Date.now(),
    dataType,
  };

  const encoded = encode(dataToCache);
  const base64 = Buffer.from(encoded).toString("base64");
  const compressed = LZString.compressToUTF16(base64);

  const key = `playersData${capitalize(dataType)}`;
  localStorage.setItem(key, compressed);
}

export function getCachedMaps() {
  if (typeof window === "undefined") return null;

  const compressed = localStorage.getItem("mapsData");
  if (!compressed) return null;

  try {
    const base64 = LZString.decompressFromUTF16(compressed);
    const bytes = new Uint8Array(Buffer.from(base64, "base64"));
    const data = decode(bytes);

    return data;
  } catch (err) {
    console.error(`Failed to decompress or decode mapsData: ${err}`);
    return null;
  }
}

export function getFpsDifficultyValue({ fps, Difficulty } = {}) {
  const diff = Difficulty?.[fps];
  if (!diff || diff?.Difficulty < 0) return "?";
  return Number(diff.Difficulty).toFixed(2);
}

export function kebabCase(str) {
  return str.toLowerCase().split(" ").join("-");
}

export function getCachedPlayers(dataType) {
  if (typeof window === "undefined") return null;

  const key = `playersData${capitalize(dataType)}`;
  const compressed = localStorage.getItem(key);
  if (!compressed) return null;

  try {
    const base64 = LZString.decompressFromUTF16(compressed);
    const bytes = new Uint8Array(Buffer.from(base64, "base64"));
    const data = decode(bytes);

    return data;
  } catch (err) {
    console.error(`Failed to decompress or decode playersData: ${err}`);
    return null;
  }
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTimeObj(getSeconds) {
  const totalMinutes = Math.floor(getSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = getSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export function formatTimeBySeconds(seconds) {
  const { days, hours, minutes, seconds: sec } = getTimeObj(seconds);

  if (days > 0) return `${days}:${hours}:${minutes}:${sec}`;
  if (hours > 0) return `${hours}:${minutes}:${sec}`;
  if (minutes > 0) return `${minutes}:${sec}`;
  if (seconds > 0) return `${sec}`;

  return seconds || 0;
}

export function toSecondsFlexible(timeStr = "") {
  const parts = timeStr.split(":").map(Number);
  let seconds = 0;

  for (let i = 0; i < parts.length; i++) {
    const indexFromRight = parts.length - 1 - i;
    if (i === 0) {
      seconds += parts[indexFromRight];
    } else if (i === 1) {
      seconds += parts[indexFromRight] * 60;
    } else if (i === 2) {
      seconds += parts[indexFromRight] * 3600;
    } else if (i === 3) {
      seconds += parts[indexFromRight] * 3600 * 24;
    }
  }

  return seconds;
}

export function formatDateExcludeTime(dateString) {
  if (!dateString) return null;

  const isoString = dateString.replace(" ", "T");
  const date = new Date(isoString);

  if (isNaN(date)) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isNewMap(releaseDate) {
  const now = Date.now();
  const dateBeforeMonth = now - 30 * 24 * 60 * 60 * 1000;
  const currentYear = new Date().getFullYear();
  const isReleasedInThisYear = releaseDate?.startsWith(currentYear);

  if (!releaseDate && !isReleasedInThisYear) return false;

  const releaseDateMilliSeconds = new Date(releaseDate).getTime();
  return releaseDateMilliSeconds >= dateBeforeMonth;
}

export function getMapAverageDifficulty(map = {}) {
  const difficulties = map.Difficulty ? Object.values(map.Difficulty) : [];

  if (difficulties.length > 0) {
    const allDifficultiesSummed = difficulties.reduce(
      (sum, d) => sum + (d.Difficulty || 0),
      0,
    );

    return allDifficultiesSummed / difficulties.length;
  }

  return 0;
}

export function getCleanMapName(mapName) {
  if (!mapName) return "unknown";
  return mapName?.toLowerCase().replace(/[^a-z0-9_]/g, "");
}
