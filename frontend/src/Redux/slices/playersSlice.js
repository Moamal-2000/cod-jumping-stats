import { PLAYERS_BATCH_SIZE } from "@/Data/constants";
import { createSlice } from "@reduxjs/toolkit";
import { fetchAllPlayers } from "../thunks/playersThunk";

const initialState = {
  allPlayersData: [],
  playersData: [],
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
        state.playersData.length
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
        const { allPlayersData, filteredPlayersData } = payload;

        state.allPlayersData = allPlayersData;
        state.playersData = filteredPlayersData;
        state.displayedCount = PLAYERS_BATCH_SIZE;
        state.hasMore = filteredPlayersData.length > PLAYERS_BATCH_SIZE;
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
