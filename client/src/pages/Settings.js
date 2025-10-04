import React from 'react';
import { Settings, MapPin, Bell, Database, Cloud } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure your air quality monitoring preferences and data sources
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-700">Default Location</span>
                  </div>
                  <span className="text-gray-600">New York, NY</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-700">Alert Radius</span>
                  </div>
                  <span className="text-gray-600">25 km</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Sources</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Database className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-700">TEMPO Satellite</span>
                  </div>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Cloud className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-700">Ground Stations</span>
                  </div>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Alert Thresholds</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Warning Level</span>
                  <span className="text-yellow-600 font-semibold">AQI 100</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Critical Level</span>
                  <span className="text-orange-600 font-semibold">AQI 150</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">Emergency Level</span>
                  <span className="text-red-600 font-semibold">AQI 200</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Information</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span>1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Update:</span>
                  <span>Just now</span>
                </div>
                <div className="flex justify-between">
                  <span>Data Sources:</span>
                  <span>3 Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
