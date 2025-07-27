import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Zap, Gauge, Trophy, Target } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const SportsCars: React.FC = () => {
  const { sportsCars, isCategoryLoading, categoryError, getSportsCars } =
    useCars();

  useEffect(() => {
    getSportsCars();
  }, [getSportsCars]);

  const categoryData = {
    title: "Sports Cars",
    subtitle: "Unleash the thrill of pure performance",
    description:
      "Feel the adrenaline rush with our collection of high-performance sports cars. From track-bred supercars to elegant grand tourers, experience the ultimate in speed and precision.",
    icon: Zap,
    color: "bg-black",
    features: [
      { icon: Zap, text: "High Performance" },
      { icon: Gauge, text: "Track Ready" },
      { icon: Trophy, text: "Racing Heritage" },
    ],
    backgroundImage: "/cartypes/sports.jpeg",
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12">
        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 gold p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">0-100</div>
            <div className="text-gray-600">In under 3.5s</div>
          </div>
          <div className="bg-gray-900 gold p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">350+</div>
            <div className="text-gray-600">km/h Top Speed</div>
          </div>
          <div className="bg-gray-900 gold p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">600+</div>
            <div className="text-gray-600">Horsepower</div>
          </div>
          <div className="bg-gray-900 gold p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold gold mb-2">
              {sportsCars.length}+
            </div>
            <div className="text-gray-600">Sports Cars</div>
          </div>
        </div>

        {/* Cars Grid */}
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : categoryError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{categoryError}</p>
          </div>
        ) : sportsCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No sports cars available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 p-4">
              <h2 className="text-2xl font-bold gold mb-2">
                Available Sports Cars ({sportsCars.length})
              </h2>
              <p className="text-gray-600">
                Experience the thrill of our high-performance sports car
                collection
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {sportsCars.map((car: any) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Track Experience Section */}
        <div className="mt-16 bg-gradient-to-r goldbg rounded-lg p-8 text-black">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Track Day Experience</h3>
            <p className="text-xl opacity-90">
              Take your sports car rental to the next level with our exclusive
              track day packages
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-6 text-black">
            <div className="text-center">
              <div className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Professional Circuit</h4>
              <p className="text-sm opacity-90">
                Access to Dubai's premier racing circuits
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Expert Instruction</h4>
              <p className="text-sm opacity-90">
                Professional racing instructors available
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gauge className="w-8 h-8" />
              </div>
              <h4 className="font-semibold mb-2">Performance Data</h4>
              <p className="text-sm opacity-90">
                Telemetry and lap time analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SportsCars;
