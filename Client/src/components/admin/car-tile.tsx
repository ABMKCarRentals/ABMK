import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  MapPin,
  Calendar,
  Users,
  Fuel,
  Cog,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React from "react";
import type { Car } from "@/store/admin/car-slice"; // Adjust path as needed

interface AdminCarTileProps {
  car: Car;
  handleEdit: (car: Car) => void;
  handleDelete: (carId: string) => void;
  handleToggleAvailability: (carId: string) => void;
}

function AdminCarTile({
  car,
  handleEdit,
  handleDelete,
  handleToggleAvailability,
}: AdminCarTileProps) {
  const primaryImage =
    car.images?.find((img) => img.isPrimary) || car.images?.[0];
  const imageUrl = primaryImage?.url || "/api/placeholder/300/200";

  return (
    <Card className="group bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = "/api/placeholder/300/200";
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={car.isAvailable ? "default" : "secondary"}
            className={`${
              car.isAvailable
                ? "bg-green-600 text-white"
                : "bg-gray-600 text-gray-200"
            } px-2 py-1 text-xs font-medium`}
          >
            {car.isAvailable ? "Available" : "Inactive"}
          </Badge>
        </div>

        {/* Featured Badge */}
        {car.isFeatured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-600 text-black px-2 py-1 text-xs font-medium">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          </div>
        )}

        {/* View Count */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Eye className="w-3 h-3 text-gray-300" />
          <span className="text-xs text-gray-300">{car.viewCount || 0}</span>
        </div>

        {/* Actions Dropdown */}
        <div className="absolute top-3 right-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-gray-800 border-gray-700"
            >
              <DropdownMenuItem
                onClick={() => handleEdit(car)}
                className="text-gray-200 hover:bg-gray-700 cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleToggleAvailability(car._id)}
                className="text-gray-200 hover:bg-gray-700 cursor-pointer"
              >
                {car.isAvailable ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(car._id)}
                className="text-red-400 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4 space-y-4">
        {/* Title and Brand */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-white truncate group-hover:text-yellow-400 transition-colors">
            {car.name}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {car.brand} {car.model}
          </p>
        </div>

        {/* Car Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-3 h-3" />
            <span>{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Fuel className="w-3 h-3" />
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Cog className="w-3 h-3" />
            <span>{car.transmission}</span>
          </div>
        </div>

        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-gray-600 text-gray-300 text-xs"
          >
            {car.category}
          </Badge>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{car.location}</span>
        </div>

        {/* Status Section */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Status:</span>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  car.isAvailable ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <span
                className={car.isAvailable ? "text-green-400" : "text-gray-400"}
              >
                {car.status || (car.isAvailable ? "Available" : "Inactive")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => handleEdit(car)}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            onClick={() => handleToggleAvailability(car._id)}
            size="sm"
            variant="outline"
            className={`flex-1 text-xs border-gray-600 ${
              car.isAvailable
                ? "text-red-400 hover:bg-red-500/10 hover:border-red-500"
                : "text-green-400 hover:bg-green-500/10 hover:border-green-500"
            }`}
          >
            {car.isAvailable ? (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Activate
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminCarTile;
