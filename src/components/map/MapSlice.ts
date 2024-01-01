import { createSlice } from "@reduxjs/toolkit";

export interface MapState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  minZoom: number;
  maxZoom: number;
  transitionDuration: number;
}

const initialState: MapState = {
  longitude: 10.5,
  latitude: 44.7,
  zoom: 7,
  pitch: 0,
  bearing: 0,
  minZoom: 4,
  maxZoom: 15,
  transitionDuration: 500,
  //transitionEasing: TODO
};

export const mapSlice = createSlice({
  name: "map",
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
} = mapSlice.actions;

export default mapSlice.reducer;
