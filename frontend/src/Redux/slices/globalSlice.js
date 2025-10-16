import { jhApis } from "@/Api/jumpersHeaven";
import { decodeAsyncData } from "@/Functions/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNotFoundPage: false,
  isLeaderboardReversed: false,
  isLeaderboardExpanded: true,
  isMapsExpanded: true,
  isMobileNavActive: false,
  isGlobalOverlayActive: false,
  pageVisits: [],
  tryFetchAgain: 0,
  statistics: {},
  hoveredPlayer: null,
};

export const getJumpersHeavenStats = createAsyncThunk(
  "globalSlice/getJumpersHeavenStats",
  async () => {
    try {
      const response = await fetch(jhApis().map.getMapsCount, {
        headers: { Accept: "application/msgpack", "Accept-Encoding": "gzip" },
      });

      const mapsCountData = await decodeAsyncData(response);
      return { mapsCount: mapsCountData?.Count };
    } catch (error) {
      console.error(error);
    }
  }
);

export const globalSlice = createSlice({
  initialState,
  name: "globalSlice",
  reducers: {
    updateGlobalState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
    toggleMobileNav: (state, { payload }) => {
      const value = payload?.value ? payload.value : !state.isMobileNavActive;
      state.isMobileNavActive = value;
      state.isGlobalOverlayActive = value;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getJumpersHeavenStats.pending, (state, action) => {})
      .addCase(getJumpersHeavenStats.fulfilled, (state, action) => {
        state.statistics = action.payload;
      })
      .addCase(getJumpersHeavenStats.rejected, (state, action) => {});
  },
});

export default globalSlice.reducer;
export const { updateGlobalState, toggleMobileNav } = globalSlice.actions;
