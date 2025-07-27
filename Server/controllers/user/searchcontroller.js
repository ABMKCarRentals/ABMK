const Car = require("../../models/car");
const _ = require("lodash");

/**
 * Search cars by keyword (brand, model, name, description, category, fuelType, transmission, location)
 * GET /api/cars/search/:keyword
 */
const searchCars = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    // Escape and build regex for keyword
    const safeKeyword = _.escapeRegExp(keyword);
    const regEx = new RegExp(safeKeyword, "i");

    // Build search query according to car schema
    const createSearchQuery = {
      $or: [
        { name: regEx },
        { brand: regEx },
        { model: regEx },
        { description: regEx },
        { category: regEx },
        { fuelType: regEx },
        { transmission: regEx },
        { location: regEx },
      ],
      isActive: true,
      isAvailable: true,
    };

    const searchResults = await Car.find(createSearchQuery).sort({
      viewCount: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for cars.",
    });
  }
};

module.exports = { searchCars };
