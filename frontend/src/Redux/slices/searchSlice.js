import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchPlayer: "",
};

export const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    updateSearchState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },
});
