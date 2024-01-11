import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location, IDictionary } from "./../types";

export interface MainSlice {
  selectedLocation: Location;
  sizeShows: string;
  structureShows: string;
  sex: IDictionary;
  pos: IDictionary;
  rel: IDictionary;
  occ: IDictionary;
}

const initialState: MainSlice = {
  selectedLocation: <Location>{},
  sizeShows: "pos",
  structureShows: "occ",
  sex: { male: true, female: true },
  pos: { dep: true, nondep: true },
  rel: {
    cathar_milieu: true,
    apostolic_milieu: true,
    other_heterodoxy: true,
    undef_heresy: true,
  },
  occ: {
    church: true,
    craft: true,
    diss: true,
    free: true,
    man: true,
    qual: true,
    merch: true,
    offi: true,
    serv: true,
    sp: true,
    undef_occ: true,
  },
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
    changeSexDict: (state, action: PayloadAction<Array<any>>) => {
      let newSex = state.sex;
      newSex[action.payload[0]] = action.payload[1];
      state.sex = newSex;
    },
    resetSexDict: (state) => {
      state.sex = initialState.sex;
    },
    changePosDict: (state, action: PayloadAction<Array<any>>) => {
      let newPos = state.pos;
      newPos[action.payload[0]] = action.payload[1];
      state.pos = newPos;
    },
    resetPosDict: (state) => {
      state.pos = initialState.pos;
    },
    changeRelDict: (state, action: PayloadAction<Array<any>>) => {
      let newRel = state.rel;
      newRel[action.payload[0]] = action.payload[1];
      state.rel = newRel;
    },
    resetRelDict: (state) => {
      state.rel = initialState.rel;
    },
    clearOccDict: (state) => {
      let newOcc = {
        church: false,
        craft: false,
        diss: false,
        free: false,
        man: false,
        qual: false,
        merch: false,
        offi: false,
        serv: false,
        sp: false,
        undef_occ: false,
      };
      state.occ = newOcc;
    },
    changeOccDict: (state, action: PayloadAction<Array<any>>) => {
      let newOcc = state.occ;
      newOcc[action.payload[0]] = action.payload[1];
      state.occ = newOcc;
    },
    resetOccDict: (state) => {
      state.occ = initialState.occ;
    },
  },
});

export const {
  selectLocation,
  setStructureShows,
  setSizeShows,
  changeSexDict,
  resetSexDict,
  changePosDict,
  resetPosDict,
  changeRelDict,
  resetRelDict,
  changeOccDict,
  resetOccDict,
  clearOccDict,
} = mainSlice.actions;

export default mainSlice.reducer;
