import { jhApis } from "@/api/jumpersHeaven";
import { decodeAsyncData, fetchMsgPackResponse } from "@/lib/msgpackClient";
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

function getLeaderboardUrl(paramsObject) {
  const leaderboardType = paramsObject?.["leaderboard"] || "speedrun";
  const leaderboardUrls = {
    speedrun: jhApis(paramsObject).leaderboard.speedRunLeaderboard,
    skilled: jhApis(paramsObject).leaderboard.skilledLeaderboard,
    defrag: jhApis(paramsObject).leaderboard.defragLeaderboard,
    surf: jhApis(paramsObject).leaderboard.surfLeaderboard,
    routescompleted:
      jhApis(paramsObject).leaderboard.routesCompletedLeaderboard,
  };

  return leaderboardUrls[leaderboardType];
}
