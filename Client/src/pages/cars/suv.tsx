import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Mountain, Shield, Users, Compass } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const SUVCars = () => {
  const { suvCars, isCategoryLoading, categoryError, getSUVCars } = useCars();

  useEffect(() => {
    getSUVCars();
  }, [getSUVCars]);

  const categoryData = {
    title: "SUV Cars",
    subtitle: "Adventure meets luxury in perfect harmony",
    description:
      "Explore Dubai and beyond with our premium SUV collection. Whether for family adventures, business trips, or desert expeditions, our SUVs offer the perfect blend of comfort, capability, and style.",
    icon: Mountain,
    color: "from-green-900 to-teal-700",
    features: [
      { icon: Mountain, text: "All-Terrain Capable" },
      { icon: Users, text: "Spacious Interior" },
      { icon: Shield, text: "Advanced Safety" },
    ],
    backgroundImage: "/images/suv-hero-bg.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12">
        {/* Capability Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">7-8</div>
            <div className="text-gray-600">Seating Capacity</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">4WD</div>
            <div className="text-gray-600">All-Terrain Ready</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              Premium
            </div>
            <div className="text-gray-600">Interior Comfort</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {suvCars.length}+
            </div>
            <div className="text-gray-600">SUV Models</div>
          </div>
        </div>

        {/* Cars Grid */}
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : categoryError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{categoryError}</p>
          </div>
        ) : suvCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No SUV cars available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available SUVs ({suvCars.length})
              </h2>
              <p className="text-gray-600">
                Perfect for family trips, business travel, and desert adventures
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suvCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Adventure Packages Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Desert Adventure Packages
            </h3>
            <p className="text-gray-600">
              Enhance your SUV rental with our exclusive desert experience
              packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Desert Safari</h4>
              <p className="text-sm text-gray-600 mb-4">
                Guided desert tours with dune bashing and cultural experiences
              </p>
              <div className="text-lg font-bold text-green-600">
                From AED 500
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Mountain Expedition</h4>
              <p className="text-sm text-gray-600 mb-4">
                Explore the Hajar Mountains with off-road adventures
              </p>
              <div className="text-lg font-bold text-green-600">
                From AED 750
              </div>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Family Package</h4>
              <p className="text-sm text-gray-600 mb-4">
                Family-friendly adventures with entertainment and dining
              </p>
              <div className="text-lg font-bold text-green-600">
                From AED 1,200
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SUVCars;
