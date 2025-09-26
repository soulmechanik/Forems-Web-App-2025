'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loadingScreen'
import { Suspense } from 'react';

function LoginComponent() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/auth/redirect'); // role-based redirect page
    }
  }, [status, router]);

  // Handle Google login errors from query string
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) setError(decodeURIComponent(errorParam));
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    setError('');
    // Redirects to /auth/redirect after NextAuth login
    signIn('google', { callbackUrl: '/auth/redirect' });
  };

  // Show loading state while NextAuth session is being checked
  if (status === 'loading') {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background gradients and subtle patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/10 to-indigo-200/10"></div>
      <div className="absolute inset-0 opacity-[0.03] pattern-dots pattern-purple-500 pattern-bg-white pattern-size-6 pattern-opacity-20"></div>

      {/* Header */}
<div className="absolute top-0 left-0 right-0 flex justify-between items-center p-8 z-20">
  <div className="flex items-center">
    <h1 className="text-l font-medium text-gray-800">Forems Africa</h1>
    {/* <div className="w-2 h-2 bg-purple-900 rounded-full ml-2"></div> */}
  </div>
  
  <div className="flex items-center space-x-3">
    <span className="text-gray-400 text-sm hidden sm:block">Don't have an account?</span>
    <a 
      href="/register" 
      className="bg-green-100 hover:bg-purple-50 text-gray-700 hover:text-purple-700 text-sm font-medium py-2 px-4 rounded-xl transition-all duration-200"
    >
      Create Account
    </a>
  </div>
</div>

      {/* Centered login card */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-100"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-500 text-sm">Sign in to continue to your account</p>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-xs mb-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </motion.div>
            )}

            {/* Google Login Button */}
            <button
  onClick={handleGoogleLogin}
  disabled={isLoggingIn}
  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 text-sm font-medium py-3 px-4 rounded-lg mb-5 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
>
  {isLoggingIn ? (
    <>
      {/* Using your existing PulseLoader */}
      <PulseLoader color="#8B5CF6" size={8} />
      <span>Connecting to Google...</span>
    </>
  ) : (
    <>
      {/* Google logo - only show when not loading */}
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span>Continue with Google</span>
    </>
  )}
</button>

            {/* Create Account Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a 
                  href="/register" 
                  className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
                >
                  Create Account
                </a>
              </p>
            </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginComponent />
    </Suspense>
  );
}