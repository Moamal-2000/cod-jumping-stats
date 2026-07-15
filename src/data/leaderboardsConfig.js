export const LEADERBOARD_CONFIGS = {
  jh_speedrun: {
    scoreText: "Points",
    isRoutesCompleted: false,
    isXpRank: false,
    isSkilled: false,
    showJ4lRank: false,
    showTops: true,
    showTotalXp: false,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "player", label: "Player" },
      { key: "rating", label: "Rating" },
      { key: "score", label: "Points", dataHeader: "Points" },
      { key: "tops", label: "Tops 1-10" },
    ],
  },
  j4l_speedrun: {
    scoreText: "Points",
    isRoutesCompleted: false,
    isXpRank: false,
    isSkilled: false,
    showJ4lRank: true,
    showTops: true,
    showTotalXp: false,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "j4lRank", label: "J4L Rank" },
      { key: "player", label: "Player" },
      { key: "rating", label: "Rating" },
      { key: "score", label: "Points", dataHeader: "Points" },
      { key: "tops", label: "Tops 1-10" },
    ],
  },
  jh_skilled: {
    scoreText: "Points",
    isRoutesCompleted: false,
    isXpRank: false,
    isSkilled: true,
    showJ4lRank: false,
    showTops: true,
    showTotalXp: false,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "player", label: "Player" },
      { key: "rating", label: "Rating" },
      { key: "score", label: "Points", dataHeader: "Points" },
      { key: "tops", label: "Points per difficulty" },
    ],
  },
  j4l_skilled: {
    scoreText: "Points",
    isRoutesCompleted: false,
    isXpRank: false,
    isSkilled: true,
    showJ4lRank: true,
    showTops: true,
    showTotalXp: false,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "j4lRank", label: "J4L Rank" },
      { key: "player", label: "Player" },
      { key: "rating", label: "Rating" },
      { key: "score", label: "Points", dataHeader: "Points" },
      { key: "tops", label: "Points per difficulty" },
    ],
  },
  jh_routescompleted: {
    scoreText: "Completed routes",
    isRoutesCompleted: true,
    isXpRank: false,
    isSkilled: false,
    showJ4lRank: false,
    showTops: false,
    showTotalXp: false,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "player", label: "Player" },
      { key: "rating", label: "Rating" },
      {
        key: "score",
        label: "Completed routes",
        dataHeader: "Completed routes",
      },
    ],
  },
  j4l_routescompleted: {
    scoreText: "Completed routes",
    isRoutesCompleted: true,
    isXpRank: false,
    isSkilled: false,
    showJ4lRank: true,
    showTops: false,
    showTotalXp: false,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "j4lRank", label: "J4L Rank" },
      { key: "player", label: "Player" },
      { key: "rating", label: "Rating" },
      {
        key: "score",
        label: "Completed routes",
        dataHeader: "Completed routes",
      },
    ],
  },
  jh_rankxp: {
    scoreText: "Next Level Progress",
    isRoutesCompleted: false,
    isXpRank: true,
    isSkilled: false,
    showJ4lRank: false,
    showTops: false,
    showTotalXp: true,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "player", label: "Player" },
      { key: "level", label: "Level" },
      {
        key: "score",
        label: "Next Level Progress",
        dataHeader: "Next Level Progress",
      },
      { key: "totalXp", label: "Total XP" },
    ],
  },
  j4l_rankxp: {
    scoreText: "Next Level Progress",
    isRoutesCompleted: false,
    isXpRank: true,
    isSkilled: false,
    showJ4lRank: true,
    showTops: false,
    showTotalXp: true,
    columns: [
      { key: "rank", label: "Rank" },
      { key: "j4lRank", label: "J4L Rank" },
      { key: "player", label: "Player" },
      { key: "level", label: "Level" },
      {
        key: "score",
        label: "Next Level Progress",
        dataHeader: "Next Level Progress",
      },
      { key: "totalXp", label: "Total XP" },
    ],
  },
};

export function getLeaderboardConfig(
  leaderboardType = "speedrun",
  isJ4lServer = false,
) {
  const serverKey = isJ4lServer ? "j4l" : "jh";
  const configKey = `${serverKey}_${leaderboardType}`;

  return (
    LEADERBOARD_CONFIGS[configKey] ||
    LEADERBOARD_CONFIGS[`${serverKey}_speedrun`] ||
    LEADERBOARD_CONFIGS.jh_speedrun
  );
}
