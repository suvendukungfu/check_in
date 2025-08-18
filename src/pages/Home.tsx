import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 circuit-pattern">
      <div className="relative w-full max-w-lg px-2 sm:px-0">
        {/* Decorative elements */}
        <div className="hidden sm:block absolute -top-10 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="hidden sm:block absolute -bottom-8 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="hidden sm:block absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="robotics-card w-full p-8 backdrop-blur-lg z-10 relative">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 text-center sm:text-left">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-0 sm:mr-3 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <h1 className="robotics-title text-2xl sm:text-3xl font-bold">Robotics Club Check-in</h1>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
          <div className="p-4 sm:p-6 robotics-border rounded-lg bg-opacity-20 bg-blue-900 hover:robotics-glow transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-2 text-center sm:text-left">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <h2 className="text-lg sm:text-xl font-semibold text-blue-300">Registration</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4">Register for the robotics event and download your QR code ticket</p>
            <Link 
              to="/register" 
              className="robotics-button block w-full text-center py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Go to Registration
              </span>
            </Link>
          </div>
          
          <div className="p-4 sm:p-6 robotics-border rounded-lg bg-opacity-20 bg-green-900 hover:robotics-glow transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-lg sm:text-xl font-semibold text-green-300">Check-in</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4">Scan QR codes to check in robotics club members</p>
            <Link 
              to="/checkin" 
              className="robotics-button block w-full text-center py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Go to Check-in
              </span>
            </Link>
          </div>
          
          <div className="p-4 sm:p-6 robotics-border rounded-lg bg-opacity-20 bg-purple-900 hover:robotics-glow transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 className="text-lg sm:text-xl font-semibold text-purple-300">Administration</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-4">View all registered robotics club members and check-in statistics</p>
            <Link 
              to="/admin-login" 
              className="robotics-button block w-full text-center py-2 sm:py-3 px-3 sm:px-4 rounded-md text-xs sm:text-sm font-medium"
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                Go to Admin Panel
              </span>
            </Link>
          </div>
        </div>
        
        {/* Tech decorations */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-opacity-20 bg-blue-900 text-blue-300 text-xs">
            <svg className="w-4 h-4 mr-1 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Robotics Club Event Management System v1.0
          </div>
        </div>
      </div>
      
      {/* Add animated tech background elements */}
      <div className="hidden sm:block absolute bottom-10 left-10 w-20 h-20 border border-blue-500 rounded-full animate-ping opacity-20 duration-1000 delay-300"></div>
      <div className="hidden sm:block absolute top-10 right-10 w-32 h-32 border border-green-500 rounded-full animate-ping opacity-10 duration-700"></div>
      </div>
    </main>
  );
}