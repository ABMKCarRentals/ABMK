import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CarCard from "../../components/cars/car-card";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import LoadingSpinner from "../../components/common/loading-spinner";

const CarsPage = () => {
  const {
    cars,
    isLoading,
    error,
    pagination,
    activeFilters,
    searchQuery,
    getAllCars,
    searchCars,
    filterAndSortCars,
    loadMoreCars,
    updateFilters,
    clearFilters,
  } = useCars();

  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [localFilters, setLocalFilters] = useState({
    brand: "",
    category: "",
    transmission: "",
    fuelType: "",
    seats: "",
    year: "",
    priceMin: "",
    priceMax: "",
    sort: "newest",
  });
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    getAllCars({ page: 1, limit: 12, sort: "newest" });
  }, [getAllCars]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      searchCars(localSearchQuery, { ...localFilters, page: 1, limit: 12 });
    } else {
      getAllCars({ ...localFilters, page: 1, limit: 12 });
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    filterAndSortCars({
      ...newFilters,
      search: localSearchQuery,
      page: 1,
      limit: 12,
    });
  };

  const handleClearFilters = () => {
    setLocalFilters({
      brand: "",
      category: "",
      transmission: "",
      fuelType: "",
      seats: "",
      year: "",
      priceMin: "",
      priceMax: "",
      sort: "newest",
    });
    setLocalSearchQuery("");
    clearFilters();
    getAllCars({ page: 1, limit: 12, sort: "newest" });
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      loadMoreCars(pagination.currentPage + 1);
    }
  };

  const brands = [
    "Ferrari",
    "Lamborghini",
    "Bentley",
    "Rolls Royce",
    "Porsche",
    "Mercedes",
    "BMW",
    "Audi",
  ];
  const categories = [
    "Luxury",
    "Sports",
    "SUV",
    "Sedan",
    "Convertible",
    "Coupe",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Premium Car <span className="text-yellow-400">Collection</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover our fleet of luxury and sports cars available for rent in
              Dubai
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by brand, model, or car name..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-black h-12 px-6"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Brand
                  </Label>
                  <Select
                    value={localFilters.brand}
                    onValueChange={(value) =>
                      handleFilterChange("brand", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Category
                  </Label>
                  <Select
                    value={localFilters.category}
                    onValueChange={(value) =>
                      handleFilterChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Price Range (AED/Day)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localFilters.priceMin}
                      onChange={(e) =>
                        handleFilterChange("priceMin", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localFilters.priceMax}
                      onChange={(e) =>
                        handleFilterChange("priceMax", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Transmission */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Transmission
                  </Label>
                  <Select
                    value={localFilters.transmission}
                    onValueChange={(value) =>
                      handleFilterChange("transmission", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Fuel Type
                  </Label>
                  <Select
                    value={localFilters.fuelType}
                    onValueChange={(value) =>
                      handleFilterChange("fuelType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Seats */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Seats
                  </Label>
                  <Select
                    value={localFilters.seats}
                    onValueChange={(value) =>
                      handleFilterChange("seats", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="2">2 Seats</SelectItem>
                      <SelectItem value="4">4 Seats</SelectItem>
                      <SelectItem value="5">5 Seats</SelectItem>
                      <SelectItem value="7">7 Seats</SelectItem>
                      <SelectItem value="8">8 Seats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Year</Label>
                  <Select
                    value={localFilters.year}
                    onValueChange={(value) => handleFilterChange("year", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters and Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {cars.length} Cars Found
                </h2>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      {/* Same filter content as sidebar */}
                      <div className="space-y-6">
                        {/* Brand Filter */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Brand
                          </Label>
                          <Select
                            value={localFilters.brand}
                            onValueChange={(value) =>
                              handleFilterChange("brand", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Brands" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Brands</SelectItem>
                              {brands.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                  {brand}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Add other filters here */}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={localFilters.sort}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Cars Grid/List */}
            {isLoading && cars.length === 0 ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => getAllCars({ page: 1, limit: 12 })}>
                  Try Again
                </Button>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No cars found matching your criteria
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} viewMode={viewMode} />
                  ))}
                </div>

                {/* Load More */}
                {pagination.hasNextPage && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black"
                    >
                      {isLoading ? "Loading..." : "Load More Cars"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarsPage;
