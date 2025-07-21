import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosResponse } from "axios";

// Configure axios instance for admin
const adminApiClient = axios.create({
  baseURL: import.meta.env.VITE_PORT,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for admin operations
adminApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for admin operations
adminApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Types
export interface Car {
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
  metaTitle: string;
  metaDescription: string;
  viewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  status: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface CarStats {
  totalCars: number;
  availableCars: number;
  featuredCars: number;
  rentedCars: number;
  brandStats: Array<{
    _id: string;
    count: number;
  }>;
  categoryStats: Array<{
    _id: string;
    count: number;
  }>;
}

interface CarsResponse {
  success: boolean;
  count: number;
  total: number;
  currentPage: number;
  totalPages: number;
  data: Car[];
  message?: string;
}

interface SingleCarResponse {
  success: boolean;
  data: Car;
  message?: string;
}

interface CarStatsResponse {
  success: boolean;
  data: CarStats;
  message?: string;
}

interface ImageUploadResponse {
  success: boolean;
  result: {
    url: string;
  };
  message?: string;
}

interface FilterOptions {
  page?: number;
  limit?: number;
  brand?: string;
  category?: string;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

interface AdminCarState {
  carList: Car[];
  currentCar: Car | null;
  carStats: CarStats | null;

  currentPage: number;
  totalPages: number;
  totalCars: number;

  isLoading: boolean;
  isImageUploading: boolean;
  isCarLoading: boolean;
  isStatsLoading: boolean;

  error: string | null;
  imageUploadError: string | null;
  carError: string | null;
  statsError: string | null;

  lastFetchTime: string | null;
}

const initialState: AdminCarState = {
  carList: [],
  currentCar: null,
  carStats: null,

  currentPage: 1,
  totalPages: 0,
  totalCars: 0,

  isLoading: false,
  isImageUploading: false,
  isCarLoading: false,
  isStatsLoading: false,

  error: null,
  imageUploadError: null,
  carError: null,
  statsError: null,

  lastFetchTime: null,
};

const buildQueryString = (filters: FilterOptions): string => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
};

const handleApiError = (error: unknown): string => {
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
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Async thunks
export const uploadCarImage = createAsyncThunk<ImageUploadResponse, File>(
  "adminCars/uploadImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await adminApiClient.post<ImageUploadResponse>(
        "/api/admin/cars/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to upload image"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchAllCars = createAsyncThunk<
  CarsResponse,
  FilterOptions | void
>("adminCars/fetchAllCars", async (filters = {}, { rejectWithValue }) => {
  try {
    const queryString = buildQueryString(filters);
    const url = queryString
      ? `/api/admin/cars/get?${queryString}`
      : "/api/admin/cars/get";

    const response = await adminApiClient.get<CarsResponse>(url);

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Failed to fetch cars");
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const getSingleCar = createAsyncThunk<SingleCarResponse, string>(
  "adminCars/getSingleCar",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.get<SingleCarResponse>(
        `/api/admin/cars/get/${encodeURIComponent(carId)}`
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Car not found");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addNewCar = createAsyncThunk<SingleCarResponse, Partial<Car>>(
  "adminCars/addNewCar",
  async (carData, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.post<SingleCarResponse>(
        "/api/admin/cars/add",
        carData
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Failed to add car");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const editCar = createAsyncThunk<
  SingleCarResponse,
  { id: string; formData: Partial<Car> }
>("adminCars/editCar", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await adminApiClient.put<SingleCarResponse>(
      `/api/admin/cars/edit/${encodeURIComponent(id)}`,
      formData
    );

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Failed to update car");
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteCar = createAsyncThunk<
  { success: boolean; message: string; carId: string },
  string
>("adminCars/deleteCar", async (carId, { rejectWithValue }) => {
  try {
    const response = await adminApiClient.delete<{
      success: boolean;
      message: string;
    }>(`/api/admin/cars/delete/${encodeURIComponent(carId)}`);

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Failed to delete car");
    }

    return { ...response.data, carId };
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const toggleCarAvailability = createAsyncThunk<
  SingleCarResponse,
  string
>("adminCars/toggleCarAvailability", async (carId, { rejectWithValue }) => {
  try {
    const response = await adminApiClient.patch<SingleCarResponse>(
      `/api/admin/cars/toggle-availability/${encodeURIComponent(carId)}`
    );

    if (!response.data.success) {
      return rejectWithValue(
        response.data.message || "Failed to toggle car availability"
      );
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const getCarStats = createAsyncThunk<CarStatsResponse, void>(
  "adminCars/getCarStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiClient.get<CarStatsResponse>(
        "/api/admin/cars/stats"
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Failed to fetch car statistics"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const adminCarSlice = createSlice({
  name: "adminCars",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearImageUploadError: (state) => {
      state.imageUploadError = null;
    },

    clearCarError: (state) => {
      state.carError = null;
    },

    clearStatsError: (state) => {
      state.statsError = null;
    },

    clearAllErrors: (state) => {
      state.error = null;
      state.imageUploadError = null;
      state.carError = null;
      state.statsError = null;
    },

    clearCurrentCar: (state) => {
      state.currentCar = null;
    },

    updateCarInList: (state, action: PayloadAction<Car>) => {
      const updatedCar = action.payload;
      const index = state.carList.findIndex(
        (car) => car._id === updatedCar._id
      );
      if (index !== -1) {
        state.carList[index] = updatedCar;
      }
    },

    removeCarFromList: (state, action: PayloadAction<string>) => {
      const carId = action.payload;
      state.carList = state.carList.filter((car) => car._id !== carId);
      state.totalCars = Math.max(0, state.totalCars - 1);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setImageUploading: (state, action: PayloadAction<boolean>) => {
      state.isImageUploading = action.payload;
    },

    resetAdminCarState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCarImage.pending, (state) => {
        state.isImageUploading = true;
        state.imageUploadError = null;
      })
      .addCase(uploadCarImage.fulfilled, (state) => {
        state.isImageUploading = false;
        state.imageUploadError = null;
      })
      .addCase(uploadCarImage.rejected, (state, action) => {
        state.isImageUploading = false;
        state.imageUploadError = action.payload as string;
      })
      .addCase(fetchAllCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carList = action.payload.data;
        state.totalCars = action.payload.total;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.lastFetchTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAllCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getSingleCar.pending, (state) => {
        state.isCarLoading = true;
        state.carError = null;
      })
      .addCase(getSingleCar.fulfilled, (state, action) => {
        state.isCarLoading = false;
        state.currentCar = action.payload.data;
        state.carError = null;
      })
      .addCase(getSingleCar.rejected, (state, action) => {
        state.isCarLoading = false;
        state.carError = action.payload as string;
        state.currentCar = null;
      })
      .addCase(addNewCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewCar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.carList.unshift(action.payload.data);
        state.totalCars += 1;
        state.error = null;
      })
      .addCase(addNewCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(editCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editCar.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCar = action.payload.data;
        const index = state.carList.findIndex(
          (car) => car._id === updatedCar._id
        );
        if (index !== -1) {
          state.carList[index] = updatedCar;
        }
        if (state.currentCar && state.currentCar._id === updatedCar._id) {
          state.currentCar = updatedCar;
        }
        state.error = null;
      })
      .addCase(editCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.isLoading = false;
        const carId = action.payload.carId;
        state.carList = state.carList.filter((car) => car._id !== carId);
        state.totalCars = Math.max(0, state.totalCars - 1);
        if (state.currentCar && state.currentCar._id === carId) {
          state.currentCar = null;
        }
        state.error = null;
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleCarAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleCarAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedCar = action.payload.data;
        const index = state.carList.findIndex(
          (car) => car._id === updatedCar._id
        );
        if (index !== -1) {
          state.carList[index] = updatedCar;
        }
        if (state.currentCar && state.currentCar._id === updatedCar._id) {
          state.currentCar = updatedCar;
        }
        state.error = null;
      })
      .addCase(toggleCarAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getCarStats.pending, (state) => {
        state.isStatsLoading = true;
        state.statsError = null;
      })
      .addCase(getCarStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        state.carStats = action.payload.data;
        state.statsError = null;
      })
      .addCase(getCarStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.statsError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearImageUploadError,
  clearCarError,
  clearStatsError,
  clearAllErrors,
  clearCurrentCar,
  updateCarInList,
  removeCarFromList,
  setLoading,
  setImageUploading,
  resetAdminCarState,
} = adminCarSlice.actions;

// Selectors
export const selectAdminCars = (state: { adminCars: AdminCarState }) =>
  state.adminCars;
export const selectCarList = (state: { adminCars: AdminCarState }) =>
  state.adminCars.carList;
export const selectCurrentCar = (state: { adminCars: AdminCarState }) =>
  state.adminCars.currentCar;
export const selectCarStats = (state: { adminCars: AdminCarState }) =>
  state.adminCars.carStats;

export const selectIsLoading = (state: { adminCars: AdminCarState }) =>
  state.adminCars.isLoading;
export const selectIsImageUploading = (state: { adminCars: AdminCarState }) =>
  state.adminCars.isImageUploading;
export const selectIsCarLoading = (state: { adminCars: AdminCarState }) =>
  state.adminCars.isCarLoading;
export const selectIsStatsLoading = (state: { adminCars: AdminCarState }) =>
  state.adminCars.isStatsLoading;

export const selectError = (state: { adminCars: AdminCarState }) =>
  state.adminCars.error;
export const selectImageUploadError = (state: { adminCars: AdminCarState }) =>
  state.adminCars.imageUploadError;
export const selectCarError = (state: { adminCars: AdminCarState }) =>
  state.adminCars.carError;
export const selectStatsError = (state: { adminCars: AdminCarState }) =>
  state.adminCars.statsError;

export const selectPagination = (state: { adminCars: AdminCarState }) => ({
  currentPage: state.adminCars.currentPage,
  totalPages: state.adminCars.totalPages,
  totalCars: state.adminCars.totalCars,
});

export const selectCarsByBrand = (state: { adminCars: AdminCarState }) => {
  const cars = state.adminCars.carList;
  const brandGroups: { [key: string]: Car[] } = {};

  cars.forEach((car) => {
    if (!brandGroups[car.brand]) {
      brandGroups[car.brand] = [];
    }
    brandGroups[car.brand].push(car);
  });

  return brandGroups;
};

export const selectCarsByCategory = (state: { adminCars: AdminCarState }) => {
  const cars = state.adminCars.carList;
  const categoryGroups: { [key: string]: Car[] } = {};

  cars.forEach((car) => {
    if (!categoryGroups[car.category]) {
      categoryGroups[car.category] = [];
    }
    categoryGroups[car.category].push(car);
  });

  return categoryGroups;
};

export const selectFeaturedCars = (state: { adminCars: AdminCarState }) => {
  return state.adminCars.carList.filter((car) => car.isFeatured);
};

export const selectAvailableCars = (state: { adminCars: AdminCarState }) => {
  return state.adminCars.carList.filter((car) => car.isAvailable);
};

export default adminCarSlice.reducer;

export { adminApiClient };
