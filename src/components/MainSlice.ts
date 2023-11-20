import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MainSlice {}

const initialState: MainSlice = {};

export const mainSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {},
});

export const {} = mainSlice.actions;

export default mainSlice.reducer;
