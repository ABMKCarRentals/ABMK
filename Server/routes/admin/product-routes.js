const express = require("express");
const RateLimit = require("express-rate-limit");

const {
  handleImageUpload,
  addCar,
  editCar,
  fetchAllCars,
  getSingleCar,
  deleteCar,
  toggleCarAvailability,
  getCarStats,
} = require("../../controllers/admin/car-controller");

const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Image upload route
router.post("/upload-image", upload.single("file"), handleImageUpload);

// Car CRUD routes
router.post("/add", limiter, addCar);
router.put("/edit/:id", limiter, editCar);
router.delete("/delete/:id", limiter, deleteCar);
router.get("/get", limiter, fetchAllCars);
router.get("/get/:id", limiter, getSingleCar);

// Car management routes
router.patch("/toggle-availability/:id", limiter, toggleCarAvailability);
router.get("/stats", limiter, getCarStats);

module.exports = router;
