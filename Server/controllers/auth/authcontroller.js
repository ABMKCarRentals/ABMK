const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

// Token Expiry Config
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Hardcoded Admin Credentials
const ADMIN_CREDENTIALS = {
  email: "admin@abmkrentals.com",
  password: "Admin@2025!",
  name: "ABMK Admin",
  role: "admin",
  id: "admin_001",
};

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Admin Login Only
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check against hardcoded credentials
    if (
      email !== ADMIN_CREDENTIALS.email ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      return res.json({
        success: false,
        message: "Invalid admin credentials!",
      });
    }

    // Create admin user object
    const adminUser = {
      id: ADMIN_CREDENTIALS.id,
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
    };

    // Generate tokens
    const accessToken = generateAccessToken(adminUser);
    const refreshToken = generateRefreshToken(adminUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/auth/refresh-token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Admin logged in successfully",
      accessToken,
      user: {
        email: adminUser.email,
        role: adminUser.role,
        id: adminUser.id,
        name: adminUser.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

// Refresh Access Token
const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Unauthorized!" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // Create admin user object for token generation
    const adminUser = {
      id: ADMIN_CREDENTIALS.id,
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
    };

    const newAccessToken = generateAccessToken(adminUser);

    res.json({ success: true, accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized!" });
  }
};

// Logout Admin
const logoutAdmin = (req, res) => {
  res.clearCookie("refreshToken", { path: "/auth/refresh-token" });
  res.json({ success: true, message: "Admin logged out successfully!" });
};

// Middleware to check if admin is authenticated
const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized! No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden! Admin access required." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized! Invalid token." });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  adminAuthMiddleware,
};
