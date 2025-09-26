// src/app/dashboard/tenant/start/utils/constants.js
import { 
  Home, FileText, Users, Search, Crown 
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'applications', label: 'My Applications', icon: FileText },
  { id: 'joinRequests', label: 'Join Requests', icon: Users },
  { id: 'listings', label: 'Browse Listings', icon: Search },
];

export const STATS = [
  {
    title: "Active Applications",
    value: "3",
    subtitle: "2 accepted",
    icon: FileText,
    color: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Join Requests",
    value: "2",
    subtitle: "1 approved",
    icon: Users,
    color: "bg-purple-100",
    iconColor: "text-purple-600"
  }
];

export const applications = [
  {
    id: 1,
    property: "Lekki Luxury Apartments",
    manager: "Ade Properties",
    address: "Lekki Phase 1, Lagos",
    country: "Nigeria",
    state: "Lagos",
    status: "Accepted",
    rent: "₦3,200,000",
    period: "/year",
    type: "2 Bed, 2 Bath",
    date: "Jan 15, 2025",
    verified: true,
    applicants: 12,
    rank: 3,
    score: 7.5,
    chance: 65
  },
  // Add other applications...
];

export const joinRequests = [
  {
    id: 1,
    property: "GRA Ikeja Duplex",
    landlord: "Mr. Johnson Ade",
    manager: "Verified by NIESV",
    country: "Nigeria",
    state: "Lagos",
    status: "Pending",
    rating: 8.2,
    verified: true
  },
  // Add other join requests...
];

export const listings = [
  {
    id: 1,
    title: "Lekki Modern 2-Bedroom",
    manager: "Ade Properties • Verified by NIESV",
    address: "Lekki Phase 1, Lagos",
    country: "Nigeria",
    state: "Lagos",
    rent: "₦3,200,000",
    period: "/year",
    beds: 2,
    baths: 2,
    sqft: 1200,
    rating: 4.9,
    available: "Available Now",
    verified: true,
    images: Array(5).fill('/group.jpg'),
    amenities: {
      solar: true,
      popCeiling: true,
      parking: true,
      kitchenFurniture: true,
      bedMattress: false,
      wifi: true,
      security: true,
      water: true
    }
  },
  // Add other listings...
];