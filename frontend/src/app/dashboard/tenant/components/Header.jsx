// src/app/dashboard/tenant/start/components/Header.jsx
import React from 'react';
import { Home, Bell, Menu, X } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Forems Africa</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Your rental journey starts here</p>
            </div>
          </div>
          
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </button>
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">SK</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;