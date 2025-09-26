'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Layout from '../../(component)/layout';
import Loading from '../../../../../components/loadingScreen';

const MyTenantsPage = () => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // cards or table
  const router = useRouter();

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/my-tenants`,
          { withCredentials: true }
        );
        setProperties(res.data.properties || []);
        setLoading(false);
      } catch (err) {
        console.error('[MyTenants] Error fetching tenants:', err);
        setError('Failed to fetch tenants');
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const allTenants = properties.flatMap(property => 
    property.tenants.map(tenant => ({
      ...tenant,
      propertyName: property.propertyName,
      propertyId: property.propertyId
    }))
  );

  const filteredTenants = allTenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTenantClick = (tenantId) => {
    router.push(`/tenants/${tenantId}`);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Failed to load</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen ">
        {/* Hero Section with Backdrop */}
        <div className="relative bg-gradient-to-br rounded-3xl from-gray-700 via-gray-800 to-gray-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/3 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-6xl mx-auto px-5 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-8 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-semibold text-white mb-3">Tenant Management</h1>
                <p className="text-gray-300 text-sm lg:text-base mb-4">
                  Streamline tenant relationships, track lease status, and manage communications
                </p>
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{allTenants.filter(t => t.hasActiveTenancy).length} Active Tenants</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-400">{allTenants.filter(t => !t.hasActiveTenancy).length} Inactive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{properties.filter(p => p.tenants.length > 0).length} Occupied Properties</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 lg:items-center">
                {/* Search */}
                <div className="relative">
                  <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search tenants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-72 pl-9 pr-4 py-2.5 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-white/30 focus:outline-none transition-all"
                  />
                </div>
                
                {/* View Toggle - Hidden on Mobile */}
                <div className="hidden md:flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'cards'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Table
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-5 py-8">
          {filteredTenants.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
              {allTenants.length === 0 ? (
                <>
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tenants found</h3>
                  <p className="text-gray-500">Tenants will appear here when added to properties</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Cards View (Default + Mobile Only) */}
              {(viewMode === 'cards' || window.innerWidth < 768) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTenants.map((tenant) => (
                    <div 
                      key={`${tenant.propertyId}-${tenant.tenantId}`}
                      className="bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-hidden group"
                      onClick={() => handleTenantClick(tenant.tenantId)}
                    >
                      {/* Card Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {tenant.passportPhoto ? (
                              <img 
                                src={tenant.passportPhoto} 
                                alt={tenant.name}
                                className="w-14 h-14 rounded-xl object-cover border-2 border-gray-100"
                              />
                            ) : (
                              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                tenant.hasActiveTenancy ? 'bg-gray-900' : 'bg-gray-400'
                              }`}>
                                <span className="text-white font-semibold text-lg">
                                  {tenant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">{tenant.name}</h3>
                              <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                tenant.hasActiveTenancy 
                                  ? 'bg-green-50 text-green-700 border border-green-200' 
                                  : 'bg-gray-50 text-gray-600 border border-gray-200'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  tenant.hasActiveTenancy ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                {tenant.hasActiveTenancy ? 'Active' : 'Inactive'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tenant Details */}
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate">{tenant.propertyName}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">{tenant.email}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{tenant.phone}</span>
                            </div>
                            {tenant.gender && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                {tenant.gender}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex space-x-3">
                          <button 
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${tenant.email}`;
                            }}
                          >
                            Contact
                          </button>
                          <button 
                            className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTenantClick(tenant.tenantId);
                            }}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table View (Desktop Only) */}
              {viewMode === 'table' && (
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tenant</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Property</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contact</span>
                      </div>
                      <div className="col-span-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Gender</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</span>
                      </div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-gray-100">
                    {filteredTenants.map((tenant) => (
                      <div 
                        key={`${tenant.propertyId}-${tenant.tenantId}`}
                        className="px-6 py-4 hover:bg-gray-25 cursor-pointer transition-colors group"
                        onClick={() => handleTenantClick(tenant.tenantId)}
                      >
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Tenant Info */}
                          <div className="col-span-4 flex items-center space-x-3">
                            {tenant.passportPhoto ? (
                              <img 
                                src={tenant.passportPhoto} 
                                alt={tenant.name}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                tenant.hasActiveTenancy ? 'bg-gray-900' : 'bg-gray-400'
                              }`}>
                                <span className="text-white font-medium text-xs">
                                  {tenant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </span>
                              </div>
                            )}
                            <div>
                              <h4 className={`text-sm font-medium ${
                                tenant.hasActiveTenancy ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {tenant.name}
                              </h4>
                              <p className="text-xs text-gray-500">{tenant.email}</p>
                            </div>
                          </div>

                          {/* Property */}
                          <div className="col-span-2">
                            <p className="text-sm text-gray-700">{tenant.propertyName}</p>
                          </div>

                          {/* Contact */}
                          <div className="col-span-2">
                            <p className="text-sm text-gray-600">{tenant.phone}</p>
                          </div>

                          {/* Gender */}
                          <div className="col-span-1">
                            <p className="text-sm text-gray-600">{tenant.gender || 'N/A'}</p>
                          </div>

                          {/* Status */}
                          <div className="col-span-2">
                            <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                              tenant.hasActiveTenancy 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                tenant.hasActiveTenancy ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              {tenant.hasActiveTenancy ? 'Active' : 'Inactive'}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex justify-end">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                              <button 
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `mailto:${tenant.email}`;
                                }}
                                title="Send email"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                              </button>
                              <button 
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTenantClick(tenant.tenantId);
                                }}
                                title="Manage tenant"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyTenantsPage;