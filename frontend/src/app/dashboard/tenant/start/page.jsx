'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { 
  Search, Home, FileText, Users, MapPin, 
  CheckCircle, Award, TrendingUp, Download,
  User, ChevronRight, Calendar, Building2, MoreHorizontal, Crown,
  Sparkles, Star, ArrowRight, Heart, Plus, Eye, Zap, Target, Trophy,
  UserPlus, HomeIcon, Settings, AlertCircle, RefreshCw, Loader
} from 'lucide-react';
import SwitchRoleWidget from '@/components/Switchrole';

const TenantWelcomePage = () => {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tenantName, setTenantName] = useState('');

  const handleNavigation = (path) => {
    if (path.startsWith("/")) {
      router.push(path);
    } else {
      router.push(`/dashboard/tenant/start/${path}`);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tenancy-applications`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (response.data.success && response.data.data) {
          setApplications(response.data.data);
          // Get tenant name from first application if available
          if (response.data.data.length > 0) {
            setTenantName(response.data.data[0].tenantName || 'Tenant');
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applications:', error);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-blue-50';
    if (score >= 40) return 'bg-yellow-50';
    return 'bg-gray-50/50';
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Accepted: { color: "bg-green-50 text-green-600", icon: <CheckCircle className="w-3 h-3" /> },
      Rejected: { color: "bg-gray-50/50 text-red-500", icon: <AlertCircle className="w-3 h-3" /> },
      Pending: { color: "bg-gray-50/50 text-gray-700", icon: <TrendingUp className="w-3 h-3" /> }
    };
    
    const config = statusConfig[status] || statusConfig.Pending;
    
    return (
      <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${config.color}`}>
        {config.icon}
        {status}
      </div>
    );
  };

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get strength message based on score
  const getStrengthMessage = (score) => {
    if (score >= 80) {
      return "You have a strong application! 💪";
    } else if (score >= 60) {
      return "Good start, but there's room to improve";
    } else if (score >= 40) {
      return "Let's boost your chances of getting approved";
    } else {
      return "You're falling behind - let's fix this now! 🚨";
    }
  };

  // Handle boost button click
  const handleBoostClick = () => {
    const message = encodeURIComponent("I want to FAST-TRACK my chances of getting tenancy, how do I go about it?");
    const whatsappUrl = `https://wa.me/2348094793447?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const ApplicationCard = ({ app }) => (
    <div className="bg-gray-50/30 rounded-lg border border-gray-100 hover:border-gray-200/50 transition-all duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-gray-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-800 text-sm leading-tight">{app.property?.propertyName || 'Property Name'}</h3>
              <p className="text-xs text-gray-600 mt-1">{app.property?.landlord?.userId?.name || 'Landlord'} • {app.property?.address || 'Address'}</p>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-4">
        {/* Property Details */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50/50 p-3 rounded-md">
            <p className="text-xs text-gray-600 mb-1">Property</p>
            <p className="font-semibold text-gray-800 text-sm">{app.property?.propertyType || 'Property Type'}</p>
          </div>
          <div className="bg-gray-50/50 p-3 rounded-md">
            <p className="text-xs text-gray-600 mb-1">State</p>
            <p className="font-semibold text-gray-800 text-sm">{app.property?.state || 'State'}</p>
          </div>
        </div>
        
        {/* Application Strength */}
        <div className={`${getScoreBg(app.score)} p-3 rounded-md mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Application Strength</span>
            <span className={`text-sm font-bold ${getScoreColor(app.score)}`}>{app.score}%</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{getStrengthMessage(app.score)}</span>
          </div>
        </div>
        
        {/* Action Button */}
        {app.status === 'pending' && (
          <button 
            onClick={handleBoostClick}
            className="w-full bg-gray-800 cursor-pointer hover:bg-black/90 text-white py-2.5 px-4 rounded-md transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Fast-Track Approval</span>
          </button>
        )}
        
        {app.status === 'rejected' && (
          <button className="w-full bg-gray-50/50 hover:bg-gray-100 border border-gray-200/50 text-gray-700 py-2.5 px-4 rounded-md transition-colors font-medium text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4" />
            <span>Appeal Decision</span>
          </button>
        )}
        
        {app.status === 'accepted' && (
          <div className="w-full bg-green-50 text-green-600 py-2.5 px-4 rounded-md font-medium text-sm text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Congratulations! 🎉</span>
          </div>
        )}
      </div>
      
      {/* Card Footer */}
      <div className="px-4 py-3 bg-gray-100 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-600">Applied {formatDate(app.createdAt)}</span>
        <button className="text-xs text-blue-600 font-medium hover:text-blue-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* SaaS Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Top Navigation */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <img 
              src="/newlogoforems.png" 
              alt="Logo" 
              className="h-13"
            />
           
          </div>
        </div>

        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #6b7280 1px, transparent 1px),
              linear-gradient(to bottom, #6b7280 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
          {/* Simple Status */}
          <div className="inline-flex items-center gap-4 bg-gray-50/50 border border-gray-300 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-700">Hey {tenantName || 'there'} 👋</span>  <SwitchRoleWidget 
  className="ml-auto px-3 py-1.5 cursor-pointer bg-white/50 backdrop-blur-sm text-gray-800 font-medium rounded-full border border-white/10 shadow-sm hover:bg-white/30 hover:shadow-md transition-all duration-200"
/>


          </div>
          
          {/* Human-centered Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Let's find you 
            <br />
            a place to call home
          </h1>
          
          {/* Human Copy */}
          <p className="text-l text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            We know house hunting in Nigeria can be stressful. That's why we built something different - 
            a platform that actually helps you win.
          </p>

          {/* Clean CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
            <button 
              onClick={() => handleNavigation("vacantspace")}
              className="px-6 py-3 bg-gray-800 hover:bg-black/90 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span> House Hunting</span>
            </button>
            
            <button 
              onClick={() => handleNavigation("joinlandlord")}
              className="px-6 py-3 bg-white border border-gray-200/50 hover:bg-gray-50/50 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 text-gray-700"
            >
              <UserPlus className="w-4 h-4" />
              <span>Connect with Your Landlord</span>
            </button>
          </div>

          {/* Simple Trust Indicator */}
          <p className="text-sm text-gray-600">
            Join <span className="font-semibold text-gray-800">10,247</span> Nigerians who found their homes through us
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Single Stats Card */}
        <div className="mb-12">
          <div 
            className="bg-green-50 rounded-lg p-6 border border-green-200 hover:shadow-sm transition-all duration-200 cursor-pointer inline-block"
            onClick={() => handleNavigation("my-applications")}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg border border-green-200">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Active Applications</p>
                <p className="text-2xl font-bold text-green-600">{loading ? '...' : applications.length}</p>
                
              </div>
             
            </div>
          </div>
        </div>

        {/* Applications Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Applications</h2>
              <p className="text-gray-600">Here's how you're doing and where you can improve</p>
            </div>
           
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-gray-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading your applications...</span>
            </div>
          ) : applications.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {applications.map((app) => (
                <ApplicationCard key={app._id} app={app} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-6">Start your journey by finding your perfect home</p>
              <button 
                onClick={() => handleNavigation("vacantspace")}
                className="px-6 py-3 bg-gray-800 hover:bg-black/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <Search className="w-4 h-4" />
                <span>Find Properties</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantWelcomePage;