import React, { useEffect } from "react";
import { useCars } from "../../hooks/useCars";
import { Gem, Sparkles, Award, Eye } from "lucide-react";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import CarCard from "../../components/cars/car-card";
import LoadingSpinner from "../../components/common/loading-spinner";
import CategoryHero from "../../components/cars/category-hero";

const CoupeCars = () => {
  const { coupeCars, isCategoryLoading, categoryError, getCoupeCars } =
    useCars();

  useEffect(() => {
    getCoupeCars();
  }, [getCoupeCars]);

  const categoryData = {
    title: "Coupe Cars",
    subtitle: "Where elegance meets performance",
    description:
      "Discover the perfect balance of style and sophistication with our coupe collection. These two-door masterpieces combine stunning design with impressive performance for the ultimate driving pleasure.",
    icon: Gem,
    color: "from-purple-900 to-pink-600",
    features: [
      { icon: Gem, text: "Elegant Design" },
      { icon: Sparkles, text: "Distinctive Style" },
      { icon: Award, text: "Award Winning" },
    ],
    backgroundImage: "/images/coupe-hero-bg.jpg",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <CategoryHero data={categoryData} />

      <div className="container mx-auto px-4 py-12">
        {/* Style Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              2-Door
            </div>
            <div className="text-gray-600">Exclusive Design</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              Sport+
            </div>
            <div className="text-gray-600">Performance Mode</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              Premium
            </div>
            <div className="text-gray-600">Luxury Interior</div>
          </div>
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {coupeCars.length}+
            </div>
            <div className="text-gray-600">Coupe Models</div>
          </div>
        </div>

        {/* Cars Grid */}
        {isCategoryLoading ? (
          <LoadingSpinner />
        ) : categoryError ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{categoryError}</p>
          </div>
        ) : coupeCars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No coupe cars available at the moment
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Available Coupes ({coupeCars.length})
              </h2>
              <p className="text-gray-600">
                Sophisticated two-door vehicles that make a statement wherever
                you go
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coupeCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          </>
        )}

        {/* Design Philosophy Section */}
        <div className="mt-16 bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              The Art of Automotive Design
            </h3>
            <p className="text-gray-600">
              Every coupe in our collection represents the pinnacle of
              automotive artistry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Distinctive Silhouette
              </h4>
              <p className="text-gray-600">
                Every coupe features a unique and instantly recognizable profile
                that turns heads and captures attention
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Award-Winning Design
              </h4>
              <p className="text-gray-600">
                Our coupes have received international recognition for their
                innovative design and engineering excellence
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-10 h-10 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Head-Turning Presence
              </h4>
              <p className="text-gray-600">
                Make an unforgettable impression at any venue, from business
                events to social gatherings
              </p>
            </div>
          </div>
        </div>

        {/* Occasions Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-900 to-pink-600 rounded-lg p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              Perfect for Every Occasion
            </h3>
            <p className="text-xl opacity-90">
              Our coupes are designed to elevate any experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Date Nights</h4>
              <p className="text-sm opacity-90">
                Create romantic memories with style and sophistication
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Special Events</h4>
              <p className="text-sm opacity-90">
                Make grand entrances at weddings, galas, and celebrations
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Business Meetings</h4>
              <p className="text-sm opacity-90">
                Project success and attention to detail in professional settings
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Weekend Escapes</h4>
              <p className="text-sm opacity-90">
                Turn ordinary trips into extraordinary adventures
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoupeCars;
