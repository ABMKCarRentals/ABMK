const express = require("express");
const router = express.Router();
const {
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
} = require("../../controllers/user/car-controller");

const {
  generalLimiter,
  searchLimiter,
  detailsLimiter,
  speedLimiter,
} = require("../../middleware/ratelimiter");

// Apply general rate limiting to all routes
router.use(speedLimiter);

// IMPORTANT: Specific routes MUST come before generic /:id route

// Get all cars with search functionality - this handles /api/cars and /api/cars/all
router.get("/", searchLimiter, getAllCars);
router.get("/all", searchLimiter, getAllCars); // Add explicit /all route

// Get featured cars
router.get("/featured", generalLimiter, getFeaturedCars);

// Get cars by category
router.get("/category/luxury", generalLimiter, getLuxuryCars);
router.get("/category/sports", generalLimiter, getSportsCars);
router.get("/category/suv", generalLimiter, getSUVCars);
router.get("/category/sedan", generalLimiter, getSedanCars);
router.get("/category/convertible", generalLimiter, getConvertibleCars);
router.get("/category/coupe", generalLimiter, getCoupeCars);

// Alternative category routes (if you're using these)
router.get("/luxury", generalLimiter, getLuxuryCars);
router.get("/sports", generalLimiter, getSportsCars);
router.get("/suv", generalLimiter, getSUVCars);
router.get("/sedan", generalLimiter, getSedanCars);
router.get("/convertible", generalLimiter, getConvertibleCars);
router.get("/coupe", generalLimiter, getCoupeCars);

// Get cars by brand
router.get("/brand/:brand", generalLimiter, getCarsByBrand);

// Get related cars - this must come before /:id to avoid conflicts
router.get("/:id/related", generalLimiter, getRelatedCars);

// Get single car by ID - THIS MUST BE LAST to avoid conflicts
router.get("/:id", detailsLimiter, getCarById);

module.exports = router;
