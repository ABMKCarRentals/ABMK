import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Eye,
  Star,
  Calendar,
  Fuel,
  Settings,
  Users,
  MapPin,
  ArrowRight,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CarCard = ({ car, viewMode = "grid" }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-green-600 text-white";
      case "rented":
        return "bg-red-600 text-white";
      case "maintenance":
        return "bg-yellow-600 text-black";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const primaryImage =
    car.images?.find((img) => img.isPrimary) || car.images?.[0];
  const imageUrl = primaryImage?.url || "/api/placeholder/300/200";

  if (viewMode === "list") {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative group">
            <img
              src={imageUrl}
              alt={car.name}
              className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "/api/placeholder/300/200";
              }}
            />

            {/* Overlay badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {car.isFeatured && (
                <Badge className="bg-yellow-600 text-black font-semibold">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge className={getStatusColor(car.status)}>
                {car.status || "Available"}
              </Badge>
            </div>

            {/* Heart icon */}
            <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-white racing mb-1">
                    {car.brand} {car.model || car.name}
                  </h3>
                  <p className="text-gray-400 text-sm mont">{car.name}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatPrice(car.pricePerDay)}
                  </div>
                  <div className="text-gray-400 text-sm">per day</div>
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{car.year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{car.seats} Seats</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Fuel className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Settings className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{car.transmission}</span>
                </div>
              </div>

              {/* Location and Views */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{car.location || "Dubai, UAE"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{car.viewCount || 0} views</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Link to={`/cars/${car._id}`}>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold transition-colors group">
                View Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:border-yellow-400">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={car.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/200";
          }}
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {car.isFeatured && (
            <Badge className="bg-yellow-600 text-black font-semibold">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Badge className={getStatusColor(car.status)}>
            {car.status || "Available"}
          </Badge>
        </div>

        {/* Heart icon */}
        <button className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors">
          <Heart className="w-4 h-4" />
        </button>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg text-white racing mb-1 group-hover:text-yellow-400 transition-colors">
            {car.brand} {car.model || car.name}
          </h3>
          <p className="text-gray-400 text-sm mont">{car.name}</p>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Fuel className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Settings className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{car.transmission}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{car.location || "Business Bay, Dubai"}</span>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between mb-4">
          

          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Eye className="w-4 h-4" />
            <span>{car.viewCount || 0}</span>
          </div>
        </div>

        {/* View Details Button */}
        <Link to={`/cars/${car._id}`}>
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold transition-colors group">
            View Details
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
