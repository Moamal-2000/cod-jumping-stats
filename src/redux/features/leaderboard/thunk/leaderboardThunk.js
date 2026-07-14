import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/api/msgpackClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLeaderboard = createAsyncThunk(
  "leaderboardSlice/fetchLeaderboard",
  async (paramsObject) => {
    try {
      const leaderboardUrl = getLeaderboardUrl(paramsObject);
      const response = await fetchMsgPackResponse({ url: leaderboardUrl });
      const leaderboardData = (await decodeAsyncData(response)) ?? [];

      return { leaderboardData, paramsObject };
    } catch (error) {
      console.error(error);
      return { leaderboardData: [], paramsObject };
    }
  },
);

const leaderboardUrls = (paramsObject) => ({
  speedrun: jhApis(paramsObject).leaderboard.speedRunLeaderboard,
  skilled: jhApis(paramsObject).leaderboard.skilledLeaderboard,
  defrag: jhApis(paramsObject).leaderboard.defragLeaderboard,
  surf: jhApis(paramsObject).leaderboard.surfLeaderboard,
  routescompleted: jhApis(paramsObject).leaderboard.routesCompletedLeaderboard,
  rankxp: jhApis(paramsObject).leaderboard.rankXpLeaderboard,
});

function getLeaderboardUrl(paramsObject) {
  const leaderboardType = paramsObject?.leaderboard || "speedrun";
  return leaderboardUrls(paramsObject)[leaderboardType];
}
