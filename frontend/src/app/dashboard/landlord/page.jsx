'use client'
import React, { useState } from 'react';
import Layout from './(component)/layout';
import { FaNairaSign } from "react-icons/fa6";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import CreatePropertyModal from './(component)/CreateProperty';

import { 
  Building, 
  DollarSign, 
  Users, 
  CreditCard,
  Calendar,
  AlertCircle,
  Plus,
  Bell,
  FileText,
  Wrench,
  Trash2,
  MessageSquare,
  Settings,
  UserPlus,
  Receipt,
  BarChart3,
  Home,
  Shield,
  ClipboardList
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LandlordOverview = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState('monthly');

   const [isModalOpen, setIsModalOpen] = useState(false);
  const user = { hasCreatedBankAccount: false };
  
  // Mock data
  const dashboardData = {
    totalProperties: 24,
    totalUnits: 142,
    totalRevenue: 45750000,
    pendingRent: 7550000,
    expenses: 12900000,
    totalTenants: 118,
    occupancyRate: 91.5,
    
    financials: {
      collected: 38200000,
      pending: 7550000,
      expenses: 12900000,
      netProfit: 25300000
    },
    
    rentCollection: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [3200000, 3500000, 3800000, 4100000, 4500000, 4200000, 4600000, 4800000, 5100000, 5300000, 5500000, 5800000]
    },
    
    revenueBreakdown: {
      residential: 72,
      commercial: 22,
      other: 6
    },
    
    alerts: [
      { type: 'payment', count: 8, title: 'Pending Payments' },
      { type: 'lease', count: 5, title: 'Leases Expiring' },
      { type: 'maintenance', count: 3, title: 'Maintenance Requests' }
    ],
    
    topProperties: [
      { name: "Victoria Island Complex", occupancy: 100, revenue: 8500000 },
      { name: "Lekki Phase 1 Towers", occupancy: 87.5, revenue: 6200000 },
      { name: "Ikeja GRA Estate", occupancy: 83.3, revenue: 4100000 }
    ],
    
    notifications: [
      { id: 1, title: "Rent payment received from Tenant #245", time: "2 hours ago", read: false },
      { id: 2, title: "New maintenance request for Victoria Island", time: "5 hours ago", read: false },
      { id: 3, title: "Lease agreement signed for Lekki property", time: "Yesterday", read: true },
      { id: 4, title: "Property inspection scheduled for tomorrow", time: "2 days ago", read: true }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Rent collection chart data
  const rentChartData = {
    labels: dashboardData.rentCollection.labels,
    datasets: [
      {
        label: 'Rent Collection',
        data: dashboardData.rentCollection.values,
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(139, 92, 246)',
        pointBorderColor: '#fff',
        pointRadius: 3,
        pointHoverRadius: 5
      }
    ]
  };

  const rentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.03)'
        },
        ticks: {
          callback: function(value) {
            return '₦' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    maintainAspectRatio: false
  };

  // Revenue breakdown chart data
  const revenueChartData = {
    labels: ['Residential', 'Commercial', 'Other'],
    datasets: [
      {
        data: [
          dashboardData.revenueBreakdown.residential,
          dashboardData.revenueBreakdown.commercial,
          dashboardData.revenueBreakdown.other
        ],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(203, 213, 225, 0.8)'
        ],
        borderWidth: 0,
        borderRadius: 5,
        hoverOffset: 8
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
        }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  const StatCard = ({ title, value, subtitle, icon: Icon }) => {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <p className="text-xl font-semibold text-gray-900 mb-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
    );
  };

  const AlertItem = ({ title, count, icon: Icon }) => {
    return (
      <div className="flex items-center p-3 cursor-pointer bg-gray-50  rounded-lg">
        <div className="p-2 rounded-lg  bg-gray-200 text-gray-500">
          <Icon className="w-4 h-4" />
        </div>
        <div className="ml-3">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 font-normal">{count} {count === 1 ? 'alert' : 'alerts'}</p>
        </div>
      </div>
    );
  };

  const NotificationItem = ({ title, time, read }) => {
    return (
      <div className={`p-3 rounded-lg ${read ? 'bg-gray-50' : 'bg-green-50'} mb-2 transition-colors`}>
        <div className="flex justify-between items-start">
          <p className={`text-sm ${read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{title}</p>
          {!read && <span className="bg-green-500 w-2 h-2 rounded-full ml-2 mt-1 flex-shrink-0"></span>}
        </div>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    );
  };

  const QuickAction = ({ title, icon: Icon }) => {
    return (
      <button className="flex flex-col cursor-pointer  items-center p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors group">
        <div className="p-2 rounded-lg bg-white group-hover:bg-purple-100 transition-colors mb-2">
          <Icon className="w-4 h-4 text-gray-600 group-hover:text-gray-600" />
        </div>
        <span className="text-xs text-gray-600 group-hover:text-purple-700">{title}</span>
      </button>
    );
  };

  const TimeFilterButton = ({ label, active, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          active 
            ? 'bg-purple-100 text-purple-700' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen rounded bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Property Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm">Welcome back, here's your portfolio overview</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
             <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 text-purple-800 font-semibold text-sm rounded-lg shadow-md hover:scale-105 transition-all duration-300 cursor-pointer border border-purple-300">
        Add Property
      </button>
      
      <CreatePropertyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={user} 
      />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Properties"
              value={dashboardData.totalProperties}
              subtitle={`${dashboardData.totalUnits} units`}
              icon={Building}
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(dashboardData.totalRevenue)}
              subtitle="Year - 2025"
              icon={FaNairaSign}
            />
            <StatCard
              title="Pending "
              value={formatCurrency(dashboardData.pendingRent)}
              subtitle="To be collected"
              icon={CreditCard}
            />
            <StatCard
              title="Expenses"
              value={formatCurrency(dashboardData.expenses)}
              subtitle="This year"
              icon= {TrendingDownIcon}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-3">
                <QuickAction title="Make Announcement" icon={MessageSquare} />
                <QuickAction title="Rent Payment" icon={CreditCard} />
                <QuickAction title="Service Charge" icon={Receipt} />
                <QuickAction title="Add Property" icon={Plus} />
                <QuickAction title="Managers" icon={UserPlus} />
                <QuickAction title="All Tenants" icon={Users} />
                <QuickAction title="Waste Management" icon={Trash2} />
                <QuickAction title="Maintenance" icon={Wrench} />
                <QuickAction title="Reports" icon={BarChart3} />
              </div>
            </div>

            {/* Financial Overview */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <TimeFilterButton 
                    label="Weekly" 
                    active={activeTimeFilter === 'weekly'} 
                    onClick={() => setActiveTimeFilter('weekly')} 
                  />
                  <TimeFilterButton 
                    label="Monthly" 
                    active={activeTimeFilter === 'monthly'} 
                    onClick={() => setActiveTimeFilter('monthly')} 
                  />
                  <TimeFilterButton 
                    label="Yearly" 
                    active={activeTimeFilter === 'yearly'} 
                    onClick={() => setActiveTimeFilter('yearly')} 
                  />
                </div>
              </div>
              <div className="h-64">
                <Line data={rentChartData} options={rentChartOptions} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Alerts */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {dashboardData.alerts.map((alert, index) => (
                  <AlertItem
                    key={index}
                    title={alert.title}
                    count={alert.count}
                    icon={CreditCard}
                  />
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                {dashboardData.notifications.map(notification => (
                  <NotificationItem 
                    key={notification.id}
                    title={notification.title}
                    time={notification.time}
                    read={notification.read}
                  />
                ))}
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="h-48 mb-4">
                <Doughnut data={revenueChartData} options={revenueChartOptions} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm font-medium text-gray-900">72%</p>
                  <p className="text-xs text-gray-500">Residential</p>
                </div>
                <div>
                  <div className="w-3 h-3 bg-purple-300 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm font-medium text-gray-900">22%</p>
                  <p className="text-xs text-gray-500">Commercial</p>
                </div>
                <div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto mb-1"></div>
                  <p className="text-sm font-medium text-gray-900">6%</p>
                  <p className="text-xs text-gray-500">Other</p>
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </div>

      <style jsx global>{`
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
      `}</style>
    </Layout>
  );
};

export default LandlordOverview;