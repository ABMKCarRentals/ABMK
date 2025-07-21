import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Zap, Crown, Mountain, Users, Wind } from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: "Sports Cars",
      slug: "sports",
      icon: Zap,
      description: "High-performance vehicles built for speed and agility.",
      count: 25,
      color: "from-red-600 to-red-800",
    },
    {
      name: "Luxury Sedans",
      slug: "luxury",
      icon: Crown,
      description: "Premium comfort and elegance for business and leisure.",
      count: 18,
      color: "from-purple-600 to-purple-800",
    },
    {
      name: "SUVs",
      slug: "suv",
      icon: Mountain,
      description: "Spacious and powerful vehicles for any terrain.",
      count: 15,
      color: "from-green-600 to-green-800",
    },
    {
      name: "Convertibles",
      slug: "convertible",
      icon: Wind,
      description: "Open-top driving experience with ultimate freedom.",
      count: 12,
      color: "from-blue-600 to-blue-800",
    },
    {
      name: "Family Cars",
      slug: "family",
      icon: Users,
      description: "Comfortable and safe vehicles for family adventures.",
      count: 20,
      color: "from-teal-600 to-teal-800",
    },
    {
      name: "Coupes",
      slug: "coupe",
      icon: Car,
      description:
        "Stylish two-door vehicles combining luxury and performance.",
      count: 14,
      color: "from-orange-600 to-orange-800",
    },
  ];

  const handleCategoryClick = (categorySlug) => {
    navigate(`/cars?category=${categorySlug}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-yellow-400 mb-6">
            Car Categories
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the perfect vehicle for your needs. From high-performance
            sports cars to luxurious family vehicles, we have something for
            every occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="relative bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-yellow-400 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              <div className="relative p-8">
                <div className="text-center">
                  <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <category.icon className="w-8 h-8 text-black" />
                  </div>

                  <h3 className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 mb-3">
                    {category.name}
                  </h3>

                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-yellow-400 mb-6">
                    <span className="font-semibold text-lg">
                      {category.count}
                    </span>
                    <span className="text-gray-400">vehicles available</span>
                  </div>

                  <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 w-full">
                    Explore {category.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-300 mb-6">
              Our team can help you find the perfect vehicle for your specific
              needs.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
