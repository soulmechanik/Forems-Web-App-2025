'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Link from 'next/link';
import { ArrowLeft } from '@mui/icons-material';
import Image from 'next/image';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

  const validatePassword = (pw) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]).{8,}$/;
    return regex.test(pw);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!validatePassword(password)) {
      setMessage('Password must be at least 8 characters, include 1 number and 1 symbol.');
      setMessageType('error');
      return;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setMessage(data.message || 'Password successfully reset!');
        setMessageType('success');
        setPassword('');
        setConfirmPassword('');
      } else {
        setMessage(data.message || 'Failed to reset password. Please try again.');
        setMessageType('error');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Wave gradient background */}
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

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pattern-dots pattern-purple-500 pattern-bg-white pattern-size-6 pattern-opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/10 to-indigo-200/10"></div>

      {/* Header with logo */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start sm:items-center p-6 z-20 gap-2">
        <div className="flex flex-col items-start flex-shrink-0 max-w-[60%]">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <div className="relative w-6 h-6">
                <Image src="/foremsnobg.png" alt="Forems Africa Logo" fill className="object-contain filter brightness-0 invert" />
              </div>
            </div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight ml-3">Forems Africa</h1>
          </div>
        </div>
        
        <Link href="/login" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors text-sm">
          <ArrowLeft className="mr-1" fontSize="small" />
          Back to Login
        </Link>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-100"
          >
            {/* Card Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
              <p className="text-gray-500 text-sm">Enter your new password below</p>
            </div>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm mb-4 p-3 rounded-lg border flex items-center ${
                  messageType === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-100' 
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 mr-2 flex-shrink-0 ${
                    messageType === 'success' ? 'text-green-600' : 'text-red-600'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {messageType === 'success' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff sx={{fontSize: 20}} /> : <Visibility sx={{fontSize: 20}} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters with 1 number and 1 symbol
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <VisibilityOff sx={{fontSize: 20}} /> : <Visibility sx={{fontSize: 20}} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !password || !confirmPassword}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm mt-2 shadow-md hover:shadow-lg"
              >
                {isLoading ? <PulseLoader color="#ffffff" size={8} /> : 'Reset Password'}
              </button>
            </form>

            {/* Success action */}
            {messageType === 'success' && (
              <div className="text-center mt-6 pt-4 border-t border-gray-100">
                <Link 
                  href="/login" 
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        /* Pattern dots background */
        .pattern-dots {
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 16px 16px;
        }
        
        .pattern-purple-500 {
          color: #8B5CF6;
        }
        
        .pattern-bg-white {
          background-color: #ffffff;
        }
        
        .pattern-size-6 {
          background-size: 24px 24px;
        }
        
        .pattern-opacity-20 {
          opacity: 0.2;
        }
      `}</style>
    </div>
  );
}