const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const lusca = require("lusca");

const mongoose = require("mongoose");
const authRouter = require("./routes/auth/auth-rotes");
const adminCarRouter = require("./routes/admin/car-routes");
const userCarRouter = require("./routes/user/car-routes.js");
const userSearchRouter = require("./routes/user/searchroutes.js");
const reviewRouter = require("./routes/user/reviewroutes.js");

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
    origin: [
      "http://localhost:5173",
      "https://www.abmkcarrental.com",
      "https://abmkcarrental.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
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

// CSRF protection middleware
app.use(lusca.csrf());

// Optionally, provide a route to get the CSRF token for clients
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/cars", adminCarRouter);
app.use("/api/cars", userCarRouter);
app.use("/api/car/search", userSearchRouter);
app.use("/api/car/review", reviewRouter);

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
