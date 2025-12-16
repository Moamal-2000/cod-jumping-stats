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
      getAllMaps: generateUrl("/map/all"),
      getMapsCount: generateUrl("/map/count"),
      getTops: generateUrl("/map/tops", { cpid, fps, limit }),
    },
    player: {
      getAll: generateUrl("/player/all", { sort }),
      getAllTops: generateUrl("/player/all-tops", { fps, limit }),
      getTops: generateUrl("/player/tops", { fps, playerid, limit }),
      getJumpScores: generateUrl("/player/jump-scores", { fps, playerid }),
      getIdFromName: generateUrl("/player/id-from-name", { name, limit }),
      getOnlinePlayers: generateUrl("/tracker/online-players"),
      getPlayersPlayTime: generateUrl("/map/players-playtime", { fps, limit, mapid }),
      getPerformanceStats: generateUrl("/player/performance-stats", { playerid }),
      getLeaderboardPositions: generateUrl("/player/leaderboard-positions", { playerid }),
      getPlayerProgress: generateUrl("/historical/player-progress", { playerid, fps, gametype, limit }),
      getMapRuns: generateUrl("/player/map-runs", { playerid, cpid, fps }),
    },
    leaderboard: {
      getSkilledLeaderboard: generateUrl("/leaderboard/jump-skill", { fps }),
      getSpeedRunLeaderboard: generateUrl("/leaderboard/speed-skill", { fps }),
      getDefragLeaderboard: generateUrl("/leaderboard/defrag-skill", { fps }),
      getSurfLeaderboard: generateUrl("/leaderboard/surf-skill", { fps }),
      getRoutesCompletedLeaderboard: generateUrl("/leaderboard/howmany"),
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
