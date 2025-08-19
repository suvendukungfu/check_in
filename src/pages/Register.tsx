import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [year, setYear] = useState('');
  const [batch, setBatch] = useState('');
  const [interest, setInterest] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordInput === 'register@workshop') {
      setIsPasswordVerified(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Please contact organizers for the correct password.');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Generate unique token
      const token = nanoid(24);
      
      // Insert into Supabase
      const { error: dbError } = await supabase
        .from('attendees')
        .insert({
          name: name.trim(),
          email: email.toLowerCase(),
          phone: phone.trim(),
          gender,
          year: parseInt(year),
          batch,
          interest,
          token
        });

      if (dbError) {
        if (dbError.code === '23505') { // Unique constraint violation
          setError('This email is already registered for the event');
        } else {
          console.error('Database error:', dbError);
          setError('Registration failed. Please try again.');
        }
        return;
      }

      // Generate QR code
      const currentPath = window.location.pathname.endsWith('/') ? window.location.pathname : window.location.pathname + '/';
      const qrUrl = `${window.location.origin}${currentPath}#/checkin?t=${token}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Download QR code
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `event-ticket-${name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setRegistered(true);
    } catch (err) {
      console.error(err);
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setGender('');
    setYear('');
    setBatch('');
    setInterest('');
    setPasswordInput('');
    setIsPasswordVerified(false);
    setPasswordError('');
    setRegistered(false);
    setError('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-3 sm:p-6 bg-gradient-to-br from-dark-surface to-card-bg relative overflow-hidden">
      {/* Circuit Pattern Background */}
      <div className="circuit-pattern absolute inset-0 opacity-10"></div>
      
      {/* Decorative Elements */}
      <div className="hidden sm:block absolute top-10 left-10 w-32 h-32 bg-accent opacity-20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="hidden sm:block absolute bottom-10 right-10 w-32 h-32 bg-primary opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="hidden sm:block absolute bottom-40 left-1/4 w-32 h-32 bg-secondary opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-lg p-4 sm:p-6 robotics-card rounded-lg relative overflow-hidden z-10 mx-2 sm:mx-0">
        <div className="tech-border"></div>
        <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white robotics-title glow-text text-center sm:text-left">Robotics Club <span className="text-accent">Registration</span></h1>
          <Link 
            to="/" 
            className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium flex items-center transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        {!isPasswordVerified ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-primary glow-text mb-2">Access Required</h2>
              <p className="text-sm sm:text-base text-gray-300 mb-4">Enter the registration password to access the form</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="passwordInput" className="block text-xs sm:text-sm font-medium text-white mb-2">
                  Registration Password
                </label>
                <input
                  type="password"
                  id="passwordInput"
                  value={passwordInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordInput(e.target.value)}
                  required
                  className="block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
                  placeholder="Enter registration password"
                />
                <p className="mt-1 text-xs sm:text-xs text-gray-300">
                  Contact organizers for the registration password
                </p>
              </div>
              
              {passwordError && (
                <div className="p-2 sm:p-3 rounded-md bg-accent/20 border border-accent/30">
                  <p className="text-accent text-xs sm:text-sm">{passwordError}</p>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full flex justify-center py-2 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-300 robotics-button"
              >
                Access Registration Form
              </button>
            </form>
          </div>
        ) : !registered ? (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-white">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                maxLength={100}
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-white">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
                placeholder="Enter your email address"
              />
              <p className="mt-1 text-xs sm:text-xs text-gray-300">
                Each email can only be used once for registration
              </p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-white">Mobile Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                required
                maxLength={20}
                pattern="[0-9()+\-\s]{7,20}"
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-xs sm:text-sm font-medium text-white">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setGender(e.target.value)}
                required
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-xs sm:text-sm font-medium text-white">Academic Year</label>
              <select
                id="year"
                value={year}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setYear(e.target.value)}
                required
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="batch" className="block text-xs sm:text-sm font-medium text-white">Batch</label>
              <select
                id="batch"
                value={batch}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setBatch(e.target.value)}
                required
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              >
                <option value="">Select Batch</option>
                <option value="ramanujan">Ramanujan</option>
                <option value="hopper">Hopper</option>
                <option value="turing">Turing</option>
                <option value="newmann">Newmann</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="interest" className="block text-xs sm:text-sm font-medium text-white">Area of Interest</label>
              <select
                id="interest"
                value={interest}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setInterest(e.target.value)}
                required
                className="mt-1 block w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-primary/30 bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary transition-all duration-300"
              >
                <option value="">Select Interest</option>
                <option value="electronics">Electronics</option>
                <option value="iot">IoT</option>
                <option value="physics">Physics</option>
                <option value="math">Math</option>
                <option value="mechanics">Mechanics</option>
                <option value="dev">Dev</option>
                <option value="robotic operating system">Robotic Operating System</option>
                <option value="astronomy">Astronomy</option>
                <option value="content creation">Content Creation</option>
                <option value="editor ppt">Editor PPT</option>
                <option value="ai/ml developer">AI/ML Developer</option>
                <option value="cool guys">Cool Guys</option>
                <option value="others">Others</option>
              </select>
            </div>
            
            {error && (
              <div className="p-2 sm:p-3 rounded-md bg-accent/20 border border-accent/30">
                <p className="text-accent text-xs sm:text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 transition-all duration-300 robotics-button"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/30">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-secondary glow-text mb-2">Registration Successful!</h2>
              <p className="text-sm sm:text-base text-gray-300">Your QR code ticket has been downloaded automatically.</p>
            </div>
            
            <div className="w-full p-3 sm:p-4 bg-primary/20 rounded-lg mb-4 sm:mb-6 border border-primary/30">
              <h3 className="text-sm sm:text-base font-medium text-primary mb-2">Important Instructions:</h3>
              <ul className="text-xs sm:text-sm text-gray-300 space-y-1">
                <li>• Check your Downloads folder for the QR code ticket</li>
                <li>• Save the QR code image to your phone</li>
                <li>• Bring the QR code to the event for check-in</li>
                <li>• Each email can only register once</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-300 robotics-button"
              >
                Register Another
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto text-center py-2 px-3 sm:px-4 border border-dark-surface/50 rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-dark-surface hover:bg-dark-surface/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-surface/50 transition-all duration-300 robotics-button"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}