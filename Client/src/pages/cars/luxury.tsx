import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Crown, Star, Gem } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const LuxuryCars = () => {
  const { luxuryCars, isCategoryLoading, categoryError, getLuxuryCars } =
    useCars();

  useEffect(() => {
    getLuxuryCars();
  }, [getLuxuryCars]);

  const categoryData = {
    title: "Luxury Cars",
    subtitle: "Experience the pinnacle of automotive excellence",
    description:
      "Our luxury car collection features the world's most prestigious brands, offering unparalleled comfort, performance, and sophistication for the most discerning clients.",
    icon: Crown,
    color: "from-purple-900 to-black",
    features: [
      { icon: Crown, text: "Premium Brands" },
      { icon: Star, text: "5-Star Service" },
      { icon: Gem, text: "Exclusive Models" },
    ],
    backgroundImage: "/images/luxury-hero-bg.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {luxuryCars.length}+
            </div>
            <div className="text-gray-600">Luxury Vehicles</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Concierge Service</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">VIP</div>
            <div className="text-gray-600">Treatment</div>
          </div>
        </div>

        {/* Cars Grid */}
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : categoryError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{categoryError}</p>
          </div>
        ) : luxuryCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No luxury cars available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Luxury Cars ({luxuryCars.length})
              </h2>
              <p className="text-gray-600">
                Choose from our exclusive collection of luxury vehicles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {luxuryCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Luxury Services Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Luxury Car Rental Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">VIP Delivery</h4>
              <p className="text-sm text-gray-600">
                White-glove delivery service to your location
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                Round-the-clock concierge assistance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Premium Insurance</h4>
              <p className="text-sm text-gray-600">
                Comprehensive coverage included
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Chauffeur Service</h4>
              <p className="text-sm text-gray-600">
                Professional drivers available
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LuxuryCars;
