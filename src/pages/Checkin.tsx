import React, { useState, useEffect, useRef } from 'react';
import { BrowserQRCodeReader, Result } from '@zxing/browser';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Checkin() {
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [scannedCount, setScannedCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      codeReaderRef.current = new BrowserQRCodeReader();
    }
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!codeReaderRef.current) return;
    
    try {
      setScanning(true);
      setMessage('Scanning...');
      setStatus('');
      
      try {
        // First request camera permission explicitly
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (permissionError) {
        console.error('Camera permission denied:', permissionError);
        setMessage('Camera permission denied. Please allow camera access and try again.');
        setStatus('error');
        setScanning(false);
        return;
      }
      
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      
      if (!videoInputDevices || videoInputDevices.length === 0) {
        setMessage('No camera found. Please ensure your device has a camera and it is not being used by another application.');
        setStatus('error');
        setScanning(false);
        return;
      }
      
      const selectedDeviceId = videoInputDevices[0]?.deviceId;
      
      codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current || undefined,
        async (result: Result | null, error: Error | undefined) => {
          if (result) {
            try {
              const url = new URL(result.getText());
              const token = url.searchParams.get('t');
              
              if (!token) {
                setMessage('Invalid QR code');
                setStatus('error');
                return;
              }
              
              // Process the check-in without stopping the scanner
              await processCheckin(token);
              
              // Add a small delay to prevent multiple scans of the same QR code
              await new Promise(resolve => setTimeout(resolve, 3000));
              
              // Reset message after delay to indicate ready for next scan
              setMessage('Ready for next scan...');
              setStatus('');
            } catch (error) {
              console.error('Error processing QR code:', error);
              setMessage('Error processing QR code');
              setStatus('error');
              
              // Add delay before allowing next scan
              await new Promise(resolve => setTimeout(resolve, 2000));
              setMessage('Ready for next scan...');
              setStatus('');
            }
          }
          
          if (error && !(error instanceof TypeError) && error.name !== 'NotFoundException') {
            console.error('QR scanning error:', error);
          }
        }
      );
    } catch (error) {
      console.error('Failed to start scanner:', error);
      setMessage('Failed to start scanner');
      setStatus('error');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      setScanning(false);
    }
  };

  const processCheckin = async (token: string) => {
    try {
      // First, check if the attendee exists
      const { data: attendee, error: fetchError } = await supabase
        .from('attendees')
        .select('*')
        .eq('token', token)
        .single();
      
      if (fetchError || !attendee) {
        setMessage('Invalid or unregistered ticket');
        setStatus('error');
        speak('Invalid ticket');
        return;
      }
      
      if (attendee.checked_in) {
        setMessage(`Already checked in: ${attendee.name}`);
        setStatus('warning');
        speak(`Already checked in ${attendee.name}`);
        return;
      }

      // Update check-in status
      const { error: updateError } = await supabase
        .from('attendees')
        .update({ checked_in: true })
        .eq('token', token);

      if (updateError) {
        console.error('Update error:', updateError);
        setMessage('Failed to process check-in');
        setStatus('error');
        return;
      }

      // Success
      setScannedCount(prevCount => prevCount + 1);
      setMessage(`Welcome, ${attendee.name}!`);
      setStatus('success');
      speak(`Welcome ${attendee.name}`);
    } catch (error) {
      console.error('Check-in error:', error);
      setMessage('Failed to process check-in');
      setStatus('error');
    }
  };

  const processCheckinOld = async (token: string) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setScannedCount(prevCount => prevCount + 1);
        setMessage(`Welcome, ${data.name}!`);
        setStatus('success');
        speak(`Welcome ${data.name}`);
      } else if (data.status === 'already_scanned') {
        setMessage(`Already checked in: ${data.name}`);
        setStatus('warning');
        speak(`Already checked in ${data.name}`);
      } else {
        setMessage('Invalid or unregistered ticket');
        setStatus('error');
        speak('Invalid ticket');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      setMessage('Failed to process check-in');
      setStatus('error');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech before starting a new one
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const statusClasses = {
    success: 'bg-green-900 bg-opacity-20',
    warning: 'bg-yellow-900 bg-opacity-20',
    error: 'bg-red-900 bg-opacity-20',
    info: 'bg-blue-900 bg-opacity-20',
  };

  const statusTextClasses = {
    success: 'text-green-300',
    warning: 'text-yellow-300',
    error: 'text-red-300',
    info: 'text-blue-300',
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 circuit-pattern">
      <div className="w-full max-w-md p-8 robotics-card rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="robotics-button flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Home</span>
          </Link>
          <h1 className="robotics-title text-2xl font-bold">Robotics Check-in</h1>
        </div>
        
        {/* Display scan counter with reset button */}
        <div className="mb-6 p-4 robotics-border rounded-lg bg-opacity-20 bg-blue-900">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-lg font-medium text-blue-300 mr-2">Attendees Checked In:</span>
              <span className="text-lg font-bold text-white bg-blue-500 px-3 py-1 rounded-full">{scannedCount}</span>
            </div>
            <button 
              onClick={() => setScannedCount(0)}
              className="robotics-button px-3 py-1 flex items-center"
              title="Reset counter"
            >
              <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>
        
        {scanning && (
          <div className="bg-opacity-20 bg-blue-900 robotics-border p-4 mb-6 rounded-md">
            <p className="text-sm text-blue-300 text-center flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Multiple QR code scanning enabled. Each code will be processed automatically.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          {scanning ? (
            <div className="relative">
              <video 
                ref={videoRef} 
                className="w-full h-72 object-cover robotics-border rounded-lg shadow-md robotics-glow"
              />
              <button
                onClick={stopScanner}
                className="mt-4 w-full py-3 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                </svg>
                Stop Scanning
              </button>
            </div>
          ) : (
            <button
              onClick={startScanner}
              className="robotics-button w-full py-3 px-4 rounded-md shadow-md text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1zM13 12a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 00-1-1h-3zm1 2v1h1v-1h-1z" clipRule="evenodd" />
              </svg>
              Start Scanning
            </button>
          )}
        </div>
        
        {message && (
          <div className={`p-4 rounded-md shadow-sm robotics-border ${status === 'success' ? 'bg-green-900 bg-opacity-20' : status === 'warning' ? 'bg-yellow-900 bg-opacity-20' : status === 'error' ? 'bg-red-900 bg-opacity-20' : 'bg-blue-900 bg-opacity-20'}`}>
            <div className="flex items-center justify-center">
              {status === 'success' && (
                <svg className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              {status === 'warning' && (
                <svg className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {status === 'error' && (
                <svg className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className="text-center font-medium text-blue-300">{message}</p>
            </div>
          </div>
        )}
        
        {/* Tech decorations */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-opacity-20 bg-blue-900 text-blue-300 text-xs">
            <svg className="w-4 h-4 mr-1 animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Robotics Club Scanner v1.0
          </div>
        </div>
      </div>
    </main>
  );
}