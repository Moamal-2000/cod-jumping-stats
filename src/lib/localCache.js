import LZString from "lz-string";
import { decode, encode } from "msgpackr";
import { capitalize } from "./utils";

function uint8ToBase64(uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

function base64ToUint8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

export function getValueFromLocalStorage({ key, defaultValue }) {
  if (typeof window === "undefined") {
    return defaultValue;
  }

  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

export function cacheMapsLocally(mapsLocal, paramsObject) {
  if (typeof window === "undefined") {
    return;
  }

  const sourceParam = paramsObject?.source || "jh";
  const dataToCache = { maps: mapsLocal, timeStamp: Date.now() };

  const encoded = encode(dataToCache);
  const base64 = uint8ToBase64(encoded);
  const compressed = LZString.compressToUTF16(base64);

  localStorage.setItem(`${sourceParam}-mapsData`, compressed);
}

export function getCachedMaps(paramsObject) {
  if (typeof window === "undefined") {
    return null;
  }

  const sourceParam = paramsObject?.source || "jh";
  const compressed = localStorage.getItem(`${sourceParam}-mapsData`);

  if (!compressed) {
    return null;
  }

  try {
    const base64 = LZString.decompressFromUTF16(compressed);
    const bytes = base64ToUint8(base64);
    const data = decode(bytes);

    return data;
  } catch (err) {
    console.error(`Failed to decompress or decode mapsData: ${err}`);
    return null;
  }
}

export function cachePlayersLocally(playersLocal, dataType) {
  if (typeof window === "undefined") {
    return;
  }

  const dataToCache = {
    allPlayersData: playersLocal,
    timeStamp: Date.now(),
    dataType,
  };

  const encoded = encode(dataToCache);
  const base64 = uint8ToBase64(encoded);
  const compressed = LZString.compressToUTF16(base64);

  const key = `playersData${capitalize(dataType)}`;
  localStorage.setItem(key, compressed);
}

export function getCachedPlayers(dataType) {
  if (typeof window === "undefined") {
    return null;
  }

  const key = `playersData${capitalize(dataType)}`;
  const compressed = localStorage.getItem(key);
  if (!compressed) {
    return null;
  }

  try {
    const base64 = LZString.decompressFromUTF16(compressed);
    const bytes = base64ToUint8(base64);
    const data = decode(bytes);

    return data;
  } catch (err) {
    console.error(`Failed to decompress or decode playersData: ${err}`);
    return null;
  }
}
