import {
  decodeAsyncData,
  fetchMsgPackResponse,
  getLeaderboardUrl,
} from "@/functions/utils";
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
    }
  },
);
