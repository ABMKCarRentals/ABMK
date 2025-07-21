import React from "react";
import { useNavigate } from "react-router-dom";
import ferrari from "../../assets/images/brands/ferrari.png";
import lambo from "../../assets/images/brands/lambo.png";
import bentley from "../../assets/images/brands/bentley.png";
import rollsroyce from "../../assets/images/brands/rollsroyce.png";
import porsche from "../../assets/images/brands/porsche.png";
import benz from "../../assets/images/brands/benz.png";

const Brands = () => {
  const navigate = useNavigate();

  const brands = [
    {
      name: "Ferrari",
      logo: ferrari,
      slug: "ferrari",
      description: "Italian luxury sports cars known for speed and elegance.",
      count: 12,
    },
    {
      name: "Lamborghini",
      logo: lambo,
      slug: "lamborghini",
      description: "Bold and aggressive supercars from Italy.",
      count: 8,
    },
    {
      name: "Bentley",
      logo: bentley,
      slug: "bentley",
      description: "British luxury automobiles with handcrafted excellence.",
      count: 6,
    },
    {
      name: "Rolls Royce",
      logo: rollsroyce,
      slug: "rolls-royce",
      description: "The pinnacle of luxury and craftsmanship.",
      count: 4,
    },
    {
      name: "Porsche",
      logo: porsche,
      slug: "porsche",
      description: "German engineering meets sports car perfection.",
      count: 15,
    },
    {
      name: "Mercedes",
      logo: benz,
      slug: "mercedes",
      description: "Luxury, innovation, and superior performance.",
      count: 20,
    },
  ];

  const handleBrandClick = (brandSlug) => {
    navigate(`/cars?brand=${brandSlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-yellow-400 mb-6">
            Our Brands
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our collection of the world's most prestigious automotive
            brands. Each vehicle represents the pinnacle of luxury, performance,
            and craftsmanship.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.slug}
              onClick={() => handleBrandClick(brand.slug)}
              className="bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-yellow-400 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105"
            >
              <div className="text-center">
                <div className="bg-gray-900/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-400/10 transition-colors duration-300">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-16 h-16 object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-200"
                  />
                </div>

                <h3 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 mb-3">
                  {brand.name}
                </h3>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {brand.description}
                </p>

                <div className="flex items-center justify-center gap-2 text-yellow-400">
                  <span className="font-semibold">{brand.count}</span>
                  <span className="text-gray-400">vehicles available</span>
                </div>

                <button className="mt-6 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                  View {brand.name} Cars
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
