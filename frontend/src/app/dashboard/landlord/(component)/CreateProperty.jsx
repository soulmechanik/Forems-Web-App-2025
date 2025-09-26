"use client";
export const dynamic = "force-dynamic";


import { useState, useEffect } from 'react';
import axios from "axios";
import toast from "react-hot-toast";

const NigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
  "Sokoto", "Taraba", "Yobe", "Zamfara"
];

// Amenities options with Nigerian focus
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

export default function CreatePropertyModal({ isOpen, onClose, }) {
const [currentStep, setCurrentStep] = useState(1);
const [isVisible, setIsVisible] = useState(false);
const [loading, setLoading] = useState(false);
const [verifyingAccount, setVerifyingAccount] = useState(false);
const [banks, setBanks] = useState([]);
const [filteredBanks, setFilteredBanks] = useState([]);
const [bankError, setBankError] = useState('');
const [formErrors, setFormErrors] = useState({});
const [bankSearch, setBankSearch] = useState('');
const [showBankDropdown, setShowBankDropdown] = useState(false);
const [selectedAmenities, setSelectedAmenities] = useState([]);
const [amenitiesSearch, setAmenitiesSearch] = useState('');
const [user, setUser] = useState(null);


  // Form state
const [formData, setFormData] = useState({
  bankCode: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  propertyName: '',
  address: '',
  numberOfUnits: '',
  state: '',
  propertyType: '',
  managerId: '',
  requiresTenancyContract: true,
  amenities: []
});

  // Check if bank account is verified
  const isBankVerified = formData.bankCode && formData.accountNumber && formData.accountName;

useEffect(() => {
  if (isOpen) {
    const fetchLatestUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );

        const latestUser = res.data; // ✅ FIXED
        console.log("Fetched latest user:", latestUser);

        setUser(latestUser);

        setFormData(prev => ({
          ...prev,
          managerId: latestUser?._id || "",
        }));

        setCurrentStep(latestUser?.hasCreatedBankAccount ? 2 : 1);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchLatestUser();
    fetchBanks();
    setTimeout(() => setIsVisible(true), 10);
  } else {
    setIsVisible(false);
  }
}, [isOpen]);


