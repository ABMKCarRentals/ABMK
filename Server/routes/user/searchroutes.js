const express = require("express");
const rateLimit = require("express-rate-limit");
const { searchCars } = require("../../controllers/user/searchcontroller");

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

router.use(limiter);
router.get("/:keyword", limiter, searchCars);

module.exports = router;
