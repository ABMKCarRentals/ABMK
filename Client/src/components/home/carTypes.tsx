import luxury from "../../assets/images/types/luxury.jpg";
import convertible from "../../assets/images/types/convertible.jpg";
import coupe from "../../assets/images/types/coupe.jpg";
import hatchback from "../../assets/images/types/hatchback.jpg";
import sedan from "../../assets/images/types/sedan.jpg";
import sports from "../../assets/images/types/sports.jpg";
import suv from "../../assets/images/types/suv.jpg";
import supercar from "../../assets/images/types/super.jpeg";

const types = [
  { name: "Luxury", logo: luxury },
  { name: "Super", logo: supercar },
  { name: "Convertible", logo: convertible },
  { name: "Coupe", logo: coupe },
  { name: "Hatchback", logo: hatchback },
  { name: "Sedan", logo: sedan },
  { name: "Sports", logo: sports },
  { name: "SUV", logo: suv },
];

const TypeSection = () => {
  return (
    <section className="bg-black text-white py-16 px-4 racing">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl mb-16 text- gold">Discover Your Drive</h2>

        <div className="grid grid-cols-4 justify-center gap-6 mb-10">
          {types.map((type, index) => (
            <div
              key={index}
              className="bg-black rounded-xl border border-gray-800 w-80 h-70 flex flex-col justify-center items-center hover:scale-105 transition-transform"
            >
              <img
                src={type.logo}
                alt={type.name}
                className="h-50 mb-3 object-contain"
              />
              <p className="text- gold font-light">{type.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TypeSection;
