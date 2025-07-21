import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import {
  ArrowLeft,
  Star,
  Users,
  Fuel,
  Settings,
  Calendar,
  MapPin,
  Eye,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import LoadingSpinner from "../../components/common/loading-spinner";
import CarCard from "../../components/cars/car-card";
import ImageGallery from "../../components/cars/image-gallery";

interface Specification {
  engine?: string;
  horsepower?: number;
  topSpeed?: number;
  acceleration?: string;
  mileage?: string;
  color?: string;
  interiorColor?: string;
}

interface CarImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  images: CarImage[];
  features: string[];
  specifications: Specification;
  location: string;
  description: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  viewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  status: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    currentCar,
    relatedCars,
    isCarLoading,
    isRelatedLoading,
    carError,
    getCarById,
    getRelatedCars,
    incrementCarViewCount,
  } = useCars();

  // Image selection for gallery (if needed for thumbnails)
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    if (id) {
      getCarById(id);
      incrementCarViewCount(id);
    }
  }, [id, getCarById, incrementCarViewCount]);

  useEffect(() => {
    if (currentCar?._id) {
      getRelatedCars(currentCar._id, 4);
    }
  }, [currentCar?._id, getRelatedCars]);

  const handleBookNow = () => {
    const message = `Hi, I'm interested in renting the ${
      currentCar?.brand || ""
    } ${currentCar?.model || ""} ${currentCar?.name || ""}`;
    window.open(
      `https://wa.me/971XXXXXXXXX?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleShare = () => {
    if (!currentCar) return;
    if (navigator.share) {
      navigator.share({
        title: `${currentCar.brand} ${currentCar.model} ${currentCar.name}`,
        text: `Check out this amazing car for rent in Dubai!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Optionally show a toast/feedback here for copied link
      });
    }
  };

  if (isCarLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (carError || !currentCar) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Car Not Found
            </h1>
            <p className="text-gray-400 mb-8">
              {carError || "The car you're looking for doesn't exist."}
            </p>
            <Link to="/cars">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cars
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Professional formatting for numbers & fallback for missing fields
  const formatNumber = (num?: number) =>
    typeof num === "number" ? num.toLocaleString() : "-";

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <nav
            className="flex items-center text-sm text-gray-400"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              to="/cars"
              className="hover:text-yellow-400 transition-colors"
            >
              Cars
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">
              {currentCar.brand} {currentCar.model}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Header */}
            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {currentCar.brand} {currentCar.model}
                  </h1>
                  <p className="text-xl text-gray-300 mb-4">
                    {currentCar.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatNumber(currentCar.viewCount)} views
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentCar.location || "Dubai, UAE"}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    aria-label="Share"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Add to Favorites"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {currentCar.category && (
                  <Badge className="bg-yellow-600 text-black capitalize">
                    {currentCar.category}
                  </Badge>
                )}
                {currentCar.isFeatured && (
                  <Badge className="bg-green-600 text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  {currentCar.year}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-gray-600 text-gray-300 capitalize"
                >
                  {currentCar.status}
                </Badge>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-400">Seats</p>
                    <p className="font-semibold text-white">
                      {formatNumber(currentCar.seats)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <Settings className="w-5 h-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-400">Transmission</p>
                    <p className="font-semibold text-white">
                      {currentCar.transmission}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <Fuel className="w-5 h-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-400">Fuel</p>
                    <p className="font-semibold text-white">
                      {currentCar.fuelType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="text-xs text-gray-400">Year</p>
                    <p className="font-semibold text-white">
                      {formatNumber(currentCar.year)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Image Gallery */}
            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 shadow-lg">
              <ImageGallery images={currentCar.images || []} />
            </section>

            {/* Details Tabs */}
            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="specifications"
                    className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black"
                  >
                    Features
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {currentCar.description ||
                        `Experience the ultimate luxury with this stunning ${currentCar.brand} ${currentCar.model}. Perfect for special occasions, business trips, or simply enjoying the finest automotive engineering Dubai has to offer.`}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentCar.specifications?.engine && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Engine</span>
                        <span className="font-semibold text-white">
                          {currentCar.specifications.engine}
                        </span>
                      </div>
                    )}
                    {typeof currentCar.specifications?.horsepower !==
                      "undefined" && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Horsepower</span>
                        <span className="font-semibold text-white">
                          {formatNumber(currentCar.specifications.horsepower)}{" "}
                          HP
                        </span>
                      </div>
                    )}
                    {typeof currentCar.specifications?.topSpeed !==
                      "undefined" && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Top Speed</span>
                        <span className="font-semibold text-white">
                          {formatNumber(currentCar.specifications.topSpeed)}{" "}
                          km/h
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.acceleration && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">0-100 km/h</span>
                        <span className="font-semibold text-white">
                          {currentCar.specifications.acceleration}
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.color && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Exterior Color</span>
                        <span className="font-semibold text-white">
                          {currentCar.specifications.color}
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.interiorColor && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Interior Color</span>
                        <span className="font-semibold text-white">
                          {currentCar.specifications.interiorColor}
                        </span>
                      </div>
                    )}
                    {/* Default specifications if none exist */}
                    {(!currentCar.specifications ||
                      Object.keys(currentCar.specifications).length === 0) && (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-gray-400">
                          Detailed specifications will be provided upon inquiry.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentCar.features && currentCar.features.length > 0 ? (
                      currentCar.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-gray-400">
                          Features information will be provided upon inquiry.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Contact Card */}
            <Card className="sticky top-4 mb-6 bg-gray-800 border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white text-lg font-semibold">
                  Get a Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wider">
                      Premium Rental
                    </div>
                    <div className="text-sm text-gray-300">
                      Contact us for pricing
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleBookNow}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
                      size="lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Inquire via WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      size="lg"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-600">
                    <p>Need help? Contact us</p>
                    <p className="font-semibold text-white">+971 XX XXX XXXX</p>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 text-base">
                      Why Choose Us?
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 24/7 Customer Support</li>
                      <li>• Free Delivery & Pickup</li>
                      <li>• Comprehensive Insurance</li>
                      <li>• No Hidden Fees</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related Cars */}
        {relatedCars && relatedCars.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Cars</h2>
            {isRelatedLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCars.map((car: Car) => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CarDetails;
