import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  CheckCircle,
  Clock,
  AlertCircle,
  Car as CarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import LoadingSpinner from "../../components/common/loading-spinner";
import CarCard from "../../components/cars/car-card";
import ImageGallery from "../../components/cars/image-gallery";
import type { Car } from "@/types/Car";

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
      `https://wa.me/971552082602?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Function to determine car availability status
  const getCarStatusInfo = () => {
    if (!currentCar)
      return { available: false, status: "unknown", message: "Status unknown" };

    const status = currentCar.status?.toLowerCase() || "";
    const isAvailable = currentCar.isAvailable;

    switch (status) {
      case "available":
      case "active":
        return {
          available: true,
          status: "available",
          message: "Available Now",
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/20",
        };

      case "rented":
        return {
          available: false,
          status: "rented",
          message: "Currently Rented",
          description:
            "This vehicle is currently with another customer. Check back later or explore similar options.",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20",
          icon: <CarIcon className="w-4 h-4" />,
        };

      case "maintenance":
        return {
          available: false,
          status: "maintenance",
          message: "Under Maintenance",
          description:
            "This vehicle is currently undergoing scheduled maintenance for your safety and comfort.",
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/20",
          icon: <AlertCircle className="w-4 h-4" />,
        };

      case "not available":
      case "inactive":
        return {
          available: false,
          status: "unavailable",
          message: "Temporarily Unavailable",
          description:
            "This vehicle is currently not available for rental. Please check our other premium options.",
          color: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/20",
          icon: <Clock className="w-4 h-4" />,
        };

      default:
        return {
          available: isAvailable,
          status: isAvailable ? "available" : "unavailable",
          message: isAvailable ? "Available Now" : "Currently Unavailable",
          color: isAvailable ? "text-green-400" : "text-red-400",
          bgColor: isAvailable ? "bg-green-500/10" : "bg-red-500/10",
          borderColor: isAvailable
            ? "border-green-500/20"
            : "border-red-500/20",
        };
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
      <div className="min-h-screen bg-black">
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

  // Extract specification fields gracefully
  const {
    specifications = {},
    name,
    brand,
    model,
    year,
    category,
    transmission,
    fuelType,
    seats,
    images,
    location,
    description,
    features,
  } = currentCar;

  const statusInfo = getCarStatusInfo();

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="bg-black border-b border-gray-700 mt-16">
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
              {brand} {model}
            </span>
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
          <div className="lg:col-span-2">
            <section className="bg-black border border-gray-700 rounded-lg p-6 mb-6 shadow-lg ">
              <ImageGallery images={images || []} />
            </section>
            <section className="bg-black border border-gray-700 rounded-lg p-6 shadow-lg">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-black">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-[#b08a53] data-[state=active]:text-black"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="specifications"
                    className="data-[state=active]:bg-[#b08a53] data-[state=active]:text-black"
                  >
                    Specifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="data-[state=active]:bg-[#b08a53] data-[state=active]:text-black"
                  >
                    Features
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      {name}
                    </h3>
                    <h3 className="text-lg font-semibold mb-4 text-white">
                      Description
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      {description ||
                        `Experience the ultimate luxury with this stunning ${brand} ${model}. Perfect for special occasions, business trips, or simply enjoying the finest automotive engineering Dubai has to offer.`}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Brand</span>
                        <span className="font-semibold text-white">
                          {brand}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Model</span>
                        <span className="font-semibold text-white">
                          {model}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Year</span>
                        <span className="font-semibold text-white">{year}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Category</span>
                        <span className="font-semibold text-white">
                          {category}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Transmission</span>
                        <span className="font-semibold text-white">
                          {transmission}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Fuel Type</span>
                        <span className="font-semibold text-white">
                          {fuelType}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Seats</span>
                        <span className="font-semibold text-white">
                          {seats}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Location</span>
                        <span className="font-semibold text-white">
                          {location}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Availability</span>
                        <span className={`font-semibold ${statusInfo.color}`}>
                          {statusInfo.message}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="specifications" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specifications?.engine && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Engine</span>
                        <span className="font-semibold text-white">
                          {specifications.engine}
                        </span>
                      </div>
                    )}
                    {specifications?.acceleration && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">0-100 km/h</span>
                        <span className="font-semibold text-white">
                          {specifications.acceleration}
                        </span>
                      </div>
                    )}
                    {specifications?.mileage && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Mileage</span>
                        <span className="font-semibold text-white">
                          {specifications.mileage}
                        </span>
                      </div>
                    )}
                    {specifications?.color && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Exterior Color</span>
                        <span className="font-semibold text-white">
                          {specifications.color}
                        </span>
                      </div>
                    )}
                    {specifications?.interiorColor && (
                      <div className="flex justify-between py-2 border-b border-gray-600">
                        <span className="text-gray-400">Interior Color</span>
                        <span className="font-semibold text-white">
                          {specifications.interiorColor}
                        </span>
                      </div>
                    )}
                    {(!specifications ||
                      Object.values(specifications).every((v) => !v)) && (
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
                    {features && features.length > 0 ? (
                      features.map((feature, index) => (
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
          <aside className="lg:col-span-1">
            <Card className="sticky top-4 mb-6 bg-black border-gray-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white text-lg font-semibold">
                  {statusInfo.available ? "Get a Quote" : "Vehicle Status"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  {/* Status Alert */}
                  {!statusInfo.available && (
                    <Alert
                      className={`${statusInfo.bgColor} ${statusInfo.borderColor} border flex text-center`}
                    >
                      <div className="flex items-center">
                        
                        <AlertDescription
                          className={`ml-2 ${statusInfo.color}`}
                        >
                          <div className="font-semibold w-full">
                            {statusInfo.message}
                          </div>
                          {statusInfo.description && (
                            <div className="text-sm text-gray-400 mt-1">
                              {statusInfo.description}
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  <div className="text-center p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wider">
                      ABMK Car Rentals
                    </div>
                    <div className="text-sm text-gray-300">
                      {statusInfo.available
                        ? "Contact us for pricing"
                        : "Premium Car Rental Service"}
                    </div>
                  </div>

                  {statusInfo.available ? (
                    // Available - Show inquiry buttons
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
                        asChild
                      >
                        <a href="tel:+971552082602">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </a>
                      </Button>
                    </div>
                  ) : (
                    // Not Available - Show alternative actions
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
                        size="lg"
                        onClick={() => {
                          const message = `Hi, I'm interested in the ${brand} ${model} ${name}. When will it be available for rental?`;
                          window.open(
                            `https://wa.me/971552082602?text=${encodeURIComponent(
                              message
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Check Availability
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        size="lg"
                        asChild
                      >
                        <Link to="/cars">
                          <CarIcon className="w-4 h-4 mr-2" />
                          View Similar Cars
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-gray-400 hover:bg-gray-700"
                        size="lg"
                        asChild
                      >
                        <a href="tel:+971552082602">
                          <Phone className="w-4 h-4 mr-2" />
                          Speak to Our Team
                        </a>
                      </Button>
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-600">
                    <p>Need help? Contact us</p>
                    <a
                      className="font-semibold text-white"
                      href="tel:+971552082602"
                    >
                      +971 552082602
                    </a>
                  </div>

                  <div className="p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 text-base">
                      Why Choose Us?
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• 24/7 Customer Support</li>
                      <li>• Free Delivery & Pickup</li>
                      <li>• Comprehensive Insurance</li>
                      <li>• No Hidden Fees</li>
                      {!statusInfo.available && (
                        <li>• Alternative Vehicle Options</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
        {relatedCars && relatedCars.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              {statusInfo.available ? "Similar Cars" : "Available Alternatives"}
            </h2>
            {isRelatedLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCars.map((car: Car, idx: number) => (
                  <CarCard key={car._id || idx} car={car} />
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
