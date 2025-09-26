'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { ChevronLeft, User, Home, Building, Users } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';


import { useSession } from "next-auth/react";

// Country and state data
const COUNTRIES = [
  { name: 'Nigeria', code: 'NG' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Kenya', code: 'KE' }
];

const STATES_BY_COUNTRY = {
  NG: [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 
    'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 
    'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ],
  GH: [
    'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern', 'Greater Accra', 
    'North East', 'Northern', 'Oti', 'Savannah', 'Upper East', 'Upper West', 'Volta', 
    'Western', 'Western North'
  ],
  KE: [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombassa', 'Murang\'a', 
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 
    'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ]
};

// Role definitions
const ROLES = [
  {
    id: 'landlord',
    title: 'Landlord',
    description: 'I own properties and rent them out',
    icon: Home,
    color: 'from-purple-600 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    benefits: ['Automated rent collection', 'Portfolio management', 'Tenant screening']
  },
  {
    id: 'tenant',
    title: 'Tenant',
    description: 'I rent and live in properties',
    icon: User,
    color: 'from-emerald-600 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    benefits: ['Easy rent payments', 'Maintenance requests', 'Find new homes']
  },
  {
    id: 'propertyManager',
    title: 'Property Manager',
    description: 'I manage properties on behalf of owners',
    icon: Building,
    color: 'from-blue-600 to-cyan-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    benefits: ['Maintenance scheduling', 'Vendor management', 'Performance analytics']
  },
  
  {
    id: 'agent',
    title: 'Agent',
    description: 'I help connect tenants with properties',
    icon: Users,
    color: 'from-orange-600 to-red-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    benefits: ['Lead generation', 'Commission tracking', 'Client management']
  }
];

// Enhanced carousel messages with role information
const ROLE_MESSAGES = {
  landlord: [
    {
      text: "Guaranteed on-time payments with automated rent collection",
      subtext: "No more chasing tenants for payments",
      color: "from-purple-600 to-indigo-600",
      icon: "💰",
      role: "Landlord"
    },
    {
      text: "Complete portfolio management in one powerful dashboard",
      subtext: "Track all your investments effortlessly",
      color: "from-blue-600 to-cyan-600",
      icon: "📊",
      role: "Landlord"
    }
  ],
  tenant: [
    {
      text: "Your entire rental life simplified in one app",
      subtext: "Payments, requests, documents - all in one place",
      color: "from-emerald-600 to-teal-600",
      icon: "📱",
      role: "Tenant"
    },
    {
      text: "Discover local gigs and job opportunities around you",
      subtext: "Earn while you rent with our opportunity network",
      color: "from-amber-600 to-orange-600",
      icon: "🔍",
      role: "Tenant"
    },
    {
      text: "Find perfect homes at best prices through verified agents",
      subtext: "No more scams or overpriced listings",
      color: "from-rose-600 to-pink-600",
      icon: "🏠",
      role: "Tenant"
    }
  ],
  agent: [
    {
      text: "Receive your full commission without negotiations or delays",
      subtext: "Transparent, fixed-rate compensation structure",
      color: "from-violet-600 to-purple-600",
      icon: "💸",
      role: "Agent"
    },
    {
      text: "Get matched with tenants seeking properties in your area",
      subtext: "Real-time alerts for new rental requests in your vicinity",
      color: "from-fuchsia-600 to-pink-600",
      icon: "📍",
      role: "Agent"
    }
  ],
  manager: [
    {
      text: "Automated maintenance scheduling and vendor management",
      subtext: "Streamline property upkeep with smart workflows",
      color: "from-indigo-600 to-blue-600",
      icon: "🔧",
      role: "Property Manager"
    },
    {
      text: "AI-powered insights for optimal rental pricing and occupancy",
      subtext: "Maximize returns with data-driven recommendations",
      color: "from-cyan-600 to-teal-600",
      icon: "🤖",
      role: "Property Manager"
    }
  ]
};

// All messages combined for carousel
const ALL_MESSAGES = Object.values(ROLE_MESSAGES).flat();

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    whatsappNumber: '',
    gender: '',
    country: '',
    state: '',
    role: '',
    agreedToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableStates, setAvailableStates] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [animationStage, setAnimationStage] = useState('enter');
  
  // Enhanced carousel with succession animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStage('exit');
      
      // Wait for exit animation to complete before changing message
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % ALL_MESSAGES.length);
        setAnimationStage('enter');
      }, 800);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const navigateMessage = (newIndex) => {
    setAnimationStage('exit');
    setTimeout(() => {
      setCurrentMessage(newIndex);
      setAnimationStage('enter');
    }, 800);
  };

  // Update available states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryCode = COUNTRIES.find(c => c.name === formData.country)?.code;
      setAvailableStates(STATES_BY_COUNTRY[countryCode] || []);
      setFormData(prev => ({ ...prev, state: '' }));
    } else {
      setAvailableStates([]);
    }
  }, [formData.country]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({ ...prev, role: roleId }));
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }
    
    if (!formData.state) {
      newErrors.state = 'Please select your state';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    
    if (validateStep1()) {
      setCurrentStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

 const router = useRouter();

const { data: session, update } = useSession();

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('Submitting onboarding form...', formData);

  if (!validateStep2()) {
    console.log('Step 2 validation failed:', errors);
    return;
  }

  setIsLoading(true);

  try {
    const payload = {
      whatsappNumber: formData.whatsappNumber,
      gender: formData.gender,
      country: formData.country,
      state: formData.state,
      agreedToTerms: formData.agreedToTerms,
      roles: [formData.role],
      lastActiveRole: formData.role
    };

    console.log('Payload to send to backend:', payload);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/onboarding`,
      payload,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session?.user?.backendToken ?? ""}`
        }
      }
    );

    console.log('Backend response:', response.data);

    // Method 1: Update session with explicit data
    console.log('Updating session with explicit data...');
    await update({
      user: {
        lastActiveRole: formData.role,
        roles: [formData.role],
        onboarded: true
      }
    });

    // Method 2: Also trigger a general update to fetch fresh data
    console.log('Triggering general session update...');
    await update();

    // Give NextAuth time to process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if session was updated
    console.log('Current session after update:', session);

    // Redirect
    console.log('Redirecting user to dashboard...');
    router.push('/auth/redirect');

  } catch (error) {
    console.error('Onboarding error:', error);
    const message = error?.response?.data?.message || 'Something went wrong. Please try again.';
    setErrors({ submit: message });
  } finally {
    setIsLoading(false);
  }
};





  // Animation variants for the succession effect
  const messageVariants = {
    enter: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(10px)",
      scale: 0.95,
      transition: {
        duration: 0.8,
        ease: "easeIn"
      }
    }
  };

  // Step transition variants
  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const stepTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Enhanced geometric background */}
      <div className="absolute inset-0">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 1024" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.15" />
              <stop offset="25%" stopColor="#8b5cf6" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.09" />
              <stop offset="75%" stopColor="#c084fc" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#e879f9" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Main wave */}
          <path 
            d="M0,350 C300,250 600,450 900,350 C1200,250 1440,350 1440,350 L1440,1024 L0,1024 Z" 
            fill="url(#gradient1)"
          />
          {/* Secondary wave */}
          <path 
            d="M0,500 C200,450 400,550 600,500 C800,450 1000,550 1200,500 C1400,450 1440,500 1440,500 L1440,1024 L0,1024 Z" 
            fill="url(#gradient2)" 
            opacity="0.7"
          />
          {/* Floating shapes */}
          <circle cx="100" cy="100" r="40" fill="#7c3aed" fillOpacity="0.1" />
          <circle cx="1300" cy="200" r="60" fill="#8b5cf6" fillOpacity="0.08" />
          <circle cx="200" cy="500" r="50" fill="#a855f7" fillOpacity="0.06" />
          <rect x="1200" y="400" width="80" height="80" rx="10" fill="#10b981" fillOpacity="0.07" transform="rotate(45 1200 400)" />
        </svg>
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pattern-dots pattern-purple-500 pattern-bg-white pattern-size-6 pattern-opacity-20"></div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100/15 to-indigo-200/10"></div>

      {/* Enhanced Text Carousel for Desktop with Succession Animation */}
      <div className="hidden md:block absolute top-0 left-0 right-0 z-10 pt-8">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative h-40 mb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                variants={messageVariants}
                initial="exit"
                animate={animationStage}
                className={`absolute inset-0 bg-gradient-to-r ${ALL_MESSAGES[currentMessage].color} text-white p-6 rounded-2xl shadow-xl flex flex-col justify-center`}
              >
                <div className="flex items-start">
                  <span className="text-3xl mr-4">{ALL_MESSAGES[currentMessage].icon}</span>
                  <div>
                    <div className="flex items-center mb-2">
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full mr-2">
                        {ALL_MESSAGES[currentMessage].role}
                      </span>
                      <span className="text-sm italic">says:</span>
                    </div>
                    <p className="text-xl font-semibold mb-2">{ALL_MESSAGES[currentMessage].text}</p>
                    <p className="text-white/90 text-sm">{ALL_MESSAGES[currentMessage].subtext}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Enhanced carousel indicators */}
          <div className="flex justify-center space-x-3 mt-6">
            {ALL_MESSAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateMessage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  index === currentMessage 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to message ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Carousel - Hidden as requested */}
      <div className="md:hidden w-full px-4 pt-6 pb-4 z-10 relative hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg mb-4">
          <div className="flex items-center mb-2">
            <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full mr-2">
              {ALL_MESSAGES[currentMessage].role}
            </span>
            <span className="text-sm italic">says:</span>
          </div>
          <p className="text-sm font-medium">{ALL_MESSAGES[currentMessage].text}</p>
          <p className="text-white/80 text-xs mt-1">{ALL_MESSAGES[currentMessage].subtext}</p>
        </div>
      </div>

      {/* Centered content with gap for desktop */}
      <div className="min-h-screen flex items-center justify-center px-4 py-16 md:py-20">
        <div className="w-full max-w-md z-10 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 border border-gray-100"
          >
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <div className={`w-8 h-1 rounded transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Error message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-xs mb-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.submit}
              </motion.div>
            )}

            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={currentStep}>
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={currentStep}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={stepTransition}
                  >
                    {/* Step 1: Personal Information */}
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h1>
                      <p className="text-gray-600 text-sm">Tell us a bit about yourself</p>
                    </div>

                    <form onSubmit={handleNext} className="space-y-4">
                      {/* WhatsApp Number */}
                      <div>
                        <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          id="whatsappNumber"
                          name="whatsappNumber"
                          value={formData.whatsappNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. +234 812 345 6789"
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none text-gray-800 placeholder-gray-400 transition-all duration-200"
                        />
                        {errors.whatsappNumber && (
                          <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Male', 'Female'].map(gender => (
                            <div key={gender} className="relative">
                              <input
                                type="radio"
                                id={`gender-${gender.toLowerCase()}`}
                                name="gender"
                                value={gender}
                                checked={formData.gender === gender}
                                onChange={handleInputChange}
                                className="absolute opacity-0 h-0 w-0"
                              />
                              <label
                                htmlFor={`gender-${gender.toLowerCase()}`}
                                className={`block text-center py-2.5 px-4 text-sm border rounded-lg cursor-pointer transition-all duration-200 ${
                                  formData.gender === gender
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                {gender}
                              </label>
                            </div>
                          ))}
                        </div>
                        {errors.gender && (
                          <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                        )}
                      </div>

                      {/* Country */}
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none text-gray-800 transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzlDQThBNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem]"
                        >
                          <option value="">Select your country</option>
                          {COUNTRIES.map(country => (
                            <option key={country.code} value={country.name}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                        )}
                      </div>

                      {/* State */}
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={!formData.country}
                          className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none text-gray-800 transition-all duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgNkw4IDEwTDEyIDYiIHN0cm9rZT0iIzlDQThBNiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select your state</option>
                          {availableStates.map(state => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                        )}
                      </div>

                      {/* Terms Agreement */}
                      <div className="flex items-start pt-2">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            id="agreedToTerms"
                            name="agreedToTerms"
                            checked={formData.agreedToTerms}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="agreedToTerms" className="text-gray-700">
                            I agree to the{' '}
                            <a href="/terms" className="text-purple-600 hover:text-purple-700 hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-purple-600 hover:text-purple-700 hover:underline">
                              Privacy Policy
                            </a>
                          </label>
                          {errors.agreedToTerms && (
                            <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm mt-6 shadow-md hover:shadow-lg"
                      >
                        Next Step
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </form>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={currentStep}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={stepTransition}
                  >
                    {/* Step 2: Role Selection */}
                    <div className="text-center mb-6">
                      <button
                        onClick={handleBack}
                        className="absolute left-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        aria-label="Go back"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Role</h1>
                      <p className="text-gray-600 text-sm">How will you be using our platform?</p>
                      <p className="text-purple-600 text-xs mt-1 font-medium">💡 You can always switch roles later in the software</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Role Selection Grid */}
                      <div className="space-y-3">
                        {ROLES.map((role) => {
                          const IconComponent = role.icon;
                          const isSelected = formData.role === role.id;
                          
                          return (
                            <motion.div
                              key={role.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? `${role.bgColor} ${role.borderColor} border-2 shadow-md`
                                  : 'bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                              onClick={() => handleRoleSelect(role.id)}
                            >
                              <div className="p-4 rounded-lg">
                                <div className="flex items-start">
                                  <div className={`p-2 rounded-lg mr-3 flex-shrink-0 ${
                                    isSelected ? role.bgColor : 'bg-gray-100'
                                  }`}>
                                    <IconComponent className={`w-5 h-5 ${
                                      isSelected ? role.textColor : 'text-gray-500'
                                    }`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-sm mb-1 ${
                                      isSelected ? role.textColor : 'text-gray-800'
                                    }`}>
                                      {role.title}
                                    </h3>
                                    <p className={`text-xs ${
                                      isSelected ? 'text-gray-700' : 'text-gray-600'
                                    }`}>
                                      {role.description}
                                    </p>
                                  
                                   
                                  </div>
                                  {isSelected && (
                                    <div className="flex-shrink-0">
                                      <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center`}>
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {errors.role && (
                        <p className="text-red-500 text-xs mt-2 text-center">{errors.role}</p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center text-sm"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || !formData.role}
                          className="flex-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center justify-center text-sm shadow-md hover:shadow-lg"
                        >
                          {isLoading ? <PulseLoader color="#ffffff" size={8} /> : 'Complete Profile'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
        
        .flex-2 {
          flex: 2;
        }
      `}</style>
    </div>
  );
}