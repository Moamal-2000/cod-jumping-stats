import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchPlayer: "",
};

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    updateSearchState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },
});

export default searchSlice.reducer;
export const { updateSearchState } = searchSlice.actions;
