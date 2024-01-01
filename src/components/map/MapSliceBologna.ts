import { createSlice } from "@reduxjs/toolkit";

export interface MapStateBologna {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  minZoom: number;
  maxZoom: number;
  transitionDuration: number;
}

const initialState: MapStateBologna = {
  longitude: 11.344,
  latitude: 44.495,
  zoom: 13,
  pitch: 0,
  bearing: 0,
  minZoom: 13,
  maxZoom: 15,
  transitionDuration: 500,
  //transitionEasing: TODO
};

export const mapSliceBologna = createSlice({
  name: "mapBologna",
  initialState,
  reducers: {
    restoreDefaultMapPosition: (state) => {
      state.zoom = initialState.zoom;
      state.longitude = initialState.longitude;
      state.latitude = initialState.latitude;
    },
    restoreDefaultPitch: (state) => {
      state.pitch = initialState.pitch;
    },
    restoreDefaultBearing: (state) => {
      state.bearing = initialState.bearing;
    },
    zoomIn: (state) => {
      state.zoom = state.zoom + 0.25;
    },
    zoomOut: (state) => {
      state.zoom = state.zoom - 0.25;
    },
    updateMapState: (state, action) => {
      let newState = action.payload;
      state.zoom = newState.zoom;
      state.latitude = newState.latitude;
      state.longitude = newState.longitude;
      state.pitch = newState.pitch;
      state.bearing = newState.bearing;
    },
  },
});

export const {
  restoreDefaultMapPosition,
  zoomIn,
  zoomOut,
  restoreDefaultPitch,
  restoreDefaultBearing,
  updateMapState,
} = mapSliceBologna.actions;

export default mapSliceBologna.reducer;
