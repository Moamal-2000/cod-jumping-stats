import { COUNTRIES_WITH_THE } from "@/data/constants";

export function stripColorCodes(name) {
  if (name === undefined) return "";
  return name.replace(/\^\d/g, "");
}

export function kebabCase(str) {
  return str.toLowerCase().split(" ").join("-");
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function domainToCountryFlag(domain) {
  let country = domain.split(".")[0];
  if (country === "uk") country = "gb";
  return `/assets/countryFlags/${country}.svg`;
}

export function getCountryName(countryCode) {
  if (!countryCode) return "Unknown Country";

  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode) || "Unknown Country";
  } catch {
    return "Unknown Country";
  }
}

export function getCleanMapName(mapName) {
  if (!mapName) return "unknown";
  return mapName?.toLowerCase().replace(/[^a-z0-9_]/g, "");
}

export function getFormattedCountryName(code) {
  const name = getCountryName(code);
  return COUNTRIES_WITH_THE.has(name) ? `the ${name}` : name;
}

export function getFpsDifficultyValue({ fps, Difficulty } = {}) {
  const diff = Difficulty?.[fps];
  if (!diff || diff?.Difficulty < 0) return "?";
  return Number(diff.Difficulty).toFixed(2);
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

export function isNewMap(releaseDate) {
  const now = Date.now();
  const dateBeforeMonth = now - 30 * 24 * 60 * 60 * 1000;
  const currentYear = new Date().getFullYear();
  const isReleasedInThisYear = releaseDate?.startsWith(currentYear);

  if (!releaseDate && !isReleasedInThisYear) return false;

  const releaseDateMilliSeconds = new Date(releaseDate).getTime();
  return releaseDateMilliSeconds >= dateBeforeMonth;
}
