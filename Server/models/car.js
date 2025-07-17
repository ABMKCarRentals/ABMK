const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Car name is required"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      enum: [
        "Ferrari",
        "Lamborghini",
        "Bentley",
        "Rolls Royce",
        "Porsche",
        "Mercedes",
        "BMW",
        "Audi",
        "Other",
      ],
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1990, "Year must be after 1990"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },

    // Car Details
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Luxury",
        "Sports",
        "SUV",
        "Sedan",
        "Convertible",
        "Coupe",
        "Hatchback",
      ],
    },
    transmission: {
      type: String,
      required: [true, "Transmission is required"],
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },
    fuelType: {
      type: String,
      required: [true, "Fuel type is required"],
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      default: "Petrol",
    },
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [2, "Must have at least 2 seats"],
      max: [8, "Cannot have more than 8 seats"],
    },

    // Pricing
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [0, "Price cannot be negative"],
    },
    pricePerWeek: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    pricePerMonth: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },

    // Images
    images: [
      {
        url: {
          type: String,
          required: [true, "Image URL is required"],
        },
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Features & Specifications
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    specifications: {
      engine: String,
      horsepower: Number,
      topSpeed: Number,
      acceleration: String, // 0-100 km/h
      mileage: String,
      color: String,
      interiorColor: String,
    },

    // Availability & Status
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Available", "Rented", "Maintenance", "Inactive"],
      default: "Available",
    },

    // Location
    location: {
      type: String,
      required: [true, "Location is required"],
      default: "Business Bay, Dubai",
    },

    // SEO & Meta
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    metaTitle: String,
    metaDescription: String,

    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    bookingCount: {
      type: Number,
      default: 0,
    },

    // Admin fields
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create slug before saving
carSchema.pre("save", function (next) {
  if (
    this.isModified("name") ||
    this.isModified("brand") ||
    this.isModified("model")
  ) {
    this.slug = `${this.brand}-${this.model}-${this.name}`
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Indexes for better performance
carSchema.index({ brand: 1, category: 1 });
carSchema.index({ pricePerDay: 1 });
carSchema.index({ isAvailable: 1, status: 1 });
carSchema.index({ slug: 1 });
carSchema.index({ isFeatured: -1, createdAt: -1 });

module.exports = mongoose.model("Car", carSchema);
