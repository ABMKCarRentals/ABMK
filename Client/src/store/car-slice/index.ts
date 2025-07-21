import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";

// Configure axios instance with enhanced error handling
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PORT,
  timeout: 15000, // Increased timeout
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor with rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

apiClient.interceptors.request.use(
  async (config) => {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    lastRequestTime = Date.now();

    // Add timestamp to prevent caching issues
    if (config.url && !config.url.includes("?")) {
      config.url += `?_t=${Date.now()}`;
    } else if (config.url) {
      config.url += `&_t=${Date.now()}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/admin/login";
    } else if (error.response?.status === 429) {
      // Handle rate limiting
      const retryAfter = error.response.headers["retry-after"] || 5;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Retry the original request
          if (error.config) {
            apiClient.request(error.config).then(resolve).catch(reject);
          } else {
            reject(error);
          }
        }, parseInt(retryAfter) * 1000);
      });
    }
    return Promise.reject(error);
  }
);

// Types
interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  features: string[];
  specifications: {
    engine?: string;
    horsepower?: number;
    topSpeed?: number;
    acceleration?: string;
    mileage?: string;
    color?: string;
    interiorColor?: string;
  };
  location: string;
  description: string;
  slug: string;
  viewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

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

interface CarsResponse {
  success: boolean;
  data: Car[];
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  message?: string;
}

interface SingleCarResponse {
  success: boolean;
  data: Car | Car[];
  message?: string;
}

interface CarState {
  cars: Car[];
  totalCars: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;

  featuredCars: Car[];

  luxuryCars: Car[];
  sportsCars: Car[];
  suvCars: Car[];
  sedanCars: Car[];
  convertibleCars: Car[];
  coupeCars: Car[];

  carsByBrand: Car[];
  currentBrand: string | null;

  currentCar: Car | null;
  relatedCars: Car[];

  activeFilters: CleanFilterOptions;
  searchQuery: string;

  isLoading: boolean;
  isFeaturedLoading: boolean;
  isCategoryLoading: boolean;
  isBrandLoading: boolean;
  isCarLoading: boolean;
  isRelatedLoading: boolean;

  error: string | null;
  featuredError: string | null;
  categoryError: string | null;
  brandError: string | null;
  carError: string | null;
  relatedError: string | null;

  lastFetchTime: string | null;
  cacheExpiryTime: number;

  // Rate limiting state
  isRateLimited: boolean;
  retryAfter: number;
}

const initialState: CarState = {
  cars: [],
  totalCars: 0,
  currentPage: 1,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,

  featuredCars: [],

  luxuryCars: [],
  sportsCars: [],
  suvCars: [],
  sedanCars: [],
  convertibleCars: [],
  coupeCars: [],

  carsByBrand: [],
  currentBrand: null,

  currentCar: null,
  relatedCars: [],

  activeFilters: {},
  searchQuery: "",

  isLoading: false,
  isFeaturedLoading: false,
  isCategoryLoading: false,
  isBrandLoading: false,
  isCarLoading: false,
  isRelatedLoading: false,

  error: null,
  featuredError: null,
  categoryError: null,
  brandError: null,
  carError: null,
  relatedError: null,

  lastFetchTime: null,
  cacheExpiryTime: 5 * 60 * 1000,

  isRateLimited: false,
  retryAfter: 0,
};

// Utility function to clean filters and remove "all" values
const cleanFilters = (filters: FilterOptions): CleanFilterOptions => {
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
          const filtered = value.filter((v) => v && v !== "all" && v !== "");
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
};

const buildQueryString = (filters: CleanFilterOptions): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;

      if (status === 429) {
        return "Too many requests. Please wait a moment before trying again.";
      } else if (
        status === 400 &&
        message.includes("Valid car ID is required")
      ) {
        return "Invalid request parameters. Please try again.";
      } else if (status >= 500) {
        return "Server error. Please try again later.";
      }

      return `Error (${status}): ${message}`;
    } else if (error.request) {
      return "Network Error: Unable to connect to server. Please check your internet connection.";
    } else {
      return `Request Error: ${error.message}`;
    }
  }
  return error.message || "An unexpected error occurred";
};

// Async thunks with proper route handling
export const fetchAllCars = createAsyncThunk<CarsResponse, FilterOptions>(
  "cars/fetchAllCars",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const cleanedFilters = cleanFilters(filters);
      const queryString = buildQueryString(cleanedFilters);

      // Use base route instead of /all to avoid conflicts
      const url = queryString ? `/api/cars?${queryString}` : "/api/cars";

      const response = await apiClient.get<CarsResponse>(url);

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to fetch cars");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchFeaturedCars = createAsyncThunk<Car[], { limit?: number }>(
  "cars/fetchFeaturedCars",
  async ({ limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<SingleCarResponse>(
        `/api/cars/featured?limit=${limit}`
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch featured cars"
        );
      }

      return Array.isArray(response.data.data)
        ? response.data.data
        : ([response.data.data] as Car[]);
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCarsByCategory = createAsyncThunk<
  { cars: Car[]; category: string },
  { category: string; filters?: FilterOptions }
>(
  "cars/fetchCarsByCategory",
  async ({ category, filters = {} }, { rejectWithValue }) => {
    try {
      if (!category || category === "all") {
        // If category is "all", fetch all cars instead
        const cleanedFilters = cleanFilters(filters);
        const response = await apiClient.get<CarsResponse>(
          `/api/cars?${buildQueryString(cleanedFilters)}`
        );
        if (response.data.success) {
          return { cars: response.data.data, category: "all" };
        } else {
          return rejectWithValue("Failed to fetch all cars");
        }
      }

      const cleanedFilters = cleanFilters(filters);
      const queryString = buildQueryString(cleanedFilters);

      // Use the direct category routes (without /category/ prefix)
      const url = queryString
        ? `/api/cars/${category.toLowerCase()}?${queryString}`
        : `/api/cars/${category.toLowerCase()}`;

      const response = await apiClient.get<SingleCarResponse>(url);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch cars by category"
        );
      }

      const cars = Array.isArray(response.data.data)
        ? response.data.data
        : ([response.data.data] as Car[]);
      return { cars, category };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCarsByBrand = createAsyncThunk<
  { cars: Car[]; brand: string },
  { brand: string; filters?: FilterOptions }
>(
  "cars/fetchCarsByBrand",
  async ({ brand, filters = {} }, { rejectWithValue }) => {
    try {
      if (!brand || brand === "all") {
        // If brand is "all", fetch all cars instead
        const cleanedFilters = cleanFilters(filters);
        const response = await apiClient.get<CarsResponse>(
          `/api/cars?${buildQueryString(cleanedFilters)}`
        );
        if (response.data.success) {
          return { cars: response.data.data, brand: "all" };
        } else {
          return rejectWithValue("Failed to fetch all cars");
        }
      }

      const cleanedFilters = cleanFilters(filters);
      const queryString = buildQueryString(cleanedFilters);
      const url = queryString
        ? `/api/cars/brand/${encodeURIComponent(brand)}?${queryString}`
        : `/api/cars/brand/${encodeURIComponent(brand)}`;

      const response = await apiClient.get<SingleCarResponse>(url);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch cars by brand"
        );
      }

      const cars = Array.isArray(response.data.data)
        ? response.data.data
        : ([response.data.data] as Car[]);
      return { cars, brand };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCarById = createAsyncThunk<Car, string>(
  "cars/fetchCarById",
  async (carId, { rejectWithValue }) => {
    try {
      // Validate carId
      if (
        !carId ||
        carId === "all" ||
        carId === "undefined" ||
        carId === "null"
      ) {
        return rejectWithValue("Invalid car ID provided");
      }

      const response = await apiClient.get<SingleCarResponse>(
        `/api/cars/${encodeURIComponent(carId)}`
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Car not found");
      }

      return Array.isArray(response.data.data)
        ? response.data.data[0]
        : (response.data.data as Car);
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchRelatedCars = createAsyncThunk<
  Car[],
  { carId: string; limit?: number }
>(
  "cars/fetchRelatedCars",
  async ({ carId, limit = 4 }, { rejectWithValue }) => {
    try {
      // Validate carId
      if (
        !carId ||
        carId === "all" ||
        carId === "undefined" ||
        carId === "null"
      ) {
        return rejectWithValue("Invalid car ID for related cars");
      }

      const response = await apiClient.get<SingleCarResponse>(
        `/api/cars/${encodeURIComponent(carId)}/related?limit=${limit}`
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch related cars"
        );
      }

      return Array.isArray(response.data.data)
        ? response.data.data
        : ([response.data.data] as Car[]);
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const incrementCarViewCount = createAsyncThunk<
  { carId: string; newViewCount: number },
  string
>("cars/incrementViewCount", async (carId, { rejectWithValue }) => {
  try {
    // Validate carId
    if (
      !carId ||
      carId === "all" ||
      carId === "undefined" ||
      carId === "null"
    ) {
      return rejectWithValue("Invalid car ID for view count increment");
    }

    const response = await apiClient.post<{
      success: boolean;
      data: { viewCount: number };
    }>(`/api/cars/${encodeURIComponent(carId)}/increment-view`);

    if (!response.data.success) {
      return rejectWithValue("Failed to update view count");
    }

    return { carId, newViewCount: response.data.data.viewCount };
  } catch (error: any) {
    // Don't show error for view count failures
    console.warn("View count update failed:", error);
    return rejectWithValue("View count update failed");
  }
});

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.isRateLimited = false;
      state.retryAfter = 0;
    },

    clearFeaturedError: (state) => {
      state.featuredError = null;
    },

    clearCategoryError: (state) => {
      state.categoryError = null;
    },

    clearBrandError: (state) => {
      state.brandError = null;
    },

    clearCarError: (state) => {
      state.carError = null;
    },

    clearRelatedError: (state) => {
      state.relatedError = null;
    },

    clearAllErrors: (state) => {
      state.error = null;
      state.featuredError = null;
      state.categoryError = null;
      state.brandError = null;
      state.carError = null;
      state.relatedError = null;
      state.isRateLimited = false;
      state.retryAfter = 0;
    },

    setActiveFilters: (state, action: PayloadAction<FilterOptions>) => {
      const cleanedFilters = cleanFilters(action.payload);
      state.activeFilters = { ...state.activeFilters, ...cleanedFilters };
    },

    clearActiveFilters: (state) => {
      state.activeFilters = {};
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      const query = action.payload;
      if (query && query !== "all") {
        state.searchQuery = query.trim();
      } else {
        state.searchQuery = "";
      }
    },

    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },

    clearCurrentCar: (state) => {
      state.currentCar = null;
      state.relatedCars = [];
    },

    clearCarsByBrand: (state) => {
      state.carsByBrand = [];
      state.currentBrand = null;
    },

    incrementViewCountLocal: (state, action: PayloadAction<string>) => {
      const carId = action.payload;

      // Validate carId
      if (
        !carId ||
        carId === "all" ||
        carId === "undefined" ||
        carId === "null"
      ) {
        return;
      }

      if (state.currentCar && state.currentCar._id === carId) {
        state.currentCar.viewCount += 1;
      }

      const carIndex = state.cars.findIndex((car) => car._id === carId);
      if (carIndex !== -1) {
        state.cars[carIndex].viewCount += 1;
      }

      const featuredIndex = state.featuredCars.findIndex(
        (car) => car._id === carId
      );
      if (featuredIndex !== -1) {
        state.featuredCars[featuredIndex].viewCount += 1;
      }
    },

    validateCache: (state) => {
      if (state.lastFetchTime) {
        const now = new Date().getTime();
        const lastFetch = new Date(state.lastFetchTime).getTime();
        const isExpired = now - lastFetch > state.cacheExpiryTime;

        if (isExpired) {
          state.cars = [];
          state.featuredCars = [];
          state.lastFetchTime = null;
        }
      }
    },

    setRateLimited: (
      state,
      action: PayloadAction<{ isLimited: boolean; retryAfter?: number }>
    ) => {
      state.isRateLimited = action.payload.isLimited;
      state.retryAfter = action.payload.retryAfter || 0;
    },

    resetCarState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllCars
      .addCase(fetchAllCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isRateLimited = false;
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload.data;
        state.totalCars = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPrevPage = action.payload.hasPrevPage;
        state.lastFetchTime = new Date().toISOString();
        state.error = null;
        state.isRateLimited = false;
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.isLoading = false;
        const errorMessage = action.payload as string;
        state.error = errorMessage;

        if (errorMessage.includes("Too many requests")) {
          state.isRateLimited = true;
          state.retryAfter = 5;
        }
      })

      // fetchFeaturedCars
      .addCase(fetchFeaturedCars.pending, (state) => {
        state.isFeaturedLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedCars.fulfilled, (state, action) => {
        state.isFeaturedLoading = false;
        state.featuredCars = action.payload;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedCars.rejected, (state, action) => {
        state.isFeaturedLoading = false;
        state.featuredError = action.payload as string;
      })

      // fetchCarsByCategory
      .addCase(fetchCarsByCategory.pending, (state) => {
        state.isCategoryLoading = true;
        state.categoryError = null;
      })
      .addCase(fetchCarsByCategory.fulfilled, (state, action) => {
        state.isCategoryLoading = false;
        const { cars, category } = action.payload;

        switch (category.toLowerCase()) {
          case "luxury":
            state.luxuryCars = cars;
            break;
          case "sports":
            state.sportsCars = cars;
            break;
          case "suv":
            state.suvCars = cars;
            break;
          case "sedan":
            state.sedanCars = cars;
            break;
          case "convertible":
            state.convertibleCars = cars;
            break;
          case "coupe":
            state.coupeCars = cars;
            break;
          case "all":
            // If fetching all cars, update the main cars array
            state.cars = cars;
            break;
        }

        state.categoryError = null;
      })
      .addCase(fetchCarsByCategory.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryError = action.payload as string;
      })

      // fetchCarsByBrand
      .addCase(fetchCarsByBrand.pending, (state) => {
        state.isBrandLoading = true;
        state.brandError = null;
      })
      .addCase(fetchCarsByBrand.fulfilled, (state, action) => {
        state.isBrandLoading = false;
        state.carsByBrand = action.payload.cars;
        state.currentBrand = action.payload.brand;
        state.brandError = null;
      })
      .addCase(fetchCarsByBrand.rejected, (state, action) => {
        state.isBrandLoading = false;
        state.brandError = action.payload as string;
      })

      // fetchCarById
      .addCase(fetchCarById.pending, (state) => {
        state.isCarLoading = true;
        state.carError = null;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.isCarLoading = false;
        state.currentCar = action.payload;
        state.carError = null;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.isCarLoading = false;
        state.carError = action.payload as string;
        state.currentCar = null;
      })

      // fetchRelatedCars
      .addCase(fetchRelatedCars.pending, (state) => {
        state.isRelatedLoading = true;
        state.relatedError = null;
      })
      .addCase(fetchRelatedCars.fulfilled, (state, action) => {
        state.isRelatedLoading = false;
        state.relatedCars = action.payload;
        state.relatedError = null;
      })
      .addCase(fetchRelatedCars.rejected, (state, action) => {
        state.isRelatedLoading = false;
        state.relatedError = action.payload as string;
      })

      // incrementCarViewCount
      .addCase(incrementCarViewCount.fulfilled, (state, action) => {
        const { carId, newViewCount } = action.payload;

        if (state.currentCar && state.currentCar._id === carId) {
          state.currentCar.viewCount = newViewCount;
        }

        const carIndex = state.cars.findIndex((car) => car._id === carId);
        if (carIndex !== -1) {
          state.cars[carIndex].viewCount = newViewCount;
        }

        const featuredIndex = state.featuredCars.findIndex(
          (car) => car._id === carId
        );
        if (featuredIndex !== -1) {
          state.featuredCars[featuredIndex].viewCount = newViewCount;
        }
      })
      .addCase(incrementCarViewCount.rejected, (state, action) => {
        // Silently handle view count errors
        console.warn("View count increment failed:", action.payload);
      });
  },
});

export const {
  clearError,
  clearFeaturedError,
  clearCategoryError,
  clearBrandError,
  clearCarError,
  clearRelatedError,
  clearAllErrors,
  setActiveFilters,
  clearActiveFilters,
  setSearchQuery,
  clearSearchQuery,
  clearCurrentCar,
  clearCarsByBrand,
  incrementViewCountLocal,
  validateCache,
  setRateLimited,
  resetCarState,
} = carSlice.actions;

// Selectors
export const selectCarState = (state: { car: CarState }) => state.car;
export const selectCars = (state: { car: CarState }) => state.car.cars;
export const selectFeaturedCars = (state: { car: CarState }) =>
  state.car.featuredCars;
export const selectCurrentCar = (state: { car: CarState }) =>
  state.car.currentCar;
export const selectRelatedCars = (state: { car: CarState }) =>
  state.car.relatedCars;
export const selectCarsByBrand = (state: { car: CarState }) =>
  state.car.carsByBrand;
export const selectCurrentBrand = (state: { car: CarState }) =>
  state.car.currentBrand;

// Category selectors
export const selectLuxuryCars = (state: { car: CarState }) =>
  state.car.luxuryCars;
export const selectSportsCars = (state: { car: CarState }) =>
  state.car.sportsCars;
export const selectSUVCars = (state: { car: CarState }) => state.car.suvCars;
export const selectSedanCars = (state: { car: CarState }) =>
  state.car.sedanCars;
export const selectConvertibleCars = (state: { car: CarState }) =>
  state.car.convertibleCars;
export const selectCoupeCars = (state: { car: CarState }) =>
  state.car.coupeCars;

// Loading selectors
export const selectIsLoading = (state: { car: CarState }) =>
  state.car.isLoading;
export const selectIsFeaturedLoading = (state: { car: CarState }) =>
  state.car.isFeaturedLoading;
export const selectIsCategoryLoading = (state: { car: CarState }) =>
  state.car.isCategoryLoading;
export const selectIsBrandLoading = (state: { car: CarState }) =>
  state.car.isBrandLoading;
export const selectIsCarLoading = (state: { car: CarState }) =>
  state.car.isCarLoading;
export const selectIsRelatedLoading = (state: { car: CarState }) =>
  state.car.isRelatedLoading;

// Error selectors
export const selectError = (state: { car: CarState }) => state.car.error;
export const selectFeaturedError = (state: { car: CarState }) =>
  state.car.featuredError;
export const selectCategoryError = (state: { car: CarState }) =>
  state.car.categoryError;
export const selectBrandError = (state: { car: CarState }) =>
  state.car.brandError;
export const selectCarError = (state: { car: CarState }) => state.car.carError;
export const selectRelatedError = (state: { car: CarState }) =>
  state.car.relatedError;

// Rate limiting selectors
export const selectIsRateLimited = (state: { car: CarState }) =>
  state.car.isRateLimited;
export const selectRetryAfter = (state: { car: CarState }) =>
  state.car.retryAfter;

// Filter selectors
export const selectActiveFilters = (state: { car: CarState }) =>
  state.car.activeFilters;
export const selectSearchQuery = (state: { car: CarState }) =>
  state.car.searchQuery;

// Pagination selectors
export const selectPagination = (state: { car: CarState }) => ({
  currentPage: state.car.currentPage,
  totalPages: state.car.totalPages,
  totalCars: state.car.totalCars,
  hasNextPage: state.car.hasNextPage,
  hasPrevPage: state.car.hasPrevPage,
});

// Cache selectors
export const selectCacheInfo = (state: { car: CarState }) => ({
  lastFetchTime: state.car.lastFetchTime,
  cacheExpiryTime: state.car.cacheExpiryTime,
  isExpired: state.car.lastFetchTime
    ? new Date().getTime() - new Date(state.car.lastFetchTime).getTime() >
      state.car.cacheExpiryTime
    : true,
});

export default carSlice.reducer;
export { apiClient, cleanFilters };
