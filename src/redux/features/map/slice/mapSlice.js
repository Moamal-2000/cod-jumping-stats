import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  test: "yes",
};

export const mapSlice = createSlice({
  initialState,
  name: "mapSlice",
  reducers: {
    updateMapsState: (state, { payload }) => {
      state[payload.key] = payload.value;
    },
  },
  extraReducers: ({ addCase }) => {},
});

export const {} = mapSlice.actions;
export default mapSlice.reducer;
