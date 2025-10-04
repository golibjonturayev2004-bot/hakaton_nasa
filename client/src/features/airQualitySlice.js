import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for API calls
export const fetchAirQualityData = createAsyncThunk(
  'airQuality/fetchData',
  async ({ lat, lng, radius = 25 }) => {
    const response = await axios.get('/api/air-quality/current', {
      params: { lat, lng, radius }
    });
    return response.data;
  }
);

export const fetchTempoData = createAsyncThunk(
  'airQuality/fetchTempoData',
  async ({ lat, lng }) => {
    const response = await axios.get('/api/tempo/current', {
      params: { lat, lng }
    });
    return response.data;
  }
);

export const fetchWeatherData = createAsyncThunk(
  'airQuality/fetchWeatherData',
  async ({ lat, lng }) => {
    const response = await axios.get('/api/weather/current', {
      params: { lat, lng }
    });
    return response.data;
  }
);

const initialState = {
  currentData: null,
  tempoData: null,
  weatherData: null,
  loading: false,
  error: null,
  lastUpdate: null,
  location: {
    lat: 40.7128,
    lng: -74.0060,
    name: 'New York, NY'
  }
};

const airQualitySlice = createSlice({
  name: 'airQuality',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLastUpdate: (state) => {
      state.lastUpdate = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch air quality data
      .addCase(fetchAirQualityData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirQualityData.fulfilled, (state, action) => {
        state.loading = false;
        state.currentData = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchAirQualityData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch TEMPO data
      .addCase(fetchTempoData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTempoData.fulfilled, (state, action) => {
        state.loading = false;
        state.tempoData = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchTempoData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch weather data
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.weatherData = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setLocation, clearError, updateLastUpdate } = airQualitySlice.actions;
export default airQualitySlice.reducer;
