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

function sortMaps(maps, sortBy) {
  if (!maps || maps.length === 0) return maps;

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
};

export const mapsSlice = createSlice({
  initialState,
  name: "mapsSlice",
  reducers: {
    updateMapsState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
    setFilteredMaps: (state, { payload }) => {
      state.mapsScroll = sortMaps(payload).slice(0, 10);
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(fetchMaps.pending, (state) => {
      state.loading = true;
      state.error = false;
    })
      .addCase(fetchMaps.fulfilled, (state, { payload }) => {
        const { mapsData, paramsObject } = payload;
        let mapsResult = mapsData;

        const type = paramsObject?.type || "all";
        const sortBy = paramsObject?.["sort-by"] || "newest";

        const mapNameSearch = paramsObject?.name || "";
        const mapAuthorSearch = paramsObject?.author || "";

        if (type !== "all") {
          mapsResult = getFilteredMaps(mapsData, paramsObject);
        }

        if (mapNameSearch) {
          mapsResult = mapsResult.filter((map) =>
            map.Name.toLowerCase().includes(mapNameSearch)
          );
        }

        if (mapAuthorSearch) {
          mapsResult = mapsResult.filter((map) =>
            map?.Author?.toLowerCase()?.includes?.(mapAuthorSearch)
          );
        }

        mapsResult = sortMaps(mapsResult, sortBy);
        mapsResult = modifyMapsData(mapsResult);

        const paginationMaps = paginateData(mapsResult, 1);

        state.mapsData = mapsResult;
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

export const { updateMapsState, setFilteredMaps } = mapsSlice.actions;
export default mapsSlice.reducer;
