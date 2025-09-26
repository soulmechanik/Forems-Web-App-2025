// src/app/dashboard/tenant/start/components/Overview.jsx
import React from 'react';
import StatCard from './StatCard';
import ApplicationCard from './ApplicationCard';
import JoinRequestCard from './JoinRequestCard';
import { STATS, applications, joinRequests } from '../utils/constants';
import { Search, UserCheck, ChevronRight, TrendingUp } from 'lucide-react';

const Overview = ({ setActiveTab }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Welcome back, Hassanah!</h1>
        <p className="text-purple-700 mb-6">You have 2 accepted applications and 1 approved join request.</p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveTab('listings')}
            className="px-4 py-2.5 md:px-6 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium flex items-center gap-2 text-sm md:text-base"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5" />
            Find a New Apartment
          </button>
          <button 
            onClick={() => setActiveTab('joinRequests')}
            className="px-4 py-2.5 md:px-6 md:py-3 bg-white text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all duration-200 font-medium flex items-center gap-2 text-sm md:text-base"
          >
            <UserCheck className="w-4 h-4 md:w-5 md:h-5" />
            Join Your Landlord
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {STATS.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            iconColor={stat.iconColor}
            onClick={() => setActiveTab(
              index === 0 ? 'applications' : 'joinRequests'
            )}
          />
        ))}
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Recent Applications</h2>
          <button 
            onClick={() => setActiveTab('applications')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 text-sm md:text-base"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {applications.slice(0, 2).map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      </div>

      {/* Join Requests Sent */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Join Requests Sent</h2>
          <button 
            onClick={() => setActiveTab('joinRequests')}
            className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 text-sm md:text-base"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {joinRequests.map((request) => (
            <JoinRequestCard key={request.id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;