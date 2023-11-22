import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "./../types";

export interface MainSlice {
  selectedLocation: Location;
}

const initialState: MainSlice = {
  selectedLocation: <Location>{},
};

export const mainSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    selectLocation: (state, action: PayloadAction<Location>) => {
      let newSelectedLocation = action.payload;
      state.selectedLocation = newSelectedLocation;
    },
  },
});

export const { selectLocation } = mainSlice.actions;

export default mainSlice.reducer;
