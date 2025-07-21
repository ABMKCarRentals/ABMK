import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Zap, Crown, Mountain, Users, Wind } from "lucide-react";

const categories = [
  {
    name: "Sports Cars",
    slug: "sports",
    icon: Zap,
    description: "High-performance vehicles built for speed and agility.",
    count: 25,
    color: "from-red-600 to-red-900",
    shadow: "shadow-[0_0_32px_0_rgba(220,38,38,0.5)]",
  },
  {
    name: "Luxury Sedans",
    slug: "luxury",
    icon: Crown,
    description: "Premium comfort and elegance for business and leisure.",
    count: 18,
    color: "from-purple-600 to-purple-900",
    shadow: "shadow-[0_0_32px_0_rgba(168,85,247,0.4)]",
  },
  {
    name: "SUVs",
    slug: "suv",
    icon: Mountain,
    description: "Spacious and powerful vehicles for any terrain.",
    count: 15,
    color: "from-green-600 to-green-900",
    shadow: "shadow-[0_0_32px_0_rgba(34,197,94,0.4)]",
  },
  {
    name: "Convertibles",
    slug: "convertible",
    icon: Wind,
    description: "Open-top driving experience with ultimate freedom.",
    count: 12,
    color: "from-blue-600 to-blue-900",
    shadow: "shadow-[0_0_32px_0_rgba(59,130,246,0.4)]",
  },
  {
    name: "Family Cars",
    slug: "family",
    icon: Users,
    description: "Comfortable and safe vehicles for family adventures.",
    count: 20,
    color: "from-teal-500 to-teal-900",
    shadow: "shadow-[0_0_32px_0_rgba(20,184,166,0.4)]",
  },
  {
    name: "Coupes",
    slug: "coupe",
    icon: Car,
    description: "Stylish two-door vehicles combining luxury and performance.",
    count: 14,
    color: "from-orange-500 to-orange-900",
    shadow: "shadow-[0_0_32px_0_rgba(251,146,60,0.4)]",
  },
];

const Categories: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/cars?category=${slug}`);
  };

  return (
    <div className="min-h-screen bg-black text-[#b08a53] pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-6xl font-bold italic mb-6"
            style={{
              color: "#b08a53",
              fontFamily: "'Poppins', 'Montserrat', serif",
              letterSpacing: "1px",
            }}
          >
            Car Categories
          </h1>
          <p
            className="text-xl text-[#d8c7b0] max-w-3xl mx-auto font-medium"
            style={{ fontFamily: "'Montserrat', serif" }}
          >
            Discover the perfect vehicle for your needs. From high-performance
            sports cars to luxurious family vehicles, we have something for
            every occasion.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-12">
          {categories.map((category) => (
            <div
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className={`relative bg-gradient-to-br ${category.color} rounded-2xl flex flex-col items-center justify-center cursor-pointer group
                border border-[#595959] min-w-[250px] min-h-[300px] max-w-[280px] w-full
                hover:border-[#b08a53] ${category.shadow} hover:scale-105 transition-all duration-200
              `}
              style={{
                boxShadow: category.shadow
                  ? undefined
                  : "0 0 24px 0 rgba(176,138,83,0.13)",
                background: "rgba(20,20,20,0.98)",
              }}
            >
              <div className="flex flex-col items-center p-8 w-full">
                <div className="bg-[#b08a53] rounded-full w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <category.icon className="w-10 h-10 text-black" />
                </div>
                <h3
                  className="text-2xl font-bold italic mb-3"
                  style={{
                    color: "#b08a53",
                    fontFamily: "'Poppins', 'Montserrat', serif",
                    textShadow: "0 1px 2px #00000060",
                    letterSpacing: "0.5px",
                  }}
                >
                  {category.name}
                </h3>
                <p className="text-[#d8c7b0] text-sm mb-6 leading-relaxed font-medium text-center">
                  {category.description}
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span
                    className="font-bold text-lg"
                    style={{ color: "#b08a53" }}
                  >
                    {category.count}
                  </span>
                  <span className="text-[#b08a53] font-medium">
                    vehicles available
                  </span>
                </div>
                <button
                  className="bg-[#b08a53] hover:bg-[#e4c489] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 w-full shadow"
                  style={{
                    fontFamily: "'Montserrat', serif",
                  }}
                >
                  Explore {category.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl border border-[#595959] shadow-xl mx-auto max-w-2xl p-10">
            <h2
              className="text-3xl md:text-4xl font-bold italic mb-4"
              style={{
                color: "#b08a53",
                fontFamily: "'Poppins', 'Montserrat', serif",
              }}
            >
              Can't Find What You're Looking For?
            </h2>
            <p
              className="text-[#d8c7b0] mb-8 font-medium"
              style={{ fontFamily: "'Montserrat', serif" }}
            >
              Our team can help you find the perfect vehicle for your specific
              needs.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-[#b08a53] hover:bg-[#e4c489] text-black font-semibold py-3 px-10 rounded-lg transition-colors duration-200 shadow"
              style={{ fontFamily: "'Montserrat', serif" }}
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
