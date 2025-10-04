import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, RefreshCw, Layers, Eye, EyeOff } from 'lucide-react';
import { fetchAirQualityData, fetchTempoData } from '../features/airQualitySlice';

const MapView = () => {
  const dispatch = useDispatch();
  const { currentData, tempoData, loading, error } = useSelector(state => state.airQuality);
  const [selectedLayer, setSelectedLayer] = useState('aqi');
  const [showStations, setShowStations] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

  const fetchData = () => {
    dispatch(fetchAirQualityData({
      lat: mapCenter.lat,
      lon: mapCenter.lng
    }));
    dispatch(fetchTempoData({
      lat: mapCenter.lat,
      lon: mapCenter.lng
    }));
  };

  useEffect(() => {
    fetchData();
  }, [mapCenter]);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 150) return 'bg-orange-500';
    if (aqi <= 200) return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    return 'Very Unhealthy';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactive Air Quality Map</h1>
          <p className="text-gray-600 mt-2">
            Real-time air quality data from NASA TEMPO satellite and ground stations
          </p>
        </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Map Controls</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowStations(!showStations)}
                className={`flex items-center px-3 py-2 rounded-md ${
                  showStations ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {showStations ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                Stations
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Layer:</span>
            </div>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="aqi">Air Quality Index</option>
              <option value="tempo">TEMPO Satellite</option>
              <option value="pollutants">Pollutants</option>
            </select>
          </div>
        </div>

        {/* Map Area */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
            {/* Mock Map with Data Points */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
              {/* Map Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#9CA3AF" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Data Points */}
              {currentData && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-8 h-8 rounded-full ${getAQIColor(currentData.aqi || 0)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {currentData.aqi || 0}
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs">
                    {getAQILevel(currentData.aqi || 0)}
                  </div>
                </div>
              )}

              {/* TEMPO Data Points */}
              {tempoData && tempoData.pollutants && showStations && (
                <div className="absolute top-1/4 left-1/4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    T
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs">
                    TEMPO
                  </div>
                </div>
              )}

              {/* Mock Station Points */}
              {showStations && (
                <>
                  <div className="absolute top-1/3 right-1/3">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                  </div>
                  <div className="absolute bottom-1/3 left-1/3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                  </div>
                  <div className="absolute top-2/3 right-1/4">
                    <div className="w-4 h-4 bg-orange-500 rounded-full shadow-lg"></div>
                  </div>
                </>
              )}
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">AQI Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Good (0-50)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Moderate (51-100)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Unhealthy for Sensitive (101-150)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Unhealthy (151-200)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Very Unhealthy (201+)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Data Summary */}
        {currentData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Location Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{currentData.aqi || 0}</div>
                <div className="text-sm text-gray-600">Air Quality Index</div>
                <div className={`text-sm font-medium ${getAQIColor(currentData.aqi || 0).replace('bg-', 'text-')}`}>
                  {getAQILevel(currentData.aqi || 0)}
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {currentData.stations ? currentData.stations.length : 0}
                </div>
                <div className="text-sm text-gray-600">Active Stations</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {currentData.sources ? currentData.sources.length : 0}
                </div>
                <div className="text-sm text-gray-600">Data Sources</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
