import { getOpenGraphMetadata } from "@/functions/metadata";

export const SITE_URL = process.env.SITE_URL;
const title = "Statistics | JumpersHeaven";

const keywords = [
  "Jumpers Heaven",
  "Jumpers Heaven Stats",
  "Jumpers Heaven Leaderboards",
  "Jumpers Heaven Players",
  "Jumpers Heaven Maps",
  "JH Stats",
  "JH Leaderboards",
  "Call of Duty 2 Jumpers Heaven",
  "CoD2 Jumpers Heaven",
  "CoD2 Jumper Stats",
  "Call of Duty 2 Leaderboards",
  "Call of Duty 2 Player Stats",
  "CoD2 Records",
  "CoD2 Maps",
  "Jumper Mod CoD2",
  "Jumping Mod Call of Duty 2",
  "Game Server Statistics",
];

const description =
  "JumpersHeaven statistics platform for tracking servers, players, maps, favorites, and leaderboard performance.";

export const METADATA = {
  title,
  description,
  keywords,
  ...getOpenGraphMetadata(),
};
