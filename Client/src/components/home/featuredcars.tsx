import { FastForwardIcon } from "lucide-react";
import { Button } from "../ui/button";
import CommonCardLayout from "../../common/cardlayout";
import x5 from "../../assets/images/x5.png";

const cars = [
  {
    name: "BMW X5",
    type: "SUV · 2006",
    seats: "4 Seats",
    transmission: "Semi-Automatic",
    fuel: "Hybrid",
    location: "New York",
    price: "$300",
    img: x5,
  },
  {
    name: "Toyota Corolla",
    type: "Sedan · 2021",
    seats: "4 Seats",
    transmission: "Automatic",
    fuel: "Diesel",
    location: "Los Angeles",
    price: "$130",
    img: x5,
  },
  {
    name: "BMW X5",
    type: "SUV · 2006",
    seats: "4 Seats",
    transmission: "Semi-Automatic",
    fuel: "Hybrid",
    location: "New York",
    price: "$300",
    img: x5,
  },
  {
    name: "BMW X5",
    type: "SUV · 2006",
    seats: "4 Seats",
    transmission: "Semi-Automatic",
    fuel: "Hybrid",
    location: "New York",
    price: "$300",
    img: x5,
  },
  {
    name: "BMW X5",
    type: "SUV · 2006",
    seats: "4 Seats",
    transmission: "Semi-Automatic",
    fuel: "Hybrid",
    location: "New York",
    price: "$300",
    img: x5,
  },
  {
    name: "BMW X5",
    type: "SUV · 2006",
    seats: "4 Seats",
    transmission: "Semi-Automatic",
    fuel: "Hybrid",
    location: "New York",
    price: "$300",
    img: x5,
  },
];

const FeaturedVehicles = () => {
  const handleCardClick = (car: any, index: number) => {
    console.log("Card clicked:", car, index);
    // Add your card click logic here
  };

  return (
    <section className="py-12 bg-black text- gold">
      <div className="text-center mb-10">
        <h2 className="text-4xl racing">Featured Vehicles</h2>
        <p className="text-gray-500 mt-2 mont">
          Explore our selection of premium vehicles available for your next
          adventure.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <CommonCardLayout
          cars={cars}
          onCardClick={handleCardClick}
          className=""
          cardClassName=""
        />
      </div>

      <div className="mt-12 flex justify-center items-center">
        <Button className="flex justify-center border items-center text-md gap-2 mont">
          Explore all Cars <FastForwardIcon />
        </Button>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
