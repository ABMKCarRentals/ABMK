import { FastForwardIcon } from "lucide-react";
import { Button } from "../ui/button";
import CommonCardLayout from "../common/cardlayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  location: string;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  status: string;
  isAvailable: boolean;
}

interface ApiResponse {
  success: boolean;
  data: Car[];
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const FeaturedVehicles = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const timestamp = Date.now();
        const response = await fetch(
          `https://abmk.onrender.com/api/cars?page=1&limit=12&sort=newest&_t=${timestamp}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && data.data) {
          setCars(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch cars");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Transform API data to match CommonCardLayout expected format
  const transformedCars = cars.map((car) => ({
    name: `${car.brand} ${car.model}`,
    type: `${car.category} · ${car.year}`,
    seats: `${car.seats} Seats`,
    transmission: car.transmission,
    fuel: car.fuelType,
    location: car.location,
    price: "Contact for Price", // API doesn't seem to have price, adjust as needed
    img:
      car.images && car.images.length > 0
        ? car.images.find((img) => img.isPrimary)?.url || car.images[0].url
        : "/api/placeholder/300/200", // fallback image
    id: car._id,
    status: car.status,
    isAvailable: car.isAvailable,
  }));

  const handleCardClick = (car: any, index: number) => {
    const originalCar = cars[index];
    console.log(car);
    if (originalCar) {
      navigate(`/cars/${originalCar._id}`);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-black text-gold">
        <div className="text-center mb-10">
          <h2 className="text-4xl racing">Featured Vehicles</h2>
          <p className="text-gray-500 mt-2 mont">
            Explore our selection of premium vehicles available for your next
            adventure.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            <span className="ml-4 text-gray-400">
              Loading featured vehicles...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-black text-gold">
        <div className="text-center mb-10">
          <h2 className="text-4xl racing">Featured Vehicles</h2>
          <p className="text-gray-500 mt-2 mont">
            Explore our selection of premium vehicles available for your next
            adventure.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">Error loading vehicles: {error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (cars.length === 0) {
    return (
      <section className="py-12 bg-black text-gold">
        <div className="text-center mb-10">
          <h2 className="text-4xl racing">Featured Vehicles</h2>
          <p className="text-gray-500 mt-2 mont">
            Explore our selection of premium vehicles available for your next
            adventure.
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-300">
              No Cars Found
            </h3>
            <p className="text-gray-500 mb-6">
              We're currently updating our fleet. Please check back soon!
            </p>
            <Button
              onClick={() => navigate("/contact")}
              className="bg-yellow-600 hover:bg-yellow-700 text-black"
            >
              Contact Us for Updates
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-black text-gold">
      <div className="text-center mb-10">
        <h2 className="text-4xl racing">Featured Vehicles</h2>
        <p className="text-gray-500 mt-2 mont">
          Explore our selection of premium vehicles available for your next
          adventure.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <CommonCardLayout
          cars={transformedCars}
          onCardClick={handleCardClick}
          className=""
          cardClassName=""
        />
      </div>

      <div className="mt-12 flex justify-center items-center">
        <Button
          className="flex justify-center border items-center text-md gap-2 mont bg-yellow-600 hover:bg-yellow-700 text-black"
          onClick={() => {
            navigate("/cars");
          }}
        >
          Explore all Cars <FastForwardIcon />
        </Button>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
