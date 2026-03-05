import { createSlice } from "@reduxjs/toolkit";
import { fetchMapPlayers, fetchMapTops } from "../thunk/mapThunk";

const initialState = {
  mapTops: [],
  mapPlayers: [],
  loadingTops: true,
  loadingPlayers: true,
  errorTops: false,
  errorPlayers: false,
};

export const mapSlice = createSlice({
  initialState,
  name: "mapSlice",
  reducers: {
    updateMapsState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchMapTops.pending, (state) => {
      state.loadingTops = true;
      state.errorTops = false;
    });
    addCase(fetchMapTops.fulfilled, (state, { payload }) => {
      state.mapTops = payload;
      state.loadingTops = false;
      state.errorTops = false;
    });
    addCase(fetchMapTops.rejected, (state) => {
      state.errorTops = true;
      state.loadingTops = false;
    });
    addCase(fetchMapPlayers.pending, (state) => {
      state.loadingPlayers = true;
      state.errorPlayers = false;
    });
    addCase(fetchMapPlayers.fulfilled, (state, { payload }) => {
      state.mapPlayers = payload;
      state.loadingPlayers = false;
      state.errorPlayers = false;
    });
    addCase(fetchMapPlayers.rejected, (state) => {
      state.errorPlayers = true;
      state.loadingPlayers = false;
    });
  },
});

export const {} = mapSlice.actions;
export default mapSlice.reducer;
