"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, MapPin, User, X, Home, ChevronDown, ChevronUp, MessageCircle, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function JoinLandlordPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/joinable`,
          { withCredentials: true }
        );
        setAllProperties(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load properties. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching properties:", err);
      }
    };

    fetchProperties();
  }, []);

  // Local search function
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 2) {
      const results = allProperties.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase()) ||
        (p.manager && p.manager.toLowerCase().includes(value.toLowerCase())) ||
        p.address.toLowerCase().includes(value.toLowerCase()) ||
        (p.landlord && p.landlord.toLowerCase().includes(value.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleApply = (property) => {
    // Navigate to apply page with only property ID as query parameter
    router.push(`${window.location.pathname}/apply?propertyId=${property.id}`);
  };

  const togglePropertyExpansion = (id) => {
    setExpandedProperty(expandedProperty === id ? null : id);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    searchInputRef.current.focus();
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/08094793447?text=Hello, I need help finding my property.`, '_blank');
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 font-sans">
      {/* Top navigation with logo and back button */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm">Back</span>
        </button>
        
        <div className="flex items-center">
          <img 
            src="/newlogoforems.png" 
            alt="Forem Africa Logo" 
            className="h-8 object-contain"
          />
        </div>
      </div>

      {/* Main card content */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-5 bg-gray-700 rounded-sm"></div>
            <span className="text-gray-600 text-xs font-medium tracking-wide">FOREM AFRICA</span>
          </div>
          <h1 className="text-xl font-medium text-gray-800 mb-1">
            Connect with Your Landlord
          </h1>
          <p className="text-gray-500 text-xs">
            Search by address, property name, or manager
          </p>
        </div>

        {/* Middle section with the new text */}
        <div className="px-6 py-4 border-b border-gray-100 bg-blue-50">
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium">
          For tenants who have already paid rent and whose landlord is registered on Forem Africa
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-6 py-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search properties..."
              className="bg-white text-gray-700 rounded-lg pl-10 pr-10 py-2.5 w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-700"></div>
              <p className="text-gray-600 text-sm mt-2">Loading properties...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg text-center border border-red-200">
              <p className="text-red-600 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-red-600 hover:text-red-800 text-xs mt-1 underline"
              >
                Try again
              </button>
            </div>
          )}
          
          {/* Search results */}
          {!isLoading && !error && searchResults.length > 0 && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-2 font-medium">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
              {searchResults.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-lg mb-2 border border-gray-200 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                        <p className="font-medium text-gray-800 text-sm">
                          {p.name}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{p.address}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleApply(p)}
                      className="ml-2 px-3 py-1.5 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-800 transition-all duration-200"
                    >
                      Connect
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => togglePropertyExpansion(p.id)}
                    className="flex items-center gap-1 text-xs text-gray-600 mt-2"
                  >
                    {expandedProperty === p.id ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Less details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> More details
                      </>
                    )}
                  </button>
                  
                  {expandedProperty === p.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid gap-2 text-xs">
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span>Landlord: {p.landlord || "Not specified"}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <Home className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span>Manager: {p.manager || "No manager assigned"}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span>State: {p.state}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* No results found */}
          {!isLoading && !error && searchTerm.length > 2 && searchResults.length === 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-gray-600 text-sm">No properties found</p>
              <button 
                onClick={clearSearch}
                className="text-gray-600 hover:text-gray-800 text-xs mt-1"
              >
                Clear search
              </button>
            </div>
          )}
          
          {/* Initial state - no search yet */}
          {!isLoading && !error && searchTerm.length === 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center border border-gray-200">
              <p className="text-gray-600 text-sm">Start typing to search for properties</p>
              <p className="text-gray-500 text-xs mt-1">Enter at least 3 characters</p>
            </div>
          )}
        </div>

        {/* Help section */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 bg-gray-200 rounded">
              <MessageCircle className="w-3.5 h-3.5 text-gray-600" />
            </div>
            <h2 className="font-medium text-gray-700 text-sm">Need help finding your property?</h2>
          </div>
          <p className="text-gray-600 text-xs mb-4">
            Message us on WhatsApp for quick assistance.
          </p>
          <button 
            onClick={handleWhatsAppContact}
            className="w-full bg-gray-700 text-white rounded py-2.5 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact via WhatsApp
          </button>
        </div>

        {/* Tips */}
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
          <h3 className="font-medium text-gray-600 text-xs mb-2 uppercase tracking-wide">Search Tips</h3>
          <ul className="text-gray-600 text-xs space-y-1">
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              <span>Try your complete address</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              <span>Search by landlord or manager name</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              <span>Use the property name</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}