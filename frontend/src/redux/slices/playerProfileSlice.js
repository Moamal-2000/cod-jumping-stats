import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMapRuns,
  fetchPlayerJumpScores,
  fetchPlayerLeaderboardPositions,
  fetchPlayerProfile,
  fetchPlayerTops,
} from "../thunks/playerProfileThunk";

const initialState = {
  performanceStats: null,
  performanceStatsLoading: false,
  performanceStatsError: false,

  leaderboardPositions: [],
  leaderboardPositionsLoading: false,
  leaderboardPositionsError: false,

  topRuns: {},
  topRunsLoading: false,
  topRunsError: false,

  jumpScores: null,
  jumpScoresLoading: false,
  jumpScoresError: false,

  loading: false,
  error: false,

  currentFetchingFps: "125",

  mapRuns: [],
  mapRunsLoading: false,
  mapRunsError: false,
};

export const playerProfileSlice = createSlice({
  name: "playerProfileSlice",
  initialState,
  reducers: {
    updatePlayerProfileState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
    clearPlayerProfile: (state) => {
      state.performanceStats = null;
      state.leaderboardPositions = [];
      state.topRuns = {};
      state.jumpScores = null;
      state.loading = false;
      state.error = false;
      state.performanceStatsLoading = false;
      state.performanceStatsError = false;
      state.leaderboardPositionsLoading = false;
      state.leaderboardPositionsError = false;
      state.topRunsLoading = false;
      state.topRunsError = false;
      state.jumpScoresLoading = false;
      state.jumpScoresError = false;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchPlayerProfile.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchPlayerProfile.fulfilled, (state, { payload }) => {
        state.performanceStats = payload.performanceStats;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchPlayerProfile.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });

    addCase(fetchPlayerLeaderboardPositions.pending, (state) => {
      state.leaderboardPositionsLoading = true;
      state.leaderboardPositionsError = false;
    })
      .addCase(
        fetchPlayerLeaderboardPositions.fulfilled,
        (state, { payload }) => {
          state.leaderboardPositions = payload;
          state.leaderboardPositionsLoading = false;
          state.leaderboardPositionsError = false;
        }
      )
      .addCase(fetchPlayerLeaderboardPositions.rejected, (state) => {
        state.leaderboardPositionsError = true;
        state.leaderboardPositionsLoading = false;
      });

    addCase(fetchPlayerTops.pending, (state) => {
      state.topRunsLoading = true;
      state.topRunsError = false;
    })
      .addCase(fetchPlayerTops.fulfilled, (state, { payload }) => {
        state.topRuns = payload;
        state.topRunsLoading = false;
        state.topRunsError = false;
      })
      .addCase(fetchPlayerTops.rejected, (state) => {
        state.topRunsError = true;
        state.topRunsLoading = false;
      });

    addCase(fetchPlayerJumpScores.pending, (state) => {
      state.jumpScoresLoading = true;
      state.jumpScoresError = false;
    })
      .addCase(fetchPlayerJumpScores.fulfilled, (state, { payload }) => {
        state.jumpScores = payload;
        state.jumpScoresLoading = false;
        state.jumpScoresError = false;
      })
      .addCase(fetchPlayerJumpScores.rejected, (state) => {
        state.jumpScoresError = true;
        state.jumpScoresLoading = false;
      });

    addCase(fetchMapRuns.pending, (state) => {
      state.mapRunsLoading = true;
      state.mapRunsError = false;
    })
      .addCase(fetchMapRuns.fulfilled, (state, { payload }) => {
        state.mapRuns = payload;
        state.mapRunsLoading = false;
        state.mapRunsError = false;
      })
      .addCase(fetchMapRuns.rejected, (state) => {
        state.mapRunsError = true;
        state.mapRunsLoading = false;
      });
  },
});

export const { updatePlayerProfileState, clearPlayerProfile } =
  playerProfileSlice.actions;
export default playerProfileSlice.reducer;
