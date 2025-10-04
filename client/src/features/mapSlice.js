import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  center: {
    lat: 40.7128,
    lng: -74.0060
  },
  zoom: 10,
  selectedLocation: null,
  markers: [],
  layers: {
    airQuality: true,
    tempo: true,
    weather: true,
    forecasts: true
  },
  viewMode: 'satellite', // satellite, street, terrain
  showLegend: true,
  showControls: true
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action) => {
      state.center = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    addMarker: (state, action) => {
      state.markers.push(action.payload);
    },
    removeMarker: (state, action) => {
      state.markers = state.markers.filter(marker => marker.id !== action.payload);
    },
    clearMarkers: (state) => {
      state.markers = [];
    },
    updateLayer: (state, action) => {
      const { layer, visible } = action.payload;
      state.layers[layer] = visible;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    toggleLegend: (state) => {
      state.showLegend = !state.showLegend;
    },
    toggleControls: (state) => {
      state.showControls = !state.showControls;
    },
    resetMap: (state) => {
      state.center = initialState.center;
      state.zoom = initialState.zoom;
      state.selectedLocation = null;
      state.markers = [];
    }
  }
});

export const {
  setCenter,
  setZoom,
  setSelectedLocation,
  addMarker,
  removeMarker,
  clearMarkers,
  updateLayer,
  setViewMode,
  toggleLegend,
  toggleControls,
  resetMap
} = mapSlice.actions;

export default mapSlice.reducer;
