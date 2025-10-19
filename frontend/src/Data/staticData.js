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
    name: "Scoring",
    href: "/scoring",
    iconName: "calculator",
    id: 5,
  },
  {
    name: "About",
    href: "/about",
    iconName: "exclamation-mark",
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

export const MAPS = [
  {
    name: "Crystal Peaks",
    types: ["Expert", "Speedrun"],
    classification: "New",
    img: null,
    rate: 4.8,
    description:
      "An icy mountain challenge with slippery surfaces and crystal formations requiring precise movement and timing.",
    info: [
      { title: "Best Time", result: "1:24.852", icon: "⏱", id: 1 },
      { title: "Completions", result: "1,248", icon: "✓", id: 2 },
      { title: "Checkpoints", result: 6, icon: "◆", id: 3 },
      { title: "Avg Attempts", result: 24, icon: "↻", id: 4 },
    ],
    compilationRate: "27%",
    author: "JumpMaster",
    release: "Mar 15, 2025",
    id: 1,
  },
  {
    name: "Neon City",
    types: ["Medium", "Skilled"],
    classification: null,
    img: null,
    rate: 4.9,
    description:
      "Navigate through a cyberpunk cityscape with neon lights and advanced momentum mechanics. Perfect for skilled players.",
    info: [
      { title: "Best Time", result: "2:32.419", icon: "⏱", id: 1 },
      { title: "Completions", result: "3,574", icon: "✓", id: 2 },
      { title: "Checkpoints", result: 12, icon: "◆", id: 3 },
      { title: "Avg Attempts", result: 15, icon: "↻", id: 4 },
    ],
    compilationRate: "58%",
    author: "NeonXtreme",
    release: "Feb 28, 2025",
    id: 2,
  },
  {
    name: "Velocity",
    types: ["Easy", "Surf"],
    classification: "Featured",
    img: null,
    rate: 4.7,
    description:
      "A beginner-friendly surf map with smooth ramps and gentle curves. Perfect for learning surf mechanics and building speed control.",
    info: [
      { title: "Best Time", result: "0:58.762", icon: "⏱", id: 1 },
      { title: "Completions", result: "8,962", icon: "✓", id: 2 },
      { title: "Checkpoints", result: 5, icon: "◆", id: 3 },
      { title: "Avg Attempts", result: null, icon: "↻", id: 4 },
    ],
    compilationRate: null,
    author: null,
    release: null,
    id: 3,
  },
];

export const PLAYERS = [
  {
    name: "SpeedDemon",
    avatar: "",
    totalPoints: 156,
    mapsCompleted: 24,
    bestTime: "1:23.456",
    id: 1,
  },
  {
    name: "JumpMaster",
    avatar: "",
    totalPoints: 142,
    mapsCompleted: 22,
    bestTime: "1:25.789",
    id: 2,
  },
  {
    name: "Rocket",
    avatar: "",
    totalPoints: 138,
    mapsCompleted: 20,
    bestTime: "1:26.345",
    id: 3,
  },
];

export const TOP_STATS_COLOR = ["#facc15", "#c0c0c0", "#cd7f32"];

export const SOCIAL_MEDIA_DATA = [
  {
    iconName: "discord",
    link: "https://discord.com/channels/@me/752895615347851264/1359590695429603451",
    id: 1,
  },
  {
    iconName: "youtube",
    link: "https://www.youtube.com/user/JumpersHeaven",
    id: 2,
  },
  {
    iconName: "github",
    link: "https://github.com/Moamal-2000/JHLeaderboard",
    id: 3,
  },
  {
    iconName: "twitter",
    link: "https://x.com/JumpersHeaven",
    id: 4,
  },
  {
    iconName: "jumpersHeaven",
    link: "https://www.jumpersheaven.com",
    id: 5,
  },
];

export const SORT_MAPS_OPTIONS = [
  {
    groupLabel: "Basic Sorting Options",
    groupOptions: [
      { label: "Newest First", value: "newest", id: 1 },
      { label: "Oldest First", value: "oldest", id: 2 },
      { label: "Shortest First", value: "shortest", id: 3 },
      { label: "Longest First", value: "longest", id: 4 },
      { label: "High Checkpoints", value: "high-checkpoints", id: 5 },
      { label: "Low Checkpoints", value: "low-checkpoints", id: 6 },
      { label: "Name (A-Z)", value: "name-a-z", id: 7 },
      { label: "Name (Z-A)", value: "name-z-a", id: 8 },
      {
        label: "Completions (High to Low)",
        value: "completions-high-to-low",
        id: 13,
      },
      {
        label: "Completions (Low to High)",
        value: "completions-low-to-high",
        id: 14,
      },
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
