import { modifyMapsData } from "./utils";

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
  let processedMaps = mapsData;

  const type = paramsObject?.type || "all";
  const sortBy = paramsObject?.["sort-by"] || "newest";

  const mapNameSearch = paramsObject?.name || "";
  const mapAuthorSearch = paramsObject?.author || "";

  if (type !== "all") {
    processedMaps = getFilteredMaps(mapsData, paramsObject);
  }

  if (mapNameSearch) {
    processedMaps = processedMaps.filter((map) =>
      map.Name.toLowerCase().includes(mapNameSearch)
    );
  }

  if (mapAuthorSearch) {
    processedMaps = processedMaps.filter((map) =>
      map?.Author?.toLowerCase()?.includes?.(mapAuthorSearch)
    );
  }

  processedMaps = sortMaps(processedMaps, sortBy);
  processedMaps = modifyMapsData(processedMaps);

  return processedMaps;
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
