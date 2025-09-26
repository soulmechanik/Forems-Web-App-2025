'use client'

import React, { useState } from 'react';
import Image from 'next/image';

const SpinnerTestPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const toggleLoading = () => {
    setIsLoading(!isLoading);
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50/95 to-white/95 backdrop-blur-xl z-50">
      {/* Ambient pulsating geometrics across screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="ambient-shape shape-1"></div>
        <div className="ambient-shape shape-2"></div>
        <div className="ambient-shape shape-3"></div>
        <div className="ambient-shape shape-4"></div>
        <div className="ambient-shape shape-5"></div>
        <div className="ambient-shape shape-6"></div>
        <div className="ambient-shape shape-7"></div>
        <div className="ambient-shape shape-8"></div>
        <div className="ambient-shape shape-9"></div>
        <div className="ambient-shape shape-10"></div>
      </div>
      
      <div className="flex flex-col items-center relative z-10">
        
        {/* Revolutionary logo-centric animation system */}
        <div className="relative">
          {/* Breathing energy field around logo */}
          <div className="absolute -inset-20 opacity-30">
            <div className="energy-ring ring-outer"></div>
            <div className="energy-ring ring-middle"></div>
            <div className="energy-ring ring-inner"></div>
          </div>
          
          {/* Neural network connections */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-48 h-48 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1f2937" stopOpacity="0" />
                  <stop offset="50%" stopColor="#374151" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1f2937" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Animated connection lines */}
              <path className="neural-path path-1" d="M100,40 Q130,70 160,100 Q130,130 100,160 Q70,130 40,100 Q70,70 100,40" 
                    fill="none" stroke="url(#connectionGradient)" strokeWidth="1"/>
              <path className="neural-path path-2" d="M100,60 Q120,80 140,100 Q120,120 100,140 Q80,120 60,100 Q80,80 100,60" 
                    fill="none" stroke="url(#connectionGradient)" strokeWidth="1"/>
              <path className="neural-path path-3" d="M100,20 Q150,50 180,100 Q150,150 100,180 Q50,150 20,100 Q50,50 100,20" 
                    fill="none" stroke="url(#connectionGradient)" strokeWidth="0.5"/>
              
              {/* Floating data points */}
              <circle className="data-point point-1" cx="100" cy="40" r="2" fill="#374151"/>
              <circle className="data-point point-2" cx="160" cy="100" r="2" fill="#374151"/>
              <circle className="data-point point-3" cx="100" cy="160" r="2" fill="#374151"/>
              <circle className="data-point point-4" cx="40" cy="100" r="2" fill="#374151"/>
              <circle className="data-point point-5" cx="130" cy="70" r="1.5" fill="#6b7280"/>
              <circle className="data-point point-6" cx="70" cy="130" r="1.5" fill="#6b7280"/>
            </svg>
          </div>
          
          {/* Central logo with sophisticated effects */}
          <div className="relative z-10">
            <div className="logo-container">
              <div className="logo-glow"></div>
              <div className="logo-wrapper">
                <Image
                  src="/forems logo no bg.png"
                  alt="Forems Africa"
                  width={80}
                  height={80}
                  className="logo-main"
                />
              </div>
            </div>
          </div>
          
          {/* Particle field emanating from logo */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
            <div className="particle particle-6"></div>
            <div className="particle particle-7"></div>
            <div className="particle particle-8"></div>
          </div>
          
          {/* Additional micro particles in formation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="micro-particle micro-1"></div>
            <div className="micro-particle micro-2"></div>
            <div className="micro-particle micro-3"></div>
            <div className="micro-particle micro-4"></div>
            <div className="micro-particle micro-5"></div>
            <div className="micro-particle micro-6"></div>
            <div className="micro-particle micro-7"></div>
            <div className="micro-particle micro-8"></div>
          </div>
        </div>

        {/* Intelligent loading text */}
        <div className="text-center mt-16">
          <div className="loading-text-modern">
            <div className="text-line-1">
              <span className="loading-char">P</span>
              <span className="loading-char">r</span>
              <span className="loading-char">o</span>
              <span className="loading-char">c</span>
              <span className="loading-char">e</span>
              <span className="loading-char">s</span>
              <span className="loading-char">s</span>
              <span className="loading-char">i</span>
              <span className="loading-char">n</span>
              <span className="loading-char">g</span>
            </div>
            <div className="status-bar" style={{display: 'none'}}>
              <div className="status-progress"></div>
            </div>
            <div className="sub-text">Preparing your PropTech experience</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Test Page Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/foremslogo.png"
                alt="Forems Africa"
                width={60}
                height={60}
                className="mr-4"
              />
              <h1 className="text-6xl font-thin text-gray-900 tracking-tight">
                Forems Africa
              </h1>
            </div>
            <p className="text-xl text-gray-600 font-light">Revolutionary PropTech Platform</p>
          </header>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 p-10 mb-12 shadow-xl shadow-gray-100/50">
            <h2 className="text-3xl font-light text-gray-800 mb-8">Next-Gen Loading Experience</h2>
            <p className="text-gray-600 mb-10 leading-relaxed text-lg">
              Experience an AI-powered loading animation that creates neural network connections around your logo, 
              with intelligent particle systems and dynamic progress visualization.
            </p>
            
            <button
              onClick={toggleLoading}
              className="inline-flex items-center px-10 py-4 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Hide Loading' : 'Show Loading'}
            </button>
          </div>

          {/* Same content grid as before */}
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
              <h3 className="text-xl font-light text-gray-800 mb-8">Premium Properties</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex-shrink-0 shadow-lg"></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Luxury Penthouse</h4>
                    <p className="text-gray-500 text-sm mb-2">Victoria Island, Lagos</p>
                    <p className="text-gray-800 font-semibold">₦125,000,000</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
              <h3 className="text-xl font-light text-gray-800 mb-8">Analytics Dashboard</h3>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
              <h3 className="text-xl font-light text-gray-800 mb-8">Live Activity</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Spinner Overlay */}
      {isLoading && <LoadingSpinner />}

      <style jsx global>{`
        @keyframes energyPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }

        @keyframes neuralFlow {
          0% {
            stroke-dashoffset: 20;
            opacity: 0.2;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 0.8;
          }
          100% {
            stroke-dashoffset: -20;
            opacity: 0.2;
          }
        }

        @keyframes dataPointFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(2px, -3px) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes logoBreathePremium {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1) contrast(1);
          }
          50% {
            transform: scale(1.02) rotate(0.5deg);
            filter: brightness(1.1) contrast(1.05);
          }
        }

        @keyframes logoGlow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes particleOrbit {
          0% {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
            opacity: 0;
          }
          10%, 90% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
            opacity: 0;
          }
        }

        @keyframes microParticleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(0.8);
            opacity: 0.4;
          }
          33% {
            transform: translate(8px, -12px) scale(1);
            opacity: 0.8;
          }
          66% {
            transform: translate(-6px, -8px) scale(0.9);
            opacity: 0.6;
          }
        }

        @keyframes ambientPulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            opacity: 0.3;
          }
        }

        @keyframes textTyping {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes statusProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        /* Energy rings */
        .energy-ring {
          position: absolute;
          border: 1px solid #374151;
          border-radius: 50%;
          animation: energyPulse 4s ease-in-out infinite;
        }
        .ring-outer { width: 160px; height: 160px; top: -80px; left: -80px; animation-delay: 0s; }
        .ring-middle { width: 120px; height: 120px; top: -60px; left: -60px; animation-delay: 1s; }
        .ring-inner { width: 100px; height: 100px; top: -50px; left: -50px; animation-delay: 2s; }

        /* Neural paths */
        .neural-path {
          stroke-dasharray: 5, 3;
          animation: neuralFlow 3s ease-in-out infinite;
        }
        .path-1 { animation-delay: 0s; }
        .path-2 { animation-delay: 1s; }
        .path-3 { animation-delay: 2s; }

        /* Data points */
        .data-point {
          animation: dataPointFloat 2s ease-in-out infinite;
        }
        .point-1 { animation-delay: 0s; }
        .point-2 { animation-delay: 0.3s; }
        .point-3 { animation-delay: 0.6s; }
        .point-4 { animation-delay: 0.9s; }
        .point-5 { animation-delay: 1.2s; }
        .point-6 { animation-delay: 1.5s; }

        /* Logo effects */
        .logo-container {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .logo-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(55, 65, 81, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: logoGlow 3s ease-in-out infinite;
        }

        .logo-wrapper {
          position: relative;
          z-index: 2;
          border-radius: 16px;
          overflow: hidden;
        }

        .logo-main {
          animation: logoBreathePremium 4s ease-in-out infinite;
          border-radius: 16px;
        }

        /* Particles */
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(135deg, #374151, #6b7280);
          border-radius: 50%;
          animation: particleOrbit linear infinite;
        }

        .particle-1 { animation-duration: 8s; animation-delay: 0s; }
        .particle-2 { animation-duration: 6s; animation-delay: 1s; }
        .particle-3 { animation-duration: 10s; animation-delay: 2s; }
        .particle-4 { animation-duration: 7s; animation-delay: 3s; }
        .particle-5 { animation-duration: 9s; animation-delay: 1.5s; }
        .particle-6 { animation-duration: 5s; animation-delay: 2.5s; }
        .particle-7 { animation-duration: 11s; animation-delay: 0.5s; }
        .particle-8 { animation-duration: 6.5s; animation-delay: 3.5s; }

        /* Micro particles */
        .micro-particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: linear-gradient(135deg, #374151, #6b7280);
          border-radius: 50%;
          animation: microParticleFloat 3s ease-in-out infinite;
        }

        .micro-1 { top: -40px; left: 20px; animation-delay: 0s; animation-duration: 4s; }
        .micro-2 { top: 30px; left: -35px; animation-delay: 0.5s; animation-duration: 3.5s; }
        .micro-3 { top: -20px; right: -30px; animation-delay: 1s; animation-duration: 5s; }
        .micro-4 { bottom: -35px; left: 15px; animation-delay: 1.5s; animation-duration: 3.2s; }
        .micro-5 { bottom: 25px; right: 20px; animation-delay: 2s; animation-duration: 4.5s; }
        .micro-6 { top: 50px; left: 40px; animation-delay: 2.5s; animation-duration: 3.8s; }
        .micro-7 { top: -10px; right: 45px; animation-delay: 3s; animation-duration: 4.2s; }
        .micro-8 { bottom: -20px; right: -25px; animation-delay: 0.3s; animation-duration: 3.7s; }

        /* Ambient shapes across screen */
        .ambient-shape {
          position: absolute;
          background: linear-gradient(45deg, rgba(107, 114, 128, 0.1), rgba(55, 65, 81, 0.05));
          border-radius: 50%;
          animation: ambientPulse ease-in-out infinite;
        }

        .shape-1 { width: 20px; height: 20px; top: 10%; left: 15%; animation-duration: 6s; animation-delay: 0s; }
        .shape-2 { width: 16px; height: 16px; top: 25%; right: 20%; animation-duration: 8s; animation-delay: 1s; }
        .shape-3 { width: 12px; height: 12px; top: 60%; left: 10%; animation-duration: 7s; animation-delay: 2s; }
        .shape-4 { width: 18px; height: 18px; bottom: 20%; right: 25%; animation-duration: 9s; animation-delay: 0.5s; }
        .shape-5 { width: 14px; height: 14px; bottom: 40%; left: 20%; animation-duration: 6.5s; animation-delay: 1.5s; }
        .shape-6 { width: 22px; height: 22px; top: 35%; left: 80%; animation-duration: 7.5s; animation-delay: 3s; }
        .shape-7 { width: 10px; height: 10px; top: 70%; right: 15%; animation-duration: 8.5s; animation-delay: 2.5s; }
        .shape-8 { width: 16px; height: 16px; bottom: 15%; left: 70%; animation-duration: 5.5s; animation-delay: 4s; }
        .shape-9 { width: 24px; height: 24px; top: 45%; right: 40%; animation-duration: 9.5s; animation-delay: 0.8s; }
        .shape-10 { width: 13px; height: 13px; bottom: 35%; right: 60%; animation-duration: 6.8s; animation-delay: 3.5s; }

        /* Modern text */
        .loading-text-modern {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .text-line-1 {
          display: flex;
          justify-content: center;
          gap: 2px;
          margin-bottom: 12px;
        }

        .loading-char {
          font-size: 18px;
          font-weight: 500;
          color: #1f2937;
          animation: textTyping 0.6s ease-out forwards;
          opacity: 0;
        }

        .loading-char:nth-child(1) { animation-delay: 0.1s; }
        .loading-char:nth-child(2) { animation-delay: 0.2s; }
        .loading-char:nth-child(3) { animation-delay: 0.3s; }
        .loading-char:nth-child(4) { animation-delay: 0.4s; }
        .loading-char:nth-child(5) { animation-delay: 0.5s; }
        .loading-char:nth-child(6) { animation-delay: 0.6s; }
        .loading-char:nth-child(7) { animation-delay: 0.7s; }
        .loading-char:nth-child(8) { animation-delay: 0.8s; }
        .loading-char:nth-child(9) { animation-delay: 0.9s; }
        .loading-char:nth-child(10) { animation-delay: 1.0s; }

        .status-bar {
          width: 200px;
          height: 2px;
          background: #e5e7eb;
          border-radius: 1px;
          margin: 0 auto 8px;
          overflow: hidden;
        }

        .status-progress {
          height: 100%;
          background: linear-gradient(90deg, #1f2937, #374151);
          animation: statusProgress 4s ease-out infinite;
        }

        .sub-text {
          font-size: 14px;
          color: #6b7280;
          font-weight: 400;
          opacity: 0;
          animation: textTyping 0.6s ease-out 1.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default SpinnerTestPage;