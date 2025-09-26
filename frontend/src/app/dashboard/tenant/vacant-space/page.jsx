'use client'
import React, { useState } from 'react';
import { 
  Search, 
  Filter,
  ArrowRight,
  Heart,
  Star,
  Bath,
  Bed,
  Square,
  BadgeCheck,
  ChevronRight,
  ChevronLeft,
  Check,
  X as XIcon,
  X as CloseIcon,
  Globe,
  Map
} from 'lucide-react';

const VacantSpace = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [amenitiesOpen, setAmenitiesOpen] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const listings = [
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
      images: Array(5).fill('/api/placeholder/400/300'),
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
    {
      id: 2,
      title: "VI Executive Apartment",
      manager: "Prime Estates • Verified by NIESV",
      address: "Victoria Island, Lagos",
      country: "Nigeria",
      state: "Lagos",
      rent: "₦4,500,000",
      period: "/year",
      beds: 3,
      baths: 3,
      sqft: 1800,
      rating: 4.7,
      available: "Feb 1st",
      verified: true,
      images: Array(5).fill('/api/placeholder/400/300'),
      amenities: {
        solar: false,
        popCeiling: true,
        parking: true,
        kitchenFurniture: false,
        bedMattress: true,
        wifi: true,
        security: true,
        water: true
      }
    }
  ];

  const openLightbox = (listingId, imageIndex = 0) => {
    setCurrentListingId(listingId);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    const currentListing = listings.find(listing => listing.id === currentListingId);
    if (currentListing) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === currentListing.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    const currentListing = listings.find(listing => listing.id === currentListingId);
    if (currentListing) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? currentListing.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextImage();
    } else if (touchEnd - touchStart > 50) {
      prevImage();
    }
  };

  const toggleAmenities = (listingId) => {
    setAmenitiesOpen(prev => ({
      ...prev,
      [listingId]: !prev[listingId]
    }));
  };

  const ListingCard = ({ listing }) => {
    const [currentImage, setCurrentImage] = useState(0);

    const handleNextImage = () => {
      setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1));
    };

    const handlePrevImage = () => {
      setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1));
    };

    const handleSwipe = (direction) => {
      if (direction === 'left') {
        handleNextImage();
      } else if (direction === 'right') {
        handlePrevImage();
      }
    };

    return (
      <div className="bg-white rounded-xl overflow-hidden border border-purple-100 hover:shadow-md transition-all duration-300">
        <div className="h-48 bg-purple-100 relative">
          <div 
            className="h-full w-full bg-cover bg-center cursor-pointer relative" 
            style={{ backgroundImage: `url(${listing.images[currentImage]})` }}
            onClick={() => openLightbox(listing.id, currentImage)}
            onTouchStart={(e) => {
              setTouchStart(e.targetTouches[0].clientX);
            }}
            onTouchMove={(e) => {
              setTouchEnd(e.targetTouches[0].clientX);
            }}
            onTouchEnd={() => {
              if (touchStart - touchEnd > 50) {
                handleSwipe('left');
              } else if (touchEnd - touchStart > 50) {
                handleSwipe('right');
              }
            }}
          >
            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {listing.available}
            </div>
            <div className="absolute top-3 right-3">
              {listing.verified ? (
                <div className="bg-white bg-opacity-90 px-2 py-1 rounded-lg flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-semibold">Verified</span>
                </div>
              ) : null}
            </div>
            <div className="absolute bottom-3 right-3 p-1 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-gray-600" />
            </div>
            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {currentImage + 1}/{listing.images.length}
            </div>
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 bg-white bg-opacity-70 rounded-full hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-white bg-opacity-70 rounded-full hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{listing.title}</h3>
            <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md">
              <Star className="w-3 h-3 text-yellow-500 fill-current" />
              <span className="text-xs font-semibold">{listing.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{listing.manager}</p>
          
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Globe className="w-3 h-3" />
            {listing.country}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <Map className="w-3 h-3" />
            {listing.state}, {listing.address}
          </div>
          
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
            {listing.beds > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-3 h-3" />
                {listing.beds}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              {listing.baths}
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-3 h-3" />
              {listing.sqft} sqft
            </div>
          </div>

          <div className="mb-3">
            <button 
              className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
              onClick={() => toggleAmenities(listing.id)}
            >
              {amenitiesOpen[listing.id] ? 'Hide Amenities' : 'See Amenities'} 
              <ChevronRight className={`w-3 h-3 transition-transform ${amenitiesOpen[listing.id] ? 'rotate-90' : ''}`} />
            </button>
            
            {amenitiesOpen[listing.id] && (
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  {listing.amenities.solar ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />}
                  <span>Solar System</span>
                </div>
                <div className="flex items-center gap-1">
                  {listing.amenities.popCeiling ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />}
                  <span>P.O.P Ceiling</span>
                </div>
                <div className="flex items-center gap-1">
                  {listing.amenities.parking ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />}
                  <span>Parking Space</span>
                </div>
                <div className="flex items-center gap-1">
                  {listing.amenities.kitchenFurniture ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />}
                  <span>Kitchen Furniture</span>
                </div>
                <div className="flex items-center gap-1">
                  {listing.amenities.bedMattress ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />}
                  <span>Bed Mattress</span>
                </div>
                <div className="flex items-center gap-1">
                  {listing.amenities.wifi ? <Check className="w-3 h-3 text-green-500" /> : <XIcon className="w-3 h-3 text-red-500" />}
                  <span>WiFi</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-purple-600">{listing.rent}</span>
              <span className="text-gray-500 text-xs">{listing.period}</span>
            </div>
            <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-sm font-medium flex items-center gap-1">
              Apply
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Lightbox = () => {
    if (!lightboxOpen || !currentListingId) return null;

    const listing = listings.find(l => l.id === currentListingId);
    if (!listing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <button 
          className="absolute top-4 right-4 text-white p-2"
          onClick={closeLightbox}
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        
        <button 
          className="absolute left-4 text-white p-2 bg-black bg-opacity-50 rounded-full"
          onClick={prevImage}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        
        <button 
          className="absolute right-4 text-white p-2 bg-black bg-opacity-50 rounded-full"
          onClick={nextImage}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
        
        <div 
          className="max-w-4xl max-h-full"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={listing.images[currentImageIndex]} 
            alt={`Property ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="flex gap-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-500'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Properties</h2>
            <p className="text-gray-600 mt-1">Find your perfect home</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button className="px-4 py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 font-medium text-sm">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
              <input 
                type="text" 
                placeholder="Search properties..." 
                className="w-full pl-10 pr-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      {/* Lightbox for image gallery */}
      <Lightbox />
    </>
  );
};

export default VacantSpace;