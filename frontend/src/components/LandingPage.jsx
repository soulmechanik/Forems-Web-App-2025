'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, Brain, Users, Building2, BarChart3, Settings,
  CheckCircle, ArrowRight, Play, Phone, Mail, Menu, X,
  Zap, Shield, Clock, Globe, MessageCircle, Star, Home, UserCheck,
  FileText, Calendar, CreditCard, Lock, Bell, FileCheck, BookOpen,
  GraduationCap, Briefcase, Award, LogIn, UserPlus
} from 'lucide-react';
import Image from 'next/image';

const ForemsAILanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState('management');
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const academyRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (academyRef.current && !academyRef.current.contains(event.target)) {
        setIsAcademyOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Property Management Content (Primary Focus)
  const managementContent = {
    hero: {
      badge: "Professional Property Management Platform",
      title: "See Your Property Differently",
      description: "Your property is more than just walls and roofs — it's an asset. Forems helps you manage tenants, finances, and daily affairs stress-free.",
      primaryCTA: "Get Started",
      secondaryCTA: "Watch Demo"
    },
    features: [
      {
        icon: Monitor,
        title: "Complete Management Dashboard",
        description: "Your centralized command center for all properties, tenants, and financial tracking"
      },
      {
        icon: Shield,
        title: "NIEVS Compliance Built-in",
        description: "Automatically generated compliant documentation that meets professional standards"
      },
      {
        icon: FileCheck,
        title: "Professional Documentation",
        description: "Legally sound contracts, receipts, and records that protect your investment"
      },
      {
        icon: BarChart3,
        title: "Financial Performance Analytics",
        description: "Track ROI, expenses, and property performance with detailed reporting"
      },
      {
        icon: Bell,
        title: "Automated Rent Collection",
        description: "Never miss payments with automated reminders and multiple payment options"
      },
      {
        icon: Brain,
        title: "AI-Powered Maintenance",
        description: "Smart scheduling and cost optimization for property upkeep and repairs"
      }
    ],
    benefits: [
      "Protect your property investment with professional management",
      "NIEVS-compliant documentation and processes",
      "Maximize rental income and minimize vacancies",
      "Automated financial tracking and reporting"
    ],
    testimonials: [
      {
        name: "Mr. Ethan Okonkwo",
        role: "Property Owner",
        company: "Lagos Mainland",
        quote: "I was losing money with old management methods. Forems turned my properties into profitable assets with professional oversight."
      },
      {
        name: "Mrs. Adebayo Johnson", 
        company: "Abuja Properties",
        quote: "Finally have peace of mind knowing my properties are professionally managed with proper documentation and compliance."
      }
    ],
    states: ["Lagos", "Abuja", "Rivers", "Kogi", "Kwara", "Niger", "Jos"]
  };

  // Tenant Content
  const tenantContent = {
    hero: {
      badge: "WhatsApp-Enabled Tenant Experience",
      title: "Find, Rent, and Enjoy Your Tenancy on WhatsApp",
      description: "Register once and handle everything via chat — from house hunting and rent payments to maintenance requests and utilities, all in WhatsApp.",
      primaryCTA: "Register Now",
      secondaryCTA: "See WhatsApp Features"
    },
    features: [
      {
        icon: MessageCircle,
        title: "WhatsApp Everything",
        description: "Handle all housing needs through WhatsApp messages. No apps to download or learn."
      },
      {
        icon: Zap,
        title: "Instant Utilities Payment",
        description: "Buy electricity, pay water bills, and handle utilities with simple text commands."
      },
      {
        icon: Settings,
        title: "Easy Maintenance Requests",
        description: "Report issues and get connected with verified artisans instantly via chat."
      },
      {
        icon: Shield,
        title: "Tenant Rights Support",
        description: "Get instant advice on tenancy laws and understand your rights as a tenant."
      },
      {
        icon: Clock,
        title: "Smart Payment Reminders",
        description: "Never miss rent payments with AI-powered reminders and payment scheduling."
      },
      {
        icon: Brain,
        title: "24/7 AI Assistant",
        description: "Intelligent support that understands your housing needs and helps instantly."
      }
    ],
    benefits: [
      "No apps to download or learn - use WhatsApp",
      "24/7 support through familiar messaging",
      "Instant utility purchases and bill payments",
      "Direct access to verified service providers"
    ],
    testimonials: [
      {
        name: "Kemi Adebola",
        role: "Tenant",
        company: "Victoria Island, Lagos",
        quote: "Bought electricity at 2am through WhatsApp. So convenient! No more queuing or stress."
      },
      {
        name: "Ibrahim Musa",
        role: "Tenant", 
        company: "Wuse 2, Abuja",
        quote: "Fixed my leaking tap in 30 minutes. Just sent a message and artisan came immediately."
      }
    ]
  };

  // Agent Content (Focus on Commission/Earnings)
  const agentContent = {
    hero: {
      badge: "Professional Agent Platform",
      title: "Stop Losing Prospects to Disorganization",
      description: "Professional agents use professional tools. Our platform helps you manage leads, close more deals, and earn higher commissions while looking credible to serious clients.",
      primaryCTA: "Boost My Earnings",
      secondaryCTA: "See How It Works"
    },
    features: [
      {
        icon: Users,
        title: "Intelligent Lead Management",
        description: "Track prospects from first contact to commission payout. Never lose a potential client again."
      },
      {
        icon: Brain,
        title: "AI-Powered Prospect Matching",
        description: "Smart matching of your listings with serious buyers and tenants based on preferences."
      },
      {
        icon: MessageCircle,
        title: "Professional Client Communication",
        description: "Tools that make you look established and trustworthy to high-value clients."
      },
      {
        icon: BarChart3,
        title: "Commission Tracking & Analytics",
        description: "Monitor your earnings pipeline, performance metrics, and best lead sources."
      },
      {
        icon: Settings,
        title: "Automated Follow-up System",
        description: "Never forget to follow up with prospects. Automated sequences that increase conversions."
      },
      {
        icon: Shield,
        title: "Credibility Building Tools",
        description: "Professional presentation tools that make clients take you seriously."
      }
    ],
    benefits: [
      "Increase commission earnings by 40%+ with better organization",
      "Look professional to serious, high-value clients", 
      "Never lose track of prospects or follow-ups again",
      "Automated systems that work while you sleep"
    ],
    testimonials: [
      {
        name: "Tunde Adeyemi",
        role: "Real Estate Agent",
        company: "Lagos Mainland",
        quote: "Doubled my commission in 6 months. Clients see me as a serious professional now, not just another agent."
      },
      {
        name: "Grace Okonkwo",
        role: "Property Agent", 
        company: "Port Harcourt",
        quote: "The lead management system helped me close deals I would have lost to poor follow-up. My earnings have never been better."
      }
    ],
    states: ["Lagos", "Abuja", "Rivers", "Kogi", "Kwara", "Niger", "Jos"]
  };

  const currentContent = activeRole === 'agent' ? agentContent : 
                        activeRole === 'tenant' ? tenantContent : 
                        managementContent;

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className=" flex items-center justify-center">
                <Image 
              src="/forems logo no bg.png" 
                  alt="Forems Logo" 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                />
              </div>
              <span className="font-semibold text-gray-800">Forems</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-700 hover:text-gray-800 cursor-pointer">Features</a>
              
              {/* Academy Dropdown */}
              <div className="relative" ref={academyRef}>
                <button 
                  className="text-sm text-gray-700 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                  onClick={() => setIsAcademyOpen(!isAcademyOpen)}
                >
                  <span>Academy</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isAcademyOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <a href="/certification" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer group">
                      <Award className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-blue-600">Certification</div>
                        <div className="text-xs text-gray-500 mt-1">Get certified in property management</div>
                      </div>
                    </a>
                    <a href="/courses" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer group">
                      <BookOpen className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-green-600">Courses</div>
                        <div className="text-xs text-gray-500 mt-1">Learn property management skills</div>
                      </div>
                    </a>
                    <a href="/internship" className="flex items-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer group">
                      <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-gray-900 group-hover:text-purple-600">Internship</div>
                        <div className="text-xs text-gray-500 mt-1">Gain practical experience</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
              
              <a href="#contact" className="text-sm text-gray-700 hover:text-gray-800 cursor-pointer">Contact</a>
              
              <div className="flex items-center gap-4">
                <a href="/login" className="text-sm text-gray-700 hover:text-gray-800 flex items-center gap-1 cursor-pointer">
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </a>
                <a href="/register" className="bg-gray-800 hover:bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 cursor-pointer">
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </a>
              </div>
            </div>

            <button 
              className="md:hidden p-2 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-gray-700 cursor-pointer">Features</a>
              
              {/* Mobile Academy Section */}
              <div>
                <button 
                  className="flex items-center justify-between w-full text-gray-700 cursor-pointer"
                  onClick={() => setIsAcademyOpen(!isAcademyOpen)}
                >
                  <span>Academy</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAcademyOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
                
                {isAcademyOpen && (
                  <div className="pl-4 mt-2 space-y-3">
                    <a href="/certification" className="flex items-start text-gray-600 cursor-pointer group">
                      <Award className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Certification</div>
                        <div className="text-xs text-gray-500">Get certified in property management</div>
                      </div>
                    </a>
                    <a href="/courses" className="flex items-start text-gray-600 cursor-pointer group">
                      <BookOpen className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Courses</div>
                        <div className="text-xs text-gray-500">Learn property management skills</div>
                      </div>
                    </a>
                    <a href="/internship" className="flex items-start text-gray-600 cursor-pointer group">
                      <Briefcase className="w-4 h-4 text-purple-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium">Internship</div>
                        <div className="text-xs text-gray-500">Gain practical experience</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>
              
              <a href="#contact" className="block text-gray-700 cursor-pointer">Contact</a>
              <a href="/login" className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </a>
              <a href="/register" className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </a>
              <button className="w-full bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer">
                {currentContent.hero.primaryCTA}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #6b7280 1px, transparent 1px),
              linear-gradient(to bottom, #6b7280 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 text-center">
          {/* Role Switcher */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex flex-wrap justify-center">
              <button
                onClick={() => setActiveRole('management')}
                className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2 cursor-pointer ${
                  activeRole === 'management' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Building2 className="w-3 md:w-4 h-3 md:h-4" />
                <span className="hidden sm:inline">Property Management</span>
                <span className="sm:hidden">Management</span>
              </button>
              <button
                onClick={() => setActiveRole('tenant')}
                className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2 cursor-pointer ${
                  activeRole === 'tenant' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Home className="w-3 md:w-4 h-3 md:h-4" />
                <span>Tenant</span>
              </button>
              <button
                onClick={() => setActiveRole('agent')}
                className={`px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors flex items-center gap-1 md:gap-2 cursor-pointer ${
                  activeRole === 'agent' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <UserCheck className="w-3 md:w-4 h-3 md:h-4" />
                <span>Agent</span>
              </button>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
            {activeRole === 'management' ? <Monitor className="w-4 h-4 text-gray-700" /> : 
             activeRole === 'agent' ? <Brain className="w-4 h-4 text-gray-700" /> : 
             <MessageCircle className="w-4 h-4 text-gray-700" />}
            <span className="text-sm font-medium text-gray-700">{currentContent.hero.badge}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
            {currentContent.hero.title}
          </h1>

          <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            {currentContent.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 md:mb-16">
            <button className="bg-gray-800 hover:bg-black/90 text-white px-6 md:px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer">
              <span>{currentContent.hero.primaryCTA}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="border border-gray-200/50 hover:bg-gray-50/50 px-6 md:px-8 py-3 rounded-lg font-medium text-gray-700 flex items-center justify-center gap-2 cursor-pointer">
              <Play className="w-4 h-4" />
              <span>{currentContent.hero.secondaryCTA}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-16">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-800">50K+</div>
              <div className="text-xs md:text-sm text-gray-600">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-800">98%</div>
              <div className="text-xs md:text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-800">24/7</div>
              <div className="text-xs md:text-sm text-gray-600">Support</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-bold text-gray-800">#1</div>
              <div className="text-xs md:text-sm text-gray-600">In Africa</div>
            </div>
          </div>

          <div className="bg-gray-50/50 rounded-lg p-4 md:p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-4">
              {activeRole === 'management' ? 'Trusted by professional property managers' : 
               activeRole === 'agent' ? 'Used by top-earning agents' : 
               'Loved by tenants across Nigeria'}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-3 opacity-60">
              {(currentContent.states || ["Lagos", "Abuja", "Port Harcourt", "Kano"]).map((state, index) => (
                <div key={index} className="text-xs font-medium text-gray-500">{state}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-gray-50/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {activeRole === 'management' ? 'Why Professional Management Matters' : 
             activeRole === 'agent' ? 'Stop Leaving Money on the Table' : 
             'Experience the Future of Renting'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-12">
            {activeRole === 'management' 
              ? 'Your property is a valuable asset that deserves proper care and professional management'
              : activeRole === 'agent'
              ? 'Professional tools lead to professional results and higher earnings'
              : 'Everything you need for comfortable, stress-free living'
            }
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
            {currentContent.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start justify-center gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 font-medium text-sm md:text-base text-left">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {activeRole === 'management' ? 'Complete Property Management Solution' : 
               activeRole === 'agent' ? 'Everything You Need to Succeed' : 
               'All Your Housing Needs Covered'}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              {activeRole === 'management' 
                ? 'Professional tools designed specifically for Nigerian property markets'
                : activeRole === 'agent'
                ? 'Built for African real estate professionals to maximize earnings'
                : 'Simple, fast, and reliable solutions for modern tenants'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentContent.features.map((feature, index) => (
              <div key={index} className="bg-gray-50/30 rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Automation Section - Focus for Management & Agent */}
      {(activeRole === 'management' || activeRole === 'agent') && (
        <section className="py-16 md:py-20 bg-gray-800 text-white">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              AI-Powered Automation
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {activeRole === 'management' 
                ? 'Our AI handles follow-ups, reminders, and tenant communication automatically. Focus on growing your portfolio while we handle the routine work.'
                : 'Automated lead follow-up, client communication, and prospect nurturing. Our AI works 24/7 so you can focus on closing deals.'
              }
            </p>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <p className="text-sm text-gray-300 italic">
                "The automated follow-up system converted leads I would have completely forgotten about"
              </p>
              <p className="text-xs text-gray-400 mt-2">- Current User</p>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof */}
      <section className="py-16 md:py-20 bg-gray-50/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {activeRole === 'management' ? 'Property Owners Love Our Professional Approach' : 
               activeRole === 'agent' ? 'Agents Are Increasing Their Earnings' : 
               'Tenants Love the Convenience'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {currentContent.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 cursor-pointer">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role && `${testimonial.role} • `}{testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {activeRole === 'management' ? 'Ready for Professional Property Management?' : 
             activeRole === 'agent' ? 'Ready to Increase Your Commission?' : 
             'Ready for Hassle-Free Living?'}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            {activeRole === 'management' 
              ? 'Join property owners who are protecting their investments and maximizing returns'
              : activeRole === 'agent'
              ? 'Join successful agents who are earning more with professional tools'
              : 'Join thousands of tenants enjoying convenient housing management'
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 cursor-pointer">
              {currentContent.hero.primaryCTA}
            </button>
            <button className="border border-white/20 hover:bg-white/10 px-8 py-3 rounded-lg font-medium cursor-pointer">
              Schedule Demo
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            {activeRole === 'management' ? 'No long-term contracts • Professional setup assistance' : 
             activeRole === 'agent' ? 'No credit card required • Start earning more immediately' : 
             'Start immediately • No downloads required'}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-gray-50/30 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <Image 
                  src="/forems logo no bg.png" 
                  alt="Forems Logo" 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                />
              </div>
              <span className="font-semibold text-gray-800">Forems</span>
              <span className="text-sm text-gray-600">© 2024 Forems Africa</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="mailto:hello@forems.com" className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                hello@forems.com
              </a>
              <a href="tel:+2348094793447" className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2 cursor-pointer">
                <Phone className="w-4 h-4" />
                +234 809 479 3447
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForemsAILanding;