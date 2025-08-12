import { useEffect, useCallback, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  fetchAllCars,
  fetchFeaturedCars,
  fetchCarsByCategory,
  fetchCarsByBrand,
  fetchCarById,
  fetchRelatedCars,
  incrementCarViewCount,
  setActiveFilters,
  clearActiveFilters,
  setSearchQuery,
  clearSearchQuery,
  clearCurrentCar,
  clearCarsByBrand,
  incrementViewCountLocal,
  validateCache,
  clearAllErrors,
  selectCarState,
  selectCars,
  selectFeaturedCars,
  selectCurrentCar,
  selectRelatedCars,
  selectCarsByBrand,
  selectCurrentBrand,
  selectLuxuryCars,
  selectSportsCars,
  selectSUVCars,
  selectSedanCars,
  selectConvertibleCars,
  selectCoupeCars,
  selectIsLoading,
  selectIsFeaturedLoading,
  selectIsCategoryLoading,
  selectIsBrandLoading,
  selectIsCarLoading,
  selectIsRelatedLoading,
  selectError,
  selectFeaturedError,
  selectCategoryError,
  selectBrandError,
  selectCarError,
  selectRelatedError,
  selectActiveFilters,
  selectSearchQuery,
  selectPagination,
  selectCacheInfo,
} from "../store/car-slice";

interface FilterOptions {
  search?: string;
  brand?: string | string[];
  category?: string | string[];
  transmission?: string | string[];
  fuelType?: string | string[];
  seats?: number | number[] | string;
  year?: number | number[] | string;
  priceMin?: number | string;
  priceMax?: number | string;
  sort?: string;
  page?: number | string;
  limit?: number | string;
}

interface CleanFilterOptions {
  search?: string;
  brand?: string;
  category?: string;
  transmission?: string;
  fuelType?: string;
  seats?: string;
  year?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

interface RequestQueueItem {
  apiFunction: any;
  params: any;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timestamp: number;
}

export const useCars = () => {
  const dispatch = useAppDispatch();

  // Redux state selectors
  const carState = useAppSelector(selectCarState);
  const cars = useAppSelector(selectCars);
  const featuredCars = useAppSelector(selectFeaturedCars);
  const currentCar = useAppSelector(selectCurrentCar);
  const relatedCars = useAppSelector(selectRelatedCars);
  const carsByBrand = useAppSelector(selectCarsByBrand);
  const currentBrand = useAppSelector(selectCurrentBrand);

  const luxuryCars = useAppSelector(selectLuxuryCars);
  const sportsCars = useAppSelector(selectSportsCars);
  const suvCars = useAppSelector(selectSUVCars);
  const sedanCars = useAppSelector(selectSedanCars);
  const convertibleCars = useAppSelector(selectConvertibleCars);
  const coupeCars = useAppSelector(selectCoupeCars);

  const isLoading = useAppSelector(selectIsLoading);
  const isFeaturedLoading = useAppSelector(selectIsFeaturedLoading);
  const isCategoryLoading = useAppSelector(selectIsCategoryLoading);
  const isBrandLoading = useAppSelector(selectIsBrandLoading);
  const isCarLoading = useAppSelector(selectIsCarLoading);
  const isRelatedLoading = useAppSelector(selectIsRelatedLoading);

  const error = useAppSelector(selectError);
  const featuredError = useAppSelector(selectFeaturedError);
  const categoryError = useAppSelector(selectCategoryError);
  const brandError = useAppSelector(selectBrandError);
  const carError = useAppSelector(selectCarError);
  const relatedError = useAppSelector(selectRelatedError);

  const activeFilters = useAppSelector(selectActiveFilters);
  const searchQuery = useAppSelector(selectSearchQuery);
  const pagination = useAppSelector(selectPagination);
  const cacheInfo = useAppSelector(selectCacheInfo);

  // Rate limiting state
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Rate limiting refs
  const lastApiCall = useRef(0);
  const requestQueue = useRef<RequestQueueItem[]>([]);
  const isProcessingQueue = useRef(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // FIXED: Track featured cars loading to prevent infinite loops
  const featuredCarsInitialized = useRef(false);

  // Rate limiting constants
  const MIN_API_INTERVAL = 2000; // 2 seconds between API calls
  const MAX_RETRIES = 3;
  const DEBOUNCE_DELAY = 1000; // 1 second debounce

  // Utility function to clean filters and remove "all" values
  const cleanFilters = useCallback(
    (filters: FilterOptions): CleanFilterOptions => {
      const cleanedFilters: CleanFilterOptions = {};

      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof FilterOptions];

        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all"
        ) {
          return;
        }

        switch (key) {
          case "search":
            if (
              typeof value === "string" &&
              value.trim() !== "" &&
              value !== "all"
            ) {
              cleanedFilters.search = value.trim();
            }
            break;

          case "brand":
          case "category":
          case "transmission":
          case "fuelType":
            if (Array.isArray(value)) {
              const filtered = value.filter(
                (v) => v && v !== "all" && v !== ""
              );
              if (filtered.length > 0) {
                cleanedFilters[key] = filtered.join(",");
              }
            } else if (
              typeof value === "string" &&
              value !== "all" &&
              value !== ""
            ) {
              cleanedFilters[key] = value;
            }
            break;

          case "seats":
          case "year":
            if (Array.isArray(value)) {
              const filtered = value.filter(
                (v) => v !== null && v !== undefined && v !== "all"
              );
              if (filtered.length > 0) {
                cleanedFilters[key] = filtered.join(",");
              }
            } else if (typeof value === "number" && value > 0) {
              cleanedFilters[key] = value.toString();
            } else if (
              typeof value === "string" &&
              value !== "all" &&
              value !== "" &&
              !isNaN(Number(value))
            ) {
              cleanedFilters[key] = value;
            }
            break;

          case "priceMin":
          case "priceMax":
            if (typeof value === "number" && value > 0) {
              cleanedFilters[key] = value;
            } else if (
              typeof value === "string" &&
              value !== "" &&
              !isNaN(Number(value))
            ) {
              const numValue = Number(value);
              if (numValue > 0) {
                cleanedFilters[key] = numValue;
              }
            }
            break;

          case "page":
          case "limit":
            if (typeof value === "number" && value > 0) {
              cleanedFilters[key] = value;
            } else if (typeof value === "string" && !isNaN(Number(value))) {
              const numValue = Number(value);
              if (numValue > 0) {
                cleanedFilters[key] = numValue;
              }
            }
            break;

          case "sort":
            if (typeof value === "string" && value !== "all" && value !== "") {
              cleanedFilters.sort = value;
            }
            break;

          default:
            break;
        }
      });

