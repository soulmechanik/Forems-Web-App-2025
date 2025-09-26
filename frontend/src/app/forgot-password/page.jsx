'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import Link from 'next/link';
import { ArrowLeft } from '@mui/icons-material';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'If an account exists with this email, you will receive password reset instructions shortly.');
        setEmail('');
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Wave gradient background - matching our design */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 1024" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
              <stop offset="25%" stopColor="#8b5cf6" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.06" />
              <stop offset="75%" stopColor="#c084fc" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#e879f9" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path 
            d="M0,300 C300,200 600,400 900,300 C1200,200 1440,300 1440,300 L1440,1024 L0,1024 Z" 
            fill="url(#gradient1)"
          />
        </svg>
      </div>

      {/* Header with back button */}
      <div className="w-full flex items-start sm:items-center p-6 z-20">
        <Link 
          href="/login" 
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="mr-2" fontSize="small" />
          <span className="text-sm">Back to Login</span>
        </Link>
      </div>

      {/* Main content area with centered card */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-100"
        >
          {/* Card Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
          </div>

          {/* Success/Error Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs mb-4 p-3 rounded-lg border text-center flex items-center justify-center ${
                message.toLowerCase().includes('something') ? 'text-red-600 border-red-100 bg-red-50' : 'text-green-600 border-green-100 bg-green-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {message}
            </motion.div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email 
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isLoading ? <PulseLoader color="#ffffff" size={8} /> : 'Send me the link'}
            </button>
          </form>

          {/* Help Text */}
          <div className="text-center text-xs text-gray-500 mt-6 pt-5 border-t border-gray-100">
            <p>Didn't receive the email? Check your spam folder or</p>
            <Link href="/support" className="text-purple-600 hover:text-purple-700 hover:underline font-medium">
              contact support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
