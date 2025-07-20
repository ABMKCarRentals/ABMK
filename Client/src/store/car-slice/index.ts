import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosResponse } from "axios";

// Configure axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_PORT,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/admin/login";
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
  brand?: string[];
  category?: string[];
  transmission?: string[];
  fuelType?: string[];
  seats?: number[];
  year?: number[];
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
}

interface SingleCarResponse {
  success: boolean;
  data: Car;
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

  activeFilters: FilterOptions;
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
};

const buildQueryString = (filters: FilterOptions): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.append(key, value.join(","));
        }
      } else {
        params.append(key, value.toString());
      }
    }
  });

  return params.toString();
};

const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      return `Server Error (${error.response.status}): ${message}`;
    } else if (error.request) {
      return "Network Error: Unable to connect to server. Please check your internet connection.";
    } else {
      return `Request Error: ${error.message}`;
    }
  }
  return error.message || "An unexpected error occurred";
};

// Async thunks
export const fetchAllCars = createAsyncThunk<CarsResponse, FilterOptions>(
  "cars/fetchAllCars",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryString = buildQueryString(filters);
      const url = queryString
        ? `/api/cars/all?${queryString}`
        : "/api/cars/all";

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

      return response.data.data as Car[];
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
      const queryString = buildQueryString(filters);
      const url = queryString
        ? `/api/cars/${category.toLowerCase()}?${queryString}`
        : `/api/cars/${category.toLowerCase()}`;

      const response = await apiClient.get<SingleCarResponse>(url);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch cars by category"
        );
      }

      return { cars: response.data.data as Car[], category };
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
      const queryString = buildQueryString(filters);
      const url = queryString
        ? `/api/cars/brand/${encodeURIComponent(brand)}?${queryString}`
        : `/api/cars/brand/${encodeURIComponent(brand)}`;

      const response = await apiClient.get<SingleCarResponse>(url);

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch cars by brand"
        );
      }

      return { cars: response.data.data as Car[], brand };
    } catch (error: any) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCarById = createAsyncThunk<Car, string>(
  "cars/fetchCarById",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<SingleCarResponse>(
        `/api/cars/${encodeURIComponent(carId)}`
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Car not found");
      }

      return response.data.data;
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
      const response = await apiClient.get<SingleCarResponse>(
        `/api/cars/related/${encodeURIComponent(carId)}?limit=${limit}`
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch related cars"
        );
      }

      return response.data.data as Car[];
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
    const response = await apiClient.post<{
      success: boolean;
      data: { viewCount: number };
    }>(`/api/cars/${encodeURIComponent(carId)}/increment-view`);

    if (!response.data.success) {
      return rejectWithValue("Failed to update view count");
    }

    return { carId, newViewCount: response.data.data.viewCount };
  } catch (error: any) {
    return rejectWithValue("View count update failed");
  }
});

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
    },

    setActiveFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },

    clearActiveFilters: (state) => {
      state.activeFilters = {};
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
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

    resetCarState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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
        }

        state.categoryError = null;
      })
      .addCase(fetchCarsByCategory.rejected, (state, action) => {
        state.isCategoryLoading = false;
        state.categoryError = action.payload as string;
      })
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
  resetCarState,
} = carSlice.actions;

// Selectors
// Update all selectors to use 'car' instead of 'cars'
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

export { apiClient };