      return cleanedFilters;
    },
    []
  );

  // Enhanced queue processing system
  const processRequestQueue = useCallback(async () => {
    if (isProcessingQueue.current || requestQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;

    while (requestQueue.current.length > 0) {
      const queueItem = requestQueue.current.shift();
      if (!queueItem) continue;

      const { apiFunction, params, resolve, reject, timestamp } = queueItem;

      // Check if request is too old (more than 30 seconds)
      if (Date.now() - timestamp > 30000) {
        reject(new Error("Request timeout"));
        continue;
      }

      try {
        const now = Date.now();
        const timeSinceLastCall = now - lastApiCall.current;

        if (timeSinceLastCall < MIN_API_INTERVAL) {
          const delay = MIN_API_INTERVAL - timeSinceLastCall;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        lastApiCall.current = Date.now();
        const result = await dispatch(apiFunction(params)).unwrap();
        setIsRateLimited(false);
        setRetryCount(0);
        resolve(result);
      } catch (error: any) {
        console.error("API call error:", error);

        if (
          error?.status === 429 ||
          error?.message?.includes("429") ||
          error?.message?.includes("Too many requests")
        ) {
          const retryAfterSeconds = error?.retryAfter || 5;
          setIsRateLimited(true);
          setRetryAfter(retryAfterSeconds);

          if (retryCount < MAX_RETRIES) {
            setTimeout(() => {
              requestQueue.current.unshift({
                apiFunction,
                params,
                resolve,
                reject,
                timestamp: Date.now(),
              });
              setRetryCount((prev) => prev + 1);
              processRequestQueue();
            }, retryAfterSeconds * 1000);
          } else {
            reject(new Error("Maximum retries exceeded due to rate limiting"));
          }
        } else {
          reject(error);
        }
      }

      // Small delay between successful requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    isProcessingQueue.current = false;
  }, [dispatch, retryCount]);

  // Enhanced API call function with queue
  const makeApiCall = useCallback(
    (apiFunction: any, params: any) => {
      return new Promise((resolve, reject) => {
        // Remove duplicate requests from queue
        requestQueue.current = requestQueue.current.filter(
          (req) =>
            !(
              JSON.stringify(req.params) === JSON.stringify(params) &&
              req.apiFunction === apiFunction
            )
        );

        requestQueue.current.push({
          apiFunction,
          params,
          resolve,
          reject,
          timestamp: Date.now(),
        });

        processRequestQueue();
      });
    },
    [processRequestQueue]
  );

  // Debounced API call function
  const debouncedApiCall = useCallback(
    (apiFunction: any, params: any) => {
      return new Promise((resolve, reject) => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
          makeApiCall(apiFunction, params).then(resolve).catch(reject);
        }, DEBOUNCE_DELAY);
      });
    },
    [makeApiCall]
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

  // Cache validation - FIXED: Only run once
  useEffect(() => {
    dispatch(validateCache());
  }, [dispatch]);

  // STABLE API FUNCTIONS - These won't change reference unless their actual dependencies change
  const getAllCars = useCallback(
    (filters: FilterOptions = {}) => {
      const cleanedFilters = cleanFilters(filters);
      return makeApiCall(fetchAllCars, cleanedFilters);
    },
    [makeApiCall, cleanFilters]
  );

  const getFeaturedCarsStable = useCallback(
    (limit: number = 6) => {
      return makeApiCall(fetchFeaturedCars, { limit });
    },
    [makeApiCall]
  );

  const getCarsByCategory = useCallback(
    (category: string, filters: FilterOptions = {}) => {
      if (!category || category === "all") {
        return getAllCars(filters);
      }
      const cleanedFilters = cleanFilters(filters);
      return makeApiCall(fetchCarsByCategory, {
        category,
        filters: cleanedFilters,
      });
    },
    [makeApiCall, cleanFilters, getAllCars]
  );

  const getCarsByBrand = useCallback(
    (brand: string, filters: FilterOptions = {}) => {
      if (!brand || brand === "all") {
        return getAllCars(filters);
      }
      const cleanedFilters = cleanFilters(filters);
      return makeApiCall(fetchCarsByBrand, { brand, filters: cleanedFilters });
    },
    [makeApiCall, cleanFilters, getAllCars]
  );

  const getCarById = useCallback(
    (carId: string) => {
      if (
        !carId ||
        carId === "all" ||
        carId === "undefined" ||
        carId === "null"
      ) {
        return Promise.reject(new Error("Invalid car ID"));
      }
      return makeApiCall(fetchCarById, carId);
    },
    [makeApiCall]
  );

  const getRelatedCars = useCallback(
    (carId: string, limit: number = 4) => {
      if (
        !carId ||
        carId === "all" ||
        carId === "undefined" ||
        carId === "null"
      ) {
        return Promise.reject(new Error("Invalid car ID for related cars"));
      }
      return makeApiCall(fetchRelatedCars, { carId, limit });
    },
    [makeApiCall]
  );

  // Search and filter functions with debouncing
  const searchCars = useCallback(
    (query: string, filters: FilterOptions = {}) => {
      if (!query || query.trim() === "" || query === "all") {
        return getAllCars(filters);
      }

      const searchFilters = { ...filters, search: query.trim() };
      const cleanedFilters = cleanFilters(searchFilters);
      dispatch(setSearchQuery(query.trim()));
      return debouncedApiCall(fetchAllCars, cleanedFilters);
    },
    [getAllCars, cleanFilters, debouncedApiCall, dispatch]
  );

  const filterAndSortCars = useCallback(
    (filters: FilterOptions) => {
      const cleanedFilters = cleanFilters(filters);
      dispatch(setActiveFilters(cleanedFilters));
      return debouncedApiCall(fetchAllCars, cleanedFilters);
    },
    [cleanFilters, debouncedApiCall, dispatch]
  );

  const loadMoreCars = useCallback(
    (page: number) => {
      if (page < 1) return Promise.reject(new Error("Invalid page number"));

      const filters = { ...activeFilters, page };
      const cleanedFilters = cleanFilters(filters);
      return makeApiCall(fetchAllCars, cleanedFilters);
    },
    [makeApiCall, activeFilters, cleanFilters]
  );

  // Category-specific functions - STABLE REFERENCES
  const getLuxuryCars = useCallback(
    (filters: FilterOptions = {}) => {
      return getCarsByCategory("Luxury", filters);
    },
    [getCarsByCategory]
  );

  const getSportsCars = useCallback(
    (filters: FilterOptions = {}) => {
      return getCarsByCategory("Sports", filters);
    },
    [getCarsByCategory]
  );

  const getSUVCars = useCallback(
    (filters: FilterOptions = {}) => {
      return getCarsByCategory("SUV", filters);
    },
    [getCarsByCategory]
  );

  const getSedanCars = useCallback(
    (filters: FilterOptions = {}) => {
      return getCarsByCategory("Sedan", filters);
    },
    [getCarsByCategory]
  );

  const getConvertibleCars = useCallback(
    (filters: FilterOptions = {}) => {
      return getCarsByCategory("Convertible", filters);
    },
    [getCarsByCategory]
  );

  const getCoupeCars = useCallback(
    (filters: FilterOptions = {}) => {
      return getCarsByCategory("Coupe", filters);
    },
    [getCarsByCategory]
  );

  // Utility functions
  const incrementCarViewCountSafe = useCallback(
    (carId: string) => {
      if (
        !carId ||
        carId === "all" ||
        carId === "undefined" ||
        carId === "null"
      ) {
        return;
      }
      dispatch(incrementViewCountLocal(carId));
      makeApiCall(incrementCarViewCount, carId).catch((error) => {
        console.warn("Failed to increment view count:", error);
      });
    },
    [dispatch, makeApiCall]
  );

  const updateFilters = useCallback(
    (filters: FilterOptions) => {
      const cleanedFilters = cleanFilters(filters);
      dispatch(setActiveFilters(cleanedFilters));
    },
    [dispatch, cleanFilters]
  );

  const clearFilters = useCallback(() => {
    dispatch(clearActiveFilters());
  }, [dispatch]);

  const updateSearchQuery = useCallback(
    (query: string) => {
      if (query && query !== "all") {
        dispatch(setSearchQuery(query.trim()));
      } else {
        dispatch(clearSearchQuery());
      }
    },
    [dispatch]
  );

  const clearSearch = useCallback(() => {
    dispatch(clearSearchQuery());
  }, [dispatch]);

  const clearCar = useCallback(() => {
    dispatch(clearCurrentCar());
  }, [dispatch]);

  const clearBrandCars = useCallback(() => {
    dispatch(clearCarsByBrand());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearAllErrors());
    setIsRateLimited(false);
    setRetryAfter(0);
    setRetryCount(0);
  }, [dispatch]);

  const retryLastRequest = useCallback(() => {
    setIsRateLimited(false);
    setRetryAfter(0);
    setRetryCount(0);
    processRequestQueue();
  }, [processRequestQueue]);

  // FIXED: Auto-load featured cars - Only load once and prevent infinite loops
  useEffect(() => {
    if (
      !featuredCarsInitialized.current &&
      featuredCars.length === 0 &&
      !isFeaturedLoading &&
      !featuredError
    ) {
      featuredCarsInitialized.current = true;
      getFeaturedCarsStable().catch((error) => {
        console.warn("Failed to load featured cars:", error);
        featuredCarsInitialized.current = false; // Reset on error so it can retry
      });
    }
  }, [featuredCars.length, isFeaturedLoading, featuredError]); // Remove getFeaturedCars from deps

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      requestQueue.current = [];
      isProcessingQueue.current = false;
    };
  }, []);

  return {
    // State
    carState,
    cars,
    featuredCars,
    currentCar,
    relatedCars,
    carsByBrand,
    currentBrand,
    luxuryCars,
    sportsCars,
    suvCars,
    sedanCars,
    convertibleCars,
    coupeCars,

    // Loading states
    isLoading,
    isFeaturedLoading,
    isCategoryLoading,
    isBrandLoading,
    isCarLoading,
    isRelatedLoading,

    // Rate limiting state
    isRateLimited,
    retryAfter,
    retryCount,

    // Errors
    error,
    featuredError,
    categoryError,
    brandError,
    carError,
    relatedError,

    // Filters and pagination
    activeFilters,
    searchQuery,
    pagination,
    cacheInfo,

    // Main API functions - THESE NAMES EXPORTED ARE STABLE
    getAllCars,
    getFeaturedCars: getFeaturedCarsStable, // Export the stable version
    getCarsByCategory,
    getCarsByBrand,
    getCarById,
    getRelatedCars,

    // Category functions
    getLuxuryCars,
    getSportsCars,
    getSUVCars,
    getSedanCars,
    getConvertibleCars,
    getCoupeCars,

    // Search and filtering
    searchCars,
    filterAndSortCars,
    loadMoreCars,
    updateFilters,
    clearFilters,
    updateSearchQuery,
    clearSearch,

    // Utility functions
    clearCar,
    clearBrandCars,
    incrementCarViewCount: incrementCarViewCountSafe,
    clearErrors,
    retryLastRequest,

    // Helper functions
    cleanFilters,
  };
};
