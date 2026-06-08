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
  didServersFetchOk: false,
  didServersFetchFail: false,
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
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type === "serversApi/executeQuery/fulfilled" &&
          action.meta?.arg?.endpointName === "getServers",
        (state, { payload }) => {
          state.didServersFetchOk = payload?.__status === 200;
          state.didServersFetchFail = payload?.__status !== 200;
        },
      )
      .addMatcher(
        (action) =>
          action.type === "serversApi/executeQuery/rejected" &&
          action.meta?.arg?.endpointName === "getServers",
        (state) => {
          state.didServersFetchOk = false;
          state.didServersFetchFail = true;
        },
      );
  },
});

export default globalSlice.reducer;
export const { updateGlobalState, toggleMobileNav } = globalSlice.actions;
