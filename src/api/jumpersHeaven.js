export const API_URL = "https://jhstats.fly.dev/api/v1";

export const jhApis = ({
  fps = 125,
  limit = 50,
  mapid = 173824,
  name = "SAD",
  playerId: playerid = 108468,
  cpId: cpid = 14606,
  sort = "",
  gametype = "jump",
  source = "jh",
} = {}) => {
  fps = fps === "mix" ? 0 : fps;

  return {
    map: {
      allMaps: generateUrl("/map/all", { source }),
      mapsCount: generateUrl("/map/count"),
      tops: generateUrl("/map/tops", { cpid, fps, limit, source }),
    },
    player: {
      all: generateUrl("/player/all", { sort, source }),
      allTops: generateUrl("/player/all-tops", { fps, source, limit }),
      tops: generateUrl("/player/tops", { fps, playerid, source, limit }),
      jumpScores: generateUrl("/player/jump-scores", { fps, source, playerid }),
      idFromName: generateUrl("/player/id-from-name", { name, source, limit }),
      onlinePlayers: generateUrl("/tracker/online-players"),
      playersPlayTime: generateUrl("/map/players-playtime", { fps, source, limit, mapid }),
      performanceStats: generateUrl("/player/performance-stats", { playerid, source }),
      leaderboardPositions: generateUrl("/player/leaderboard-positions", { playerid, source }),
      playerProgress: generateUrl("/historical/player-progress", { playerid, fps, gametype, source, limit }),
      mapRuns: generateUrl("/player/map-runs", { playerid, cpid, fps, source }),
      routesCompletion: generateUrl("/player/routes-completion", { playerid, source })
    },
    leaderboard: {
      skilledLeaderboard: generateUrl("/leaderboard/jump-skill", { fps, source }),
      speedRunLeaderboard: generateUrl("/leaderboard/speed-skill", { fps, source }),
      defragLeaderboard: generateUrl("/leaderboard/defrag-skill", { fps, source }),
      surfLeaderboard: generateUrl("/leaderboard/surf-skill", { fps, source }),
      routesCompletedLeaderboard: generateUrl("/leaderboard/howmany", { source }),
    },
  };
};

export function generateUrl(endpoint, params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  return `${API_URL}${endpoint}?${queryParams}`;
}
