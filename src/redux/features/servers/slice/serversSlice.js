import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  didServersFetchOk: false,
  didServersFetchFail: false,
};

export const serversSlice = createSlice({
  name: "serversSlice",
  initialState,
  reducers: {
    setServersFetchStatus: (state, { payload }) => {
      state.didServersFetchOk = payload.success;
      state.didServersFetchFail = !payload.success;
    },
    resetServersFetchStatus: (state) => {
      state.didServersFetchOk = false;
      state.didServersFetchFail = false;
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

export default serversSlice.reducer;
export const { setServersFetchStatus, resetServersFetchStatus } =
  serversSlice.actions;
