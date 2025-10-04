import React from 'react';
import { AlertTriangle, Bell, Mail, Phone } from 'lucide-react';

const Alerts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Air Quality Alerts</h1>
          <p className="text-gray-600 mt-2">
            Manage your air quality notifications and alert preferences
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Alerts</h2>
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No active alerts</p>
                <p className="text-sm mt-1">You'll be notified when air quality conditions change</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-700">Web Notifications</span>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-gray-700">Email Alerts</span>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="font-medium text-gray-700">SMS Alerts</span>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
