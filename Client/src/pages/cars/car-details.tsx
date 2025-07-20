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

const CarDetails = () => {
  const { id } = useParams();
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

  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalPeriod, setRentalPeriod] = useState("day");

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

  const getPrice = () => {
    if (!currentCar) return 0;
    switch (rentalPeriod) {
      case "week":
        return currentCar.pricePerWeek || currentCar.pricePerDay * 7;
      case "month":
        return currentCar.pricePerMonth || currentCar.pricePerDay * 30;
      default:
        return currentCar.pricePerDay;
    }
  };

  const handleBookNow = () => {
    // Handle booking logic here
    window.open(
      `https://wa.me/971XXXXXXXXX?text=Hi, I'm interested in renting the ${currentCar.brand} ${currentCar.model} ${currentCar.name}`,
      "_blank"
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentCar.brand} ${currentCar.model} ${currentCar.name}`,
        text: `Check out this amazing car for rent in Dubai!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isCarLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (carError || !currentCar) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Car Not Found
            </h1>
            <p className="text-gray-600 mb-8">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-yellow-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/cars" className="hover:text-yellow-600">
              Cars
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">
              {currentCar.brand} {currentCar.model}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Header */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentCar.brand} {currentCar.model}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {currentCar.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {currentCar.viewCount} views
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentCar.location}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-yellow-600 text-black">
                  {currentCar.category}
                </Badge>
                {currentCar.isFeatured && (
                  <Badge className="bg-green-600">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <Badge variant="outline">{currentCar.year}</Badge>
                <Badge variant="outline">{currentCar.status}</Badge>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Seats</p>
                    <p className="font-semibold">{currentCar.seats}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Settings className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="font-semibold">{currentCar.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Fuel className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Fuel</p>
                    <p className="font-semibold">{currentCar.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-semibold">{currentCar.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <ImageGallery images={currentCar.images} />
            </div>

            {/* Details Tabs */}
            <div className="bg-white rounded-lg p-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="specifications">
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {currentCar.description ||
                        `Experience the ultimate luxury with this stunning ${currentCar.brand} ${currentCar.model}. Perfect for special occasions, business trips, or simply enjoying the finest automotive engineering Dubai has to offer.`}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentCar.specifications?.engine && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Engine</span>
                        <span className="font-semibold">
                          {currentCar.specifications.engine}
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.horsepower && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Horsepower</span>
                        <span className="font-semibold">
                          {currentCar.specifications.horsepower} HP
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.topSpeed && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Top Speed</span>
                        <span className="font-semibold">
                          {currentCar.specifications.topSpeed} km/h
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.acceleration && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">0-100 km/h</span>
                        <span className="font-semibold">
                          {currentCar.specifications.acceleration}
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.color && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Exterior Color</span>
                        <span className="font-semibold">
                          {currentCar.specifications.color}
                        </span>
                      </div>
                    )}
                    {currentCar.specifications?.interiorColor && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Interior Color</span>
                        <span className="font-semibold">
                          {currentCar.specifications.interiorColor}
                        </span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentCar.features?.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <Card className="sticky top-4 mb-6">
              <CardHeader>
                <CardTitle>Rental Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Period Selection */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={rentalPeriod === "day" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRentalPeriod("day")}
                      className={
                        rentalPeriod === "day" ? "bg-yellow-600 text-black" : ""
                      }
                    >
                      Daily
                    </Button>
                    {currentCar.pricePerWeek && (
                      <Button
                        variant={
                          rentalPeriod === "week" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setRentalPeriod("week")}
                        className={
                          rentalPeriod === "week"
                            ? "bg-yellow-600 text-black"
                            : ""
                        }
                      >
                        Weekly
                      </Button>
                    )}
                    {currentCar.pricePerMonth && (
                      <Button
                        variant={
                          rentalPeriod === "month" ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setRentalPeriod("month")}
                        className={
                          rentalPeriod === "month"
                            ? "bg-yellow-600 text-black"
                            : ""
                        }
                      >
                        Monthly
                      </Button>
                    )}
                  </div>

                  {/* Price Display */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-600">
                      AED {getPrice().toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      per {rentalPeriod}
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
                      Book via WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="text-center text-sm text-gray-600 pt-4 border-t">
                    <p>Need help? Contact us</p>
                    <p className="font-semibold">+971 XX XXX XXXX</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Cars */}
        {relatedCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Similar Cars
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CarDetails;
