import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isNotFoundPage: false,
  isLeaderboardReversed: false,
  isLeaderboardExpanded: true,
  isMapsExpanded: true,
  isMobileNavActive: false,
  isGlobalOverlayActive: false,
  pageVisits: [],
  tryFetchAgain: 0,
  hoveredPlayer: null,
  activeCopyAlert: false,
};

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
});

export default globalSlice.reducer;
export const { updateGlobalState, toggleMobileNav } = globalSlice.actions;
