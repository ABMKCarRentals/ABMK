# ABMK Car Rentals - Server Documentation

This documentation covers the **backend (server)** part of the ABMK Car Rentals project. The server is built with **Node.js**, **Express**, **Mongoose**, and provides a REST API for car data.

---

## 📁 Project Structure

```
server/
  controllers/
    user/
      car-controller.js
  models/
    car.js
  routes/
    cars.js
  middleware/
    rateLimiter.js
  app.js
  server.js
.env
```

---

## 🚀 Main Technologies

- **Node.js**: JavaScript runtime.
- **Express**: Server and routing.
- **MongoDB + Mongoose**: Database and ORM.
- **dotenv**: Environment variables.
- **Cloudinary**: Image storage (optional).

---

## 🌐 API Endpoints

### Car Endpoints

- `/api/cars` – Fetch all cars (with filters, sorting, pagination, search)
- `/api/cars/featured` – Get featured cars
- `/api/cars/:id` – Get car by ID
- `/api/cars/:id/related` – Get related cars
- `/api/cars/increment-view` – Increment car view count
- `/api/cars/brand/:brand` – Get cars by brand

### Category Endpoints

- `/api/cars/luxury`
- `/api/cars/sports`
- `/api/cars/suv`
- `/api/cars/sedan`
- `/api/cars/convertible`
- `/api/cars/coupe`

### Filtering & Search

- All endpoints support query parameters for filtering (brand, transmission, fuelType, year, seats, search, etc.).

---

## 🗃️ Models

### Car Model (`models/car.js`)

- Contains all car info except price fields.
- Includes: name, brand, model, year, category, transmission, fuelType, seats, images, features, specs, location, description, status, isAvailable, isFeatured, viewCount, bookingCount, createdAt, updatedAt, slug.

---

## 🧩 Controllers

### Car Controller (`controllers/user/car-controller.js`)

- Main controller for car logic:
  - Get all cars
  - Get cars by category
  - Get cars by brand
  - Get featured cars
  - Get car by ID
  - Get related cars
  - Increment view count
- Handles filter parsing, pagination, and sorting.

---

## 🚦 Rate Limiting

- Rate limiting middleware on all relevant endpoints.
- Uses express-rate-limit for protection.
- Returns HTTP 429 and retry-after headers.

---

## 🛡️ Middleware

- **rateLimiter.js**: Controls API request rates per endpoint.
- **Error handling**: Consistent error responses.

---

## 🧭 Routing

- **cars.js**: All car-related routes.
- Specific routes are defined before generic `/:id` route to avoid conflicts.

---

## ⚙️ Environment

- `.env` file for environment variables (MongoDB URI, Cloudinary config, etc.)

---

## 💡 Features

- **Category-specific endpoints**: Fast and efficient category queries.
- **Search and filter support**: All major car fields.
- **View tracking**: Car view counts.
- **Featured cars**: Highlighted cars.
- **Related cars**: Based on current car for recommendations.

---

## 📝 Notes

- No price fields are used or required.
- Make sure your database has the needed car data for all categories.
- All endpoints are RESTful and return JSON.

---

## 🧑‍💻 Developer Tips

- Put specific routes before generic ones for Express route matching.
- Use Mongoose queries for advanced filtering.
- Extend schema and controllers as needed for new features.
- Check logs for filter criteria when debugging.

---
