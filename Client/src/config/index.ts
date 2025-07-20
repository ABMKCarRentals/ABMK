export const addCarFormElements = [
  {
    label: "Car Name *",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter car name (e.g., 488 GTB)",
  },
  {
    label: "Brand *",
    name: "brand",
    componentType: "select",
    options: [
      { id: "Ferrari", label: "Ferrari" },
      { id: "Lamborghini", label: "Lamborghini" },
      { id: "Bentley", label: "Bentley" },
      { id: "Rolls Royce", label: "Rolls Royce" },
      { id: "Porsche", label: "Porsche" },
      { id: "Mercedes", label: "Mercedes" },
      { id: "BMW", label: "BMW" },
      { id: "Audi", label: "Audi" },
      { id: "Other", label: "Other" },
    ],
  },
  {
    label: "Model *",
    name: "model",
    componentType: "input",
    type: "text",
    placeholder: "Enter car model (e.g., 488, Huracan)",
  },
  {
    label: "Year *",
    name: "year",
    componentType: "input",
    type: "number",
    placeholder: "Enter manufacture year",
    min: 1990,
    max: new Date().getFullYear() + 1,
  },
  {
    label: "Category *",
    name: "category",
    componentType: "select",
    options: [
      { id: "Luxury", label: "Luxury" },
      { id: "Sports", label: "Sports" },
      { id: "SUV", label: "SUV" },
      { id: "Sedan", label: "Sedan" },
      { id: "Convertible", label: "Convertible" },
      { id: "Coupe", label: "Coupe" },
      { id: "Hatchback", label: "Hatchback" },
    ],
  },
  {
    label: "Transmission *",
    name: "transmission",
    componentType: "select",
    options: [
      { id: "Automatic", label: "Automatic" },
      { id: "Manual", label: "Manual" },
    ],
  },
  {
    label: "Fuel Type *",
    name: "fuelType",
    componentType: "select",
    options: [
      { id: "Petrol", label: "Petrol" },
      { id: "Diesel", label: "Diesel" },
      { id: "Electric", label: "Electric" },
      { id: "Hybrid", label: "Hybrid" },
    ],
  },
  {
    label: "Number of Seats *",
    name: "seats",
    componentType: "select",
    options: [
      { id: "2", label: "2 Seats" },
      { id: "4", label: "4 Seats" },
      { id: "5", label: "5 Seats" },
      { id: "7", label: "7 Seats" },
      { id: "8", label: "8 Seats" },
    ],
  },
  {
    label: "Price Per Day (AED) *",
    name: "pricePerDay",
    componentType: "input",
    type: "number",
    placeholder: "Enter daily rental price",
    min: 0,
  },
  {
    label: "Price Per Week (AED)",
    name: "pricePerWeek",
    componentType: "input",
    type: "number",
    placeholder: "Enter weekly rental price (optional)",
    min: 0,
  },
  {
    label: "Price Per Month (AED)",
    name: "pricePerMonth",
    componentType: "input",
    type: "number",
    placeholder: "Enter monthly rental price (optional)",
    min: 0,
  },
  {
    label: "Location",
    name: "location",
    componentType: "input",
    type: "text",
    placeholder: "Enter pickup location",
    defaultValue: "Business Bay, Dubai",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter car description, features, and highlights",
    rows: 4,
  },
  {
    label: "Car Features",
    name: "features",
    componentType: "multiselect",
    placeholder: "Select car features",
    options: [
      { id: "Air Conditioning", label: "Air Conditioning" },
      { id: "Bluetooth", label: "Bluetooth" },
      { id: "GPS Navigation", label: "GPS Navigation" },
      { id: "Leather Seats", label: "Leather Seats" },
      { id: "Sunroof", label: "Sunroof" },
      { id: "Backup Camera", label: "Backup Camera" },
      { id: "Parking Sensors", label: "Parking Sensors" },
      { id: "Keyless Entry", label: "Keyless Entry" },
      { id: "Push Start", label: "Push Start" },
      { id: "Cruise Control", label: "Cruise Control" },
      { id: "Premium Sound System", label: "Premium Sound System" },
      { id: "USB Charging", label: "USB Charging" },
      { id: "WiFi Hotspot", label: "WiFi Hotspot" },
      { id: "Heated Seats", label: "Heated Seats" },
      { id: "Ventilated Seats", label: "Ventilated Seats" },
      { id: "Apple CarPlay", label: "Apple CarPlay" },
      { id: "Android Auto", label: "Android Auto" },
      { id: "Wireless Charging", label: "Wireless Charging" },
      { id: "360 Camera", label: "360° Camera" },
      { id: "Lane Assist", label: "Lane Assist" },
      { id: "Adaptive Cruise Control", label: "Adaptive Cruise Control" },
      { id: "Blind Spot Monitor", label: "Blind Spot Monitor" },
    ],
  },
];

