'use client'
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../landlord/(component)/layout";
import { toast } from "react-hot-toast"; 
import useCheckout from 'bani-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    approved: "bg-green-50 text-green-700 border border-green-200", 
    rejected: "bg-red-50 text-red-700 border border-red-200",
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
      {status}
    </span>
  );
}

function ApprovalModal({ isOpen, onClose, application, onPaymentSuccess }) {
  const { BaniPopUp } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
    const [showReload, setShowReload] = useState(false);

  if (!isOpen || !application) return null;

  const requiresContract = !!application.formData?.tenancyContract;
  const tenant = application.tenantName || application.tenant?.userId?.name || "Unknown";
  const contractSigned = application.formData?.tenancyContract?.signed || false;
  const currentPaymentStatus = application.contractPaymentInfo?.status;

  // Helper function to format phone number for Bani
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 234, it's already international format
    if (cleaned.startsWith('234')) {
      return cleaned;
    }
    
    // If it starts with 0, remove it and add 234
    if (cleaned.startsWith('0')) {
      return '234' + cleaned.substring(1);
    }
    
    // If it's just 10 digits (like 8073237395), add 234
    if (cleaned.length === 10) {
      return '234' + cleaned;
    }
    
    // Return as is if we can't determine format
    return cleaned;
  };

  // Helper function to extract names
  const getNames = (fullName) => {
    if (!fullName) return { firstName: "Landlord", lastName: "" };
    
    const nameParts = fullName.trim().split(' ');
    return {
      firstName: nameParts[0] || "Landlord",
      lastName: nameParts.slice(1).join(' ') || ""
    };
  };

  const handleOnClose = (response) => {
    console.log('Bani payment closed: ', response);
    setIsProcessing(false);
  };

