import { DEFAULT_FPS } from "@/data/constants";

const FPS_QUERY_VALUES = new Set([
  "all",
  "125",
  "250",
  "333",
  "43",
  "76",
  "mix",
]);

export function normalizeFpsQuery(fpsValue) {
  const value = String(fpsValue || DEFAULT_FPS).toLowerCase();
  const isNumber = !Number.isNaN(+value);

  if (!FPS_QUERY_VALUES.has(value)) {
    return DEFAULT_FPS;
  }

  return isNumber ? +value : value;
}
