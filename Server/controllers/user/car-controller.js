const Car = require("../../models/car");
const mongoose = require("mongoose");

const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    message: "Error occurred while processing request",
    error: error.message,
  });
};

// Utility function to validate ObjectId
const isValidObjectId = (id) => {
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    (typeof id === "string" ? id.length === 24 : true)
  );
};

const getCarsByCategory = async (req, res, category) => {
  try {
    const {
      sort,
      priceMin,
      priceMax,
      brand,
      transmission,
      fuelType,
      seats,
      year,
    } = req.query;

    let sortCriteria = { popularity: -1 };
    let filterCriteria = {
      category,
    };

    // Sorting
    if (sort) {
      switch (sort) {
        case "newest":
        case "latest":
          sortCriteria = { createdAt: -1 };
          break;
        case "oldest":
          sortCriteria = { createdAt: 1 };
          break;
        case "price-low":
          sortCriteria = { pricePerDay: 1 };
          break;
        case "price-high":
          sortCriteria = { pricePerDay: -1 };
          break;
        case "popular":
          sortCriteria = { viewCount: -1 };
          break;
        case "featured":
          sortCriteria = { isFeatured: -1, createdAt: -1 };
          break;
        default:
          sortCriteria = { isFeatured: -1, createdAt: -1 };
      }
    }

    // Brand filtering - handle "all" value
    if (brand && brand !== "all" && brand.length > 0) {
      const brandArray = brand.split(",").filter((b) => b && b !== "all");
      if (brandArray.length > 0) {
        filterCriteria.brand = { $in: brandArray };
      }
    }

    // Transmission filtering - handle "all" value
    if (transmission && transmission !== "all" && transmission.length > 0) {
      const transmissionArray = transmission
        .split(",")
        .filter((t) => t && t !== "all");
      if (transmissionArray.length > 0) {
        filterCriteria.transmission = { $in: transmissionArray };
      }
    }

    // Fuel type filtering - handle "all" value
    if (fuelType && fuelType !== "all" && fuelType.length > 0) {
      const fuelArray = fuelType.split(",").filter((f) => f && f !== "all");
      if (fuelArray.length > 0) {
        filterCriteria.fuelType = { $in: fuelArray };
      }
    }

    // Seats filtering - handle "all" value
    if (seats && seats !== "all" && seats.length > 0) {
      const seatsArray = seats
        .split(",")
        .map(Number)
        .filter((s) => !isNaN(s) && s > 0);
      if (seatsArray.length > 0) {
        filterCriteria.seats = { $in: seatsArray };
      }
    }

    // Year filtering - handle "all" value
    if (year && year !== "all" && year.length > 0) {
      const yearArray = year
        .split(",")
        .map(Number)
        .filter((y) => !isNaN(y) && y > 1900);
      if (yearArray.length > 0) {
        filterCriteria.year = { $in: yearArray };
      }
    }

    const cars = await Car.find(filterCriteria)
      .sort(sortCriteria)
      .select("-__v");

    return res.status(200).json({
      success: true,
      data: cars,
      count: cars.length,
      category: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get cars by specific categories
const getLuxuryCars = async (req, res) => getCarsByCategory(req, res, "Luxury");
const getSportsCars = async (req, res) => getCarsByCategory(req, res, "Sports");
const getSUVCars = async (req, res) => getCarsByCategory(req, res, "SUV");
const getSedanCars = async (req, res) => getCarsByCategory(req, res, "Sedan");
const getConvertibleCars = async (req, res) =>
  getCarsByCategory(req, res, "Convertible");
const getCoupeCars = async (req, res) => getCarsByCategory(req, res, "Coupe");

// Get cars by brand
const getCarsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const {
      sort,
      priceMin,
      priceMax,
      category,
      transmission,
      fuelType,
      seats,
      year,
    } = req.query;

    if (!brand || typeof brand !== "string" || brand === "all") {
      return res.status(400).json({
        success: false,
        message: "Valid brand is required",
      });
    }

    let filterCriteria = {
      brand: { $eq: brand },
      isActive: true,
      isAvailable: true,
      status: "Available",
    };

    // Category filtering - handle "all" value
    if (category && category !== "all" && category.length > 0) {
      const categoryArray = category.split(",").filter((c) => c && c !== "all");
      if (categoryArray.length > 0) {
        filterCriteria.category = { $in: categoryArray };
      }
    }

    // Transmission filtering - handle "all" value
    if (transmission && transmission !== "all" && transmission.length > 0) {
      const transmissionArray = transmission
        .split(",")
        .filter((t) => t && t !== "all");
      if (transmissionArray.length > 0) {
        filterCriteria.transmission = { $in: transmissionArray };
      }
    }

    // Fuel type filtering - handle "all" value
    if (fuelType && fuelType !== "all" && fuelType.length > 0) {
      const fuelArray = fuelType.split(",").filter((f) => f && f !== "all");
      if (fuelArray.length > 0) {
        filterCriteria.fuelType = { $in: fuelArray };
      }
    }

    // Seats filtering - handle "all" value
    if (seats && seats !== "all" && seats.length > 0) {
      const seatsArray = seats
        .split(",")
        .map(Number)
        .filter((s) => !isNaN(s) && s > 0);
      if (seatsArray.length > 0) {
        filterCriteria.seats = { $in: seatsArray };
      }
    }

    // Year filtering - handle "all" value
    if (year && year !== "all" && year.length > 0) {
      const yearArray = year
        .split(",")
        .map(Number)
        .filter((y) => !isNaN(y) && y > 1900);
      if (yearArray.length > 0) {
        filterCriteria.year = { $in: yearArray };
      }
    }

    let sortCriteria = {};
    switch (sort) {
      case "newest":
      case "latest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "price-low":
        sortCriteria = { pricePerDay: 1 };
        break;
      case "price-high":
        sortCriteria = { pricePerDay: -1 };
        break;
      case "popular":
        sortCriteria = { viewCount: -1 };
        break;
      default:
        sortCriteria = { isFeatured: -1, createdAt: -1 };
    }

    const cars = await Car.find(filterCriteria)
      .sort(sortCriteria)
      .select("-__v");

    res.status(200).json({
      success: true,
      count: cars.length,
      brand: brand,
      data: cars,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get single car by ID or slug with validation
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that we have an ID and it's not "all" or other invalid values
    if (!id || id === "all" || id === "undefined" || id === "null") {
      return res.status(400).json({
        success: false,
        message: "Valid car ID is required",
      });
    }

    let car = null;

    // Try to find by ObjectId first if it's a valid ObjectId
    if (isValidObjectId(id)) {
      car = await Car.findById(id).select("-__v");
    }

    // If not found by ID, try to find by slug
    if (!car) {
      car = await Car.findOne({
        slug: id,
        isActive: true,
      }).select("-__v");
    }

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Increment view count
    car.viewCount += 1;
    await car.save();

    res.status(200).json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.error("getCarById error:", error);
    return handleError(res, error);
  }
};

// Get all cars with filtering
const getAllCars = async (req, res) => {
  try {
    const {
      sort,
      brand,
      category,
      transmission,
      fuelType,
      seats,
      year,
      search,
      page = 1,
      limit = 12,
    } = req.query;

    // Start with no availability restriction
    let filterCriteria = {};

    // Search functionality
    if (search && search.trim() && search !== "all") {
      filterCriteria.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Brand filter
    if (brand && brand !== "all" && brand.length > 0) {
      const brandArray = brand.split(",").filter((b) => b && b !== "all");
      if (brandArray.length > 0) {
        filterCriteria.brand = { $in: brandArray };
      }
    }

    // Category filter
    if (category && category !== "all" && category.length > 0) {
      const categoryArray = category.split(",").filter((c) => c && c !== "all");
      if (categoryArray.length > 0) {
        filterCriteria.category = { $in: categoryArray };
      }
    }

    // Transmission filter
    if (transmission && transmission !== "all" && transmission.length > 0) {
      const transmissionArray = transmission
        .split(",")
        .filter((t) => t && t !== "all");
      if (transmissionArray.length > 0) {
        filterCriteria.transmission = { $in: transmissionArray };
      }
    }

    // Fuel type filter
    if (fuelType && fuelType !== "all" && fuelType.length > 0) {
      const fuelArray = fuelType.split(",").filter((f) => f && f !== "all");
      if (fuelArray.length > 0) {
        filterCriteria.fuelType = { $in: fuelArray };
      }
    }

    // Seats filter
    if (seats && seats !== "all" && seats.length > 0) {
      const seatsArray = seats
        .split(",")
        .map(Number)
        .filter((s) => !isNaN(s) && s > 0);
      if (seatsArray.length > 0) {
        filterCriteria.seats = { $in: seatsArray };
      }
    }

    // Year filter
    if (year && year !== "all" && year.length > 0) {
      const yearArray = year
        .split(",")
        .map(Number)
        .filter((y) => !isNaN(y) && y > 1900);
      if (yearArray.length > 0) {
        filterCriteria.year = { $in: yearArray };
      }
    }

    // Sorting
    let sortCriteria = {};
    switch (sort) {
      case "newest":
      case "latest":
        sortCriteria = { createdAt: -1 };
        break;
      case "oldest":
        sortCriteria = { createdAt: 1 };
        break;
      case "price-low":
        sortCriteria = { pricePerDay: 1 };
        break;
      case "price-high":
        sortCriteria = { pricePerDay: -1 };
        break;
      case "popular":
        sortCriteria = { viewCount: -1 };
        break;
      case "name":
        sortCriteria = { name: 1 };
        break;
      default:
        sortCriteria = { isFeatured: -1, createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit))); // Limit max to 50
    const skip = (pageNum - 1) * limitNum;

    const cars = await Car.find(filterCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum)
      .select("-__v");

    const total = await Car.countDocuments(filterCriteria);

    res.status(200).json({
      success: true,
      data: cars,
      count: cars.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get featured cars
const getFeaturedCars = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNum = Math.max(1, Math.min(20, parseInt(limit))); // Limit max to 20

    const cars = await Car.find({})
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .select("-__v");

    res.status(200).json({
      success: true,
      data: cars,
      count: cars.length,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get related cars (same brand or category)
const getRelatedCars = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // Validate ID
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid car ID is required",
      });
    }

    const limitNum = Math.max(1, Math.min(10, parseInt(limit))); // Limit max to 10

    const currentCar = await Car.findById(id);
    if (!currentCar) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    const relatedCars = await Car.find({
      _id: { $ne: id },
      $or: [{ brand: currentCar.brand }, { category: currentCar.category }],
      isActive: true,
      isAvailable: true,
      status: "Available",
    })
      .sort({ viewCount: -1 })
      .limit(limitNum)
      .select("-__v");

    res.status(200).json({
      success: true,
      data: relatedCars,
      count: relatedCars.length,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getLuxuryCars,
  getSportsCars,
  getSUVCars,
  getSedanCars,
  getConvertibleCars,
  getCoupeCars,
  getCarsByBrand,
  getCarById,
  getAllCars,
  getFeaturedCars,
  getRelatedCars,
};
