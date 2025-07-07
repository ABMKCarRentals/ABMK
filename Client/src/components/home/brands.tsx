import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import ferrari from "../../assets/images/brands/ferrari.png";
import lambo from "../../assets/images/brands/lambo.png";
import bentley from "../../assets/images/brands/bentley.png";
import rollsroyce from "../../assets/images/brands/rollsroyce.png";
import porsche from "../../assets/images/brands/porsche.png";
import benz from "../../assets/images/brands/benz.png";

const brands = [
  { name: "Ferrari", logo: ferrari },
  { name: "Lamborghini", logo: lambo },
  { name: "Bentley", logo: bentley },
  { name: "Rolls Royce", logo: rollsroyce },
  { name: "Porsche", logo: porsche },
  { name: "Mercedes", logo: benz },
];

const BrandSection = () => {
  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-16 text- gold">Our Brands</h2>

        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="bg-black rounded-xl border border-gray-500 w-40 h-40 flex flex-col justify-center items-center hover:scale-105 transition-transform"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-10 mb-3 object-contain"
              />
              <p className="font-medium text- gold">{brand.name}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-16">
          <Button className="border gold text-black text-md font-semibold py-2 px-5 rounded-md flex items-center gap-2">
            All Brands <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
