import luxury from "../../assets/images/types/luxury.jpg";
import convertible from "../../assets/images/types/convertible.jpg";
import coupe from "../../assets/images/types/coupe.jpg";
// import hatchback from "../../assets/images/types/hatchback.jpg";
import sedan from "../../assets/images/types/sedan.jpg";
import sports from "../../assets/images/types/sports.jpg";
import suv from "../../assets/images/types/suv.jpg";
// import supercar from "../../assets/images/types/super.jpeg";

import { useNavigate } from "react-router-dom";

const types = [
  { name: "Luxury", logo: luxury, link: "/luxury" },
  // { name: "Super", logo: supercar },
  { name: "Convertible", logo: convertible, link: "/convertible" },
  { name: "Coupe", logo: coupe, link: "/coupe" },
  // { name: "Hatchback", logo: hatchback },
  { name: "Sedan", logo: sedan, link: "/sedan" },
  { name: "Sports", logo: sports, link: "/sports" },
  { name: "SUV", logo: suv, link: "/suv" },
];

const TypeSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-black text-white py-16 px-4 racing">
      <div className="max-w-7xl mx-auto text-center flex flex-col justify-center items-center">
        <h2 className="text-4xl mb-16 text- gold">Discover Your Drive</h2>

        <div className="flex md:grid flex-wrap md:grid-cols-3 justify-center items-center gap-6 mb-10">
          {types.map((type, index) => (
            <div
              key={index}
              className="bg-black rounded-xl border border-gray-800 w-40 md:w-80 h-35 md:h-70 flex flex-col justify-center items-center hover:scale-105 transition-transform"
            >
              <img
                src={type.logo}
                alt={type.name}
                className="h-25 md:h-50 mb-3 object-contain"
                onClick={() => {
                  navigate(type.link);
                }}
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
