export const MAX_J4L_PRESTIGE_COUNT = 10;

export const rankImages = [
  { minLevel: 1, maxLevel: 1, image: "core/rank_core_01.webp" },
  { minLevel: 2, maxLevel: 7, image: "core/rank_core_02.webp" },
  { minLevel: 8, maxLevel: 13, image: "core/rank_core_03.webp" },
  { minLevel: 14, maxLevel: 19, image: "core/rank_core_04.webp" },
  { minLevel: 20, maxLevel: 25, image: "core/rank_core_05.webp" },
  { minLevel: 26, maxLevel: 31, image: "core/rank_core_06.webp" },
  { minLevel: 32, maxLevel: 37, image: "core/rank_core_07.webp" },
  { minLevel: 38, maxLevel: 43, image: "core/rank_core_08.webp" },

  { level: 44, image: "mythic/mythic_01.webp" },
  { level: 45, image: "mythic/mythic_02.webp" },
  { level: 46, image: "mythic/mythic_03.webp" },
  { level: 47, image: "mythic/mythic_04.webp" },
  { level: 48, image: "mythic/mythic_05.webp" },
  { level: 49, image: "mythic/mythic_06.webp" },
  { level: 50, image: "mythic/mythic_07.webp" },
];

export function getPrestigeImage(prestige) {
  if (
    prestige > MAX_J4L_PRESTIGE_COUNT ||
    prestige === undefined ||
    prestige === null
  ) {
    return "unknown prestige";
  }

  return `prestige/p${prestige}.webp`;
}
