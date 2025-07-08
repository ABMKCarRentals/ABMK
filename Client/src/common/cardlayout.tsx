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
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {cars.map((car, index) => (
        <Card
          key={index}
          className={`overflow-hidden transition-transform hover:scale-[1.01] border-[#232424] shadow-2xl cursor-pointer ${cardClassName} mont`}
          onClick={() => onCardClick?.(car, index)}
        >
          <div className="relative">
            <img
              src={car.img}
              alt={car.name}
              className="w-full h-56 object-cover"
            />
            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
              Available Now
            </span>
            <span className="absolute bottom-3 right-3 bg-black text-white text-sm font-semibold px-3 py-1 rounded-md">
              {car.price} <span className="text-xs font-light">/ day</span>
            </span>
          </div>

          <CardHeader>
            <CardTitle className="text-lg racing font-extralight">{car.name}</CardTitle>
            <CardDescription className="text-gray-600">
              {car.type}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{car.seats}</span>
              </div>
              <div className="flex items-center gap-2">
                <Fuel size={16} />
                <span>{car.fuel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings size={16} />
                <span>{car.transmission}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
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
