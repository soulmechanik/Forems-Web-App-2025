'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../(component)/layout';
import axios from 'axios';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({
    propertyName: '',
    numberOfUnits: 0,
    amenities: [],
    requiresTenancyContract: false,
    requiresInventoryReport: false,
    insurance: '',
    taxRate: 0,
    insuranceReceipts: false
  });
  const [uploading, setUploading] = useState(false);
  const [showAddAmenity, setShowAddAmenity] = useState(false);
  const [newAmenity, setNewAmenity] = useState({ label: '', icon: '' });

  // Amenities options with icons
  const AmenitiesOptions = [
    { id: 'internet', label: 'Internet', icon: '🌐' },
    { id: 'swimming_pool', label: 'Swimming Pool', icon: '🏊' },
    { id: 'solar_System', label: 'Solar Energy System', icon: '☀️' },
    { id: 'fitted_kitchen', label: 'Fitted Kitchen', icon: '🍳' },
    { id: 'car_park', label: 'Car Park', icon: '🚗' },
    { id: 'security_guard', label: 'Security Guard', icon: '👮' },
    { id: 'pop', label: 'P.O.P Ceiling', icon: '🏠' },
    { id: 'cctv', label: 'CCTV', icon: '📹' },
    { id: 'generator', label: 'Generator', icon: '🔌' },
    { id: 'water_supply', label: 'Clean Water Supply', icon: '💧' },
    { id: 'waste_disposal', label: 'Waste Disposal', icon: '🗑️' },
    { id: 'gym', label: 'Gym', icon: '💪' },
    { id: 'playground', label: 'Playground', icon: '🧒' },
    { id: 'air_conditioning', label: 'Air Conditioning', icon: '❄️' },
    { id: 'furnished', label: 'Furnished', icon: '🛋️' },
    { id: 'wardrobe', label: 'Wardrobe', icon: '👔' },
    { id: 'housekeeping', label: 'Housekeeping', icon: '🧹' },
    { id: 'laundry', label: 'Laundry', icon: '👕' },
    { id: 'conference_room', label: 'Conference Room', icon: '💼' },
    { id: 'elevator', label: 'Elevator', icon: '🛗' },
    { id: 'disabled_access', label: 'Disabled Access', icon: '♿' },
    { id: 'fire_safety', label: 'Fire Safety', icon: '🔥' },
    { id: 'security_fence', label: 'Security Fence', icon: '🚧' },
    { id: 'intercom', label: 'Intercom System', icon: '📞' },
    { id: 'smart_home', label: 'Smart Home Features', icon: '🏡' },
  ];

  // Document types
  const documentTypes = [
    {
      id: 'tenancy_agreement',
      label: 'Tenancy Agreement',
      field: 'requiresTenancyContract',
      description: 'Legal contract between landlord and tenant',
      icon: '📝'
    },
    {
      id: 'inventory_report',
      label: 'Inventory Report',
      field: 'requiresInventoryReport', 
      description: 'Documentation of property condition and contents',
      icon: '📋'
    },
    {
      id: 'insurance_receipts',
      label: 'Insurance Receipts',
      field: 'insuranceReceipts',
      description: 'Proof of insurance coverage and payments',
      icon: '🧾'
    }
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/${id}`,
          { withCredentials: true }
        );
        setProperty(response.data);
        // Initialize settings with property data
        setSettings({
          propertyName: response.data.propertyName || '',
          numberOfUnits: response.data.numberOfUnits || 0,
          amenities: response.data.amenities || [],
          requiresTenancyContract: response.data.requiresTenancyContract || false,
          requiresInventoryReport: response.data.requiresInventoryReport || false,
          insurance: response.data.insurance || '',
          taxRate: response.data.taxRate || 0,
          insuranceReceipts: response.data.insuranceReceipts || false
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleSaveSettings = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/${id}/settings`,
        settings,
        { withCredentials: true }
      );
      setProperty(response.data);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Error saving settings: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleAmenity = (amenityId) => {
    setSettings(prev => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenityId)) {
        return { ...prev, amenities: amenities.filter(a => a !== amenityId) };
      } else {
        return { ...prev, amenities: [...amenities, amenityId] };
      }
    });
  };

  const addCustomAmenity = () => {
    if (newAmenity.label && newAmenity.icon) {
      const customId = `custom_${Date.now()}`;
      const customAmenity = {
        id: customId,
        label: newAmenity.label,
        icon: newAmenity.icon
      };
      
      // Add to amenities options
      AmenitiesOptions.push(customAmenity);
      
      // Add to selected amenities
      setSettings(prev => ({
        ...prev,
        amenities: [...prev.amenities, customId]
      }));
      
      // Reset form
      setNewAmenity({ label: '', icon: '' });
      setShowAddAmenity(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/${id}/upload-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setProperty(response.data);
      alert('Image uploaded successfully!');
    } catch (err) {
      alert('Error uploading image: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No property found</h3>
            <p className="mt-1 text-gray-500">The property you're looking for doesn't exist.</p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/dashboard/properties')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Back to Properties
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Calculate vacancy rate and add dummy data
  const dummyTenants = [
    {
      _id: '1',
      name: 'John Anderson',
      email: 'john.anderson@email.com',
      phone: '+1 (555) 123-4567',
      unitNumber: 'Unit A1',
      rentAmount: 1200,
      leaseStart: '2024-01-15',
      leaseEnd: '2024-12-31',
      status: 'Active'
    },
    {
      _id: '2',
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      phone: '+1 (555) 234-5678',
      unitNumber: 'Unit B2',
      rentAmount: 1350,
      leaseStart: '2024-02-01',
      leaseEnd: '2024-12-31',
      status: 'Active'
    },
    {
      _id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 345-6789',
      unitNumber: 'Unit C3',
      rentAmount: 1100,
      leaseStart: '2024-03-10',
      leaseEnd: '2024-12-31',
      status: 'Active'
    }
  ];

  const displayTenants = property.tenants && property.tenants.length > 0 ? property.tenants : dummyTenants;
  const tenantsCount = displayTenants.length;
  const vacancyRate = ((property.numberOfUnits - tenantsCount) / property.numberOfUnits) * 100;
  const hasVacancies = tenantsCount < property.numberOfUnits;

  // Dummy financial data
  const currentYear = new Date().getFullYear();
  const totalRevenue = displayTenants.reduce((sum, tenant) => sum + (tenant.rentAmount * 12), 0);
  const duePayments = 2850; // Dummy amount for overdue payments

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Property Header */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{property.propertyName}</h1>
              <p className="text-gray-600 text-sm mt-1">{property.address}</p>
              <div className="flex items-center mt-3 space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {property.state}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 capitalize">
                  {property.propertyType}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {property.numberOfUnits} units
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center text-xs text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors border border-gray-200"
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tenants')}
              className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'tenants' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tenants ({tenantsCount})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-md mr-3">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Units</p>
                    <p className="text-lg font-semibold text-gray-900">{property.numberOfUnits}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Occupied</p>
                    <p className="text-lg font-semibold text-gray-900">{tenantsCount}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-2 rounded-md mr-3">
                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Vacancy Rate</p>
                    <p className="text-lg font-semibold text-gray-900">{vacancyRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Contracts</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {property.requiresTenancyContract ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-emerald-100 p-2 rounded-md mr-3">
                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Revenue {currentYear}</p>
                    <p className="text-lg font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-xs border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-md mr-3">
                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5C3.498 18.333 4.46 20 6 20z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Due Payments</p>
                    <p className="text-lg font-semibold text-red-600">${duePayments.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                  <div className="bg-indigo-100 p-2 rounded-full mb-2">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700">Add Tenant</span>
                </button>
                
                <button 
                  onClick={() => router.push('/dashboard/landlord/advertisevacancy')}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  <div className="bg-amber-100 p-2 rounded-full mb-2">
                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700">Advertise Vacancy</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                  <div className="bg-green-100 p-2 rounded-full mb-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700">Generate Report</span>
                </button>
                
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                  <div className="bg-purple-100 p-2 rounded-full mb-2">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-xs text-gray-700">Send Message</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Tenants</h2>
              {hasVacancies && (
                <button
                  onClick={() => router.push('/dashboard/landlord/advertisevacancy')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-xs text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Advertise Vacancy
                </button>
              )}
            </div>

            {property.tenants && property.tenants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {property.tenants.map((tenant) => (
                  <div key={tenant._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start mb-3">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{tenant.name}</h3>
                        <p className="text-xs text-gray-600 truncate">{tenant.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{tenant.phone || 'No phone provided'}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayTenants.map((tenant) => (
                  <div key={tenant._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-all">
                    <div className="flex items-start mb-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full mr-4">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{tenant.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{tenant.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{tenant.phone}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Unit:</span>
                        <span className="text-sm font-semibold text-gray-900">{tenant.unitNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Rent:</span>
                        <span className="text-sm font-semibold text-green-600">${tenant.rentAmount.toLocaleString()}/month</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">Lease:</span>
                        <span className="text-xs text-gray-700">{tenant.leaseStart} - {tenant.leaseEnd}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
                        {tenant.status}
                      </span>
                      <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!property.tenants || property.tenants.length === 0 ? (
              <div className="text-center py-8 mt-6">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-3 text-sm font-medium text-gray-900">This is showing dummy tenant data</h3>
                <p className="mt-1 text-xs text-gray-500">Once you have real tenants, they will replace this dummy data.</p>
              </div>
            ) : null}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl p-5 shadow-xs border border-gray-100">
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-6">Property Settings</h2>
            
            <div className="space-y-8">
              {/* Property Image Upload */}
              <div>
                <h3 className="text-xs font-medium text-gray-700 uppercase mb-3">Property Images</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.propertyName} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Property Image</label>
                    <label className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm">Choose file</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                      />
                    </label>
                    {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
                    <p className="text-xs text-gray-500 mt-2">JPEG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-xs font-medium text-gray-700 uppercase mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Property Name</label>
                    <input
                      type="text"
                      value={settings.propertyName}
                      onChange={(e) => setSettings({...settings, propertyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Number of Units</label>
                    <input
                      type="number"
                      value={settings.numberOfUnits}
                      onChange={(e) => setSettings({...settings, numberOfUnits: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="text-xs font-medium text-gray-700 uppercase mb-3">Documents</h3>
                <div className="space-y-3">
                  {documentTypes.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-white rounded-md border border-gray-300 text-lg">
                          {doc.icon}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-700">{doc.label}</p>
                          <p className="text-xs text-gray-500">{doc.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${settings[doc.field] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {settings[doc.field] ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={() => router.push(`/property/${id}/edit/${doc.id}`)}
                          className="px-3 py-1.5 bg-white text-indigo-600 text-sm font-medium rounded-md border border-indigo-200 hover:bg-indigo-50 transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Settings */}
              <div>
                <h3 className="text-xs font-medium text-gray-700 uppercase mb-3">Financial Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      value={settings.insurance}
                      onChange={(e) => setSettings({...settings, insurance: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., State Farm, Allstate"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-medium text-gray-700 uppercase">Amenities</h3>
                  <button
                    onClick={() => setShowAddAmenity(true)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Custom
                  </button>
                </div>

                {/* Add Custom Amenity Modal */}
                {showAddAmenity && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Add Custom Amenity</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Amenity Name</label>
                        <input
                          type="text"
                          value={newAmenity.label}
                          onChange={(e) => setNewAmenity({...newAmenity, label: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g., Rooftop Garden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                        <input
                          type="text"
                          value={newAmenity.icon}
                          onChange={(e) => setNewAmenity({...newAmenity, icon: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="🌿"
                          maxLength="2"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={addCustomAmenity}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Add Amenity
                      </button>
                      <button
                        onClick={() => {
                          setShowAddAmenity(false);
                          setNewAmenity({ label: '', icon: '' });
                        }}
                        className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Amenities */}
                {settings.amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-700 uppercase mb-2">Selected Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {settings.amenities.map(amenityId => {
                        const amenity = AmenitiesOptions.find(a => a.id === amenityId);
                        if (!amenity) return null;
                        return (
                          <div 
                            key={amenityId}
                            className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                          >
                            <span className="mr-2 text-base">{amenity.icon}</span>
                            <span>{amenity.label}</span>
                            <button
                              onClick={() => toggleAmenity(amenityId)}
                              className="ml-2 text-indigo-600 hover:text-indigo-800 font-bold text-lg leading-none"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available Amenities Grid */}
                <div>
                  <h4 className="text-xs font-medium text-gray-700 uppercase mb-2">Available Amenities</h4>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AmenitiesOptions
                        .filter(amenity => !settings.amenities.includes(amenity.id))
                        .map(amenity => (
                          <button
                            key={amenity.id}
                            onClick={() => toggleAmenity(amenity.id)}
                            className="flex items-center p-2 bg-white rounded-md border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all text-left"
                          >
                            <span className="text-lg mr-3">{amenity.icon}</span>
                            <span className="text-sm font-medium text-gray-700 flex-1">{amenity.label}</span>
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-white transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PropertyDetailsPage;