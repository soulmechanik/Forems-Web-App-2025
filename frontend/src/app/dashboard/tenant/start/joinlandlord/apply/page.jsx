'use client'
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';



import { ChevronLeft, ChevronRight, Download, Upload, Check, User, Briefcase, Users, FileText, AlertCircle, X, RotateCcw, Camera } from 'lucide-react';

const RentalApplicationForm = ({ mode = "join", onClose }) => {
  const router = useRouter();
     const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId'); // get from URL
  const [currentStep, setCurrentStep] = useState(0);
  const [requirements, setRequirements] = useState(null);
  const [landlordInfo, setLandlordInfo] = useState({});
  const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
const [showPopup, setShowPopup] = useState(false);




  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [formData, setFormData] = useState({
    personalProfile: {
      age: '',
      maritalStatus: '',
      stateOfOrigin: '',
      geopoliticalZone: '',
      passportPhoto: null
    },
    employment: {
      employmentStatus: '',
      jobTitle: '',
      companyName: '',
      salaryRange: '',
      workAddress: '',
      yearsOfEmployment: ''
    },
    guarantors: [{
      name: '',
      phone: '',
      address: '',
      relationship: '',
      picture: null
    }],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    },
    tenancyContract: {
      downloaded: false,
      signature: null,
      signed: false,
      agreements: {
        readDocument: false,
        legallyBinding: false,
        contractTerms: false
      }
    }
  });


