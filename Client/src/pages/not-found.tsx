import React from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const popularLinks = [
    { name: "Luxury Cars", path: "/luxury", icon: Car },
    { name: "Sports Cars", path: "/sports", icon: Car },
    { name: "All Cars", path: "/cars", icon: Car },
    { name: "About Us", path: "/about", icon: Home },
    { name: "Contact", path: "/contact", icon: Home },
  ];

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem("search") as HTMLInputElement;
    const searchTerm = searchInput.value;
    if (searchTerm.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 text-white">
      <div className="max-w-4xl w-full text-center">
        {/* Main Error Content */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="text-[180px] md:text-[280px] font-extrabold text-gray-800/30 leading-none select-none tracking-tighter">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-24 h-24 md:w-32 md:h-32 text-yellow-400 drop-shadow-lg" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-yellow-400 mb-6 drop-shadow">
            Oops! Page Not Found
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
            The page you're looking for seems to have taken a detour. Don't
            worry, our luxury cars are still waiting for you!
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-[#18181b] p-8 rounded-2xl shadow-xl mb-12 max-w-2xl mx-auto border border-[#23232b]">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            Looking for something specific?
          </h2>
          <p className="text-gray-400 mb-6">
            Search our premium car collection or browse popular categories
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                name="search"
                type="text"
                placeholder="Search for luxury cars, brands, or models..."
                className="pl-10 h-12 bg-[#23232b] border-[#23232b] text-white placeholder-gray-500"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-black h-12 px-6 font-semibold"
            >
              Search
            </Button>
          </form>

          <div className="text-sm text-gray-500">
            Try searching for:{" "}
            <span className="text-yellow-400">"Ferrari"</span>,{" "}
            <span className="text-yellow-400">"Luxury SUV"</span>,{" "}
            <span className="text-yellow-400">"Convertible"</span>, or{" "}
            <span className="text-yellow-400">"Sports Car"</span>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-yellow-400 mb-6">
            Popular Destinations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {popularLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="bg-[#18181b] p-4 rounded-lg shadow border border-[#23232b] hover:border-yellow-400 hover:shadow-xl transition-all duration-200 group"
                >
                  <Icon className="w-8 h-8 text-yellow-500 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                  <div className="text-sm font-semibold text-gray-100 group-hover:text-yellow-400 transition-colors duration-200">
                    {link.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/cars">
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-8 py-3"
              >
                <Car className="w-5 h-5 mr-2" />
                Browse Cars
              </Button>
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-yellow-400 flex items-center justify-center mx-auto font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back to Previous Page
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-gradient-to-br from-yellow-600/80 to-yellow-900/80 text-gray-900 p-8 rounded-2xl shadow-lg border border-yellow-700">
          <h3 className="text-xl font-semibold mb-4">
            Still can't find what you're looking for?
          </h3>
          <p className="text-gray-800 mb-6">
            Our team is here to help you find the perfect luxury car for your
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white shadow"
              onClick={() =>
                window.open("https://wa.me/971501234567", "_blank")
              }
            >
              WhatsApp Support
            </Button>
            <Button
              variant="outline"
              className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-yellow-400"
              onClick={() => (window.location.href = "tel:+97145678900")}
            >
              Call +971 4 567 8900
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-gray-600 text-sm">
          Error 404 - Page Not Found | ABMK Rentals |
          <span className="text-yellow-400"> Premium Car Rental Dubai</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