// Add this useEffect to track when currentStep changes
useEffect(() => {
  console.log("Current step changed to:", currentStep);
}, [currentStep]);






  // Filter banks based on search input
  useEffect(() => {
    if (bankSearch) {
      const filtered = banks.filter(bank => 
        bank.bank_name.toLowerCase().includes(bankSearch.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks(banks);
    }
  }, [bankSearch, banks]);

  // Filter amenities based on search input
  const filteredAmenities = amenitiesSearch
    ? AmenitiesOptions.filter(amenity => 
        amenity.label.toLowerCase().includes(amenitiesSearch.toLowerCase()))
    : AmenitiesOptions;

  // Validate form at each step
  const validateStep = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.bankName) errors.bankName = 'Bank name is required';
      if (!formData.accountNumber) errors.accountNumber = 'Account number is required';
      if (formData.accountNumber && formData.accountNumber.length !== 10) {
        errors.accountNumber = 'Account number must be 10 digits';
      }
      if (!formData.accountName) errors.accountName = 'Please verify your bank account';
    }
    
    if (step === 2) {
      if (!formData.propertyName) errors.propertyName = 'Property name is required';
      if (!formData.address) errors.address = 'Address is required';
      if (!formData.numberOfUnits) errors.numberOfUnits = 'Number of units is required';
      if (formData.numberOfUnits && parseInt(formData.numberOfUnits) < 1) {
        errors.numberOfUnits = 'Must have at least 1 unit';
      }
      if (!formData.state) errors.state = 'State is required';
      if (!formData.propertyType) errors.propertyType = 'Property type is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

// Fetch list of banks from your backend API
const fetchBanks = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/banks`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔑 send cookies with request
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setBanks(data.banks);
        setFilteredBanks(data.banks);
      } else {
        setBankError("Failed to load banks. Please try again.");
      }
    } else {
      setBankError("Failed to load banks. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching banks:", error);
    setBankError("Unable to load banks list. Please check your connection.");
  }
};

// Verify bank account using your backend API
const verifyBankAccount = async () => {
  if (!formData.bankCode || !formData.accountNumber) {
    setBankError("Please select a bank and enter account number");
    return;
  }

  if (formData.accountNumber.length < 10) {
    setBankError("Account number must be 10 digits");
    return;
  }

  setVerifyingAccount(true);
  setBankError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-bank`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔑 send cookies with request
        body: JSON.stringify({
          bankCode: formData.bankCode,
          accountNumber: formData.accountNumber,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          accountName: data.accountName || "Verification successful",
        }));
        setBankError("");
      } else {
        setBankError(data.message || "Account verification failed");
      }
    } else {
      setBankError("Verification service unavailable. Please try again.");
    }
  } catch (error) {
    console.error("Error verifying account:", error);
    setBankError("Unable to verify account. Please check your connection.");
  } finally {
    setVerifyingAccount(false);
  }
};


  // Auto-verify when account number is complete and bank is selected
  useEffect(() => {
    if (formData.bankCode && formData.accountNumber && formData.accountNumber.length === 10) {
      const delayDebounce = setTimeout(() => {
        verifyBankAccount();
      }, 1000);

      return () => clearTimeout(delayDebounce);
    }
  }, [formData.bankCode, formData.accountNumber]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (bankError) setBankError('');
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBankSearch = (e) => {
    setBankSearch(e.target.value);
    setShowBankDropdown(true);
  };

  const handleBankSelect = (bank) => {
    setFormData(prev => ({
      ...prev,
      bankName: bank.bank_name || '',
      bankCode: bank.bank_code || ''
    }));
    
    setBankSearch(bank.bank_name);
    setShowBankDropdown(false);
    
    if (formErrors.bankName) {
      setFormErrors(prev => ({ ...prev, bankName: '' }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId];
      
      // Update form data with amenities
      setFormData(prevData => ({
        ...prevData,
        amenities: newAmenities
      }));
      
      return newAmenities;
    });
  };

  const handleNext = (e) => {
    e.preventDefault(); // Prevent any form submission
    if (!validateStep(currentStep)) return;
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = (e) => {
    e.preventDefault(); // Prevent any form submission
    setCurrentStep(prev => prev - 1);
  };

const handleCreateProperty = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  console.log("[CreateProperty] Submit started");

  if (!validateStep(2)) {
    console.warn("[CreateProperty] Step 2 validation failed");
    return;
  }

  setLoading(true);

  try {
    // ✅ Prepare property payload including bank details if needed
    const propertyPayload = {
      propertyName: formData.propertyName,
      address: formData.address,
      numberOfUnits: parseInt(formData.numberOfUnits, 10),
      state: formData.state,
      propertyType: formData.propertyType,
      managerId: formData.managerId,
     requiresTenancyContract: formData.requiresTenancyContract,
      amenities: selectedAmenities,
      bankDetails: !user?.hasCreatedBankAccount
        ? {
            bankCode: formData.bankCode,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
          }
        : undefined, // backend ignores if user already has bank account
    };

    console.log("[CreateProperty] Sending property payload:", propertyPayload);

    const propertyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(propertyPayload),
      }
    );

    console.log(
      "[CreateProperty] Property response status:",
      propertyResponse.status
    );

    if (!propertyResponse.ok) {
      const errData = await propertyResponse.text();
      console.error("[CreateProperty] Property creation failed:", errData);
      throw new Error("Failed to create property");
    }

    const propertyData = await propertyResponse.json();
    console.log("[CreateProperty] Property created successfully:", propertyData);

    // ✅ Show success toast on top-left with white background
    toast.success("Property created successfully!", {
      position: "top-right",
      style: { background: "white", color: "#000" },
    });

    // Close modal or form
    onClose();

    // ✅ Reload page after 3 seconds
    setTimeout(() => {
      window.location.reload();
    }, 3000);

  } catch (error) {
    console.error("[CreateProperty] Error creating property:", error);
    toast.error("Failed to create property. Please try again.", {
      position: "top-left",
      style: { background: "white", color: "#000" },
    });
    setBankError("Failed to create property. Please try again.");
  } finally {
    console.log("[CreateProperty] Submit finished");
    setLoading(false);
  }
};



  // Prevent form submission on Enter key except for the final create button
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentStep !== 4) {
      e.preventDefault();
      handleNext(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-500">
      <div 
        className={`bg-white/90 backdrop-blur-xl rounded-2xl border border-white/30 shadow-2xl overflow-hidden transform transition-all duration-500 max-w-md w-full ${isVisible ? 'animate-popup-in' : 'animate-popup-out'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/30">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentStep === 1 ? 'Add Bank Account' : 
             currentStep === 2 ? 'Create Property' : 
             currentStep === 3 ? 'Property Amenities' :
             'Tenancy Contract'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/50 transition-colors duration-200"
            disabled={loading}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-5 pt-3">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content - Remove form tag to prevent auto-submission */}
        <div className="p-5" onKeyDown={handleKeyDown}>
          {/* Step 1: Bank Account */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankSearch}
                  onChange={handleBankSearch}
                  onFocus={() => setShowBankDropdown(true)}
                  placeholder="Search for your bank"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.bankName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {showBankDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredBanks.length > 0 ? (
                      filteredBanks.map(bank => (
                        <div
                          key={bank.bank_code}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleBankSelect(bank)}
                        >
                          {bank.bank_name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No banks found</div>
                    )}
                  </div>
                )}
                {formErrors.bankName && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.bankName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10-digit account number"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.accountNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.accountNumber && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.accountNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  readOnly
                  placeholder="Will be verified automatically"
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.accountName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex items-center mt-1">
                  {verifyingAccount && (
                    <div className="flex items-center">
                      <svg className="animate-spin h-3 w-3 text-indigo-600 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
  className="opacity-75"
  fill="currentColor"
  d="M4 12a8 8 0 018-8 8 8 0 00-8 8h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
/>

                      </svg>
                     <span className="text-xs text-gray-500">Verifying account...</span>

                    </div>
                  )}
                  {formData.accountName && !verifyingAccount && (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  )}
                </div>
                {formErrors.accountName && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.accountName}</p>
                )}
                {bankError && (
                  <p className="text-xs text-red-500 mt-1">{bankError}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sunshine Apartments"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.propertyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.propertyName && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.propertyName}</p>
                )}
              </div>

              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">

                  Full Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Complete physical address"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.address && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.propertyType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select property type</option>
                  <option value="residential">Residential (Tenants)</option>
                  <option value="commercial">Commercial (Shops)</option>
                  <option value="hotel">Hotel</option>
                  <option value="shortlet">Shortlet</option>
                </select>
                {formErrors.propertyType && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.propertyType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Units
                </label>
                <input
                  type="number"
                  name="numberOfUnits"
                  value={formData.numberOfUnits}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="e.g., 12"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.numberOfUnits ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.numberOfUnits && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.numberOfUnits}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select state</option>
                  {NigerianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {formErrors.state && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.state}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Amenities Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Select Property Amenities
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose all amenities available at your property. This helps attract the right tenants.
                </p>
                
                {/* Search box for amenities */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={amenitiesSearch}
                    onChange={(e) => setAmenitiesSearch(e.target.value)}
                    placeholder="Search amenities..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Amenities checklist */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  <div className="grid grid-cols-1 gap-2">
                    {filteredAmenities.map(amenity => (
                      <label 
                        key={amenity.id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAmenities.includes(amenity.id) 
                            ? 'bg-indigo-50 border border-indigo-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 flex items-center justify-center border rounded mr-3 ${
                          selectedAmenities.includes(amenity.id) 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'border-gray-300'
                        }`}>
                          {selectedAmenities.includes(amenity.id) && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm mr-2">{amenity.icon}</span>
                        <span className="text-sm text-gray-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                  
                  {filteredAmenities.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No amenities found matching your search
                    </div>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-gray-500">
                  {selectedAmenities.length} amenity{selectedAmenities.length !== 1 ? 'ies' : ''} selected
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contract Protection */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="text-center relative">
                <div 
                  className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-3 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setFormData(prev => ({...prev,requiresTenancyContract: !prev.requiresTenancyContract}))}
                >
                  <div className={`transform transition-all duration-300 ${formData.requiresTenancyContract ? 'scale-110' : 'scale-100 opacity-70'}`}>
                    <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800 mr-2">
                    Tenancy Contracts
                  </h3>
                  {/* Toggle Badge - Defaults to ON */}
                  <div 
                    className={`flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${formData.requiresTenancyContract ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                    onClick={() => setFormData(prev => ({...prev, requiresTenancyContract: !prev.requiresTenancyContract}))}
                  >
                    <span className="mr-1">{formData.requiresTenancyContract? 'ON' : 'OFF'}</span>
                    <div className="relative w-6 h-3">
                      <div className={`w-full h-3 rounded-full transition-colors ${formData.requiresTenancyContract ? 'bg-indigo-400' : 'bg-gray-400'}`}></div>
                      <div className={`absolute top-0 w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${formData.requiresTenancyContract? 'translate-x-3' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm max-w-xs mx-auto">
                  {formData.requiresTenancyContract
                    ? 'Digital contracts enabled for all tenancies' 
                    : 'Basic management without contract protection'}
                </p>
              </div>

              {/* Benefits Cards - Shown by default since protection is on */}
              {formData.requiresTenancyContract&& (
                <div className="animate-fadeIn">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 text-sm mb-3 flex items-center">
                      <svg className="w-4 h-4 text-indigo-500 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path 
  strokeLinecap="round" 
  strokeLinejoin="round" 
  strokeWidth={2} 
  d="M13 16l-1 0v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
/>

                      </svg>
                      Included protection
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-start">
                        <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Court admissible</span>
                      </div>
                 <div className="flex items-start">
  <svg
    className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586 7.293 11.879a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
  <span>Peace of Mind</span>
</div>

                      <div className="flex items-start">
                        <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Reviewed by a Lawyer (S.A.N)</span>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 mr-1.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Compliance with Tenancy Law</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                      <div className="inline-flex items-center bg-indigo-50 rounded-lg px-3 py-1.5">
                        <span className="text-indigo-700 font-medium text-sm">₦1,000</span>
                        <span className="text-indigo-600 text-xs ml-1">per contract</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Only when tenant signs</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning when toggled off */}
              {!formData.requiresTenancyContract&& (
                <div className="animate-fadeIn">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-center">
                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 text-sm mb-2">
                      Can be enabled later in settings
                    </p>
                    
                    {/* Warning message */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-yellow-700 text-xs">Operating without contracts increases legal risks</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subtle Call-to-Action */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({...prev, requiresTenancyContract: !prev.requiresTenancyContract}))}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center transition-colors"
                >
                  {formData.requiresTenancyContract ? 'Disable contracts' : 'Enable contracts'}
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={formData.requiresTenancyContract ? "M6 18L18 6M6 6l12 12" : "M9 5l7 7-7 7"} />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`flex ${currentStep === 1 ? 'justify-end' : 'justify-between'} mt-8 pt-4 border-t border-gray-200`}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                disabled={loading}
              >
                ← Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading || (currentStep === 1 && !isBankVerified)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateProperty}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium disabled:opacity-50 flex items-center transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Property...
                  </>
                ) : (
                  <>
                    🏠 Create Property
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes popup-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popup-out {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-popup-in {
          animation: popup-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-popup-out {
          animation: popup-out 0.3s ease-in forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}