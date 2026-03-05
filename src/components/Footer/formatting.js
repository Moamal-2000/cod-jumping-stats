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
  const value = String(fpsValue || "125").toLowerCase();
  if (!FPS_QUERY_VALUES.has(value)) return "125";
  return value === "all" ? "All" : value;
}
