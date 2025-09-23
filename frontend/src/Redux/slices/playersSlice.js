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

// Helper function to transform player data
const transformPlayerData = (apiResponse) => {
  if (!Array.isArray(apiResponse)) {
    console.warn("Invalid API response format:", apiResponse);
    return [];
  }

  return apiResponse.map((player, index) => ({
    id: player.player_id,
    name:
      player.pref_name ||
      player.playername ||
      player.force_name ||
      `Player ${player.player_id}`,
    avatar: null, // API doesn't provide avatar
    adminLevel: player.admin || 0,
    lastSeen: player.last_seen,
    visitCount: player.visits || 0,
    joinDate: null, // API doesn't provide join date
    country: player.country,
    level: null, // API doesn't provide level
    totalPoints: player.xp || 0,
    mapsCompleted: 0, // API doesn't provide maps completed
    bestTime: "N/A", // API doesn't provide best time
    rank: index + 1,
    // Additional fields from API
    banned: player.banned === 1,
    adminSpeedrun: player.admin_speedrun || 0,
    adminEmelie: player.admin_emelie || 0,
    xpSpeedrun: player.xp_speedrun || 0,
    donated: player.donated === 1,
    bannedUntil: player.banned_until,
    forceNameExpire: player.force_name_expire,
  }));
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
        const transformedPlayers = transformPlayerData(playersData);

        // Store all players and reset pagination
        state.playersData = transformedPlayers;
        state.filteredPlayers = transformedPlayers;
        state.displayedCount = 200;
        state.hasMore = transformedPlayers.length > 200;
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