const handleOnSuccess = async (response) => {
  console.log('Bani payment success: ', response);
  setIsProcessing(false);

  // Close modal
  onClose();

  // Show toast notification
  toast.success("Payment successful! Reloading page...");

  setShowReload(true);

  // Wait a short moment to let the user see the toast, then reload
  setTimeout(() => {
    window.location.reload();
  }, 3000); // 1.5 seconds delay
};

  const handlePayment = async () => {
    if (!contractSigned) {
      alert("Contract must be signed before proceeding with payment.");
      return;
    }

    // Check if payment is already successful
    if (currentPaymentStatus === "successful") {
      alert("This tenancy contract has already been paid for. No further payments are required.");
      return;
    }

    setIsProcessing(true);

    try {
      // Only initiate if no successful payment exists
      const initiateResponse = await axios.post(
        `${API_BASE}/api/contract-payments/initiate`,
        {
          applicationId: application._id,
          amount: 1000, // adjust as needed
        },
        { withCredentials: true }
      );

      if (!initiateResponse.data?.success) {
        throw new Error(initiateResponse.data?.message || "Failed to initiate payment");
      }

      const { paymentReference, landlord } = initiateResponse.data;

      // Extract landlord phone/email
      const landlordPhoneRaw =
        application?.property?.landlord?.userId?.whatsappNumber ||
        application?.landlordWhatsapp ||
        "";
      const landlordPhone = formatPhoneNumber(landlordPhoneRaw);
      const landlordEmail = landlord?.email || "";

      const { firstName, lastName } = getNames(landlord?.name || "Landlord");

      // Launch Bani payment popup
      BaniPopUp({
        amount: "1000",
        phoneNumber: landlordPhone,
        email: landlordEmail,
        firstName,
        lastName,
        merchantKey: process.env.NEXT_PUBLIC_BANI_PUBLIC_KEY || "pub_test_EGB9QD8TQPV0ZD",
        metadata: {
          paymentReference,
          application_id: application._id,
          tenant_id: application.tenant?._id || application.tenantId,
          property_id: application.property?._id || application.propertyId,
          tenant_name: tenant,
          property_name: application.property?.propertyName,
          payment_type: "contract_processing",
        },
        onClose: handleOnClose,
        callback: handleOnSuccess,
      });
    } catch (error) {
      console.error("Error initiating contract payment:", error);
      setIsProcessing(false);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error initiating payment. Please try again.";
      alert(errorMessage);
    }
  };

  const handleDirectApproval = async () => {
    if (!requiresContract) {
      setIsProcessing(true);
      try {
        const url = `${API_BASE}/api/tenancy-applications/${application._id}/approve`;
        const res = await axios.post(url, {}, { withCredentials: true });
        if (res.data?.success) {
          alert("Application approved successfully!");
          onPaymentSuccess(null);
          onClose();
        } else {
          alert("Unexpected response");
        }
      } catch (err) {
        console.error("Error approving application:", err);
        alert("Error approving application");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const getPaymentButtonText = () => {
    if (isProcessing) return "Processing...";
    if (currentPaymentStatus === "failed") return "Retry Payment ₦1,000";
    return "Proceed & Pay ₦1,000";
  };

  const getPaymentStatusMessage = () => {
    if (currentPaymentStatus === "failed") {
      return (
        <div className="bg-red-50/50 border border-red-200/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-red-900">Previous payment failed</span>
          </div>
          <p className="text-xs text-red-600 mt-1">You can retry the payment below.</p>
        </div>
      );
    }
    if (currentPaymentStatus === "successful") {
      return (
        <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-900">Payment completed successfully</span>
          </div>
          <p className="text-xs text-green-600 mt-1">Application has been processed.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Approve Application</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            {/* Tenant Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100/50">
              <img
                src={application.passportPhoto}
                alt={tenant}
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-white shadow-sm"
              />
              <div>
                <h3 className="font-medium text-gray-900">{tenant}</h3>
                <p className="text-sm text-gray-600">{application.property?.propertyName}</p>
              </div>
            </div>

            {/* Payment Status Message */}
            {getPaymentStatusMessage()}

            {requiresContract ? (
              <>
                {/* Contract Payment Info */}
                <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-1">Tenancy Contract Required</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        This property requires a tenancy contract with a ₦1,000 processing fee.
                      </p>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${contractSigned ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm font-medium text-gray-700">
                          Contract {contractSigned ? 'Signed by Tenant' : 'Awaiting Tenant Signature'}
                        </span>
                      </div>
                      {!contractSigned && (
                        <p className="text-xs text-blue-600 mt-1">
                          ⚠️ Payment can only be processed after tenant signs the contract
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contract Delivery Details */}
                <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1">What happens after payment:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Contract payment processed securely</li>
                        <li>• Signed contract sent to <strong>both landlord and tenant</strong> via email</li>
                        <li>• Contract stored securely in platform documents</li>
                        <li>• Application status updated to "Approved"</li>
                        <li>• Tenant can proceed with move-in arrangements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Settings Note */}
                <div className="bg-gray-50/50 border border-gray-200/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Note:</span> Contract requirements can be changed in your property settings at any time.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 mb-1">Ready for Direct Approval</h4>
                      <p className="text-sm text-green-700 mb-2">
                        This property doesn't require a tenancy contract. Application can be approved immediately.
                      </p>
                      <p className="text-xs text-green-600">
                        The tenant will be notified via email once approved.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Settings Note */}
                <div className="bg-gray-50/50 border border-gray-200/50 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Note:</span> You can enable contract requirements for this property in your property settings.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {requiresContract ? (
              <button
                onClick={handlePayment}
                disabled={isProcessing || !contractSigned || currentPaymentStatus === "successful"}
                className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getPaymentButtonText()}
              </button>
            ) : (
              <button
                onClick={handleDirectApproval}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Approve Application"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ app, onReject, isRejecting, onViewDetails, onApprove }) {
  const tenant = app.tenantName || app.tenant?.name || "Unknown";
  const employment = app.formData?.employment || {};
  const guarantor = app.formData?.guarantor || app.guarantor || {};
  const property = app.property || {};
  const status = app.agreements?.status ?? app.status ?? "pending";
  const isPending = status === "pending";
  const paymentStatus = app.contractPaymentInfo?.status;
  
  // Disable approve/reject if payment is successful or status is not pending
  const canApproveReject = isPending && paymentStatus !== "successful";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short'
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 transition-all duration-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={app.passportPhoto}
              alt={tenant}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-gray-100"
            />
            {app.guarantorPassportPhotos && app.guarantorPassportPhotos.length > 0 && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{app.guarantorPassportPhotos.length}</span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{tenant}</h3>
            <p className="text-xs text-gray-500">{formatDate(app.createdAt)}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Property */}
      <div className="mb-3 p-2 bg-gray-50 rounded-md">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">{property.propertyName || "Property N/A"}</p>
        <p className="text-xs text-gray-600">{property.address}, {property.state}</p>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white p-1.5 rounded-md border border-gray-100">
          <span className="text-xs text-gray-500 block mb-0.5">Employment</span>
          <p className="text-sm text-gray-900 font-medium truncate">{employment.employmentStatus || "N/A"}</p>
        </div>
        <div className="bg-white p-1.5 rounded-md border border-gray-100">
          <span className="text-xs text-gray-500 block mb-0.5">Salary</span>
          <p className="text-sm text-green-700 font-medium truncate">{employment.salaryRange || "N/A"}</p>
        </div>
        <div className="bg-white p-1.5 rounded-md border border-gray-100">
          <span className="text-xs text-gray-500 block mb-0.5">Guarantor</span>
          <p className="text-sm text-gray-900 font-medium truncate">{guarantor.name || "N/A"}</p>
        </div>
        <div className="bg-white p-1.5 rounded-md border border-gray-100">
          <span className="text-xs text-gray-500 block mb-0.5">Job Title</span>
          <p className="text-sm text-gray-900 font-medium truncate">{employment.jobTitle || "N/A"}</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center justify-between mb-3 p-1.5 bg-gray-50 rounded-md">
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${app.formData?.tenancyContract?.downloaded ? 'bg-green-400' : 'bg-gray-300'}`}></div>
          <span className="text-xs text-gray-600">Contract</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${app.formData?.tenancyContract?.signed ? 'bg-green-400' : 'bg-gray-300'}`}></div>
          <span className="text-xs text-gray-600">Signed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-1.5 h-1.5 rounded-full ${app.fastTrack?.paid ? 'bg-green-400' : 'bg-gray-300'}`}></div>
          <span className="text-xs text-gray-600">Paid</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {canApproveReject && (
          <>
            <button
              onClick={() => onApprove(app)}
              className="flex-1 px-3 py-1.5 bg-black text-white rounded-md text-xs font-medium hover:bg-gray-800 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(app._id)}
              disabled={isRejecting === app._id}
              className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isRejecting === app._id ? "..." : "Reject"}
            </button>
          </>
        )}
        
        <button
          onClick={() => onViewDetails(app)}
          className={`px-3 py-1.5 bg-gray-50 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors ${canApproveReject ? '' : 'flex-1'}`}
        >
          Download details (txt)
        </button>
      </div>
    </div>
  );
}

export default function TenancyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, activeFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/tenancy-applications/managed`, { withCredentials: true });
      const apps = res.data?.data ?? res.data?.applications ?? res.data;
      setApplications(Array.isArray(apps) ? apps : []);
    } catch (err) {
      console.error("Error fetching applications", err);
      alert("Error fetching applications");
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (activeFilter === 'all') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => {
        const status = app.agreements?.status ?? app.status ?? "pending";
        return status === activeFilter;
      }));
    }
  };

  const getFilterCounts = () => {
    const counts = {
      all: applications.length,
      pending: 0,
      approved: 0,
      rejected: 0
    };
    
    applications.forEach(app => {
      const status = app.agreements?.status ?? app.status ?? "pending";
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return counts;
  };

  const handleApprove = (app) => {
    setSelectedApplication(app);
    setShowApprovalModal(true);
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      if (paymentResponse) {
        // Payment was made, show success message and refresh
        alert("Payment successful! The application will be processed automatically.");
      } else {
        // Direct approval (no contract required)
        alert("Application approved successfully!");
      }
      
      // Refresh the applications list to get updated status
      await fetchApplications();
    } catch (err) {
      console.error("Error processing approval:", err);
      alert("Payment processed but there was an error refreshing the data. Please refresh the page.");
    }
  };

  const handleReject = async (appId) => {
    if (!confirm("Reject this application?")) return;
    setRejectingId(appId);
    try {
      const url = `${API_BASE}/api/tenancy-applications/${appId}/reject`;
      const res = await axios.post(url, {}, { withCredentials: true });
      if (res.data?.success) {
        alert("Application rejected");
        fetchApplications();
      } else {
        alert("Unexpected response");
      }
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Error rejecting application");
    } finally {
      setRejectingId(null);
    }
  };

  const handleViewDetails = (app) => {
    const content = `TENANCY APPLICATION DETAILS
===========================

TENANT INFORMATION
------------------
Name: ${app.tenantName || app.tenant?.name || "Unknown"}
Email: ${app.tenantEmail || app.tenant?.userId?.email || "N/A"}
WhatsApp: ${app.tenantWhatsapp || app.tenant?.userId?.whatsappNumber || "N/A"}
Application Date: ${new Date(app.createdAt).toLocaleDateString()}
Application ID: ${app._id}

PROPERTY INFORMATION  
--------------------
Property: ${app.property?.propertyName || "N/A"}
Address: ${app.property?.address || "N/A"}
State: ${app.property?.state || "N/A"}
Property Type: ${app.property?.propertyType || "N/A"}

EMPLOYMENT DETAILS
------------------
Employment Status: ${app.formData?.employment?.employmentStatus || "N/A"}
Job Title: ${app.formData?.employment?.jobTitle || "N/A"}
Company: ${app.formData?.employment?.companyName || "N/A"}
Salary Range: ${app.formData?.employment?.salaryRange || "N/A"}
Years of Employment: ${app.formData?.employment?.yearsOfEmployment || "N/A"}

GUARANTOR INFORMATION
--------------------
Name: ${app.formData?.guarantor?.name || app.guarantor?.name || "N/A"}
Phone: ${app.formData?.guarantor?.phone || app.guarantor?.phone || "N/A"}
Relationship: ${app.formData?.guarantor?.relationship || app.guarantor?.relationship || "N/A"}
Email: ${app.formData?.guarantor?.email || app.guarantor?.email || "N/A"}

EMERGENCY CONTACT
-----------------
Name: ${app.formData?.emergencyContact?.name || "N/A"}
Phone: ${app.formData?.emergencyContact?.phone || "N/A"}
Relationship: ${app.formData?.emergencyContact?.relationship || "N/A"}

APPLICATION STATUS
------------------
Current Status: ${app.agreements?.status || app.status || "Pending"}
Contract Downloaded: ${app.formData?.tenancyContract?.downloaded ? "Yes" : "No"}
Contract Signed: ${app.formData?.tenancyContract?.signed ? "Yes" : "No"}
FastTrack Payment: ${app.fastTrack?.paid ? "Completed" : "Pending"}
Contract Payment Status: ${app.contractPaymentInfo?.status || "N/A"}

ADDITIONAL INFORMATION
----------------------
Application Mode: ${app.formData?.mode || app.mode || app.agreements?.mode || "Standard"}
Tenant ID: ${app.tenant?._id || "N/A"}
KYC Verified: ${app.kycVerified ? "Yes" : "No"}
Has Active Tenancy: ${app.hasActiveTenancy ? "Yes" : "No"}
Score: ${app.score || "N/A"}

Generated on: ${new Date().toLocaleString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${app.tenantName || 'tenant'}_application_details.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const counts = getFilterCounts();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-sm text-gray-500">Loading applications...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Applications</h1>
              <p className="text-sm text-gray-600 mt-0.5">Manage tenant applications</p>
            </div>
            <button
              onClick={fetchApplications}
              className="px-3 py-1.5 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 border-b border-gray-200">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'pending', label: 'Pending', count: counts.pending },
              { key: 'approved', label: 'Approved', count: counts.approved },
              { key: 'rejected', label: 'Rejected', count: counts.rejected }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-1.5 text-sm font-medium border-b-2 transition-colors ${
                  activeFilter === filter.key
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-base font-medium text-gray-900 mb-1">No applications found</h3>
            <p className="text-gray-500 text-sm">
              {activeFilter === 'all' ? 'No applications have been submitted yet.' : `No ${activeFilter} applications found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <ApplicationCard
                key={app._id}
                app={app}
                onReject={handleReject}
                isRejecting={rejectingId}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
              />
            ))}
          </div>
        )}

        {/* Approval Modal */}
        <ApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedApplication(null);
          }}
          application={selectedApplication}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </div>
    </Layout>
  );
}


