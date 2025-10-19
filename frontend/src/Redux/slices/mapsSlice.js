import { getFilteredMaps } from "@/Functions/filters";
import { modifyMapsData, paginateData } from "@/Functions/utils";
import { createSlice } from "@reduxjs/toolkit";
import { fetchMaps } from "../thunks/mapsThunk";

function getMapsByFpsDifficulty({ sortedMaps, fps }) {
  return sortedMaps.sort((a, b) => {
    const difficultyA = a.Difficulty?.[fps]?.Difficulty ?? -1;
    const difficultyB = b.Difficulty?.[fps]?.Difficulty ?? -1;

    if (difficultyA < 0 && difficultyB < 0) return 0;
    if (difficultyA < 0) return 1;
    if (difficultyB < 0) return -1;
    return difficultyB - difficultyA;
  });
}

function sortMaps(maps) {
  if (!maps || maps.length === 0) return maps;

  const sortBy =
    new URLSearchParams(window.location.search).get("sort-by") || "newest";
  const sortedMaps = [...maps];

  switch (sortBy) {
    case "newest":
      return sortedMaps.sort(
        (a, b) => new Date(b.Released) - new Date(a.Released)
      );

    case "oldest":
      return sortedMaps.sort(
        (a, b) => new Date(a.Released) - new Date(b.Released)
      );

    case "name-a-z":
      return sortedMaps.sort((a, b) =>
        (a.Name || "").localeCompare(b.Name || "")
      );

    case "name-z-a":
      return sortedMaps.sort((a, b) =>
        (b.Name || "").localeCompare(a.Name || "")
      );

    case "completions-high-to-low":
      return sortedMaps.sort(
        (a, b) =>
          (b.IndividualFinishCount || 0) - (a.IndividualFinishCount || 0)
      );

    case "completions-low-to-high":
      return sortedMaps.sort(
        (a, b) =>
          (a.IndividualFinishCount || 0) - (b.IndividualFinishCount || 0)
      );

    default:
      // If sortBy is a number, treat it as FPS difficulty
      if (parseInt(sortBy))
        return getMapsByFpsDifficulty({ sortedMaps, fps: parseInt(sortBy) });

      return sortedMaps;
  }
}

const initialState = {
  mapsData: [],
  mapsScroll: [],
  firstChunkMaps: [],
  allDataDisplayed: [],
  loading: true,
  error: false,
  searchTerm: "",
  filteredMaps: [],
  sortBy: "125-difficulty", // Default sort
  sortedMaps: [], // Sorted maps for display
};

export const mapsSlice = createSlice({
  initialState,
  name: "mapsSlice",
  reducers: {
    updateMapsState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
    setSearchTerm: (state, { payload }) => {
      state.searchTerm = payload;
    },
    setFilteredMaps: (state, { payload }) => {
      state.filteredMaps = payload;
      state.sortedMaps = sortMaps(payload);
      state.mapsScroll = payload.slice(0, 10);
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.filteredMaps = [];
      // Reset to sorted maps from all data
      state.sortedMaps = sortMaps(state.mapsData);
      // Reset mapsScroll to first page
      state.mapsScroll = state.sortedMaps.slice(0, 10);
    },
    setSortBy: (state, { payload }) => {
      state.sortBy = payload;
      // Sort the current maps data
      const dataToSort = state.searchTerm ? state.filteredMaps : state.mapsData;
      state.sortedMaps = sortMaps(dataToSort, payload);
      // Reset mapsScroll to first page
      state.mapsScroll = state.sortedMaps.slice(0, 10);
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchMaps.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchMaps.fulfilled, (state, { payload }) => {
        const { mapsData, paramsObject } = payload;
        const filteredMapsData = getFilteredMaps(mapsData, paramsObject);
        const modifiedMapsData = modifyMapsData(filteredMapsData);

        // Apply sorting using the current sortBy state
        const sortedMapsData = sortMaps(modifiedMapsData, state.sortBy);
        const paginationMaps = paginateData(sortedMapsData, 1);

        state.mapsData = modifiedMapsData;
        state.mapsScroll = paginationMaps;
        state.firstChunkMaps = paginationMaps;
        state.sortedMaps = sortedMapsData;
        state.filteredMaps = sortedMapsData; // Set filteredMaps to sorted data
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchMaps.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const {
  updateMapsState,
  setSearchTerm,
  setFilteredMaps,
  clearSearch,
  setSortBy,
} = mapsSlice.actions;
export default mapsSlice.reducer;
