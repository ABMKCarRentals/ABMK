import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  uploadCarImage,
  fetchAllCars,
  getSingleCar,
  addNewCar,
  editCar,
  deleteCar,
  toggleCarAvailability,
  getCarStats,
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
  selectAdminCars,
  selectCarList,
  selectCurrentCar,
  selectCarStats,
  selectIsLoading,
  selectIsImageUploading,
  selectIsCarLoading,
  selectIsStatsLoading,
  selectError,
  selectImageUploadError,
  selectCarError,
  selectStatsError,
  selectPagination,
  selectCarsByBrand,
  selectCarsByCategory,
  selectFeaturedCars,
  selectAvailableCars,
} from "../store/admin/car-slice";

export interface FilterOptions {
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

export const useAdminCars = () => {
  const dispatch = useAppDispatch();

  const adminCars = useAppSelector(selectAdminCars);
  const carList = useAppSelector(selectCarList);
  const currentCar = useAppSelector(selectCurrentCar);
  const carStats = useAppSelector(selectCarStats);

  const isLoading = useAppSelector(selectIsLoading);
  const isImageUploading = useAppSelector(selectIsImageUploading);
  const isCarLoading = useAppSelector(selectIsCarLoading);
  const isStatsLoading = useAppSelector(selectIsStatsLoading);

  const error = useAppSelector(selectError);
  const imageUploadError = useAppSelector(selectImageUploadError);
  const carError = useAppSelector(selectCarError);
  const statsError = useAppSelector(selectStatsError);

  const pagination = useAppSelector(selectPagination);
  const carsByBrand = useAppSelector(selectCarsByBrand);
  const carsByCategory = useAppSelector(selectCarsByCategory);
  const featuredCars = useAppSelector(selectFeaturedCars);
  const availableCars = useAppSelector(selectAvailableCars);

  const getAllCars = useCallback(
    (filters: FilterOptions = {}) => {
      return dispatch(fetchAllCars(filters));
    },
    [dispatch]
  );

  const getCarById = useCallback(
    (carId: string) => {
      return dispatch(getSingleCar(carId));
    },
    [dispatch]
  );

  const createCar = useCallback(
    (carData: Partial<Car>) => {
      return dispatch(addNewCar(carData));
    },
    [dispatch]
  );

  const updateCar = useCallback(
    (id: string, formData: Partial<Car>) => {
      return dispatch(editCar({ id, formData }));
    },
    [dispatch]
  );

  const removeCar = useCallback(
    (carId: string) => {
      return dispatch(deleteCar(carId));
    },
    [dispatch]
  );

  const toggleAvailability = useCallback(
    (carId: string) => {
      return dispatch(toggleCarAvailability(carId));
    },
    [dispatch]
  );

  const uploadImage = useCallback(
    (imageFile: File) => {
      return dispatch(uploadCarImage(imageFile));
    },
    [dispatch]
  );

  const fetchStats = useCallback(() => {
    return dispatch(getCarStats());
  }, [dispatch]);

  const clearCarErrorCb = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearImageError = useCallback(() => {
    dispatch(clearImageUploadError());
  }, [dispatch]);

  const clearSingleCarError = useCallback(() => {
    dispatch(clearCarError());
  }, [dispatch]);

  const clearStatisticsError = useCallback(() => {
    dispatch(clearStatsError());
  }, [dispatch]);

  const clearAllCarErrors = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  const clearCurrentCarData = useCallback(() => {
    dispatch(clearCurrentCar());
  }, [dispatch]);

  const updateCarInListOptimistic = useCallback(
    (car: Car) => {
      dispatch(updateCarInList(car));
    },
    [dispatch]
  );

  const removeCarFromListOptimistic = useCallback(
    (carId: string) => {
      dispatch(removeCarFromList(carId));
    },
    [dispatch]
  );

  const setLoadingState = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const setImageUploadingState = useCallback(
    (uploading: boolean) => {
      dispatch(setImageUploading(uploading));
    },
    [dispatch]
  );

  const resetState = useCallback(() => {
    dispatch(resetAdminCarState());
  }, [dispatch]);

  return {
    adminCars,
    carList,
    currentCar,
    carStats,
    carsByBrand,
    carsByCategory,
    featuredCars,
    availableCars,
    pagination,

    isLoading,
    isImageUploading,
    isCarLoading,
    isStatsLoading,

    error,
    imageUploadError,
    carError,
    statsError,

    getAllCars,
    getCarById,
    createCar,
    updateCar,
    removeCar,
    toggleAvailability,
    uploadImage,
    fetchStats,

    clearCarError: clearCarErrorCb,
    clearImageError,
    clearSingleCarError,
    clearStatisticsError,
    clearAllCarErrors,
    clearCurrentCarData,
    updateCarInListOptimistic,
    removeCarFromListOptimistic,
    setLoadingState,
    setImageUploadingState,
    resetState,
  };
};
