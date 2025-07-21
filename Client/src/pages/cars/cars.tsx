import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import {
  Search,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  Car,
  Zap,
  Crown,
  Mountain,
  Users,
  Wind,
  AlertCircle,
  RefreshCw,
  Fuel,
  Calendar,
  Settings,
  MapPin,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CarCard from "../../components/cars/car-card";
import Navbar from "../../components/home/navbar";
import Footer from "../../components/home/footer";
import LoadingSpinner from "../../components/common/loading-spinner";

const CarsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    // Category-specific functions
    getCarsByCategory,
    getLuxuryCars,
    getSportsCars,
    getSUVCars,
    getSedanCars,
    getConvertibleCars,
    getCoupeCars,
    // Category-specific data
    luxuryCars,
    sportsCars,
    suvCars,
    sedanCars,
    convertibleCars,
    coupeCars,
    isCategoryLoading,
  } = useCars();

  const [localSearchQuery, setLocalSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [activeTab, setActiveTab] = useState(
    searchParams.get("category") || "all"
  );
  const [localFilters, setLocalFilters] = useState({
    brand: searchParams.get("brand") || "all",
    category: searchParams.get("category") || "all",
    transmission: "all",
    fuelType: "all",
    seats: "all",
    year: "all",
    sort: "newest",
  });
  const [viewMode, setViewMode] = useState("grid");
  const [retryCount, setRetryCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  // Enhanced debounce and rate limiting
  const debounceTimer = useRef(null);
  const lastApiCall = useRef(0);
  const requestQueue = useRef([]);
  const isProcessingQueue = useRef(false);
  const MIN_API_INTERVAL = 2000;
  const MAX_RETRIES = 3;

  // Get current category cars based on active tab
  const getCurrentCategoryCars = useCallback(() => {
    switch (activeTab) {
      case "luxury":
        return luxuryCars;
      case "sports":
        return sportsCars;
      case "suv":
        return suvCars;
      case "sedan":
        return sedanCars;
      case "convertible":
        return convertibleCars;
      case "coupe":
        return coupeCars;
      case "all":
      default:
        return cars;
    }
  }, [
    activeTab,
    cars,
    luxuryCars,
    sportsCars,
    suvCars,
    sedanCars,
    convertibleCars,
    coupeCars,
  ]);

  // Get filtered cars for display
  const filteredCars = getCurrentCategoryCars();

  // Car type categories with dynamic counts
  const carTypes = [
    {
      id: "all",
      name: "All Cars",
      icon: Car,
      description: "Browse our entire fleet",
      count: cars.length,
      color: "text-gray-400",
    },
    {
      id: "luxury",
      name: "Luxury",
      icon: Crown,
      description: "Premium sedans & executive cars",
      count: luxuryCars.length,
      color: "text-purple-400",
    },
    {
      id: "sports",
      name: "Sports",
      icon: Zap,
      description: "High-performance supercars",
      count: sportsCars.length,
      color: "text-red-400",
    },
    {
      id: "suv",
      name: "SUV",
      icon: Mountain,
      description: "Spacious utility vehicles",
      count: suvCars.length,
      color: "text-green-400",
    },
    {
      id: "sedan",
      name: "Sedan",
      icon: Users,
      description: "Comfortable family cars",
      count: sedanCars.length,
      color: "text-blue-400",
    },
    {
      id: "convertible",
      name: "Convertible",
      icon: Wind,
      description: "Open-top driving experience",
      count: convertibleCars.length,
      color: "text-cyan-400",
    },
    {
      id: "coupe",
      name: "Coupe",
      icon: Car,
      description: "Stylish 2-door vehicles",
      count: coupeCars.length,
      color: "text-orange-400",
    },
  ];

  // Enhanced queue processing system
  const processRequestQueue = useCallback(async () => {
    if (isProcessingQueue.current || requestQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;

    while (requestQueue.current.length > 0) {
      const { apiFunction, params, resolve, reject } =
        requestQueue.current.shift();

      try {
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCall.current;

        if (timeSinceLastCall < MIN_API_INTERVAL) {
          const delay = MIN_API_INTERVAL - timeSinceLastCall;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        lastApiCall.current = Date.now();
        const result = await apiFunction(
          ...(Array.isArray(params) ? params : [params])
        );
        setIsRateLimited(false);
        setRetryCount(0);
        resolve(result);
      } catch (error) {
        if (error.response?.status === 429) {
          const retryAfterSeconds =
            parseInt(error.response.headers["retry-after"]) || 5;
          setIsRateLimited(true);
          setRetryAfter(retryAfterSeconds);

          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              requestQueue.current.unshift({
                apiFunction,
                params,
                resolve,
                reject,
              });
              setRetryCount((prev) => prev + 1);
              processRequestQueue();
            }, retryAfterSeconds * 1000);
          } else {
            reject(new Error("Max retries exceeded"));
          }
        } else {
          reject(error);
        }
      }
    }

    isProcessingQueue.current = false;
  }, [retryCount]);

  // Enhanced API call function with queue
  const makeApiCall = useCallback(
    (apiFunction, params) => {
      return new Promise((resolve, reject) => {
        requestQueue.current = requestQueue.current.filter(
          (req) =>
            !(
              req.apiFunction === apiFunction &&
              JSON.stringify(req.params) === JSON.stringify(params)
            )
        );

        requestQueue.current.push({ apiFunction, params, resolve, reject });
        processRequestQueue();
      });
    },
    [processRequestQueue]
  );

  // Countdown timer for retry
  useEffect(() => {
    if (retryAfter > 0) {
      const timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [retryAfter]);

  // Initial load effect
  useEffect(() => {
    const brand = searchParams.get("brand");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const initialFilters = {
      brand: brand || "all",
      category: category || "all",
      transmission: "all",
      fuelType: "all",
      seats: "all",
      year: "all",
      sort: "newest",
    };

    setLocalFilters(initialFilters);
    setActiveTab(category || "all");
    setLocalSearchQuery(search || "");

    // Load initial data - always load all cars first
    const apiFilters = {
      page: 1,
      limit: 12,
      sort: "newest",
    };

    if (brand && brand !== "all") apiFilters.brand = brand;
    if (search) apiFilters.search = search;

    // Load all cars first
    makeApiCall(getAllCars, apiFilters);

    // Load all category data for counts
    makeApiCall(getLuxuryCars, {});
    makeApiCall(getSportsCars, {});
    makeApiCall(getSUVCars, {});
    makeApiCall(getSedanCars, {});
    makeApiCall(getConvertibleCars, {});
    makeApiCall(getCoupeCars, {});
  }, [
    getAllCars,
    getLuxuryCars,
    getSportsCars,
    getSUVCars,
    getSedanCars,
    getConvertibleCars,
    getCoupeCars,
    searchParams,
    makeApiCall,
  ]);

  const debouncedApiCall = useCallback(
    (apiFunction, params) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        makeApiCall(apiFunction, params);
      }, 1000);
    },
    [makeApiCall]
  );

  // Handle tab change with category-specific endpoints
  const handleTabChange = (tabValue) => {
    console.log("Tab changed to:", tabValue);

    setActiveTab(tabValue);
    const newFilters = { ...localFilters, category: tabValue };
    setLocalFilters(newFilters);

    const newSearchParams = new URLSearchParams(searchParams);
    if (tabValue === "all") {
      newSearchParams.delete("category");
    } else {
      newSearchParams.set("category", tabValue);
    }
    setSearchParams(newSearchParams);

    // Build API filters (excluding category since we use specific endpoints)
    const apiFilters = {
      search: localSearchQuery,
      page: 1,
      limit: 12,
      sort: newFilters.sort,
    };

    // Add other filters (excluding category)
    Object.keys(newFilters).forEach((key) => {
      if (
        newFilters[key] !== "all" &&
        newFilters[key] !== "" &&
        key !== "category" // Exclude category since we're using specific endpoint
      ) {
        apiFilters[key] = newFilters[key];
      }
    });

    // Use category-specific endpoints
    if (tabValue === "all") {
      console.log("Loading all cars with filters:", apiFilters);
      debouncedApiCall(getAllCars, apiFilters);
    } else {
      console.log(`Loading ${tabValue} cars with filters:`, apiFilters);

      // Map tab values to category functions
      const categoryFunctionMap = {
        luxury: getLuxuryCars,
        sports: getSportsCars,
        suv: getSUVCars,
        sedan: getSedanCars,
        convertible: getConvertibleCars,
        coupe: getCoupeCars,
      };

      const categoryFunction = categoryFunctionMap[tabValue];

      if (categoryFunction) {
        debouncedApiCall(categoryFunction, apiFilters);
      } else {
        // Fallback to generic category function
        debouncedApiCall(getCarsByCategory, [tabValue, apiFilters]);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (localSearchQuery.trim()) {
      newSearchParams.set("search", localSearchQuery);

      const apiFilters = { page: 1, limit: 12 };
      Object.keys(localFilters).forEach((key) => {
        if (
          localFilters[key] !== "all" &&
          localFilters[key] !== "" &&
          key !== "category"
        ) {
          apiFilters[key] = localFilters[key];
        }
      });

      makeApiCall(searchCars, [localSearchQuery, apiFilters]);
    } else {
      newSearchParams.delete("search");

      const apiFilters = { page: 1, limit: 12 };
      Object.keys(localFilters).forEach((key) => {
        if (
          localFilters[key] !== "all" &&
          localFilters[key] !== "" &&
          key !== "category"
        ) {
          apiFilters[key] = localFilters[key];
        }
      });

      if (activeTab === "all") {
        makeApiCall(getAllCars, apiFilters);
      } else {
        const categoryFunctionMap = {
          luxury: getLuxuryCars,
          sports: getSportsCars,
          suv: getSUVCars,
          sedan: getSedanCars,
          convertible: getConvertibleCars,
          coupe: getCoupeCars,
        };
        const categoryFunction = categoryFunctionMap[activeTab];
        if (categoryFunction) {
          makeApiCall(categoryFunction, apiFilters);
        }
      }
    }
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);

    const newSearchParams = new URLSearchParams(searchParams);
    if (value && value !== "all" && (key === "brand" || key === "category")) {
      newSearchParams.set(key, value);
    } else if (
      (value === "all" || !value) &&
      (key === "brand" || key === "category")
    ) {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);

    const apiFilters = {
      search: localSearchQuery,
      page: 1,
      limit: 12,
    };

    Object.keys(newFilters).forEach((filterKey) => {
      if (
        newFilters[filterKey] !== "all" &&
        newFilters[filterKey] !== "" &&
        filterKey !== "category"
      ) {
        apiFilters[filterKey] = newFilters[filterKey];
      }
    });

    if (activeTab === "all") {
      debouncedApiCall(filterAndSortCars, apiFilters);
    } else {
      const categoryFunctionMap = {
        luxury: getLuxuryCars,
        sports: getSportsCars,
        suv: getSUVCars,
        sedan: getSedanCars,
        convertible: getConvertibleCars,
        coupe: getCoupeCars,
      };
      const categoryFunction = categoryFunctionMap[activeTab];
      if (categoryFunction) {
        debouncedApiCall(categoryFunction, apiFilters);
      }
    }
  };

  const handleClearFilters = () => {
    const resetFilters = {
      brand: "all",
      category: "all",
      transmission: "all",
      fuelType: "all",
      seats: "all",
      year: "all",
      sort: "newest",
    };
    setLocalFilters(resetFilters);
    setLocalSearchQuery("");
    setActiveTab("all");
    setSearchParams({});
    clearFilters();
    makeApiCall(getAllCars, { page: 1, limit: 12, sort: "newest" });
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !isLoading) {
      makeApiCall(loadMoreCars, pagination.currentPage + 1);
    }
  };

  const handleRetry = () => {
    setIsRateLimited(false);
    setRetryCount(0);
    setRetryAfter(0);
    if (activeTab === "all") {
      makeApiCall(getAllCars, { page: 1, limit: 12, sort: "newest" });
    } else {
      const categoryFunctionMap = {
        luxury: getLuxuryCars,
        sports: getSportsCars,
        suv: getSUVCars,
        sedan: getSedanCars,
        convertible: getConvertibleCars,
        coupe: getCoupeCars,
      };
      const categoryFunction = categoryFunctionMap[activeTab];
      if (categoryFunction) {
        makeApiCall(categoryFunction, { page: 1, limit: 12, sort: "newest" });
      }
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Debug effect
  useEffect(() => {
    console.log("=== DEBUG INFO ===");
    console.log("Active Tab:", activeTab);
    console.log("All Cars Length:", cars.length);
    console.log("Sports Cars Length:", sportsCars.length);
    console.log("Filtered Cars Length:", filteredCars.length);
    console.log("Is Loading:", isLoading);
    console.log("Is Category Loading:", isCategoryLoading);
    console.log("Error:", error);
    console.log("Filtered Cars Data:", filteredCars);
    console.log("=================");
  }, [
    cars,
    sportsCars,
    filteredCars,
    activeTab,
    isLoading,
    isCategoryLoading,
    error,
  ]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 racing">
              Premium Car <span className="text-yellow-400">Collection</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 mont">
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
                    className="pl-10 h-12 text-base bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400"
                    disabled={isLoading || isRateLimited}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || isRateLimited}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black h-12 px-6 font-semibold disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Enhanced Rate Limit Warning */}
      {isRateLimited && (
        <div className="container mx-auto px-4 py-4">
          <Alert className="bg-yellow-900 border-yellow-600 text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Rate Limited - Too Many Requests</AlertTitle>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  Please wait before making another request.
                  {retryAfter > 0 && ` Retrying in ${retryAfter} seconds...`}
                </span>
                <Button
                  onClick={handleRetry}
                  size="sm"
                  variant="outline"
                  disabled={retryAfter > 0}
                  className="ml-4 border-yellow-600 text-yellow-200 hover:bg-yellow-800"
                >
                  {retryAfter > 0 ? `Wait ${retryAfter}s` : "Retry Now"}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Car Type Tabs */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-30 shadow-lg">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b-0">
              <div className="flex overflow-x-auto scrollbar-hide gap-1 py-4">
                {carTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    disabled={isLoading || isRateLimited || isCategoryLoading}
                    className={`
                      flex-shrink-0 flex flex-col items-center gap-2 px-6 py-4 rounded-lg border-2 transition-all duration-200 bg-gray-800
                      data-[state=active]:border-yellow-400 data-[state=active]:bg-yellow-900 data-[state=active]:text-yellow-200
                      hover:border-gray-500 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                      ${
                        activeTab === type.id
                          ? "border-yellow-400 bg-yellow-900 text-yellow-200"
                          : "border-gray-600 bg-gray-800 text-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <type.icon
                        className={`w-5 h-5 ${
                          activeTab === type.id ? "text-yellow-400" : type.color
                        }`}
                      />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{type.name}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          {type.description}
                        </div>
                      </div>
                      {type.count > 0 && (
                        <span
                          className={`
                          text-xs px-2 py-1 rounded-full font-medium
                          ${
                            activeTab === type.id
                              ? "bg-yellow-600 text-black"
                              : "bg-gray-600 text-gray-200"
                          }
                        `}
                        >
                          {type.count}
                        </span>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="lg:w-80 hidden lg:block">
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold racing text-white">
                  Filters
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  disabled={isLoading || isRateLimited}
                  className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Brand Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mont text-gray-200">
                    Brand
                  </Label>
                  <Select
                    value={localFilters.brand}
                    onValueChange={(value) =>
                      handleFilterChange("brand", value)
                    }
                    disabled={isLoading || isRateLimited}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400 disabled:opacity-50">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem
                        value="all"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        All Brands
                      </SelectItem>
                      {brands.map((brand) => (
                        <SelectItem
                          key={brand}
                          value={brand}
                          className="text-gray-200 focus:bg-gray-700"
                        >
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transmission */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mont text-gray-200">
                    Transmission
                  </Label>
                  <Select
                    value={localFilters.transmission}
                    onValueChange={(value) =>
                      handleFilterChange("transmission", value)
                    }
                    disabled={isLoading || isRateLimited}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400 disabled:opacity-50">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem
                        value="all"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        All
                      </SelectItem>
                      <SelectItem
                        value="Automatic"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        Automatic
                      </SelectItem>
                      <SelectItem
                        value="Manual"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        Manual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mont text-gray-200">
                    Fuel Type
                  </Label>
                  <Select
                    value={localFilters.fuelType}
                    onValueChange={(value) =>
                      handleFilterChange("fuelType", value)
                    }
                    disabled={isLoading || isRateLimited}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400 disabled:opacity-50">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem
                        value="all"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        All
                      </SelectItem>
                      <SelectItem
                        value="Petrol"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        Petrol
                      </SelectItem>
                      <SelectItem
                        value="Diesel"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        Diesel
                      </SelectItem>
                      <SelectItem
                        value="Electric"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        Electric
                      </SelectItem>
                      <SelectItem
                        value="Hybrid"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        Hybrid
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Seats */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mont text-gray-200">
                    Seats
                  </Label>
                  <Select
                    value={localFilters.seats}
                    onValueChange={(value) =>
                      handleFilterChange("seats", value)
                    }
                    disabled={isLoading || isRateLimited}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400 disabled:opacity-50">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem
                        value="all"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        All
                      </SelectItem>
                      <SelectItem
                        value="2"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        2 Seats
                      </SelectItem>
                      <SelectItem
                        value="4"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        4 Seats
                      </SelectItem>
                      <SelectItem
                        value="5"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        5 Seats
                      </SelectItem>
                      <SelectItem
                        value="7"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        7 Seats
                      </SelectItem>
                      <SelectItem
                        value="8"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        8 Seats
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <Label className="text-sm font-medium mb-2 block mont text-gray-200">
                    Year
                  </Label>
                  <Select
                    value={localFilters.year}
                    onValueChange={(value) => handleFilterChange("year", value)}
                    disabled={isLoading || isRateLimited}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-yellow-400 disabled:opacity-50">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem
                        value="all"
                        className="text-gray-200 focus:bg-gray-700"
                      >
                        All Years
                      </SelectItem>
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year.toString()}
                          className="text-gray-200 focus:bg-gray-700"
                        >
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
                <h2 className="text-xl font-semibold racing text-white">
                  {filteredCars.length}{" "}
                  {activeTab === "all"
                    ? "Cars"
                    : carTypes.find((t) => t.id === activeTab)?.name}{" "}
                  Found
                </h2>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden border-gray-600 text-gray-300 hover:bg-gray-700"
                      disabled={isLoading || isRateLimited}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-80 bg-gray-800 border-gray-700"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-white">Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <div className="space-y-6">
                        {/* Brand Filter for Mobile */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block text-gray-200">
                            Brand
                          </Label>
                          <Select
                            value={localFilters.brand}
                            onValueChange={(value) =>
                              handleFilterChange("brand", value)
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="All Brands" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem
                                value="all"
                                className="text-gray-200 focus:bg-gray-700"
                              >
                                All Brands
                              </SelectItem>
                              {brands.map((brand) => (
                                <SelectItem
                                  key={brand}
                                  value={brand}
                                  className="text-gray-200 focus:bg-gray-700"
                                >
                                  {brand}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Transmission for Mobile */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block text-gray-200">
                            Transmission
                          </Label>
                          <Select
                            value={localFilters.transmission}
                            onValueChange={(value) =>
                              handleFilterChange("transmission", value)
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem
                                value="all"
                                className="text-gray-200 focus:bg-gray-700"
                              >
                                All
                              </SelectItem>
                              <SelectItem
                                value="Automatic"
                                className="text-gray-200 focus:bg-gray-700"
                              >
                                Automatic
                              </SelectItem>
                              <SelectItem
                                value="Manual"
                                className="text-gray-200 focus:bg-gray-700"
                              >
                                Manual
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        onClick={handleClearFilters}
                        variant="outline"
                        className="w-full mt-6 border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select
                  value={localFilters.sort}
                  onValueChange={(value) => handleFilterChange("sort", value)}
                  disabled={isLoading || isRateLimited}
                >
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white disabled:opacity-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem
                      value="newest"
                      className="text-gray-200 focus:bg-gray-700"
                    >
                      Newest First
                    </SelectItem>
                    <SelectItem
                      value="oldest"
                      className="text-gray-200 focus:bg-gray-700"
                    >
                      Oldest First
                    </SelectItem>
                    <SelectItem
                      value="popular"
                      className="text-gray-200 focus:bg-gray-700"
                    >
                      Most Popular
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-gray-600 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    disabled={isLoading || isRateLimited}
                    className={`rounded-r-none ${
                      viewMode === "grid"
                        ? "bg-yellow-600 text-black"
                        : "text-gray-300 hover:bg-gray-700"
                    } disabled:opacity-50`}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    disabled={isLoading || isRateLimited}
                    className={`rounded-l-none ${
                      viewMode === "list"
                        ? "bg-yellow-600 text-black"
                        : "text-gray-300 hover:bg-gray-700"
                    } disabled:opacity-50`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Cars Grid/List */}
            {(isLoading || isCategoryLoading) && filteredCars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-yellow-400 mb-4" />
                <p className="text-gray-300">Loading cars...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 mb-4">{error}</p>
                <Button
                  onClick={handleRetry}
                  className="bg-yellow-600 hover:bg-yellow-700 text-black"
                  disabled={isRateLimited}
                >
                  {isRateLimited ? "Rate Limited" : "Try Again"}
                </Button>
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-gray-200">
                    No{" "}
                    {activeTab !== "all"
                      ? carTypes
                          .find((t) => t.id === activeTab)
                          ?.name.toLowerCase()
                      : ""}{" "}
                    cars found
                  </p>
                  <p className="text-sm mt-2 text-gray-400">
                    Try adjusting your filters or browse all cars
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Clear Filters
                  </Button>
                  {activeTab !== "all" && (
                    <Button
                      onClick={() => handleTabChange("all")}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black"
                    >
                      Browse All Cars
                    </Button>
                  )}
                </div>
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
                  {filteredCars.map((car) => (
                    <CarCard key={car._id} car={car} viewMode={viewMode} />
                  ))}
                </div>

                {/* Load More */}
                {pagination.hasNextPage && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoading || isRateLimited}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-3 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Cars"
                      )}
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
