import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAirQualityData, 
  fetchTempoData, 
  fetchWeatherData
} from '../features/airQualitySlice';
import { fetchComprehensiveForecast } from '../features/forecastSlice';
import { initializeSocketConnection } from '../features/notificationSlice';
import { 
  Cloud, 
  Wind, 
  Thermometer, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  MapPin,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { 
    currentData, 
    tempoData, 
    weatherData, 
    loading, 
    error, 
    location 
  } = useSelector(state => state.airQuality);
  
  const { comprehensiveForecast } = useSelector(state => state.forecast);
  const { alerts } = useSelector(state => state.notifications);
  
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(() => {
    dispatch(fetchAirQualityData({ 
      lat: location.lat, 
      lon: location.lon 
    }));
    dispatch(fetchTempoData({ 
      lat: location.lat, 
      lon: location.lon 
    }));
    dispatch(fetchWeatherData({ 
      lat: location.lat, 
      lon: location.lon 
    }));
    dispatch(fetchComprehensiveForecast({ 
      lat: location.lat, 
      lon: location.lon,
      hours: 24
    }));
  }, [dispatch, location.lat, location.lon]);

  useEffect(() => {
    // Initialize socket connection
    dispatch(initializeSocketConnection());
    
    // Fetch initial data
    fetchData();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchData();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [dispatch, autoRefresh, fetchData]);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
    if (aqi <= 150) return 'text-orange-600 bg-orange-100';
    if (aqi <= 200) return 'text-red-600 bg-red-100';
    if (aqi <= 300) return 'text-purple-600 bg-purple-100';
    return 'text-red-800 bg-red-200';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const StatCard = ({ title, value, unit, icon: Icon, color = 'text-blue-600', bgColor = 'bg-blue-100' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">
            {value} {unit && <span className="text-sm text-gray-500">{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      alert.severity === 'critical' || alert.severity === 'emergency' 
        ? 'bg-red-50 border-red-400' 
        : alert.severity === 'warning'
        ? 'bg-yellow-50 border-yellow-400'
        : 'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-start">
        <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 ${
          alert.severity === 'critical' || alert.severity === 'emergency'
            ? 'text-red-500'
            : alert.severity === 'warning'
            ? 'text-yellow-500'
            : 'text-blue-500'
        }`} />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900">{alert.message}</h4>
          <p className="text-xs text-gray-600 mt-1">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Air Quality Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Real-time air quality monitoring powered by NASA TEMPO data
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                Auto-refresh
              </label>
            </div>
          </div>
          
          {/* Location */}
          <div className="mt-4 flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {location.name} ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Conditions */}
          <div className="lg:col-span-2 space-y-6">
            {/* AQI Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Air Quality Index</h2>
              {currentData ? (
                <div className="flex items-center justify-between">
                  <div className={`px-6 py-4 rounded-lg ${getAQIColor(currentData.aqi || 0)}`}>
                    <div className="text-4xl font-bold">{currentData.aqi || 0}</div>
                    <div className="text-sm font-medium">{getAQILevel(currentData.aqi || 0)}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last updated</p>
                    <p className="text-sm font-medium">
                      {new Date(currentData.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </div>

            {/* Weather and Air Quality Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weatherData && (
                <>
                  <StatCard
                    title="Temperature"
                    value={Math.round(weatherData.temperature)}
                    unit="°C"
                    icon={Thermometer}
                    color="text-red-600"
                    bgColor="bg-red-100"
                  />
                  <StatCard
                    title="Humidity"
                    value={weatherData.humidity}
                    unit="%"
                    icon={Cloud}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                  />
                  <StatCard
                    title="Wind Speed"
                    value={weatherData.windSpeed}
                    unit="m/s"
                    icon={Wind}
                    color="text-green-600"
                    bgColor="bg-green-100"
                  />
                  <StatCard
                    title="Visibility"
                    value={weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : 'N/A'}
                    unit="km"
                    icon={Eye}
                    color="text-purple-600"
                    bgColor="bg-purple-100"
                  />
                </>
              )}
            </div>

            {/* Pollutant Levels */}
            {currentData && currentData.pollutants && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pollutant Concentrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(currentData.pollutants).map(([pollutant, data]) => (
                    <div key={pollutant} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{pollutant}</span>
                      <div className="text-right">
                        <span className="text-lg font-semibold">{data.concentration}</span>
                        <span className="text-sm text-gray-500 ml-1">{data.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TEMPO Data */}
            {tempoData && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">TEMPO Satellite Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(tempoData.pollutants).map(([pollutant, data]) => (
                    <div key={pollutant} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium text-gray-700">{pollutant}</span>
                      <div className="text-right">
                        <span className="text-lg font-semibold">{data.concentration}</span>
                        <span className="text-sm text-gray-500 ml-1">{data.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Data Quality: {tempoData.dataQuality.confidence}</p>
                  <p>Resolution: {tempoData.dataQuality.resolution}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Alerts and Forecast */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert, index) => (
                    <AlertCard key={index} alert={alert} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  No active alerts
                </div>
              )}
            </div>

            {/* Quick Forecast */}
            {comprehensiveForecast && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">24-Hour Forecast</h2>
                <div className="space-y-3">
                  {comprehensiveForecast.aqi.slice(0, 6).map((prediction, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        +{prediction.hour}h
                      </span>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getAQIColor(prediction.aqi)}`}>
                          {prediction.aqi}
                        </span>
                        <span className="ml-2 text-sm text-gray-600">{prediction.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  <span className="text-sm text-gray-600">Trend: Stable</span>
                </div>
              </div>
            )}

            {/* Data Sources */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sources</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">TEMPO Satellite</span>
                  <span className={`text-sm font-medium ${tempoData ? 'text-green-600' : 'text-red-600'}`}>
                    {tempoData ? 'Active' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ground Stations</span>
                  <span className={`text-sm font-medium ${currentData ? 'text-green-600' : 'text-red-600'}`}>
                    {currentData ? 'Active' : 'Offline'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weather Data</span>
                  <span className={`text-sm font-medium ${weatherData ? 'text-green-600' : 'text-red-600'}`}>
                    {weatherData ? 'Active' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
