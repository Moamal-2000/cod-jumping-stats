import { jhApis } from "@/api/jumpersHeaven";
import {
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

  params.delete(queryName?.toLowerCase());
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

export function paginateData(items, pageNumber = 1) {
  const page = Math.max(1, parseInt(pageNumber, 10) || 1);
  const startIndex = PAGINATION_ITEMS_PER_PAGE * (page - 1);
  const endIndex = startIndex + PAGINATION_ITEMS_PER_PAGE;

  return items?.slice(startIndex, endIndex);
}

export function getLeaderboardUrl(paramsObject) {
  const leaderboardType = paramsObject?.["leaderboard"] || "speedrun";
  const leaderboardUrls = {
    speedrun: jhApis(paramsObject).leaderboard.getSpeedRunLeaderboard,
    skilled: jhApis(paramsObject).leaderboard.getSkilledLeaderboard,
    defrag: jhApis(paramsObject).leaderboard.getDefragLeaderboard,
    surf: jhApis(paramsObject).leaderboard.getSurfLeaderboard,
    routescompleted:
      jhApis(paramsObject).leaderboard.getRoutesCompletedLeaderboard,
  };

  return leaderboardUrls[leaderboardType];
}

export function getIsLastPagination(data, paginationNumber) {
  const lastPagination = Math.ceil(data?.length / PAGINATION_ITEMS_PER_PAGE);
  return paginationNumber > lastPagination;
}

export function fetchMsgPackResponse({ url, cache } = {}) {
  return fetch(url, {
    headers: { Accept: "application/msgpack", "Accept-Encoding": "gzip" },
    cache,
  });
}

export async function decodeAsyncData(response) {
  try {
    if (!response || !response.ok) {
      console.warn(
        "Invalid response in decodeAsyncData:",
        response?.status,
        response?.statusText
      );
      return null;
    }

    const buffer = await response.arrayBuffer();
    return decode(buffer);
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
  return MAPS_VIDEOS.find((video) => {
    const hasMatchedMap =
      video.mapName === mapData.Name && video.mapId === mapData.CpID;

    if (video.mapHasRoutes) {
      const hasMatchRoute = video.videos.find(
        ({ route }) => route === mapData.Ender
      );

      return hasMatchedMap && hasMatchRoute;
    }

    return hasMatchedMap;
  })?.videos;
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
  const country = domain.split(".")[0];
  const flagPath = `/countryFlags/${country}.svg`;
  return flagPath;
}

export function getGameTypes(groupedServers) {
  return Object.keys(groupedServers).sort(
    (a, b) => a.replace(/\D/g, "") - b.replace(/\D/g, "")
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

export async function getMapByCpId(cpid) {
  if (cpid === undefined) {
    console.error("map cpid is undefined");
    return null;
  }

  const response = await fetchMsgPackResponse({
    url: jhApis().map.getAllMaps,
    cache: "no-cache",
  });
  const maps = await decodeAsyncData(response);

  return maps.find((map) => +map.CpID === +cpid);
}

export async function getPlayerById({ playerId }) {
  if (playerId === undefined) {
    console.error("playerId is undefined");
    return null;
  }

  const response = await fetchMsgPackResponse({
    url: jhApis().player.getAll,
    cache: "no-cache",
  });
  const players = await decodeAsyncData(response);

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

export function getRankCategory(rank) {
  if (rank === 1) return "rank1";
  if (rank === 2) return "rank2";
  if (rank === 3) return "rank3";
  if (rank >= 4 && rank <= 10) return "rank4to10";
  if (rank >= 11 && rank <= 20) return "rank10to20";
  return "rankBelow20";
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
    (fps) => getFpsDifficultyValue({ fps, Difficulty }) !== "?"
  );
}