useEffect(() => {
  if (!propertyId) return; // wait for propertyId to be available

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/${propertyId}/application-requirements`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('Failed to fetch property requirements');

      const result = await response.json();

      console.log("📥 Requirements from API:", result.data.requirements); // 👀 DEBUG
      console.log("📥 Landlord info:", {
        landlordName: result.data.landlordName,
        managerName: result.data.managerName
      });

      setRequirements(result.data.requirements);
      setLandlordInfo({
        landlordName: result.data.landlordName,
        managerName: result.data.managerName,
      });
    } catch (error) {
      console.error('Error fetching requirements:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchRequirements();
}, [propertyId]);



useEffect(() => {
  let timer;
  if (showPopup) {
    timer = setTimeout(() => {
      setShowPopup(false);
      router.push("/dashboard/tenant/start");
    }, 15000); // 15 seconds
  }
  return () => clearTimeout(timer);
}, [showPopup, router]);



  // Nigerian states and geopolitical zones
  const nigerianStates = {
    'North Central': ['Abuja', 'Benue', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau'],
    'North East': ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
    'North West': ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara'],
    'South East': ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
    'South South': ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
    'South West': ['Ekiti', 'Lagos', 'Ogun', 'Ondo', 'Osun', 'Oyo']
  };

  const salaryRanges = [
    '₦50,000 - ₦100,000',
    '₦100,000 - ₦200,000',
    '₦200,000 - ₦300,000',
    '₦300,000 - ₦500,000',
    '₦500,000 - ₦1,000,000',
    '₦1,000,000 - ₦2,000,000',
    'Above ₦2,000,000'
  ];

  const relationships = ['Friend', 'Sister', 'Brother', 'Parent', 'Colleague', 'Relative', 'Other'];

  // Generate steps based on requirements
  const getSteps = () => {
    const baseSteps = [
      { id: 'personal', title: 'Personal', icon: User, required: true },
      { id: 'employment', title: 'Employment', icon: Briefcase, required: true }
    ];

    if (requirements?.requiresGuarantorForm) {
      baseSteps.push({ id: 'guarantors', title: 'Guarantor', icon: Users, required: true });
    }

    if (requirements?.requiresTenancyContract) {
      baseSteps.push({ id: 'contract', title: 'Contract', icon: FileText, required: true });
    }

    return baseSteps;
  };

  const steps = requirements ? getSteps() : [];

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addGuarantor = () => {
    setFormData(prev => ({
      ...prev,
      guarantors: [...prev.guarantors, {
        name: '',
        phone: '',
        address: '',
        relationship: '',
        picture: null
      }]
    }));
  };

  const removeGuarantor = (index) => {
    setFormData(prev => ({
      ...prev,
      guarantors: prev.guarantors.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (file, section, field, index = null) => {
    if (index !== null) {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].map((item, i) => 
          i === index ? { ...item, [field]: file } : item
        )
      }));
    } else {
      updateFormData(section, field, file);
    }
  };

  // Canvas drawing functions
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: ((e.clientX || e.touches?.[0]?.clientX) - rect.left) * scaleX,
      y: ((e.clientY || e.touches?.[0]?.clientY) - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    updateFormData('tenancyContract', 'signed', true);
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateFormData('tenancyContract', 'signed', false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("📝 Raw formData state before submission:", formData);

  // ⏳ Start submission loading
  setSubmitting(true);

  // Get the signature from the canvas if it exists
  const signatureDataUrl = canvasRef.current?.toDataURL() || null;

  // Basic validation
  if (requirements?.requiresTenancyContract && (!signatureDataUrl || signatureDataUrl === "data:,")) {
    setPopupMessage("Please provide your signature before submitting.");
    setShowPopup(true);
    setSubmitting(false);
    return;
  }

  if (!formData.personalProfile.passportPhoto) {
    setPopupMessage("Please upload your passport photo.");
    setShowPopup(true);
    setSubmitting(false);
    return;
  }

  try {
    // Build FormData for files + JSON
    const form = new FormData();

    const submissionData = {
      personalProfile: {
        age: formData.personalProfile.age,
        maritalStatus: formData.personalProfile.maritalStatus,
        stateOfOrigin: formData.personalProfile.stateOfOrigin,
        geopoliticalZone: formData.personalProfile.geopoliticalZone,
      },
      employment: formData.employment,
      guarantor: {
        name: formData.guarantors[0]?.name,
        phone: formData.guarantors[0]?.phone,
        address: formData.guarantors[0]?.address,
        relationship: formData.guarantors[0]?.relationship,
      },
      emergencyContact: formData.emergencyContact,
      tenancyContract: {
        ...formData.tenancyContract,
        signature: signatureDataUrl,
      },
      propertyId,
      mode,
    };

    form.append("formData", JSON.stringify(submissionData));

    // Append passport photo
    if (formData.personalProfile.passportPhoto) {
      form.append("passportPhoto", formData.personalProfile.passportPhoto);
    }

    // Append guarantor photos
    formData.guarantors.forEach((guarantor) => {
      if (guarantor.picture) {
        form.append("guarantorPassportPhotos", guarantor.picture);
      }
    });

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tenancy-applications`;

    const response = await fetch(apiUrl, {
      method: "POST",
      body: form,
      credentials: "include",
    });

    const result = await response.json();

    // Determine popup message
    if (response.ok && result.success) {
      setPopupMessage(
        "🎉 Congratulations! Your application has been successfully submitted. We've also sent the application details to your email for future reference. You will be redirected to your dashboard to track your applications."
      );
    } else if (result.message.includes("pending application")) {
      setPopupMessage(
        "⚠️ You have already applied for this property. You will be redirected to your dashboard to track your existing applications."
      );
    } else {
      setPopupMessage(result.message || "Submission failed. Please try again.");
    }

    // Show modal
    setShowPopup(true);
  } catch (error) {
    console.error("❌ Error submitting tenancy form:", error);

    if (error.message.includes("Failed to fetch")) {
      setPopupMessage("Network error. Please check your internet connection and try again.");
    } else if (error.message.includes("non-JSON response")) {
      setPopupMessage("Server error. Please try again later or contact support.");
    } else {
      setPopupMessage("An error occurred while submitting the form. Please try again.");
    }

    setShowPopup(true);
  } finally {
    setSubmitting(false);
  }
};









  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="text-gray-600 mt-3 text-sm text-center">Loading requirements...</p>
        </div>
      </div>
    );
  }

  const renderPersonalProfile = () => (
    <div className="space-y-4">
      {/* Passport Photo Upload */}
      <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
        <label className="block text-gray-700 text-xs font-medium mb-2">Passport Photograph</label>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {formData.personalProfile.passportPhoto ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={URL.createObjectURL(formData.personalProfile.passportPhoto)}
                  alt="Passport"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Camera className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0], 'personalProfile', 'passportPhoto')}
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Upload a clear passport-size photograph</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Age</label>
          <input
            type="number"
            min="18"
            max="100"
            value={formData.personalProfile.age}
            onChange={(e) => updateFormData('personalProfile', 'age', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your age"
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Marital Status</label>
          <select
            value={formData.personalProfile.maritalStatus}
            onChange={(e) => updateFormData('personalProfile', 'maritalStatus', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Geopolitical Zone</label>
          <select
            value={formData.personalProfile.geopoliticalZone}
            onChange={(e) => {
              updateFormData('personalProfile', 'geopoliticalZone', e.target.value);
              updateFormData('personalProfile', 'stateOfOrigin', '');
            }}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Zone</option>
            {Object.keys(nigerianStates).map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">State of Origin</label>
          <select
            value={formData.personalProfile.stateOfOrigin}
            onChange={(e) => updateFormData('personalProfile', 'stateOfOrigin', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={!formData.personalProfile.geopoliticalZone}
          >
            <option value="">Select State</option>
            {formData.personalProfile.geopoliticalZone && 
              nigerianStates[formData.personalProfile.geopoliticalZone]?.map(state => (
                <option key={state} value={state}>{state}</option>
              ))
            }
          </select>
        </div>
      </div>
    </div>
  );

  const renderEmployment = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Employment Status</label>
          <select
            value={formData.employment.employmentStatus}
            onChange={(e) => updateFormData('employment', 'employmentStatus', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Status</option>
            <option value="employed">Employed</option>
            <option value="self-employed">Self Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="student">Student</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Job Title</label>
          <input
            type="text"
            value={formData.employment.jobTitle}
            onChange={(e) => updateFormData('employment', 'jobTitle', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your job title"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Company Name</label>
          <input
            type="text"
            value={formData.employment.companyName}
            onChange={(e) => updateFormData('employment', 'companyName', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Company or organization"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Salary Range</label>
          <select
            value={formData.employment.salaryRange}
            onChange={(e) => updateFormData('employment', 'salaryRange', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Range</option>
            {salaryRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Work Address</label>
          <textarea
            value={formData.employment.workAddress}
            onChange={(e) => updateFormData('employment', 'workAddress', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Full work address"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-medium mb-1.5">Years of Employment</label>
          <input
            type="number"
            min="0"
            max="50"
            value={formData.employment.yearsOfEmployment}
            onChange={(e) => updateFormData('employment', 'yearsOfEmployment', e.target.value)}
            className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Years in current position"
          />
        </div>
      </div>
    </div>
  );

  const renderGuarantors = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-gray-700">Guarantor Information</h4>
        <button
          onClick={addGuarantor}
          className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-xs font-medium"
        >
          Add Guarantor
        </button>
      </div>

      {formData.guarantors.map((guarantor, index) => (
        <div key={index} className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h5 className="text-xs font-medium text-gray-600">Guarantor {index + 1}</h5>
            {formData.guarantors.length > 1 && (
              <button
                onClick={() => removeGuarantor(index)}
                className="text-red-500 hover:text-red-600 text-xs"
              >
                Remove
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={guarantor.name}
                onChange={(e) => {
                  const updatedGuarantors = [...formData.guarantors];
                  updatedGuarantors[index].name = e.target.value;
                  setFormData(prev => ({ ...prev, guarantors: updatedGuarantors }));
                }}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Guarantor's full name"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                value={guarantor.phone}
                onChange={(e) => {
                  const updatedGuarantors = [...formData.guarantors];
                  updatedGuarantors[index].phone = e.target.value;
                  setFormData(prev => ({ ...prev, guarantors: updatedGuarantors }));
                }}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+234 xxx xxx xxxx"
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">Relationship</label>
              <select
                value={guarantor.relationship}
                onChange={(e) => {
                  const updatedGuarantors = [...formData.guarantors];
                  updatedGuarantors[index].relationship = e.target.value;
                  setFormData(prev => ({ ...prev, guarantors: updatedGuarantors }));
                }}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Relationship</option>
                {relationships.map(rel => (
                  <option key={rel} value={rel.toLowerCase()}>{rel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], 'guarantors', 'picture', index)}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-600 text-xs font-medium mb-1">Address</label>
              <textarea
                value={guarantor.address}
                onChange={(e) => {
                  const updatedGuarantors = [...formData.guarantors];
                  updatedGuarantors[index].address = e.target.value;
                  setFormData(prev => ({ ...prev, guarantors: updatedGuarantors }));
                }}
                rows={2}
                className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Full residential address"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
        <h5 className="text-xs font-medium text-gray-600 mb-3">Emergency Contact</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.emergencyContact.name}
              onChange={(e) => updateFormData('emergencyContact', 'name', e.target.value)}
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Emergency contact name"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={formData.emergencyContact.phone}
              onChange={(e) => updateFormData('emergencyContact', 'phone', e.target.value)}
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+234 xxx xxx xxxx"
            />
          </div>

          <div>
            <label className="block text-gray-600 text-xs font-medium mb-1">Relationship</label>
            <select
              value={formData.emergencyContact.relationship}
              onChange={(e) => updateFormData('emergencyContact', 'relationship', e.target.value)}
              className="w-full px-3 py-2 bg-white/50 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Relationship</option>
              {relationships.map(rel => (
                <option key={rel} value={rel.toLowerCase()}>{rel}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContract = () => (
    <div className="space-y-4">
      <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h5 className="text-sm font-medium text-gray-700">Download & Review Contract</h5>
            <p className="text-xs text-gray-500">Please download and carefully read the tenancy agreement</p>
          </div>
          <button
            onClick={() => {
              updateFormData('tenancyContract', 'downloaded', true);
              alert('Contract downloaded successfully!');
            }}
            className="flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
          >
            <Download className="mr-1.5 w-3 h-3" />
            Download
          </button>
        </div>

        {formData.tenancyContract.downloaded && (
          <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-600 text-xs">
              <Check className="mr-1.5 w-3 h-3" />
              Contract downloaded successfully
            </div>
          </div>
        )}
      </div>

      {formData.tenancyContract.downloaded && (
        <>
          <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-sm font-medium text-gray-700">Digital Signature</h5>
              <button
                onClick={clearCanvas}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
              >
                <RotateCcw className="mr-1.5 w-3 h-3" />
                Clear
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-3 bg-white/70 mb-3">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <p className="text-xs text-gray-500">Sign above using your mouse or touchscreen</p>
            
            {formData.tenancyContract.signed && (
              <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center text-green-600 text-xs">
                  <Check className="mr-1.5 w-3 h-3" />
                  Document signed successfully
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50/30 rounded-lg p-4 border border-gray-100">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Agreement Acknowledgment</h5>
            <div className="space-y-2.5">
              <label className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  checked={formData.tenancyContract.agreements.readDocument}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tenancyContract: {
                      ...prev.tenancyContract,
                      agreements: {
                        ...prev.tenancyContract.agreements,
                        readDocument: e.target.checked
                      }
                    }
                  }))}
                  className="mt-0.5 w-3.5 h-3.5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-xs text-gray-600 leading-relaxed">I have read and understood this tenancy agreement document in its entirety</span>
              </label>

              <label className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  checked={formData.tenancyContract.agreements.legallyBinding}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tenancyContract: {
                      ...prev.tenancyContract,
                      agreements: {
                        ...prev.tenancyContract.agreements,
                        legallyBinding: e.target.checked
                      }
                    }
                  }))}
                  className="mt-0.5 w-3.5 h-3.5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-xs text-gray-600 leading-relaxed">I agree that this contract is legally binding and enforceable under Nigerian law</span>
              </label>

              <label className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  checked={formData.tenancyContract.agreements.contractTerms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    tenancyContract: {
                      ...prev.tenancyContract,
                      agreements: {
                        ...prev.tenancyContract.agreements,
                        contractTerms: e.target.checked
                      }
                    }
                  }))}
                  className="mt-0.5 w-3.5 h-3.5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-xs text-gray-600 leading-relaxed">I accept all terms, conditions, and responsibilities outlined in this tenancy agreement</span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStepContent = () => {
    const currentStepData = steps[currentStep];
    switch (currentStepData?.id) {
      case 'personal':
        return renderPersonalProfile();
      case 'employment':
        return renderEmployment();
      case 'guarantors':
        return renderGuarantors();
      case 'contract':
        return renderContract();
      default:
        return null;
    }
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    switch (currentStepData?.id) {
      case 'personal':
        return formData.personalProfile.age && formData.personalProfile.maritalStatus && 
               formData.personalProfile.stateOfOrigin && formData.personalProfile.geopoliticalZone &&
               formData.personalProfile.passportPhoto;
      case 'employment':
        return formData.employment.employmentStatus && formData.employment.salaryRange;
      case 'guarantors':
        return formData.guarantors.every(g => g.name && g.phone && g.relationship) && 
               formData.emergencyContact.name && formData.emergencyContact.phone;
      case 'contract':
        return formData.tenancyContract.downloaded && formData.tenancyContract.signed &&
               Object.values(formData.tenancyContract.agreements).every(Boolean);
      default:
        return true;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (

     <>
    <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-start justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 w-full max-w-2xl my-4 md:my-8">
        {/* Header */}
        <div className="border-b border-gray-200/50 p-4 md:p-6 sticky top-0 bg-white/95 backdrop-blur-xl rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-800">
                {mode === 'fresh' ? 'Forems Rental Application' : 'Join Tenancy'}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {mode === 'fresh' 
                  ? 'Apply or join your rental property' 
                  : 'Join an existing tenancy as a co-tenant'
                }
              </p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {landlordInfo.landlordName && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Landlord:</span> {landlordInfo.landlordName}
                {landlordInfo.managerName !== "No manager assigned" && (
                  <span className="ml-3">
                    <span className="font-medium">Manager:</span> {landlordInfo.managerName}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all
                      ${isActive 
                        ? 'bg-gray-100 border-gray-700 text-gray-700' 
                        : isCompleted 
                          ? 'bg-gray-100 border-gray-700 text-gray-700'
                          : 'bg-gray-50 border-gray-300 text-gray-400'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <StepIcon className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="ml-2 hidden md:block">
                      <p className={`text-xs font-medium ${
                        isActive ? 'text-gray-700' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`w-6 h-0.5 mx-3 ${
                        isCompleted ? 'bg-gray-400' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              {steps[currentStep]?.title} Information
            </h3>
            <p className="text-xs text-gray-500">
              Complete all required fields to proceed to the next step
            </p>
          </div>
          
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/50 p-4 md:p-6 bg-gray-50/30 sticky bottom-0 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`
                flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all
                ${currentStep === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }
              `}
            >
              <ChevronLeft className="mr-1 w-3 h-3" />
              Previous
            </button>

            <div className="flex-1 text-center">
              <span className="text-xs text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all
                  ${canProceed()
                    ? 'bg-gray-700 text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Submit Application
                <Check className="ml-1 w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-all
                  ${canProceed()
                    ? 'bg-gray-700 text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Next
                <ChevronRight className="ml-1 w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Requirements Info */}
        {requirements && (
          <div className="px-4 md:px-6 pb-4">
            <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-medium text-gray-800 mb-1">Application Requirements</h5>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <div className={`flex items-center space-x-1.5 ${requirements.requiresTenancyContract ? 'text-gray-700' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${requirements.requiresTenancyContract ? 'bg-gray-600' : 'bg-gray-300'}`} />
                      <span>Contract</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${requirements.requiresGuarantorForm ? 'text-gray-700' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${requirements.requiresGuarantorForm ? 'bg-gray-600' : 'bg-gray-300'}`} />
                      <span>Guarantor</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${requirements.requiresInventoryReport ? 'text-gray-700' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${requirements.requiresInventoryReport ? 'bg-gray-600' : 'bg-gray-300'}`} />
                      <span>Inventory</span>
                    </div>
                    <div className={`flex items-center space-x-1.5 ${requirements.requiresVerification ? 'text-gray-700' : 'text-gray-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${requirements.requiresVerification ? 'bg-gray-600' : 'bg-gray-300'}`} />
                      <span>Verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

   {/* Submitting Overlay */}
{submitting && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center animate-pulse max-w-sm">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-700 rounded-full mx-auto mb-4 animate-spin" />
      <h2 className="text-base font-semibold text-gray-800">Submitting...</h2>
      <p className="text-sm text-gray-500 mt-1">
        Please wait while your application is being submitted.
      </p>
    </div>
  </div>
)}

{/* Response Popup */}
{showPopup && (
  <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm animate-scale">
      <h2 className="text-base font-semibold text-gray-800">
        {popupMessage.includes("🎉") ? "Success" : "Notice"}
      </h2>
      <p className="text-sm text-gray-500 mt-2">{popupMessage}</p>
      <button
        onClick={() => {
          setShowPopup(false);
          router.push("/dashboard/tenant/start"); // always redirect after showing the message
        }}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800"
      >
        OK
      </button>
    </div>
  </div>
)}

    </>
  );
};



const RentalApplicationFormWithSuspense = (props) => (
  <Suspense fallback={<div>Loading...</div>}>
    <RentalApplicationForm {...props} />
  </Suspense>
);

export default RentalApplicationFormWithSuspense;