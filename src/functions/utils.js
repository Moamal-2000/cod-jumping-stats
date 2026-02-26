import { jhApis } from "@/api/jumpersHeaven";
import {
  COUNTRIES_WITH_THE,
  GITHUB_REPO_API_URL,
  JUMP_FPS,
  MONTHS,
  NUMBER_OF_RATING_STARS,
  PAGINATION_ITEMS_PER_PAGE,
} from "@/data/constants";
import { MAPS_VIDEOS } from "@/data/mapsVideos";
import { SORT_MAPS_OPTIONS, TOP_STATS_COLOR } from "@/data/staticData";
import { encode } from "@msgpack/msgpack";
import { Buffer } from "buffer";
import LZString from "lz-string";
import { decode } from "msgpackr";

export function getMaxFinishTimesFrom(bestPlayer) {
  const topList = bestPlayer?.TopList;
  if (topList === undefined || topList === null) return 0;

  const maxFinishTimes = Math.max(...Object.values(topList));
  return maxFinishTimes;
}

export function createQueryString(name, value, searchParams, router, pathname) {
  const params = new URLSearchParams(searchParams.toString());

  params.set(name?.toLowerCase(), String(value)?.toLowerCase());
  router.push(`${pathname}?${params.toString()}`, { scroll: false });
}

export function removeQueryString(queryName, searchParams, router, pathname) {
  const params = new URLSearchParams(searchParams.toString());
  const multiDelete = Array.isArray(queryName);

  if (multiDelete) queryName?.forEach((q) => params.delete(q.toLowerCase()));
  if (!multiDelete) params.delete(queryName?.toLowerCase());

  router.push(`${pathname}?${params.toString()}`, { scroll: false });
}

export function getStatsBarStyles({
  isSkilledLeaderboard,
  top,
  times,
  maxFinishTimes,
}) {
  const backgroundColor = isSkilledLeaderboard
    ? TOP_STATS_COLOR[9 - top]
    : TOP_STATS_COLOR[top - 1];
  const height = `${(times / maxFinishTimes) * 100}%`;

  return { backgroundColor, height };
}

export function paginateData(
  items,
  pageNumber = 1,
  itemsPerPage = PAGINATION_ITEMS_PER_PAGE,
) {
  const page = Math.max(1, parseInt(pageNumber, 10) || 1);
  const startIndex = itemsPerPage * (page - 1);
  const endIndex = startIndex + itemsPerPage;

  return items?.slice(startIndex, endIndex);
}

export function getLeaderboardUrl(paramsObject) {
  const leaderboardType = paramsObject?.["leaderboard"] || "speedrun";
  const leaderboardUrls = {
    speedrun: jhApis(paramsObject).leaderboard.speedRunLeaderboard,
    skilled: jhApis(paramsObject).leaderboard.skilledLeaderboard,
    defrag: jhApis(paramsObject).leaderboard.defragLeaderboard,
    surf: jhApis(paramsObject).leaderboard.surfLeaderboard,
    routescompleted:
      jhApis(paramsObject).leaderboard.routesCompletedLeaderboard,
  };

  return leaderboardUrls[leaderboardType];
}

export function getIsLastPagination(
  data,
  paginationNumber,
  itemsPerPage = PAGINATION_ITEMS_PER_PAGE,
) {
  const lastPagination = Math.ceil(data?.length / itemsPerPage);
  return paginationNumber > lastPagination;
}

export function fetchMsgPackResponse({ url, cache = "no-store" } = {}) {
  return fetch(url, {
    headers: { Accept: "application/msgpack", "Accept-Encoding": "gzip" },
    cache,
  });
}

