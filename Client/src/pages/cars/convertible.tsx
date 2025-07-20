import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Sun, Wind, Camera, Heart } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const ConvertibleCars = () => {
  const {
    convertibleCars,
    isCategoryLoading,
    categoryError,
    getConvertibleCars,
  } = useCars();

  useEffect(() => {
    getConvertibleCars();
  }, [getConvertibleCars]);

  const categoryData = {
    title: "Convertible Cars",
    subtitle: "Feel the freedom of open-air driving",
    description:
      "Experience Dubai's perfect weather with our stunning convertible collection. From romantic sunset drives to exhilarating coastal cruises, enjoy the ultimate open-air luxury experience.",
    icon: Sun,
    color: "from-orange-600 to-yellow-500",
    features: [
      { icon: Sun, text: "Open-Air Experience" },
      { icon: Wind, text: "Perfect Weather" },
      { icon: Camera, text: "Instagram Worthy" },
    ],
    backgroundImage: "/images/convertible-hero-bg.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12">
        {/* Experience Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">365</div>
            <div className="text-gray-600">Days Perfect Weather</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-gray-600">Memorable Experience</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              Luxury
            </div>
            <div className="text-gray-600">Open-Air Driving</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {convertibleCars.length}+
            </div>
            <div className="text-gray-600">Convertible Models</div>
          </div>
        </div>

        {/* Cars Grid */}
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : categoryError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{categoryError}</p>
          </div>
        ) : convertibleCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No convertible cars available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Convertibles ({convertibleCars.length})
              </h2>
              <p className="text-gray-600">
                Perfect for romantic drives, special occasions, and
                unforgettable memories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {convertibleCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Scenic Routes Section */}
        <div className="mt-16 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Scenic Routes Package</h3>
            <p className="text-xl opacity-90">
              Discover Dubai's most beautiful driving routes with our curated
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Sunset Coastal Drive</h4>
              <p className="text-sm opacity-90">
                Drive along Dubai's stunning coastline during golden hour
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Photography Tour</h4>
              <p className="text-sm opacity-90">
                Visit Dubai's most Instagram-worthy locations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Romantic Getaway</h4>
              <p className="text-sm opacity-90">
                Special packages for couples and romantic occasions
              </p>
            </div>
          </div>
        </div>

        {/* Top Destinations */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Top Convertible Destinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <img
                src="/images/palm-jumeirah.jpg"
                alt="Palm Jumeirah"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-semibold mb-2">Palm Jumeirah</h4>
              <p className="text-sm text-gray-600">
                Cruise the iconic palm-shaped island with stunning views
              </p>
            </div>
            <div className="text-center p-4">
              <img
                src="/images/jumeirah-beach.jpg"
                alt="Jumeirah Beach Road"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-semibold mb-2">Jumeirah Beach Road</h4>
              <p className="text-sm text-gray-600">
                Scenic coastal drive with beach and skyline views
              </p>
            </div>
            <div className="text-center p-4">
              <img
                src="/images/dubai-marina.jpg"
                alt="Dubai Marina"
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-semibold mb-2">Dubai Marina</h4>
              <p className="text-sm text-gray-600">
                Urban sophistication with waterfront dining stops
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConvertibleCars;
