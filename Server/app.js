const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const lusca = require("lusca");

const mongoose = require("mongoose");
const authRouter = require("./routes/auth/auth-rotes");
const adminProductsRouter = require("./routes/admin/product-routes");
const shopProductRouter = require("./routes/shop/productroutes");
const shopSearchRouter = require("./routes/shop/searchroutes");
const reviewRouter = require("./routes/shop/reviewroutes");

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Import passport configuration

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
      "X-XSRF-TOKEN",
    ],
    exposedHeaders: ["set-cookie"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Session setup (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize passport

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", reviewRouter);

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
