import { useNavigate } from "react-router-dom";
import ferrari from "../../assets/images/brands/ferrari.png";
import lambo from "../../assets/images/brands/lambo.png";
import bentley from "../../assets/images/brands/bentley.png";
import rollsroyce from "../../assets/images/brands/rollsroyce.png";
import porsche from "../../assets/images/brands/porsche.png";
import benz from "../../assets/images/brands/benz.png";
import bmw from "../../assets/images/brands/bmw.png";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

const Brands = () => {
  const navigate = useNavigate();

  const brands = [
    {
      name: "Ferrari",
      logo: ferrari,
      slug: "Ferrari",
    },
    {
      name: "Lamborghini",
      logo: lambo,
      slug: "Lamborghini",
    },
    {
      name: "Bentley",
      logo: bentley,
      slug: "Bentley",
    },
    {
      name: "Rolls Royce",
      logo: rollsroyce,
      slug: "Rolls-royce",
    },
    {
      name: "Porsche",
      logo: porsche,
      slug: "Porsche",
    },
    {
      name: "Mercedes",
      logo: benz,
      slug: "Mercedes",
    },
    {
      name: "BMW",
      logo: bmw,
      slug: "BMW",
    },
  ];

  const handleBrandClick = (brandSlug: string) => {
    navigate(`/cars?brand=${brandSlug}`);
  };

  return (
    <div className="min-h-screen bg-black text-[#b08a53] pt-20">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic mb-4 sm:mb-6"
            style={{
              color: "#b08a53",
              fontFamily: "'Poppins', 'Montserrat', 'serif'",
              letterSpacing: "1px",
            }}
          >
            Our Brands
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
            Discover our premium collection of luxury automotive brands
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {brands.map((brand) => (
            <div
              key={brand.slug}
              onClick={() => handleBrandClick(brand.slug)}
              className="bg-transparent border border-[#595959] rounded-xl sm:rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#b08a53] group shadow-lg hover:shadow-xl"
              style={{
                // Responsive dimensions using CSS custom properties
                minHeight: "clamp(140px, 20vw, 200px)",
                aspectRatio: "4/5",
              }}
            >
              {/* Logo Container */}
              <div className="flex items-center justify-center mb-2 sm:mb-4 lg:mb-6 flex-1">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain select-none group-hover:scale-110 transition-transform duration-300"
                  draggable="false"
                  style={{
                    filter: "drop-shadow(0px 2px 8px #000000)",
                  }}
                />
              </div>

              {/* Brand Name */}
              <div className="px-2 pb-2 sm:pb-3 lg:pb-4 text-center">
                <div
                  className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold italic leading-tight group-hover:text-[#e4c489] transition-colors duration-300"
                  style={{
                    color: "#b08a53",
                    fontFamily: "'Poppins', 'Montserrat', 'serif'",
                    textShadow: "0 1px 2px #00000060",
                    letterSpacing: "0.5px",
                  }}
                >
                  {brand.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl sm:rounded-2xl border border-[#595959] shadow-xl mx-auto max-w-xl lg:max-w-2xl p-6 sm:p-8 lg:p-10">
            <h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold italic mb-3 sm:mb-4"
              style={{
                color: "#b08a53",
                fontFamily: "'Poppins', 'Montserrat', 'serif'",
              }}
            >
              Can't Find Your Preferred Brand?
            </h2>
            <p
              className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 font-medium"
              style={{ fontFamily: "'Montserrat', 'serif'" }}
            >
              We're constantly expanding our fleet. Contact us for special
              requests.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="bg-[#b08a53] hover:bg-[#e4c489] text-black font-semibold py-2 sm:py-3 px-6 sm:px-8 lg:px-10 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
              style={{ fontFamily: "'Montserrat', 'serif'" }}
            >
              Contact Our Experts
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Brands;
