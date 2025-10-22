import { getMapsByParams } from "@/Functions/filters";
import { paginateData } from "@/Functions/utils";
import { createSlice } from "@reduxjs/toolkit";
import { fetchMaps } from "../thunks/mapsThunk";

const initialState = {
  allMaps: [],
  mapsData: [],
  mapsScroll: [],
  firstChunkMaps: [],
  allDataDisplayed: [],
  loading: true,
  error: false,
};

export const mapsSlice = createSlice({
  initialState,
  name: "mapsSlice",
  reducers: {
    updateMapsState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchMaps.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchMaps.fulfilled, (state, { payload }) => {
        const { mapsData, paramsObject } = payload;
        const processedMaps = getMapsByParams({ mapsData, paramsObject });
        const paginationMaps = paginateData(processedMaps, 1);

        state.allMaps = mapsData;
        state.mapsData = processedMaps;
        state.mapsScroll = paginationMaps;
        state.firstChunkMaps = paginationMaps;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchMaps.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const { updateMapsState } = mapsSlice.actions;
export default mapsSlice.reducer;
