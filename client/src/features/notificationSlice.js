import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import io from 'socket.io-client';

// Initialize socket connection
let socket = null;

const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
  }
  return socket;
};

// Async thunks for notification API calls
export const subscribeToNotifications = createAsyncThunk(
  'notifications/subscribe',
  async ({ userId, location, preferences }) => {
    const response = await axios.post('/api/notifications/subscribe', {
      userId,
      location,
      preferences
    });
    return response.data;
  }
);

export const unsubscribeFromNotifications = createAsyncThunk(
  'notifications/unsubscribe',
  async ({ userId }) => {
    const response = await axios.delete('/api/notifications/unsubscribe', {
      data: { userId }
    });
    return response.data;
  }
);

export const updateNotificationPreferences = createAsyncThunk(
  'notifications/updatePreferences',
  async ({ userId, preferences }) => {
    const response = await axios.put('/api/notifications/preferences', {
      userId,
      preferences
    });
    return response.data;
  }
);

export const fetchNotificationHistory = createAsyncThunk(
  'notifications/fetchHistory',
  async ({ userId, limit = 50 }) => {
    const response = await axios.get('/api/notifications/history', {
      params: { userId, limit }
    });
    return response.data;
  }
);

export const sendTestNotification = createAsyncThunk(
  'notifications/sendTest',
  async ({ userId }) => {
    const response = await axios.post('/api/notifications/test', {
      userId
    });
    return response.data;
  }
);

const initialState = {
  isSubscribed: false,
  userId: null,
  location: null,
  preferences: {
    aqiThresholds: {
      warning: 100,
      critical: 150,
      emergency: 200
    },
    pollutantThresholds: {
      NO2: { warning: 40, critical: 100 },
      O3: { warning: 100, critical: 200 },
      SO2: { warning: 60, critical: 150 },
      HCHO: { warning: 20, critical: 50 },
      PM2_5: { warning: 35, critical: 55 },
      PM10: { warning: 154, critical: 254 }
    },
    notificationMethods: ['websocket', 'email'],
    email: '',
    phone: '',
    enabled: true
  },
  history: [],
  alerts: [],
  socketConnected: false,
  loading: false,
  error: null,
  lastUpdate: null
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
      // Keep only last 100 alerts
      if (state.alerts.length > 100) {
        state.alerts = state.alerts.slice(0, 100);
      }
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
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
      // Subscribe to notifications
      .addCase(subscribeToNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeToNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.isSubscribed = true;
        state.userId = action.payload.data.userId;
        state.location = action.payload.data.location;
        state.preferences = { ...state.preferences, ...action.payload.data.preferences };
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(subscribeToNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Unsubscribe from notifications
      .addCase(unsubscribeFromNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsubscribeFromNotifications.fulfilled, (state) => {
        state.loading = false;
        state.isSubscribed = false;
        state.userId = null;
        state.location = null;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(unsubscribeFromNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update notification preferences
      .addCase(updateNotificationPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.preferences = { ...state.preferences, ...action.payload.data.preferences };
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(updateNotificationPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch notification history
      .addCase(fetchNotificationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload.data;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(fetchNotificationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Send test notification
      .addCase(sendTestNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendTestNotification.fulfilled, (state) => {
        state.loading = false;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(sendTestNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

// Socket event handlers
export const initializeSocketConnection = () => (dispatch) => {
  const socket = initializeSocket();
  
  socket.on('connect', () => {
    dispatch(setSocketConnected(true));
    console.log('Connected to notification server');
  });
  
  socket.on('disconnect', () => {
    dispatch(setSocketConnected(false));
    console.log('Disconnected from notification server');
  });
  
  socket.on('air-quality-alert', (data) => {
    console.log('Received air quality alert:', data);
    data.alerts.forEach(alert => {
      dispatch(addAlert({
        ...alert,
        id: `${alert.type}-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString()
      }));
    });
  });
  
  socket.on('air-quality-update', (data) => {
    console.log('Received air quality update:', data);
    // Handle real-time updates
  });
};

export const subscribeToLocationUpdates = (location) => (dispatch) => {
  const socket = initializeSocket();
  socket.emit('subscribe-location', location);
};

export const {
  setUserId,
  setLocation,
  updatePreferences,
  addAlert,
  removeAlert,
  clearAlerts,
  setSocketConnected,
  clearError,
  updateLastUpdate
} = notificationSlice.actions;

export default notificationSlice.reducer;
