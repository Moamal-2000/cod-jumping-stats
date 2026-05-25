import { GITHUB_REPO_URL } from "./constants";

export const NAV_LINKS_DATA = [
  {
    name: "Servers",
    href: "/",
    iconName: "servers",
    id: 1,
  },
  {
    name: "Leaderboards",
    href: "/leaderboards",
    iconName: "leaderboard",
    id: 2,
  },
  {
    name: "Maps",
    href: "/maps",
    iconName: "map",
    id: 3,
  },
  {
    name: "Players",
    href: "/players",
    iconName: "users",
    id: 4,
  },
  {
    name: "About",
    href: "/about",
    iconName: "exclamation-mark",
    id: 5,
  },
  {
    name: "Favorites",
    href: "/favorites",
    iconName: "heart",
    id: 6,
  },
];

export const COD2_COLORS = {
  1: "red",
  2: "green",
  3: "yellow",
  4: "blue",
  5: "cyan",
  6: "magenta",
  7: "white",
  8: "purple",
  9: "gray",
  0: "black",
};

export const COD2_HEX_COLORS = {
  red: "#da0120",
  green: "#00b906",
  yellow: "#e8ff19",
  blue: "#170bdb",
  cyan: "#23c2c6",
  magenta: "#e201db",
  white: "#eee",
  purple: "#8080FE",
  gray: "#757575",
  black: "#000",
};

export const TOP_STATS_COLOR = ["#facc15", "#c0c0c0", "#cd7f32"];

export const SOCIAL_MEDIA_DATA = [
  {
    iconName: "discord",
    link: "https://discord.jumpersheaven.com",
    id: 1,
  },
  {
    iconName: "youtube",
    link: "https://www.youtube.com/user/JumpersHeaven",
    id: 2,
  },
  {
    iconName: "github",
    link: GITHUB_REPO_URL,
    id: 3,
  },
  {
    iconName: "twitter",
    link: "https://x.com/JumpersHeaven",
    id: 4,
  },
  {
    iconName: "jumpers-heaven",
    link: "https://www.jumpersheaven.com",
    id: 5,
  },
];

export const SORT_MAPS_OPTIONS = [
  {
    groupLabel: "Sort Options",
    groupOptions: [
      { label: "Most Completions", value: "completions-high-to-low", id: 1 },
      { label: "Fewest Completions", value: "completions-low-to-high", id: 2 },
      { label: "Newest First", value: "newest", id: 3 },
      { label: "Oldest First", value: "oldest", id: 4 },
      { label: "Shortest Duration", value: "shortest", id: 5 },
      { label: "Longest Duration", value: "longest", id: 6 },
      { label: "Most Checkpoints", value: "high-checkpoints", id: 7 },
      { label: "Fewest Checkpoints", value: "low-checkpoints", id: 8 },
      { label: "Name (A - Z)", value: "name-a-z", id: 9 },
      { label: "Name (Z - A)", value: "name-z-a", id: 10 },
    ],
  },
  {
    groupLabel: "FPS Difficulty",
    groupOptions: [
      { label: "43 fps", value: "43-difficulty", id: 1 },
      { label: "76 fps", value: "76-difficulty", id: 2 },
      { label: "125 fps", value: "125-difficulty", id: 3 },
      { label: "250 fps", value: "250-difficulty", id: 4 },
      { label: "333 fps", value: "333-difficulty", id: 5 },
    ],
  },
];

export const FILTER_PLAYERS_BADGES = [
  { label: "All", value: "all", id: 0 },
  { label: "Banned", value: "banned", id: 1 },
  { label: "Donator", value: "donator", id: 2 },
  { label: "Active", value: "active", id: 3 },
  { label: "Mapper", value: "mapper", id: 4 },
  { label: "Winner", value: "winner", id: 5 },
  { label: "Bug Hunter", value: "bug-hunter", id: 6 },
  { label: "Creator", value: "creator", id: 7 },
  { label: "Admin", value: "admin", id: 8 },
];
