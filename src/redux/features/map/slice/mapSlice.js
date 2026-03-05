import { createSlice } from "@reduxjs/toolkit";
import { fetchMapTops } from "../thunk/mapThunk";

const initialState = {
  mapTops: [],
  loadingTops: true,
  errorTops: false,
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
  },
});

export const {} = mapSlice.actions;
export default mapSlice.reducer;
