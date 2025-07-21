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
    },
    {
      name: "Lamborghini",
      logo: lambo,
      slug: "lamborghini",
    },
    {
      name: "Bentley",
      logo: bentley,
      slug: "bentley",
    },
    {
      name: "Rolls Royce",
      logo: rollsroyce,
      slug: "rolls-royce",
    },
    {
      name: "Porsche",
      logo: porsche,
      slug: "porsche",
    },
    {
      name: "Mercedes",
      logo: benz,
      slug: "mercedes",
    },
  ];

  const handleBrandClick = (brandSlug: string) => {
    navigate(`/cars?brand=${brandSlug}`);
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
              fontFamily: "'Poppins', 'Montserrat', 'serif'",
              letterSpacing: "1px",
            }}
          >
            Our Brands
          </h1>
        </div>

        {/* Brands Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {brands.map((brand) => (
            <div
              key={brand.slug}
              onClick={() => handleBrandClick(brand.slug)}
              className="bg-transparent border border-[#595959] rounded-2xl min-w-[200px] min-h-[270px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:border-[#b08a53] group"
              style={{
                width: "220px",
                height: "270px",
              }}
            >
              <div className="mb-6 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-20 h-20 object-contain select-none"
                  draggable="false"
                  style={{
                    filter: "drop-shadow(0px 2px 8px #000000)",
                  }}
                />
              </div>
              <div
                className="text-2xl md:text-2xl font-semibold italic"
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
