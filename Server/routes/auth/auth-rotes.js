const express = require("express");
const RateLimit = require("express-rate-limit");
const {
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  adminAuthMiddleware,
} = require("../../controllers/auth/authcontroller");

const router = express.Router();

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// Admin authentication routes
router.post("/admin/login", limiter, loginAdmin);
router.post("/admin/logout", limiter, logoutAdmin);
router.post("/refresh-token", limiter, refreshAccessToken);

// Check if admin is authenticated
router.get("/check-auth", limiter, adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated admin!",
    user: req.user,
  });
});

module.exports = router;
