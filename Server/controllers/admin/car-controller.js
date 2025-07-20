const { imageUploadUtil } = require("../../helpers/cloudinary");
const Car = require("../../models/car");

// Utility function for current UTC datetime
const getCurrentUTCDateTime = () => {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

// Handle image upload with tracking
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary with user tracking
    const result = await imageUploadUtil(dataURI, "admin");

    res.json({
      success: true,
      result: {
        url: result.url,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading image",
    });
  }
};

// Add a new car
const addCar = async (req, res) => {
  try {
    const {
      name,
      brand,
      model,
      year,
      category,
      transmission,
      fuelType,
      seats,
      images,
      features,
      specifications,
      location,
      description,
      metaTitle,
      metaDescription,
      isFeatured,
      isActive,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !brand ||
      !model ||
      !year ||
      !category ||
      !transmission ||
      !fuelType ||
      !seats ||
      !images?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1990 || year > currentYear + 1) {
      return res.status(400).json({
        success: false,
        message: "Year must be between 1990 and " + (currentYear + 1),
      });
    }

    // Validate seats
    if (seats < 2 || seats > 8) {
      return res.status(400).json({
        success: false,
        message: "Seats must be between 2 and 8",
      });
    }

    // Process images array
    const processedImages = images.map((img, index) => ({
      url: img.url || img,
      alt: img.alt || `${name} - Image ${index + 1}`,
      isPrimary: index === 0, // First image is primary
    }));

    // Process features array
    const processedFeatures = Array.isArray(features)
      ? features.filter((feature) => feature && feature.trim())
      : [];

    // Create new car
    const newCar = new Car({
      name,
      brand,
      model,
      year: Number(year),
      category,
      transmission,
      fuelType,
      seats: Number(seats),
      images: processedImages,
      features: processedFeatures,
      specifications: specifications || {},
      location: location || "Business Bay, Dubai",
      description: description || "",
      metaTitle: metaTitle || `${brand} ${model} ${name} - Rental in Dubai`,
      metaDescription:
        metaDescription ||
        `Rent ${brand} ${model} ${name} in Dubai. Premium car rental service by ABMK Rentals.`,
      isFeatured: Boolean(isFeatured),
      isActive: Boolean(isActive !== false), // Default to true
      isAvailable: true,
      status: "Available",
    });

    await newCar.save();

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: newCar,
    });
  } catch (error) {
    console.error("Add car error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error adding car",
    });
  }
};

// Fetch all cars
const fetchAllCars = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      brand,
      category,
      status,
      isActive,
      isFeatured,
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (brand) filter.brand = brand;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      select: "-__v",
    };

    const cars = await Car.find(filter)
      .sort(options.sort)
      .limit(options.limit * options.page)
      .skip((options.page - 1) * options.limit)
      .select(options.select);

    const total = await Car.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      currentPage: options.page,
      totalPages: Math.ceil(total / options.limit),
      data: cars,
    });
  } catch (error) {
    console.error("Fetch cars error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching cars",
    });
  }
};

// Get single car by ID or slug
const getSingleCar = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by ID first, then by slug
    let car = await Car.findById(id).select("-__v");
    if (!car) {
      car = await Car.findOne({ slug: id }).select("-__v");
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
    console.error("Get car error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching car",
    });
  }
};

// Edit a car
const editCar = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Validate required fields
    if (
      updates.name === "" ||
      updates.brand === "" ||
      updates.model === "" ||
      updates.category === "" ||
      !updates.images ||
      updates.images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields cannot be empty",
      });
    }

    // Process numeric fields
    if (updates.year) updates.year = Number(updates.year);
    if (updates.seats) updates.seats = Number(updates.seats);

    // Process boolean fields
    if (updates.isActive !== undefined)
      updates.isActive = Boolean(updates.isActive);
    if (updates.isFeatured !== undefined)
      updates.isFeatured = Boolean(updates.isFeatured);
    if (updates.isAvailable !== undefined)
      updates.isAvailable = Boolean(updates.isAvailable);

    // Process images if provided
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.map((img, index) => ({
        url: img.url || img,
        alt: img.alt || `${updates.name || car.name} - Image ${index + 1}`,
        isPrimary: index === 0,
      }));
    }

    // Process features if provided
    if (updates.features && Array.isArray(updates.features)) {
      updates.features = updates.features.filter(
        (feature) => feature && feature.trim()
      );
    }

    // Update fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        car[key] = updates[key];
      }
    });

    await car.save();

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: car,
    });
  } catch (error) {
    console.error("Edit car error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error updating car",
    });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check if car has active bookings (optional - you may want to implement this)
    // const activeBookings = await Booking.find({
    //   car: id,
    //   status: { $in: ['Confirmed', 'Active'] }
    // });

    // if (activeBookings.length > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Cannot delete car with active bookings",
    //   });
    // }

    await Car.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting car",
    });
  }
};

// Toggle car availability
const toggleCarAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    car.isAvailable = !car.isAvailable;
    car.status = car.isAvailable ? "Available" : "Inactive";

    await car.save();

    res.status(200).json({
      success: true,
      message: `Car ${
        car.isAvailable ? "activated" : "deactivated"
      } successfully`,
      data: car,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error toggling car availability",
    });
  }
};

// Get car statistics
const getCarStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const availableCars = await Car.countDocuments({ isAvailable: true });
    const featuredCars = await Car.countDocuments({ isFeatured: true });
    const rentedCars = await Car.countDocuments({ status: "Rented" });

    const brandStats = await Car.aggregate([
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const categoryStats = await Car.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCars,
        availableCars,
        featuredCars,
        rentedCars,
        brandStats,
        categoryStats,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching car statistics",
    });
  }
};

module.exports = {
  handleImageUpload,
  addCar,
  fetchAllCars,
  getSingleCar,
  editCar,
  deleteCar,
  toggleCarAvailability,
  getCarStats,
};
