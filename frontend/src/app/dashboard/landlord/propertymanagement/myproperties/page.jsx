'use client'
import { useState, useEffect } from 'react';
import Layout from '../../(component)/layout';
import axios from 'axios';
import CreatePropertyModal from '../../(component)/CreateProperty';
import { usePathname } from "next/navigation";

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/userproperty`,
          { withCredentials: true }
        );
        setProperties(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const calculateVacancyRate = (property) => {
    const mockTenantsCount = Math.floor(Math.random() * property.numberOfUnits);
    const vacancyRate = ((property.numberOfUnits - mockTenantsCount) / property.numberOfUnits) * 100;
    return {
      tenants: mockTenantsCount,
      vacancyRate: vacancyRate.toFixed(1)
    };
  };

  const formatAmenity = (amenity) => {
    return amenity.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="sm:flex sm:items-center mb-8">
            <div className="sm:flex-auto">
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="mt-2 text-gray-600">
                Manage your property portfolio with ease
              </p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <div
                onClick={() => setShowModal(true)}
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              >
               Create Property
              </div>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const vacancyInfo = calculateVacancyRate(property);
              
              return (
                <div key={property._id} className="group">
                  {/* Enhanced Glassmorphism Card */}
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header with settings and manage button */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">{property.propertyName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-sm">
                            {property.state}
                          </span>
                        </div>
                        <a 
                          href={`/settings/${property._id}`}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-white/80 ml-2"
                          title="Property Settings"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </a>
                      </div>
                      
                      {/* People Information */}
                      <div className="mb-4 p-3 bg-white/60 rounded-lg border border-gray-100">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Landlord</p>
                            <p className="text-sm font-medium text-gray-900">
                              {property.landlord?.userId?.name || property.ownerName || "Not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Manager</p>
                            <p className="text-sm font-medium text-gray-900">
                              {property.propertyManagers?.length > 0
                                ? property.propertyManagers[0]?.userId?.name || "Unnamed Manager"
                                : "Not assigned"}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white/90 p-3 rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium">Units</p>
                          <p className="text-lg font-bold text-gray-900">{property.numberOfUnits}</p>
                        </div>
                        <div className="bg-white/90 p-3 rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium">Occupied</p>
                          <p className="text-lg font-bold text-gray-900">{vacancyInfo.tenants}</p>
                        </div>
                        <div className="bg-white/90 p-3 rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium">Type</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">{property.propertyType}</p>
                        </div>
                        <div className="bg-white/90 p-3 rounded-xl border border-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 font-medium">Vacancy</p>
                          <p className={`text-lg font-bold ${vacancyInfo.vacancyRate > 20 ? 'text-red-600' : 'text-green-600'}`}>
                            {vacancyInfo.vacancyRate}%
                          </p>
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 font-medium mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 4).map((amenity, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 rounded-lg text-xs font-medium bg-white text-gray-700 border border-gray-200 shadow-sm"
                            >
                              {formatAmenity(amenity)}
                            </span>
                          ))}
                          {property.amenities.length > 4 && (
                            <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white text-gray-600 border border-gray-200 shadow-sm">
                              +{property.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Status and Manage Button */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          {property.requiresTenancyContract ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200 shadow-sm">
                              Tenancy Contract Enabled ✓
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">
                              No Contract
                            </span>
                          )}
                          
                          {property.requiresInventoryReport && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                              Inventory ✓
                            </span>
                          )}
                        </div>
                        
                        <a 
                         href={`${pathname}/${property._id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Manage
                          <svg className="ml-1 -mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {properties.length === 0 && (
            <div className="text-center py-12">
              {/* Enhanced Glassmorphism Empty State */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-white/90 shadow-xl max-w-md mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/5 to-white/20 opacity-50 pointer-events-none"></div>
                <div className="relative z-10">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                  <p className="text-gray-600 mb-4">Get started by adding your first property to manage.</p>
                  <button 
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Property
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Component */}
      <CreatePropertyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </Layout>
  );
};

export default PropertyPage;
