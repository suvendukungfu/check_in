import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Attendee } from '../lib/supabase';

export default function Admin() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetting, setResetting] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error: fetchError } = await supabase
        .from('attendees')
        .select('*')
        .order('registered_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching attendees:', fetchError);
        setError('Failed to fetch attendees');
        return;
      }

      setAttendees(data || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
      setError('Failed to fetch attendees');
    } finally {
      setLoading(false);
    }
  };

  const resetAllData = async () => {
    try {
      setResetting(true);
      setError('');
      
      // Delete all records from the attendees table
      const { error: deleteError } = await supabase
        .from('attendees')
        .delete()
        .neq('id', ''); // This will delete all records
      
      if (deleteError) {
        console.error('Error resetting data:', deleteError);
        setError('Failed to reset data');
        return;
      }

      // Refresh the attendees list
      fetchAttendees();
      setResetConfirmOpen(false);
    } catch (err) {
      console.error('Error resetting data:', err);
      setError('Failed to reset data');
    } finally {
      setResetting(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  const totalRegistered = attendees.length;
  const checkedIn = attendees.filter(a => a.checked_in).length;
  const pending = totalRegistered - checkedIn;

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-surface to-card-bg p-6 relative overflow-hidden">
      {/* Circuit Pattern Background */}
      <div className="circuit-pattern absolute inset-0 opacity-10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-accent opacity-20 rounded-full filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-40 left-1/4 w-32 h-32 bg-secondary opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white robotics-title glow-text">Robotics Club <span className="text-accent">Admin Panel</span></h1>
          <div className="flex space-x-4">
            <button
              onClick={fetchAttendees}
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 flex items-center transition-all duration-300 robotics-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={() => setResetConfirmOpen(true)}
              disabled={resetting}
              className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:opacity-50 flex items-center transition-all duration-300 robotics-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {resetting ? 'Resetting...' : 'Reset All Data'}
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-dark-surface text-white rounded-md hover:bg-dark-surface/80 focus:outline-none focus:ring-2 focus:ring-dark-surface/50 flex items-center transition-all duration-300 robotics-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem('adminAuthenticated');
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/50 flex items-center transition-all duration-300 robotics-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="robotics-card p-6 rounded-lg relative overflow-hidden">
            <div className="tech-border"></div>
            <div className="z-10 relative">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Total Registered
              </h3>
              <p className="text-3xl font-bold text-primary glow-text">{totalRegistered}</p>
            </div>
          </div>
          <div className="robotics-card p-6 rounded-lg relative overflow-hidden">
            <div className="tech-border"></div>
            <div className="z-10 relative">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Checked In
              </h3>
              <p className="text-3xl font-bold text-secondary glow-text">{checkedIn}</p>
            </div>
          </div>
          <div className="robotics-card p-6 rounded-lg relative overflow-hidden">
            <div className="tech-border"></div>
            <div className="z-10 relative">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Pending
              </h3>
              <p className="text-3xl font-bold text-accent glow-text">{pending}</p>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        <div className="robotics-card rounded-lg overflow-hidden relative">
          <div className="tech-border"></div>
          <div className="px-6 py-4 border-b border-gray-700/30 relative z-10">
            <h2 className="text-xl font-semibold text-white glow-text">Registered Attendees</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-300">Loading attendees...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="bg-accent/20 border border-accent/30 rounded-md p-4">
                <p className="text-accent font-medium">{error}</p>
                <button
                  onClick={fetchAttendees}
                  className="mt-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300 robotics-button"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : attendees.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-300">No attendees registered yet.</p>
              <Link
                to="/register"
                className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 robotics-button"
              >
                Register First Attendee
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/30">
                <thead className="bg-dark-surface/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Batch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {attendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-dark-surface/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {attendee.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {attendee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {attendee.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {attendee.year === 1 ? '1st Year' : '2nd Year'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {attendee.batch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                        {attendee.interest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          attendee.checked_in 
                            ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                            : 'bg-accent/20 text-accent border border-accent/30'
                        }`}>
                          {attendee.checked_in ? 'Checked In' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(attendee.registered_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="robotics-card rounded-lg max-w-md w-full p-6 relative overflow-hidden">
            <div className="tech-border"></div>
            <div className="relative z-10">
            <div className="flex items-center justify-center text-red-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2 text-white glow-text">Reset All Data?</h3>
            <p className="text-gray-300 text-center mb-6">
              This action will permanently delete all attendee records from the database. This cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 bg-dark-surface text-white rounded-md hover:bg-dark-surface/80 focus:outline-none focus:ring-2 focus:ring-dark-surface/50 transition-all duration-300 robotics-button"
              >
                Cancel
              </button>
              <button
                onClick={resetAllData}
                disabled={resetting}
                className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 flex items-center transition-all duration-300 robotics-button"
              >
                {resetting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  'Yes, Reset All Data'
                )}
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}