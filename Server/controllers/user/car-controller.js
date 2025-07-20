const Car = require("../../models/car");

const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    message: "Error occurred while processing request",
    error: error.message,
  });
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
      isActive: true,
      isAvailable: true,
      status: "Available",
    };

    // Sorting
    if (sort) {
      switch (sort) {
        case "latest":
          sortCriteria = { createdAt: -1 };
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
          sortCriteria = { popularity: -1 };
      }
    }

    // Price filtering
    if (priceMin && parseFloat(priceMin) > 0) {
      filterCriteria.pricePerDay = {
        ...filterCriteria.pricePerDay,
        $gte: parseFloat(priceMin),
      };
    }
    if (priceMax && parseFloat(priceMax) > 0) {
      filterCriteria.pricePerDay = {
        ...filterCriteria.pricePerDay,
        $lte: parseFloat(priceMax),
      };
    }

    // Brand filtering
    if (brand && brand.length > 0) {
      const brandArray = brand.split(",");
      filterCriteria.brand = { $in: brandArray };
    }

    // Transmission filtering
    if (transmission && transmission.length > 0) {
      const transmissionArray = transmission.split(",");
      filterCriteria.transmission = { $in: transmissionArray };
    }

    // Fuel type filtering
    if (fuelType && fuelType.length > 0) {
      const fuelArray = fuelType.split(",");
      filterCriteria.fuelType = { $in: fuelArray };
    }

    // Seats filtering
    if (seats && seats.length > 0) {
      const seatsArray = seats.split(",").map(Number);
      filterCriteria.seats = { $in: seatsArray };
    }

    // Year filtering
    if (year && year.length > 0) {
      const yearArray = year.split(",").map(Number);
      filterCriteria.year = { $in: yearArray };
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

    if (!brand || typeof brand !== "string") {
      return res.status(400).json({
        success: false,
        message: "Brand is required",
      });
    }

    let filterCriteria = {
      brand: { $eq: brand },
      isActive: true,
      isAvailable: true,
      status: "Available",
    };

    // Category filtering
    if (category && category.length > 0) {
      const categoryArray = category.split(",");
      filterCriteria.category = { $in: categoryArray };
    }

    // Price filtering
    if (priceMin && priceMin !== "0") {
      filterCriteria.pricePerDay = {
        ...filterCriteria.pricePerDay,
        $gte: parseFloat(priceMin),
      };
    }
    if (priceMax && priceMax !== "0") {
      filterCriteria.pricePerDay = {
        ...filterCriteria.pricePerDay,
        $lte: parseFloat(priceMax),
      };
    }

    // Transmission filtering
    if (transmission && transmission.length > 0) {
      const transmissionArray = transmission.split(",");
      filterCriteria.transmission = { $in: transmissionArray };
    }

    // Fuel type filtering
    if (fuelType && fuelType.length > 0) {
      const fuelArray = fuelType.split(",");
      filterCriteria.fuelType = { $in: fuelArray };
    }

    // Seats filtering
    if (seats && seats.length > 0) {
      const seatsArray = seats.split(",").map(Number);
      filterCriteria.seats = { $in: seatsArray };
    }

    // Year filtering
    if (year && year.length > 0) {
      const yearArray = year.split(",").map(Number);
      filterCriteria.year = { $in: yearArray };
    }

    let sortCriteria = {};
    switch (sort) {
      case "latest":
        sortCriteria = { createdAt: -1 };
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

// Get single car by ID or slug
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let car = await Car.findById(id).select("-__v");
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
    return handleError(res, error);
  }
};

// Get all cars with filtering
const getAllCars = async (req, res) => {
  try {
    const {
      sort,
      priceMin,
      priceMax,
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

    let filterCriteria = {
      isActive: true,
      isAvailable: true,
      status: "Available",
    };

    // Search functionality
    if (search && search.trim()) {
      filterCriteria.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Apply all filters
    if (brand && brand.length > 0) {
      const brandArray = brand.split(",");
      filterCriteria.brand = { $in: brandArray };
    }

    if (category && category.length > 0) {
      const categoryArray = category.split(",");
      filterCriteria.category = { $in: categoryArray };
    }

    if (priceMin && parseFloat(priceMin) > 0) {
      filterCriteria.pricePerDay = {
        ...filterCriteria.pricePerDay,
        $gte: parseFloat(priceMin),
      };
    }
    if (priceMax && parseFloat(priceMax) > 0) {
      filterCriteria.pricePerDay = {
        ...filterCriteria.pricePerDay,
        $lte: parseFloat(priceMax),
      };
    }

    if (transmission && transmission.length > 0) {
      const transmissionArray = transmission.split(",");
      filterCriteria.transmission = { $in: transmissionArray };
    }

    if (fuelType && fuelType.length > 0) {
      const fuelArray = fuelType.split(",");
      filterCriteria.fuelType = { $in: fuelArray };
    }

    if (seats && seats.length > 0) {
      const seatsArray = seats.split(",").map(Number);
      filterCriteria.seats = { $in: seatsArray };
    }

    if (year && year.length > 0) {
      const yearArray = year.split(",").map(Number);
      filterCriteria.year = { $in: yearArray };
    }

    // Sorting
    let sortCriteria = {};
    switch (sort) {
      case "latest":
        sortCriteria = { createdAt: -1 };
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
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const cars = await Car.find(filterCriteria)
      .sort(sortCriteria)
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    const total = await Car.countDocuments(filterCriteria);

    res.status(200).json({
      success: true,
      data: cars,
      count: cars.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
      hasPrevPage: parseInt(page) > 1,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get featured cars
const getFeaturedCars = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const cars = await Car.find({
      isFeatured: true,
      isActive: true,
      isAvailable: true,
      status: "Available",
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
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
      .limit(parseInt(limit))
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
