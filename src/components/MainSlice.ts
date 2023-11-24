import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "./../types";

export interface MainSlice {
  selectedLocation: Location;
  sizeShows: string;
  structureShows: string;
}

const initialState: MainSlice = {
  selectedLocation: <Location>{},
  sizeShows: "pos",
  structureShows: "occ",
};

export const mainSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    selectLocation: (state, action: PayloadAction<Location>) => {
      let newSelectedLocation = action.payload;
      state.selectedLocation = newSelectedLocation;
    },
    setSizeShows: (state, action: PayloadAction<string>) => {
      let newSizeShows = action.payload;
      state.sizeShows = newSizeShows;
    },
    setStructureShows: (state, action: PayloadAction<string>) => {
      let newStructureShows = action.payload;
      state.structureShows = newStructureShows;
    },
  },
});

export const { selectLocation, setStructureShows, setSizeShows } = mainSlice.actions;

export default mainSlice.reducer;
