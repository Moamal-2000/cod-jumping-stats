import { getFilteredLeaderboard, paginateData } from "@/lib/filters";
import { getValueFromLocalStorage } from "@/lib/localCache";
import { createSlice } from "@reduxjs/toolkit";
import { fetchLeaderboard } from "../thunk/leaderboardThunk";

const isLeaderboardHeaderVisible = getValueFromLocalStorage({
  key: "isLeaderboardHeaderVisible",
  defaultValue: true,
});

const initialState = {
  allLeaderboardData: [],
  leaderboardData: [],
  leaderboardScroll: [],
  firstChunkLeaderboard: [],
  allDataDisplayed: [],
  loading: false,
  error: false,
  isLeaderboardHeaderVisible,
};

export const leaderboardSlice = createSlice({
  initialState,
  name: "leaderboardSlice",
  reducers: {
    updateLeaderboardState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },

  extraReducers: ({ addCase }) => {
    addCase(fetchLeaderboard.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchLeaderboard.fulfilled, (state, { payload }) => {
        const { leaderboardData, paramsObject } = payload;
        const filteredLeaderboard = getFilteredLeaderboard(
          leaderboardData,
          paramsObject,
        );
        const paginationLeaderboard = paginateData(filteredLeaderboard, 1);

        state.allLeaderboardData = leaderboardData;
        state.leaderboardData = filteredLeaderboard;
        state.leaderboardScroll = paginationLeaderboard;
        state.firstChunkLeaderboard = paginationLeaderboard;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchLeaderboard.rejected, (state) => {
        state.error = true;
      });
  },
});

export default leaderboardSlice.reducer;
export const { updateLeaderboardState } = leaderboardSlice.actions;
