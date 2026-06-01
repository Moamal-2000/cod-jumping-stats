import { getPlayerBadges } from "@/components/Pages/PlayersPage/PlayerCard/PlayerBadges/PlayerBadges";
import { PAGINATION_ITEMS_PER_PAGE } from "@/data/constants";
import { MAPS_VIDEOS } from "@/data/mapsVideos";
import { COD2_COLORS } from "@/data/staticData";
import { getCountryName, kebabCase, stripColorCodes } from "./utils";

export function getLastSeenCategories(lastSeen) {
  const now = new Date();
  const seenDate = new Date(lastSeen);
  const diffInMs = now - seenDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  const filters = ["today", "this week", "this month", "long time"];

  if (diffInDays < 1) {
    return filters.slice(0, 3);
  }
  if (diffInDays <= 7) {
    return filters.slice(1, 3);
  }
  if (diffInDays <= 30) {
    return filters.slice(2, 4);
  }
  return [filters.at(-1)];
}

export function matchesFilterKey(lastSeen, filterKey) {
  const filters = getLastSeenCategories(lastSeen);
  return filters?.includes(filterKey);
}

export function getLastSeenLeaderboard(data, filterKey) {
  if (!filterKey) {
    return data;
  }
  return data?.filter((item) => matchesFilterKey(item.LastSeen, filterKey));
}

export function getRegionLeaderboard(data, filterKey) {
  if (!filterKey) {
    return data;
  }
  return data?.filter((item) => item?.Region?.toLowerCase() === filterKey);
}

export function getFilteredMaps(mapsData, paramsObject) {
  const mapType = paramsObject?.type || "all";
  const shouldFilterByType = mapType !== "all";

  let filteredData = mapsData;

  if (shouldFilterByType) {
    filteredData = mapsData.filter((map) => {
      const mapTypeLower = map.Type?.toLowerCase() || "all";
      return mapTypeLower === mapType;
    });
  }

  return filteredData;
}

export function getSortedMaps(mapsData, paramsObject) {
  const sortType = paramsObject?.["sort-by"] || "125 difficulty";
  const difficultyByFps = parseInt(sortType, 10);
  const isDifficultyByFps = !isNaN(difficultyByFps);

  let filteredMaps = mapsData;

  if (isDifficultyByFps) {
    filteredMaps = sortByDifficultyFps(mapsData, difficultyByFps);
  }

  return filteredMaps;
}

export function sortByDifficultyFps(mapsData, difficultyByFps) {
  return mapsData.toSorted((a, b) => {
    const difficultyA = a.Difficulty?.[difficultyByFps]?.Difficulty ?? 0;
    const difficultyB = b.Difficulty?.[difficultyByFps]?.Difficulty ?? 0;
    return difficultyA - difficultyB;
  });
}

export function getFilteredLeaderboard(leaderboardData, paramsObject) {
  const lastSeenFilter = paramsObject?.["last-seen"];
  const regionFilter = paramsObject?.["region"];

  let filteredData = leaderboardData;

  if (lastSeenFilter) {
    filteredData = getLastSeenLeaderboard(filteredData, lastSeenFilter);
  }

  if (regionFilter) {
    filteredData = getRegionLeaderboard(filteredData, regionFilter);
  }

  return filteredData;
}

export function getMapsByParams({ mapsData, paramsObject }) {
  const mapType = paramsObject?.type || "all";
  const sortBy = paramsObject?.["sort-by"] || "completions-high-to-low";
  const filterBy = paramsObject?.["filter-by"] || "all";
  const nameQuery = paramsObject?.name || "";
  const authorQuery = paramsObject?.author || "";

  let filteredMaps =
    mapType !== "all" ? getFilteredMaps(mapsData, paramsObject) : mapsData;

  filteredMaps = filterMapsByName(filteredMaps, nameQuery);
  filteredMaps = filterMapsByAuthor(filteredMaps, authorQuery);
  filteredMaps = modifyMapsData(filteredMaps);

  if (filterBy !== "all") {
    filteredMaps = filterMapsByVideos(filteredMaps, filterBy);
  }

  return sortMaps(filteredMaps, sortBy);
}

