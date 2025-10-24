import { createSlice } from "@reduxjs/toolkit";
import { fetchAllPlayers, searchPlayers } from "../thunks/playersThunk";

const initialState = {
  playersData: [],
  filteredPlayers: [],
  loading: false,
  error: false,
  searchTerm: "",
  sortBy: "admin",
  // Client-side pagination state
  displayedCount: 200,
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
    setSearchTerm: (state, { payload }) => {
      state.searchTerm = payload;
    },
    setSortBy: (state, { payload }) => {
      state.sortBy = payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.filteredPlayers = state.playersData;
    },
    setDisplayedCount: (state, { payload }) => {
      state.displayedCount = payload;
    },
    setHasMore: (state, { payload }) => {
      state.hasMore = payload;
    },
    setIsLoadingMore: (state, { payload }) => {
      state.isLoadingMore = payload;
    },
    resetPagination: (state) => {
      state.displayedCount = 200;
      state.hasMore = true;
      state.isLoadingMore = false;
    },
    loadMorePlayersAction: (state) => {
      const newDisplayedCount = state.displayedCount + 200;
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
    // Fetch all players
    addCase(fetchAllPlayers.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchAllPlayers.fulfilled, (state, { payload }) => {
        const { playersData } = payload;

        state.playersData = playersData;
        state.filteredPlayers = playersData;
        state.displayedCount = 200;
        state.hasMore = playersData.length > 200;
        state.isLoadingMore = false;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchAllPlayers.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });

    // Search players
    addCase(searchPlayers.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(searchPlayers.fulfilled, (state, { payload }) => {
        const { playersData } = payload;
        const transformedPlayers = transformPlayerData(playersData);

        state.filteredPlayers = transformedPlayers;
        state.loading = false;
        state.error = false;
      })
      .addCase(searchPlayers.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const {
  updatePlayersState,
  setSearchTerm,
  setSortBy,
  clearSearch,
  setDisplayedCount,
  setHasMore,
  setIsLoadingMore,
  resetPagination,
  loadMorePlayersAction,
} = playersSlice.actions;
export default playersSlice.reducer;
