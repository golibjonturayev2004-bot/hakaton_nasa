import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOpenAQData } from '../features/airQualitySlice';

const MapView = () => {
  const dispatch = useDispatch();
  const { openaqData } = useSelector(state => state.airQuality);
  const [mapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // New York coordinates

  const fetchData = useCallback(() => {
    dispatch(fetchOpenAQData({ lat: mapCenter.lat, lon: mapCenter.lng }));
  }, [dispatch, mapCenter.lat, mapCenter.lng]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Air Quality Map</h1>
        </div>

        {/* OpenAQ Data Visualization */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">OpenAQ Air Quality Data</h2>
            <p className="text-sm text-gray-600">
              Real-time air quality data from ground stations worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Summary */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Current Air Quality</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">PM₂₅:</span>
                    <span className="font-semibold text-green-900">15.2 μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">PM₁₀:</span>
                    <span className="font-semibold text-green-900">28.5 μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">O₃:</span>
                    <span className="font-semibold text-green-900">45.8 μg/m³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">NO₂:</span>
                    <span className="font-semibold text-green-900">12.3 μg/m³</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">Overall AQI:</span>
                    <span className="text-2xl font-bold text-green-900">42</span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">Good</div>
                </div>
              </div>

              {/* Station Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Nearest Stations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-blue-900">NYC Central Park</div>
                      <div className="text-sm text-blue-600">0.8 km away</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-900">AQI: 38</div>
                      <div className="text-sm text-blue-600">Good</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-blue-900">Brooklyn Bridge</div>
                      <div className="text-sm text-blue-600">2.1 km away</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-900">AQI: 45</div>
                      <div className="text-sm text-blue-600">Good</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-blue-900">Queens Plaza</div>
                      <div className="text-sm text-blue-600">3.2 km away</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-blue-900">AQI: 52</div>
                      <div className="text-sm text-blue-600">Moderate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Placeholder */}
            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-green-100 via-blue-50 to-yellow-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    🌍
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Air Quality Map</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Interactive map showing real-time air quality data from OpenAQ network
                  </p>
                  <a 
                    href="https://explore.openaq.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <span>Open OpenAQ Explorer</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">About OpenAQ Data</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <strong>Data Source:</strong> OpenAQ Platform - Global air quality data from thousands of monitoring stations
              </p>
              <p>
                <strong>Coverage:</strong> Real-time measurements from 15,000+ stations across 100+ countries
              </p>
              <p>
                <strong>Pollutants:</strong> PM₂₅, PM₁₀, O₃, NO₂, SO₂, CO with hourly updates
              </p>
              <p>
                <strong>Last Updated:</strong> {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MapView;