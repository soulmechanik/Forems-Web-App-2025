// src/app/dashboard/tenant/start/utils/helpers.js
import { CheckCircle, AlertCircle, Clock, Check, X } from 'lucide-react';

export const getStatusColor = (status) => {
  switch (status) {
    case 'Accepted':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Pending':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Accepted':
      return <CheckCircle className="w-4 h-4" />;
    case 'Rejected':
      return <AlertCircle className="w-4 h-4" />;
    case 'Pending':
      return <Clock className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export const getRatingColor = (rating) => {
  if (rating >= 8) return 'bg-green-100 text-green-800';
  if (rating >= 6) return 'bg-blue-100 text-blue-800';
  if (rating >= 4) return 'bg-purple-100 text-purple-800';
  return 'bg-red-100 text-red-800';
};

export const getRatingText = (rating) => {
  if (rating >= 8) return 'Excellent';
  if (rating >= 6) return 'Good';
  if (rating >= 4) return 'Fair';
  return 'Poor';
};

export const renderAmenityCheck = (hasAmenity) => {
  return hasAmenity ? 
    <Check className="w-3 h-3 text-green-500" /> : 
    <X className="w-3 h-3 text-red-500" />;
};