export const API_URL = "https://jhstats.fly.dev/api/v1";

export const jhApis = ({
  fps = 125,
  limit = 50,
  mapid = 173824,
  name = "SAD",
  playerid = 108468,
  cpid = 14606,
  sort = "",
  gametype = "jump",
} = {}) => {
  fps = fps === "mix" ? 0 : fps;

  return {
    map: {
      allMaps: generateUrl("/map/all"),
      mapsCount: generateUrl("/map/count"),
      tops: generateUrl("/map/tops", { cpid, fps, limit }),
    },
    player: {
      all: generateUrl("/player/all", { sort }),
      allTops: generateUrl("/player/all-tops", { fps, limit }),
      tops: generateUrl("/player/tops", { fps, playerid, limit }),
      jumpScores: generateUrl("/player/jump-scores", { fps, playerid }),
      idFromName: generateUrl("/player/id-from-name", { name, limit }),
      onlinePlayers: generateUrl("/tracker/online-players"),
      playersPlayTime: generateUrl("/map/players-playtime", { fps, limit, mapid }),
      performanceStats: generateUrl("/player/performance-stats", { playerid }),
      leaderboardPositions: generateUrl("/player/leaderboard-positions", { playerid }),
      playerProgress: generateUrl("/historical/player-progress", { playerid, fps, gametype, limit }),
      mapRuns: generateUrl("/player/map-runs", { playerid, cpid, fps }),
    },
    leaderboard: {
      skilledLeaderboard: generateUrl("/leaderboard/jump-skill", { fps }),
      speedRunLeaderboard: generateUrl("/leaderboard/speed-skill", { fps }),
      defragLeaderboard: generateUrl("/leaderboard/defrag-skill", { fps }),
      surfLeaderboard: generateUrl("/leaderboard/surf-skill", { fps }),
      routesCompletedLeaderboard: generateUrl("/leaderboard/howmany"),
    },
  };
};

export function generateUrl(endpoint, params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  return `${API_URL}${endpoint}?${queryParams}`;
}

export async function testApi(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("Testing success", data);
    return data;
  } catch (err) {
    console.log(`Error while fetching data from ${url} due to ${err}`);
  }
}