// Specifications form elements (separate section)
export const carSpecificationElements = [
  {
    label: "Engine",
    name: "specifications.engine",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 3.9L V8 Twin Turbo",
  },
  {
    label: "Horsepower",
    name: "specifications.horsepower",
    componentType: "input",
    type: "number",
    placeholder: "e.g., 661",
    min: 0,
  },
  {
    label: "Top Speed (km/h)",
    name: "specifications.topSpeed",
    componentType: "input",
    type: "number",
    placeholder: "e.g., 330",
    min: 0,
  },
  {
    label: "Acceleration (0-100 km/h)",
    name: "specifications.acceleration",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 3.0 seconds",
  },
  {
    label: "Mileage",
    name: "specifications.mileage",
    componentType: "input",
    type: "text",
    placeholder: "e.g., 15 km/l city, 20 km/l highway",
  },
  {
    label: "Exterior Color",
    name: "specifications.color",
    componentType: "select",
    options: [
      { id: "Red", label: "Red" },
      { id: "Black", label: "Black" },
      { id: "White", label: "White" },
      { id: "Blue", label: "Blue" },
      { id: "Silver", label: "Silver" },
      { id: "Gray", label: "Gray" },
      { id: "Yellow", label: "Yellow" },
      { id: "Green", label: "Green" },
      { id: "Orange", label: "Orange" },
      { id: "Brown", label: "Brown" },
      { id: "Gold", label: "Gold" },
      { id: "Pearl White", label: "Pearl White" },
      { id: "Matte Black", label: "Matte Black" },
      { id: "Metallic Blue", label: "Metallic Blue" },
    ],
  },
  {
    label: "Interior Color",
    name: "specifications.interiorColor",
    componentType: "select",
    options: [
      { id: "Black", label: "Black" },
      { id: "Beige", label: "Beige" },
      { id: "Brown", label: "Brown" },
      { id: "Red", label: "Red" },
      { id: "White", label: "White" },
      { id: "Gray", label: "Gray" },
      { id: "Tan", label: "Tan" },
      { id: "Blue", label: "Blue" },
    ],
  },
];

// SEO and Meta form elements (separate section)
export const carSEOElements = [
  {
    label: "Meta Title",
    name: "metaTitle",
    componentType: "input",
    type: "text",
    placeholder: "SEO title for the car page",
    maxLength: 60,
  },
  {
    label: "Meta Description",
    name: "metaDescription",
    componentType: "textarea",
    placeholder: "SEO description for the car page",
    maxLength: 160,
    rows: 3,
  },
];

// Admin settings form elements (separate section)
export const carAdminElements = [
  {
    label: "Featured Car",
    name: "isFeatured",
    componentType: "switch",
    description: "Display this car in featured section",
  },
  {
    label: "Active Status",
    name: "isActive",
    componentType: "switch",
    description: "Make this car visible to users",
    defaultValue: true,
  },
  {
    label: "Available for Booking",
    name: "isAvailable",
    componentType: "switch",
    description: "Allow users to book this car",
    defaultValue: true,
  },
];

// Image upload configuration
export const carImageConfig = {
  maxImages: 10,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  recommendedDimensions: {
    width: 1200,
    height: 800,
  },
};

// Validation rules
export const carValidationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  brand: {
    required: true,
  },
  model: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  year: {
    required: true,
    min: 1990,
    max: new Date().getFullYear() + 1,
  },
  category: {
    required: true,
  },
  transmission: {
    required: true,
  },
  fuelType: {
    required: true,
  },
  seats: {
    required: true,
    min: 2,
    max: 8,
  },
  pricePerDay: {
    required: true,
    min: 0,
  },
  images: {
    required: true,
    minCount: 1,
    maxCount: 10,
  },
  description: {
    maxLength: 1000,
  },
  metaTitle: {
    maxLength: 60,
  },
  metaDescription: {
    maxLength: 160,
  },
};

// Default form values
export const defaultCarFormValues = {
  name: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  category: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  seats: "5",
  pricePerDay: "",
  pricePerWeek: "",
  pricePerMonth: "",
  location: "Business Bay, Dubai",
  description: "",
  features: [],
  specifications: {
    engine: "",
    horsepower: "",
    topSpeed: "",
    acceleration: "",
    mileage: "",
    color: "",
    interiorColor: "",
  },
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  isActive: true,
  isAvailable: true,
  images: [],
};
