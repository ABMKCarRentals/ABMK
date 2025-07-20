import React from "react";
import { Link } from "react-router-dom";
import { 
  Star, 
  Users, 
  Fuel, 
  Settings, 
  Calendar,
  MapPin,
  Eye,
  Heart,
  ArrowRight,
  Badge as BadgeIcon
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const CarCard = ({ car, viewMode = "grid" }) => {
  const primaryImage = car?.images?.find(img => img.isPrimary)?.url || car?.images?.[0]?.url || '/placeholder-car.jpg';
  
  const handleImageError = (e) => {
    e.target.src = '/placeholder-car.jpg';
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle wishlist functionality
    console.log("Added to wishlist:", car._id);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative">
            <Link to={`/cars/${car._id}`}>
              <img
                src={primaryImage}
                alt={`${car.brand} ${car.model} ${car.name}`}
                className="w-full h-48 md:h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={handleImageError}
              />
            </Link>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {car.isFeatured && (
                <Badge className="bg-yellow-600 hover:bg-yellow-700 text-black text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge 
                className={`text-xs ${
                  car.isAvailable 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {car.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <Heart className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
            </button>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      {car.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      AED {car.pricePerDay?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">per day</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {car.viewCount || 0}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {car.location}
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>{car.year}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>{car.seats} Seats</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Fuel className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>{car.fuelType}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Settings className="w-4 h-4 mr-2 text-yellow-600" />
                  <span>{car.transmission}</span>
                </div>
              </div>

              {/* Categories and Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {car.category}
                </Badge>
                {car.features?.slice(0, 2).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {car.features?.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{car.features.length - 2} more
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-auto">
                <div className="text-sm text-gray-600">
                  {car.pricePerWeek && (
                    <span>Weekly: AED {car.pricePerWeek?.toLocaleString()}</span>
                  )}
                </div>
                <Link to={`/cars/${car._id}`}>
                  <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Image Section */}
      <div className="relative">
        <Link to={`/cars/${car._id}`}>
          <img
            src={primaryImage}
            alt={`${car.brand} ${car.model} ${car.name}`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {car.isFeatured && (
            <Badge className="bg-yellow-600 hover:bg-yellow-700 text-black text-xs">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge 
            className={`text-xs ${
              car.isAvailable 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {car.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-200 group"
        >
          <Heart className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors duration-200" />
        </button>

        {/* View Count */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="text-xs bg-black bg-opacity-50 text-white border-none">
            <Eye className="w-3 h-3 mr-1" />
            {car.viewCount || 0}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-gray-600 font-medium truncate">
            {car.name}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-yellow-600" />
            {car.year}
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1 text-yellow-600" />
            {car.seats} Seats
          </div>
          <div className="flex items-center">
            <Fuel className="w-3 h-3 mr-1 text-yellow-600" />
            {car.fuelType}
          </div>
          <div className="flex items-center">
            <Settings className="w-3 h-3 mr-1 text-yellow-600" />
            {car.transmission}
          </div>
        </div>

        {/* Category */}
        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {car.category}
          </Badge>
        </div>

        {/* Location */}
        <div className="flex items-center text-xs text-gray-600 mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          {car.location}
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-yellow-600">
              AED {car.pricePerDay?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              per day
            </div>
          </div>
          {car.pricePerWeek && (
            <div className="text-xs text-gray-600 mt-1">
              Weekly: AED {car.pricePerWeek?.toLocaleString()}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link to={`/cars/${car._id}`} className="block">
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;