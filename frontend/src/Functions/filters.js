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