export function filterMapsByName(maps, nameQuery) {
  if (!nameQuery) {
    return maps;
  }

  const normalizedQuery = nameQuery.toLowerCase().trim();

  return maps.filter((map) => {
    const mapNameLower = map.Name.toLowerCase();
    const mapNameSpaced = mapNameLower.replace(/[_-]/g, " ");

    return (
      mapNameSpaced.includes(normalizedQuery) ||
      mapNameLower.includes(normalizedQuery)
    );
  });
}

export function filterMapsByAuthor(maps, authorQuery) {
  if (!authorQuery) {
    return maps;
  }

  const normalizedAuthor = authorQuery.toLowerCase();

  return maps.filter((map) =>
    map?.Author?.toLowerCase()?.includes(normalizedAuthor),
  );
}

export function sortMaps(maps, sortBy) {
  if (!maps || maps.length === 0) {
    return maps;
  }

  const sortedMaps = [...maps];

  switch (sortBy) {
    case "newest":
      return sortedMaps.sort(
        (a, b) => new Date(b.Released) - new Date(a.Released),
      );

    case "oldest":
      return sortedMaps.sort(
        (a, b) => new Date(a.Released) - new Date(b.Released),
      );

    case "name-a-z":
      return sortedMaps.sort((a, b) =>
        (a.Name || "").localeCompare(b.Name || ""),
      );

    case "name-z-a":
      return sortedMaps.sort((a, b) =>
        (b.Name || "").localeCompare(a.Name || ""),
      );

    case "completions-high-to-low":
      return sortedMaps.sort(
        (a, b) =>
          (b.IndividualFinishCount || 0) - (a.IndividualFinishCount || 0),
      );

    case "completions-low-to-high":
      return sortedMaps.sort(
        (a, b) =>
          (a.IndividualFinishCount || 0) - (b.IndividualFinishCount || 0),
      );

    default: {
      // If sortBy is a number, treat it as FPS difficulty
      const sortByNumber = parseInt(sortBy, 10);
      if (!isNaN(sortByNumber)) {
        return getMapsByFpsDifficulty({ sortedMaps, fps: sortByNumber });
      }

      return sortedMaps;
    }
  }
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
    if (requiredVideos) {
      mapData.Videos = requiredVideos;
    }

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

export function getMostFinishedMap(mapsData) {
  return mapsData.reduce((map, currentMap) => {
    if (map.IndividualFinishCount > currentMap.IndividualFinishCount) {
      return map;
    }

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

export function getMapsByFpsDifficulty({ sortedMaps, fps }) {
  return sortedMaps.sort((a, b) => {
    const difficultyA = a.Difficulty?.[fps]?.Difficulty ?? -1;
    const difficultyB = b.Difficulty?.[fps]?.Difficulty ?? -1;

    if (difficultyA < 0 && difficultyB < 0) {
      return 0;
    }
    if (difficultyA < 0) {
      return 1;
    }
    if (difficultyB < 0) {
      return -1;
    }
    return difficultyB - difficultyA;
  });
}

export function filterMapsByVideos(maps, filterBy = "all") {
  if (!maps || maps.length === 0 || filterBy === "all") {
    return maps;
  }

  return maps.filter((map) => {
    const hasVideos = map?.Videos?.length > 0;

    return (
      (hasVideos && filterBy === "has-videos") ||
      (!hasVideos && filterBy === "no-videos")
    );
  });
}

export function getPlayersByParams({ allPlayersData, paramsObject }) {
  const searchByName = paramsObject?.name || "";
  const searchById = paramsObject?.id || "";
  const badge = paramsObject?.badge || "all";
  const country = paramsObject?.country || "";
  const charCount = paramsObject?.charcount || "";
  const lastSeenYear = paramsObject?.lastseenyear || "";
  const colorStatus = paramsObject?.colorstatus || "all";
  const colors = paramsObject?.colors || "";

  let filteredPlayers = allPlayersData;

  if (searchByName) {
    filteredPlayers = filterPlayersByName(filteredPlayers, searchByName);
  }
  if (searchById) {
    filteredPlayers = filterPlayersById(filteredPlayers, searchById);
  }
  if (badge !== "all") {
    filteredPlayers = filterPlayersByBadge(filteredPlayers, badge);
  }
  if (country) {
    filteredPlayers = filterPlayersByCountry(filteredPlayers, country);
  }
  if (charCount) {
    filteredPlayers = filterPlayersByCharacterCount(filteredPlayers, charCount);
  }
  if (lastSeenYear) {
    filteredPlayers = filterPlayersByLastSeenYear(
      filteredPlayers,
      lastSeenYear,
    );
  }
  if (colorStatus !== "all") {
    filteredPlayers = filterPlayersByColorStatus(filteredPlayers, colorStatus);
  }
  if (colors) {
    filteredPlayers = filterPlayersByColors(filteredPlayers, colors);
  }

  return filteredPlayers;
}

export function filterPlayersByName(allPlayersData, nameQuery) {
  return allPlayersData.filter((player) => {
    const playerPrefName = player.PrefName?.toLowerCase();
    const playerName = player.PlayerName?.toLowerCase();

    return (
      stripColorCodes(playerName).includes(nameQuery) ||
      stripColorCodes(playerPrefName).includes(nameQuery)
    );
  });
}

export function filterPlayersById(allPlayersData, playerId) {
  if (playerId === undefined) {
    return allPlayersData;
  }
  return allPlayersData.filter((player) =>
    `${player.PlayerID}`.includes(playerId),
  );
}

export function filterPlayersByBadge(allPlayersData, nameQuery) {
  if (nameQuery === "all" || nameQuery === undefined) {
    return allPlayersData;
  }

  return allPlayersData.filter(
    ({ PlayerID, Banned, Donated, Admin, LastSeen }) => {
      const playerBadges = getPlayerBadges({
        cssModule: {},
        PlayerID,
        Banned,
        Donated,
        Admin,
        LastSeen,
      });

      const selectedBadge = playerBadges.find(
        (badge) => kebabCase(badge.label) === nameQuery,
      );

      return selectedBadge?.displayCondition || false;
    },
  );
}

export function filterPlayersByCountry(allPlayersData, country) {
  if (!country) {
    return allPlayersData;
  }

  return allPlayersData.filter((player) =>
    getCountryName(player.Country)
      .toLowerCase()
      .includes(country.toLowerCase()),
  );
}

export function getProcessedTopRuns(topRuns, paramsObject) {
  if (!topRuns) {
    return [];
  }
  const rank = paramsObject?.rank || "all";
  const sort = paramsObject?.sort || "rank";

  let filteredData = topRuns;

  if (rank !== "all") {
    filteredData = getTopRunsByRank(filteredData, rank);
  }

  if (sort !== "rank") {
    filteredData = getSortedTopRuns(filteredData, sort);
  }

  return filteredData;
}

export function getTopRunsByRank(topRuns = [], rank) {
  if (rank === "1") {
    return topRuns.filter((run) => run.Rank === 1);
  }
  if (rank === "1-10") {
    return topRuns.filter((run) => run.Rank > 0 && run.Rank <= 10);
  }

  return topRuns;
}

export function getSortedTopRuns(topRuns = [], sort) {
  if (sort === "time") {
    return topRuns.toSorted((a, b) => a.TimePlayed - b.TimePlayed);
  }

  if (sort === "date") {
    return topRuns.toSorted(
      (a, b) =>
        new Date(b.TimeCreated).getTime() - new Date(a.TimeCreated).getTime(),
    );
  }

  if (sort === "nade") {
    return topRuns.toSorted((a, b) => a.Nadejumps - b.Nadejumps);
  }

  return topRuns;
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

export function getIsLastPagination(
  data,
  paginationNumber,
  itemsPerPage = PAGINATION_ITEMS_PER_PAGE,
) {
  const lastPagination = Math.ceil(data?.length / itemsPerPage);
  return paginationNumber > lastPagination;
}

export function comboboxCountryNames({
  allData = [],
  fullCountryName = false,
} = {}) {
  const uniqueCountryNames = [
    ...new Set(allData.map((player) => player.Country)),
  ];

  return uniqueCountryNames.reduce((acc, country) => {
    if (!country || country === "N/A") {
      return acc;
    }

    const hasParentheses = new RegExp("[()]").test(country);
    const baseCountryName = country.slice(0, country.indexOf("(") - 1);
    let normalizedCountry = hasParentheses ? baseCountryName : country;

    if (fullCountryName) {
      normalizedCountry = getCountryName(normalizedCountry);
    }

    const count = allData.reduce((acc, player) => {
      if (player.Country === country) {
        acc += 1;
      }
      return acc;
    }, 0);

    const countryObject = {
      value: normalizedCountry.toLowerCase(),
      label: normalizedCountry,
      id: country,
      count,
    };

    return [...acc, countryObject];
  }, []);
}

export function filterPlayersByCharacterCount(allPlayersData, charCountRange) {
  if (!charCountRange) {
    return allPlayersData;
  }

  const [min, max] = charCountRange.split("-").map((n) => parseInt(n, 10));

  return allPlayersData.filter((player) => {
    const playerName = stripColorCodes(
      player.PlayerName || player.PrefName || "",
    );
    const charLength = playerName.length;

    if (!isNaN(min) && !isNaN(max)) {
      return charLength >= min && charLength <= max;
    }
    if (!isNaN(min)) {
      return charLength >= min;
    }
    if (!isNaN(max)) {
      return charLength <= max;
    }

    return true;
  });
}

export function filterPlayersByLastSeenYear(allPlayersData, year) {
  if (!year) {
    return allPlayersData;
  }

  const selectedYear = parseInt(year, 10);

  if (isNaN(selectedYear)) {
    return allPlayersData;
  }

  return allPlayersData.filter((player) => {
    const playerLastSeen = new Date(player.LastSeen);
    const playerYear = playerLastSeen.getFullYear();
    return playerYear === selectedYear;
  });
}

export function filterPlayersByColorStatus(allPlayersData, colorStatus) {
  if (colorStatus === "all") {
    return allPlayersData;
  }

  const colorCodeRegex = /\^\d/g;

  if (colorStatus === "colored") {
    return allPlayersData.filter((player) =>
      colorCodeRegex.test(player.PlayerName || player.PrefName || ""),
    );
  }

  if (colorStatus === "non-colored") {
    return allPlayersData.filter(
      (player) =>
        !colorCodeRegex.test(player.PlayerName || player.PrefName || ""),
    );
  }

  return allPlayersData;
}

export function filterPlayersByColors(allPlayersData, colorsList) {
  if (!colorsList || !colorsList.trim()) {
    return allPlayersData;
  }

  const inputColors = colorsList.split(",").map((c) => c.trim().toLowerCase());
  const selectedSet = new Set();

  inputColors.forEach((input) => {
    if (Object.prototype.hasOwnProperty.call(COD2_COLORS, input)) {
      selectedSet.add(input);
    } else {
      const code = Object.keys(COD2_COLORS).find(
        (key) => COD2_COLORS[key] === input,
      );

      if (code !== undefined) {
        selectedSet.add(code);
      }
    }
  });

  if (selectedSet.size === 0) {
    return [];
  }

  const colorCodeRegex = /\^(\d)/g;

  return allPlayersData.filter((player) => {
    const playerName = player.PlayerName || player.PrefName || "";

    const playerMatches = [...playerName.matchAll(colorCodeRegex)];
    const playerSet = new Set(playerMatches.map((m) => m[1]));

    if (playerSet.size === 0) {
      return false;
    }

    if (playerSet.size !== selectedSet.size) {
      return false;
    }

    for (const color of playerSet) {
      if (!selectedSet.has(color)) {
        return false;
      }
    }

    return true;
  });
}