export async function decodeAsyncData(response, datatype = "arraybuffer") {
  try {
    if (!response || !response.ok) {
      console.warn(
        "Invalid response in decodeAsyncData:",
        response?.status,
        response?.statusText,
      );
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return decode(
      datatype === "arraybuffer" ? arrayBuffer : new Uint8Array(arrayBuffer),
    );
  } catch (error) {
    console.error("Error decoding data:", error);
    console.error("Buffer length:", uint8Array?.length || "unknown");
    console.error("Response status:", response?.status);
    console.error("Response headers:", response?.headers);
    return null;
  }
}

export function formateReleaseDate(dateStr) {
  if (!dateStr) return "Unknown";
  const [year, month, day] = dateStr.split("-");
  return `${MONTHS[+month]} ${day}, ${year}`;
}

export function modifyMapsData(mapsData = []) {
  const now = Date.now();
  const dateBeforeMonth = now - 30 * 24 * 60 * 60 * 1000;
  const currentYear = new Date().getFullYear();

  return mapsData.map((mapData) => {
    const requiredVideos = getRequiredMapVideos(mapData);
    const isReleasedInThisYear = mapData?.Released?.startsWith(currentYear);

    mapData.Classifications = mapData?.Type
      ? [mapData?.Type?.toLowerCase()]
      : [];
    if (requiredVideos) mapData.Videos = requiredVideos;

    if (mapData?.Released && isReleasedInThisYear) {
      const releaseDate = new Date(mapData.Released).getTime();

      if (releaseDate >= dateBeforeMonth) {
        mapData.Classifications.push("new");
      }
    }

    return mapData;
  });
}

export function getRequiredMapVideos(mapData) {
  const requiredVideos = MAPS_VIDEOS.find((item) =>
    item.mapsIds.includes(mapData.CpID),
  )?.videos;

  return requiredVideos || [];
}

export function getStarsText(text) {
  const solidStars = "★".repeat(text);
  const emptyStars = "☆".repeat(NUMBER_OF_RATING_STARS - text);
  return solidStars + emptyStars;
}

export function getSortByLabel(value) {
  if (!value) return "Newest First";

  for (const group of SORT_MAPS_OPTIONS) {
    const option = group.groupOptions.find((opt) => opt.value === value);
    if (option) return option.label;
  }

  return "Newest First";
}

export function openVideo(videos, videoIndex) {
  if (typeof window === "undefined") return;

  const videoUrl = videos[videoIndex]?.videoUrl;
  if (!videoUrl) return;

  window.open(videoUrl, "_blank");
}

export function stripColorCodes(name) {
  if (!name) return "";
  // Remove color codes like ^1, ^2, etc. from player names
  return name.replace(/\^\d/g, "");
}

export function getCodServers(servers = []) {
  return servers.reduce((groups, server) => {
    const gameType = server.GameType;
    if (!groups[gameType]) groups[gameType] = [];

    groups[gameType].push(server);
    return groups;
  }, {});
}

export function getCountryFlag(domain) {
  let country = domain.split(".")[0];
  if (country === "uk") country = "gb";
  return `/countryFlags/${country}.svg`;
}

export function getGameTypes(groupedServers) {
  return Object.keys(groupedServers).sort(
    (a, b) => a.replace(/\D/g, "") - b.replace(/\D/g, ""),
  );
}

export async function generateMapMetadata({ cpid }) {
  try {
    const map = await getMapByCpId(cpid);
    const mapTitle = map?.Name ? map.Name : `Map ID ${cpid}`;

    return {
      title: `${mapTitle} | JumpersHeaven`,
      description: "Generated by create next app",
    };
  } catch (error) {
    return {
      title: `Map | JumpersHeaven`,
      description: "Explore detailed map information on JumpersHeaven.",
    };
  }
}

export async function generatePlayerMetadata({ playerId }) {
  try {
    const player = await getPlayerById({ playerId });
    const prefName = stripColorCodes(player?.PrefName);
    const playerTitle = prefName ? prefName : `Player ID ${playerId}`;

    return {
      title: `${playerTitle} | JumpersHeaven`,
      description: "Generated by create next app",
    };
  } catch (error) {
    return {
      title: `Player details | JumpersHeaven`,
      description: "Explore detailed player information on JumpersHeaven.",
    };
  }
}

export async function getMapByCpId(cpid, datatype) {
  if (cpid === undefined) {
    console.error("map cpid is undefined");
    return null;
  }

  const response = await fetchMsgPackResponse({ url: jhApis().map.allMaps });
  const maps = (await decodeAsyncData(response, datatype)) ?? [];

  return maps.find((map) => +map.CpID === +cpid);
}

export async function getPlayerById({ playerId, datatype }) {
  if (playerId === undefined) {
    console.error("playerId is undefined");
    return null;
  }

  const response = await fetchMsgPackResponse({ url: jhApis().player.all });
  const players = (await decodeAsyncData(response, datatype)) ?? [];

  return players.find((player) => +player.PlayerID === +playerId);
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

export function getMostFinishedMap(mapsData) {
  return mapsData.reduce((map, currentMap) => {
    if (map.IndividualFinishCount > currentMap.IndividualFinishCount)
      return map;

    return currentMap;
  });
}

export function getMapCompletionRate({ allMaps, IndividualFinishCount }) {
  const mostFinishedMap = getMostFinishedMap(allMaps);
  const mostFinishedCount = mostFinishedMap.IndividualFinishCount;
  const completionRate = (
    (IndividualFinishCount / mostFinishedCount) *
    100
  ).toFixed(2);

  return +completionRate || 0;
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

export function mapHasDifficulties(Difficulty) {
  return JUMP_FPS.some(
    (fps) => getFpsDifficultyValue({ fps, Difficulty }) !== "?",
  );
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

export function getMapsAuthors(maps = []) {
  const seen = new Map();

  maps.forEach(({ Author }) => {
    if (!Author) return;

    const authors = extractAuthorNames(Author);
    if (authors.length === 0) return;

    const mapAuthorKeys = new Set();

    authors.forEach((authorName) => {
      const normalizedKey = normalizeAuthor(authorName);
      if (!normalizedKey || mapAuthorKeys.has(normalizedKey)) return;

      mapAuthorKeys.add(normalizedKey);
      const existingAuthor = seen.get(normalizedKey);
      const isNew = !existingAuthor;
      const isShorterLabel =
        authorName.length < (existingAuthor?.label?.length ?? Infinity);

      if (isNew) {
        seen.set(normalizedKey, {
          id: normalizedKey,
          label: authorName,
          value: authorName,
          madeMapsCount: 1,
        });
        return;
      }

      if (isShorterLabel) {
        existingAuthor.label = authorName;
        existingAuthor.value = authorName;
      }

      existingAuthor.madeMapsCount += 1;
    });
  });

  return Array.from(seen.values());
}

function extractAuthorNames(authorText = "") {
  const text = String(authorText).trim();
  if (!text) return [];

  const hasByKeyword = text.toLowerCase().includes("by");
  let byKeyWordMatches = [];

  if (hasByKeyword) {
    const matches = text.matchAll(/\bby\b\s*:?\s*([^()]+)/gi);
    byKeyWordMatches = Array.from(matches, (match) => match[1]?.trim());
  }

  const sourceChunks =
    byKeyWordMatches.length > 0 ? [text, ...byKeyWordMatches] : [text];
  const authors = sourceChunks.flatMap(splitAuthorChunk).filter(isLikelyAuthor);

  return Array.from(new Set(authors));
}

function splitAuthorChunk(chunk = "") {
  return chunk
    .replace(/\([^)]*\)|\[[^\]]*\]/g, " ")
    .split(/\s*(?:,|&|\/|\+|\band\b|\bfeat\.?\b|\bft\.?\b)\s*/i)
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeAuthor(author) {
  return author
    .toLowerCase()
    .trim()
    .replace(/[?!.,#'"]+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/\s/g, "");
}

function isLikelyAuthor(author) {
  const hasAnd = /&|\band\b/i.test(author);
  if (hasAnd) return false;

  let score = 0;

  const has15Char = author.length >= 15;
  const has3Words = author.split(/\s+/).length >= 3;
  const hasNumber = /\d/.test(author);
  const hasParenthesis = /[()]/.test(author);
  const hasKeywords = /\b(by|version|reworked|ported|finished)\b/i.test(author);

  if (has15Char) score += 1;
  if (has3Words) score += 2;
  if (hasNumber) score += 1;
  if (hasParenthesis) score += 2;
  if (hasKeywords) score += 2;

  return score < 3;
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

export function formateTimeBySeconds(seconds) {
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

export function getGraphRunTimes(graphPoints = []) {
  const maxRunSeconds = graphPoints[0]?.rawData?.TimePlayed || 0;
  const averageRun = formateTimeBySeconds(maxRunSeconds / 2);

  const allTimePlayed = graphPoints.map(
    (point) => point?.rawData?.TimePlayedString,
  );

  const biggestTime =
    allTimePlayed.toSorted(
      (a, b) => toSecondsFlexible(b) - toSecondsFlexible(a),
    )[0] || "";

  const biggestTimeSeconds = toSecondsFlexible(biggestTime);
  const maxRunString = graphPoints[0]?.rawData?.TimePlayedString || "0";
  const formattedMaxRunString = maxRunString.replace(/\.\d+/g, "");

  return [
    {
      seconds: 7,
      formattedTime: "0:00",
    },
    {
      seconds: biggestTimeSeconds / 2,
      formattedTime: averageRun,
    },
    {
      seconds: biggestTimeSeconds - 5,
      formattedTime: formattedMaxRunString,
    },
  ];
}

export async function fetchAllTopRuns({ mapId }) {
  try {
    const topRunsPromises = JUMP_FPS.map(async (fps) => {
      const response = await fetchMsgPackResponse({
        url: jhApis({ fps, cpId: mapId }).map.tops,
      });
      const topRunsByFps = await decodeAsyncData(response);

      if (Array.isArray(topRunsByFps))
        return topRunsByFps.map((run) => ({ ...run, fps }));

      return [];
    });

    return await Promise.all(topRunsPromises);
  } catch (error) {
    console.error(`Error fetching top runs: ${error}`);
  }
}

export function formateDateExcludeTime(dateString) {
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

export async function fetchPlayers({ sort }) {
  try {
    const response = await fetchMsgPackResponse({
      url: jhApis({ sort }).player.all,
    });
    return (await decodeAsyncData(response)) ?? [];
  } catch (error) {
    console.error(`Error fetching players: ${error}`);
    return [];
  }
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

export async function fetchProjectRepo() {
  try {
    const response = await fetch(GITHUB_REPO_API_URL);
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(` Error fetching repo stars: ${error}`);
    return [];
  }
}
