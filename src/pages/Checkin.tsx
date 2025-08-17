import React, { useState, useEffect, useRef } from 'react';
import { BrowserQRCodeReader, Result } from '@zxing/browser';

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
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Increment the counter for successful check-ins
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
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Event Check-in</h1>
        
        {/* Display scan counter with reset button */}
        <div className="mb-4 text-center flex items-center justify-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            Attendees Checked In: {scannedCount}
          </span>
          <button 
            onClick={() => setScannedCount(0)}
            className="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            title="Reset counter"
          >
            Reset
          </button>
        </div>
        
        {scanning && (
          <p className="text-sm text-gray-600 mb-4 text-center">
            Multiple QR code scanning enabled. Each code will be processed automatically.
          </p>
        )}
        
        <div className="mb-6">
          {scanning ? (
            <div className="relative">
              <video 
                ref={videoRef} 
                className="w-full h-64 object-cover border-2 border-gray-300 rounded-lg"
              />
              <button
                onClick={stopScanner}
                className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Stop Scanning
              </button>
            </div>
          ) : (
            <button
              onClick={startScanner}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start Scanning
            </button>
          )}
        </div>
        
        {message && (
          <div className={`p-4 rounded-md ${status === 'success' ? 'bg-green-100 text-green-800' : status === 'warning' ? 'bg-yellow-100 text-yellow-800' : status === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
            <p className="text-center font-medium">{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}