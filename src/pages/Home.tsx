import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Event Check-in System</h1>
        
        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Registration</h2>
            <p className="text-gray-600 mb-4">Register for the event and download your QR code ticket</p>
            <Link 
              to="/register" 
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Registration
            </Link>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Check-in</h2>
            <p className="text-gray-600 mb-4">Scan QR codes to check in attendees</p>
            <Link 
              to="/checkin" 
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Go to Check-in
            </Link>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Administration</h2>
            <p className="text-gray-600 mb-4">View all registered attendees and check-in statistics</p>
            <Link 
              to="/admin" 
              className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Go to Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}