'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("pending"); // "pending" | "success" | "error"
  const [message, setMessage] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendUserId, setResendUserId] = useState(null);
  const [emailResent, setEmailResent] = useState(false);

  // Use environment variable for API URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002";

  // Verify email on page load
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus("success");
          setMessage(data.message || "Email successfully verified!");
          // Clear any resend user ID on success
          setResendUserId(null);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. Please try again.");

          // Store userId for possible resend if token expired
          if (data.resendUserId) setResendUserId(data.resendUserId);
        }
      } catch (err) {
        console.error("Verify email error:", err);
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      }
    };

    verifyEmail();
  }, [token, API_URL]);

  // Resend verification email
  const handleResend = async () => {
    if (!resendUserId) return;

    setResendLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: resendUserId }),
      });
      const data = await res.json();

      setMessage(data.message || "Verification email resent. Please check your inbox.");
      setEmailResent(true);
    } catch (err) {
      console.error("Resend verification error:", err);
      setMessage("Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Wave gradient background - matching login page */}
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

      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pattern-dots pattern-purple-500 pattern-bg-white pattern-size-6 pattern-opacity-20"></div>
      
      {/* Subtle gradient overlay */}
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
      </div>

      {/* Centered content */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-gray-100"
          >
            {/* Only show success state if verification was successful */}
            {status === "success" ? (
              <>
                {/* Card Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Email Verified</h1>
                  <p className="text-gray-500 text-sm">Your email has been successfully verified</p>
                </div>

                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Success Message */}
                <div className="text-center mb-6 p-4 rounded-lg bg-green-50 text-green-700">
                  <p className="text-sm">{message}</p>
                </div>

                {/* Success Action */}
                <div className="text-center">
                  <a 
                    href="/login" 
                    className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
                  >
                    Continue to Login
                  </a>
                </div>
              </>
            ) : (
              <>
                {/* Card Header for pending/error states */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {status === "pending" && "Verifying Email"}
                    {status === "error" && emailResent ? "Check Your Email" : "Verification Issue"}
                  </h1>
                  <p className="text-gray-500 text-sm">
                    {status === "pending" && "Please wait while we verify your email address"}
                    {status === "error" && emailResent 
                      ? "We've sent a new verification link to your email" 
                      : "There was an issue with your email verification"}
                  </p>
                </div>

                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                  {status === "pending" && (
                    <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                      <PulseLoader color="#7c3aed" size={10} />
                    </div>
                  )}
                  {status === "error" && (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center">
                      {emailResent ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className={`text-center mb-6 p-4 rounded-lg ${
                  status === "pending" ? "bg-purple-50 text-purple-700" :
                  emailResent ? "bg-purple-50 text-purple-700" : "bg-red-50 text-red-700"
                }`}>
                  <p className="text-sm">{message}</p>
                </div>

                {/* Resend Button for Error State (only show if email hasn't been resent yet) */}
                {status === "error" && resendUserId && !emailResent && (
                  <div className="text-center">
                    <button
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-md hover:shadow-lg"
                    >
                      {resendLoading ? <PulseLoader color="#ffffff" size={8} /> : 'Resend Verification Email'}
                    </button>
                  </div>
                )}

                {/* Instructions after resending */}
                {emailResent && (
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Please check your inbox and click the new verification link.</p>
                    <p className="mt-2">Didn't receive it? Check your spam folder.</p>
                  </div>
                )}

                {/* Pending State Info */}
                {status === "pending" && (
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>This may take a few moments...</p>
                  </div>
                )}
              </>
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