import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Briefcase, Star, Shield, Clock } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const SedanCars: React.FC = () => {
  const { sedanCars, isCategoryLoading, categoryError, getSedanCars } =
    useCars();

  useEffect(() => {
    getSedanCars();
  }, [getSedanCars]);

  const categoryData = {
    title: "Sedan Cars",
    subtitle: "Elegance and comfort for every journey",
    description:
      "Experience sophisticated travel with our premium sedan collection. Perfect for business meetings, airport transfers, or stylish city driving with optimal comfort and professional appeal.",
    icon: Briefcase,
    color: "bg-black",
    features: [
      { icon: Briefcase, text: "Business Class" },
      { icon: Star, text: "Premium Comfort" },
      { icon: Shield, text: "Professional Image" },
    ],
    backgroundImage: "/images/sedan-hero-bg.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12 bg-black">
        {/* Business Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">4-5</div>
            <div className="text-gray-600">Passenger Seats</div>
          </div>
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">Premium</div>
            <div className="text-gray-600">Interior Quality</div>
          </div>
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">24/7</div>
            <div className="text-gray-600">Available Service</div>
          </div>
          <div className=" p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">
              {sedanCars.length}+
            </div>
            <div className="text-gray-600">Sedan Models</div>
          </div>
        </div>

        {/* Cars Grid */}
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : categoryError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{categoryError}</p>
          </div>
        ) : sedanCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No sedan cars available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Sedans ({sedanCars.length})
              </h2>
              <p className="text-gray-600">
                Professional and comfortable sedans for business and leisure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sedanCars.map((car: any) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Business Services Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r goldbg rounded-lg p-8 text-white mb-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Corporate Solutions</h3>
              <p className="text-xl opacity-90 mb-6">
                Professional transportation services for businesses and
                executives
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className=" p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 gold" />
              </div>
              <h4 className="font-semibold mb-2">Airport Transfers</h4>
              <p className="text-sm text-gray-600">
                Punctual and professional airport pickup and drop-off services
              </p>
            </div>

            <div className=" p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 gold" />
              </div>
              <h4 className="font-semibold mb-2">Business Meetings</h4>
              <p className="text-sm text-gray-600">
                Arrive in style for important business meetings and conferences
              </p>
            </div>

            <div className=" p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 gold" />
              </div>
              <h4 className="font-semibold mb-2">VIP Service</h4>
              <p className="text-sm text-gray-600">
                Premium treatment with white-glove service and attention to
                detail
              </p>
            </div>

            <div className=" p-6 rounded-lg text-center shadow-sm">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 gold" />
              </div>
              <h4 className="font-semibold mb-2">Chauffeur Available</h4>
              <p className="text-sm text-gray-600">
                Professional drivers trained in executive transportation
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SedanCars;
