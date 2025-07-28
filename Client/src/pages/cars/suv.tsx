import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Mountain, Shield, Users, Compass } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const SUVCars: React.FC = () => {
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
    color: "bg-black",
    features: [
      { icon: Mountain, text: "All-Terrain Capable" },
      { icon: Users, text: "Spacious Interior" },
      { icon: Shield, text: "Advanced Safety" },
    ],
    backgroundImage: "/images/suv-hero-bg.jpg",
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12">
        {/* Capability Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">7+</div>
            <div className="text-gray-600">Passenger Seating</div>
          </div>
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">
              AWD/4WD
            </div>
            <div className="text-gray-600">All-Terrain Capability</div>
          </div>
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">Luxury</div>
            <div className="text-gray-600">Premium Comfort</div>
          </div>
          <div className="p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">
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
                Versatile, powerful, and comfortable SUVs for every adventure
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {suvCars.map((car: any) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Offroad Adventure Section */}
        <div className="mt-16 goldbg rounded-lg p-8 text-black">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Offroad Adventure Packages
            </h3>
            <p className="text-xl opacity-90">
              Take your SUV rental beyond the city limits with our offroad-ready
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Desert Safari</h4>
              <p className="text-sm opacity-90">
                Guided dune-bashing and sand adventure tours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Safety First</h4>
              <p className="text-sm opacity-90">
                Advanced safety features and expert guides
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Family-Friendly</h4>
              <p className="text-sm opacity-90">
                Spacious seating and comfort for all passengers
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SUVCars;
