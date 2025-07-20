import { useEffect, useCallback } from "react";
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

export const useCars = () => {
  const dispatch = useAppDispatch();

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

  useEffect(() => {
    dispatch(validateCache());
  }, [dispatch]);

  const getAllCars = useCallback(
    (filters: FilterOptions = {}) => {
      return dispatch(fetchAllCars(filters));
    },
    [dispatch]
  );

  const getFeaturedCars = useCallback(
    (limit: number = 6) => {
      return dispatch(fetchFeaturedCars({ limit }));
    },
    [dispatch]
  );

  const getCarsByCategory = useCallback(
    (category: string, filters: FilterOptions = {}) => {
      return dispatch(fetchCarsByCategory({ category, filters }));
    },
    [dispatch]
  );

  const getCarsByBrand = useCallback(
    (brand: string, filters: FilterOptions = {}) => {
      return dispatch(fetchCarsByBrand({ brand, filters }));
    },
    [dispatch]
  );

  const getCarById = useCallback(
    (carId: string) => {
      return dispatch(fetchCarById(carId));
    },
    [dispatch]
  );

  const getRelatedCars = useCallback(
    (carId: string, limit: number = 4) => {
      return dispatch(fetchRelatedCars({ carId, limit }));
    },
    [dispatch]
  );

  const incrementCarViewCount = useCallback(
    (carId: string) => {
      dispatch(incrementViewCountLocal(carId));
      dispatch(incrementCarViewCount(carId));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (filters: FilterOptions) => {
      dispatch(setActiveFilters(filters));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(clearActiveFilters());
  }, [dispatch]);

  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
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
  }, [dispatch]);

  useEffect(() => {
    if (featuredCars.length === 0 && !isFeaturedLoading && !featuredError) {
      if (cacheInfo.isExpired || !featuredCars.length) {
        getFeaturedCars();
      }
    }
  }, [
    featuredCars.length,
    isFeaturedLoading,
    featuredError,
    cacheInfo.isExpired,
    getFeaturedCars,
  ]);

  const searchCars = useCallback(
    (query: string, filters: FilterOptions = {}) => {
      const searchFilters = { ...filters, search: query };
      updateSearchQuery(query);
      return getAllCars(searchFilters);
    },
    [getAllCars, updateSearchQuery]
  );

  const filterAndSortCars = useCallback(
    (filters: FilterOptions) => {
      updateFilters(filters);
      return getAllCars(filters);
    },
    [getAllCars, updateFilters]
  );

  const loadMoreCars = useCallback(
    (page: number) => {
      const filters = { ...activeFilters, page };
      return getAllCars(filters);
    },
    [getAllCars, activeFilters]
  );

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

  return {
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

    isLoading,
    isFeaturedLoading,
    isCategoryLoading,
    isBrandLoading,
    isCarLoading,
    isRelatedLoading,

    error,
    featuredError,
    categoryError,
    brandError,
    carError,
    relatedError,

    activeFilters,
    searchQuery,
    pagination,
    cacheInfo,

    getAllCars,
    getFeaturedCars,
    getCarsByCategory,
    getCarsByBrand,
    getCarById,
    getRelatedCars,

    getLuxuryCars,
    getSportsCars,
    getSUVCars,
    getSedanCars,
    getConvertibleCars,
    getCoupeCars,

    searchCars,
    filterAndSortCars,
    loadMoreCars,
    updateFilters,
    clearFilters,
    updateSearchQuery,
    clearSearch,

    clearCar,
    clearBrandCars,
    incrementCarViewCount,
    clearErrors,
  };
};
