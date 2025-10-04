import React from 'react';
import { MapPin, BarChart3, AlertTriangle, Settings } from 'lucide-react';

const MapView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interactive Air Quality Map</h1>
          <p className="text-gray-600 mt-2">
            Real-time air quality data from NASA TEMPO satellite and ground stations
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map Coming Soon</h3>
              <p className="text-gray-600">
                This will display real-time air quality data with TEMPO satellite overlays
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
