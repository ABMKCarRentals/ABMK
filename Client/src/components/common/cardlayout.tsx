import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Fuel, Settings, MapPin } from "lucide-react";

// Define the car interface
interface Car {
  img: string;
  name: string;
  type: string;
  price: string;
  seats: string;
  fuel: string;
  transmission: string;
  location: string;
}

// Props interface for the CommonCardLayout
interface CommonCardLayoutProps {
  cars: Car[];
  className?: string;
  cardClassName?: string;
  onCardClick?: (car: Car, index: number) => void;
}

const CommonCardLayout: React.FunctionComponent<CommonCardLayoutProps> = ({
  cars,
  className = "",
  cardClassName = "",
  onCardClick,
}) => {
  return (
    <div
      className={`
        grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}
      `}
    >
      {cars.map((car, index) => (
        <Card
          key={index}
          className={`
            overflow-hidden transition-transform hover:scale-[1.01] border-[#232424] shadow-2xl cursor-pointer 
            ${cardClassName} mont w-full h-84 sm:h-64 md:h-full
          `}
          onClick={() => onCardClick?.(car, index)}
        >
          <div className="relative">
            <img
              src={car.img}
              alt={car.name}
              className="
                w-full h-32 object-contain sm:h-28 md:h-36 lg:h-40
                transition-all
              "
            />
           
            <span className="absolute bottom-3 right-3 bg-black text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-md">
              {car.price} <span className="text-xs font-light">/ day</span>
            </span>
          </div>

          <CardHeader className="py-2 px-4">
            <CardTitle className="text-base sm:text-lg md:text-lg lg:text-xl racing font-extralight truncate">
              {car.name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm md:text-base text-gray-600 truncate">
              {car.type}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-2 px-4">
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={14} className="sm:w-4 sm:h-4" />
                <span>{car.seats}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel size={14} className="sm:w-4 sm:h-4" />
                <span>{car.fuel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings size={14} className="sm:w-4 sm:h-4" />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="sm:w-4 sm:h-4" />
                <span>{car.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommonCardLayout;
