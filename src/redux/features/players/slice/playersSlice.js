import { PLAYERS_BATCH_SIZE } from "@/data/constants";
import { getPlayersByParams, paginateData } from "@/functions/filters";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllPlayers } from "../thunk/playersThunk";

const initialState = {
  allPlayersData: [],
  playersData: [],
  playersScroll: [],
  firstChunkPlayers: [],
  allDataDisplayed: false,
  loading: false,
  error: false,
  displayedCount: PLAYERS_BATCH_SIZE,
  hasMore: true,
  isLoadingMore: false,
};

export const playersSlice = createSlice({
  name: "playersSlice",
  initialState,
  reducers: {
    updatePlayersState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
    setHasMore: (state, { payload }) => {
      state.hasMore = payload;
    },
    setIsLoadingMore: (state, { payload }) => {
      state.isLoadingMore = payload;
    },
    resetPagination: (state) => {
      state.displayedCount = PLAYERS_BATCH_SIZE;
      state.hasMore = true;
      state.isLoadingMore = false;
    },
    loadMorePlayersAction: (state) => {
      const newDisplayedCount = state.displayedCount + PLAYERS_BATCH_SIZE;
      state.displayedCount = Math.min(
        newDisplayedCount,
        state.playersData.length,
      );
      state.isLoadingMore = false;
      // Update hasMore based on whether we've shown all players
      state.hasMore = state.displayedCount < state.playersData.length;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchAllPlayers.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchAllPlayers.fulfilled, (state, { payload }) => {
        const { allPlayersData, paramsObject } = payload;

        const processedPlayers = getPlayersByParams({
          allPlayersData,
          paramsObject,
        });
        const paginationPlayers = paginateData(
          processedPlayers,
          1,
          PLAYERS_BATCH_SIZE,
        );

        state.allPlayersData = allPlayersData;
        state.playersData = processedPlayers;
        state.playersScroll = paginationPlayers;
        state.firstChunkPlayers = paginationPlayers;
        state.displayedCount = PLAYERS_BATCH_SIZE;
        state.hasMore = processedPlayers.length > PLAYERS_BATCH_SIZE;
        state.isLoadingMore = false;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchAllPlayers.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const {
  updatePlayersState,
  setHasMore,
  setIsLoadingMore,
  resetPagination,
  loadMorePlayersAction,
} = playersSlice.actions;
export default playersSlice.reducer;
