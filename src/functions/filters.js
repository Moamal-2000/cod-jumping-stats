import { modifyMapsData, stripColorCodes } from "./utils";

export function getLastSeenCategories(lastSeen) {
  const now = new Date();
  const seenDate = new Date(lastSeen);
  const diffInMs = now - seenDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  const filters = ["today", "this week", "this month", "long time"];

  if (diffInDays < 1) return filters.slice(0, 3);
  if (diffInDays <= 7) return filters.slice(1, 3);
  if (diffInDays <= 30) return filters.slice(2, 4);
  return [filters.at(-1)];
}

export function matchesFilterKey(lastSeen, filterKey) {
  const filters = getLastSeenCategories(lastSeen);
  return filters?.includes(filterKey);
}

export function getLastSeenLeaderboard(data, filterKey) {
  if (!filterKey) return data;
  return data?.filter((item) => matchesFilterKey(item.LastSeen, filterKey));
}

export function getRegionLeaderboard(data, filterKey) {
  if (!filterKey) return data;
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
  const difficultyByFps = parseInt(sortType);
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

  if (lastSeenFilter)
    filteredData = getLastSeenLeaderboard(filteredData, lastSeenFilter);

  if (regionFilter)
    filteredData = getRegionLeaderboard(filteredData, regionFilter);

  return filteredData;
}

export function getMapsByParams({ mapsData, paramsObject }) {
  const mapType = paramsObject?.type || "all";
  const sortBy = paramsObject?.["sort-by"] || "newest";
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
  if (!nameQuery) return maps;

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
  if (!authorQuery) return maps;

  const normalizedAuthor = authorQuery.toLowerCase();

  return maps.filter((map) =>
    map?.Author?.toLowerCase()?.includes(normalizedAuthor)
  );
}

export function sortMaps(maps, sortBy) {
  if (!maps || maps.length === 0) return maps;

  const sortedMaps = [...maps];

  switch (sortBy) {
    case "newest":
      return sortedMaps.sort(
        (a, b) => new Date(b.Released) - new Date(a.Released)
      );

    case "oldest":
      return sortedMaps.sort(
        (a, b) => new Date(a.Released) - new Date(b.Released)
      );

    case "name-a-z":
      return sortedMaps.sort((a, b) =>
        (a.Name || "").localeCompare(b.Name || "")
      );

    case "name-z-a":
      return sortedMaps.sort((a, b) =>
        (b.Name || "").localeCompare(a.Name || "")
      );

    case "completions-high-to-low":
      return sortedMaps.sort(
        (a, b) =>
          (b.IndividualFinishCount || 0) - (a.IndividualFinishCount || 0)
      );

    case "completions-low-to-high":
      return sortedMaps.sort(
        (a, b) =>
          (a.IndividualFinishCount || 0) - (b.IndividualFinishCount || 0)
      );

    default:
      // If sortBy is a number, treat it as FPS difficulty
      if (parseInt(sortBy))
        return getMapsByFpsDifficulty({ sortedMaps, fps: parseInt(sortBy) });

      return sortedMaps;
  }
}

export function getMapsByFpsDifficulty({ sortedMaps, fps }) {
  return sortedMaps.sort((a, b) => {
    const difficultyA = a.Difficulty?.[fps]?.Difficulty ?? -1;
    const difficultyB = b.Difficulty?.[fps]?.Difficulty ?? -1;

    if (difficultyA < 0 && difficultyB < 0) return 0;
    if (difficultyA < 0) return 1;
    if (difficultyB < 0) return -1;
    return difficultyB - difficultyA;
  });
}

export function filterMapsByVideos(maps, filterBy = "all") {
  if (!maps || maps.length === 0 || filterBy === "all") return maps;

  return maps.filter((map) => {
    const hasVideos = map?.Videos?.length > 0;

    return (
      (hasVideos && filterBy === "has-videos") ||
      (!hasVideos && filterBy === "no-videos")
    );
  });
}

export function getPlayersByParams({ allPlayersData, paramsObject }) {
  if (paramsObject?.name === undefined) return allPlayersData;

  return allPlayersData.filter((player) => {
    const playerPrefName = player.PrefName?.toLowerCase();
    const playerName = player.PlayerName?.toLowerCase();

    return (
      stripColorCodes(playerName).includes(paramsObject.name) ||
      stripColorCodes(playerPrefName).includes(paramsObject.name)
    );
  });
}

export function getProcessedTopRuns(topRuns, paramsObject) {
  if (!topRuns) return [];
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
  if (rank === "1") return topRuns.filter((run) => run.Rank === 1);
  if (rank === "1-10")
    return topRuns.filter((run) => run.Rank > 0 && run.Rank <= 10);

  return topRuns;
}

export function getSortedTopRuns(topRuns = [], sort) {
  if (sort === "time") {
    return topRuns.toSorted((a, b) => a.TimePlayed - b.TimePlayed);
  }

  if (sort === "date") {
    return topRuns.toSorted(
      (a, b) =>
        new Date(b.TimeCreated).getTime() - new Date(a.TimeCreated).getTime()
    );
  }

  if (sort === "nade") {
    return topRuns.toSorted((a, b) => a.Nadejumps - b.Nadejumps);
  }

  return topRuns;
}
