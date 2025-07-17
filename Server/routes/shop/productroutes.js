const express = require("express");
const rateLimit = require("express-rate-limit");
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

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);

// Get all cars with filtering and search
router.get("/all", getAllCars);

// Get cars by category
router.get("/luxury", getLuxuryCars);
router.get("/sports", getSportsCars);
router.get("/suv", getSUVCars);
router.get("/sedan", getSedanCars);
router.get("/convertible", getConvertibleCars);
router.get("/coupe", getCoupeCars);

// Get featured cars
router.get("/featured", getFeaturedCars);

// Get cars by brand
router.get("/brand/:brand", getCarsByBrand);

// Get related cars
router.get("/related/:id", getRelatedCars);

// Get single car by ID or slug (should be last to avoid conflicts)
router.get("/:id", getCarById);

module.exports = router;
