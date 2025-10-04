import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for forecast API calls
export const fetchComprehensiveForecast = createAsyncThunk(
  'forecast/fetchComprehensive',
  async ({ lat, lng, hours = 24 }) => {
    const response = await axios.get('/api/forecast/comprehensive', {
      params: { lat, lng, hours }
    });
    return response.data;
  }
);

export const fetchAQIForecast = createAsyncThunk(
  'forecast/fetchAQI',
  async ({ lat, lng, hours = 24 }) => {
    const response = await axios.get('/api/forecast/aqi', {
      params: { lat, lng, hours }
    });
    return response.data;
  }
);

export const fetchPollutantForecast = createAsyncThunk(
  'forecast/fetchPollutant',
  async ({ lat, lng, pollutant, hours = 24 }) => {
    const response = await axios.get('/api/forecast/pollutant', {
      params: { lat, lng, pollutant, hours }
    });
    return response.data;
  }
);

export const fetchForecastAlerts = createAsyncThunk(
  'forecast/fetchAlerts',
  async ({ lat, lng, hours = 24 }) => {
    const response = await axios.get('/api/forecast/alerts', {
      params: { lat, lng, hours }
    });
    return response.data;
  }
);

const initialState = {
  comprehensiveForecast: null,
  aqiForecast: null,
  pollutantForecasts: {},
  alerts: [],
  loading: false,
  error: null,
  lastUpdate: null,
  selectedPollutant: 'PM2.5',
  forecastHours: 24
};

const forecastSlice = createSlice({
  name: 'forecast',
  initialState,
  reducers: {
    setSelectedPollutant: (state, action) => {
      state.selectedPollutant = action.payload;
    },
    setForecastHours: (state, action) => {
      state.forecastHours = action.payload;
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
      // Fetch comprehensive forecast
      .addCase(fetchComprehensiveForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComprehensiveForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.comprehensiveForecast = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchComprehensiveForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch AQI forecast
      .addCase(fetchAQIForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAQIForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.aqiForecast = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchAQIForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch pollutant forecast
      .addCase(fetchPollutantForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPollutantForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.pollutantForecasts[action.payload.data.pollutant] = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchPollutantForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch forecast alerts
      .addCase(fetchForecastAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchForecastAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { 
  setSelectedPollutant, 
  setForecastHours, 
  clearError, 
  updateLastUpdate 
} = forecastSlice.actions;

export default forecastSlice.reducer;
