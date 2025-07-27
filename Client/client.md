# ABMK Car Rentals - Client Documentation

This documentation covers the **frontend (client)** part of the ABMK Car Rentals project. The client is built with **React**, **Redux Toolkit**, **React Router**, and uses a modular UI component system. It communicates with the backend via REST APIs.

---

## 📁 Project Structure

```
src/
  components/
    cars/
      car-card.jsx
      image-gallery.jsx
    common/
      loading-spinner.jsx
    home/
      navbar.jsx
      footer.jsx
    ui/
      button.jsx
      input.jsx
      label.jsx
      select.jsx
      badge.jsx
      card.jsx
      sheet.jsx
      tabs.jsx
      alert.jsx
  hooks/
    useCars.ts
  pages/
    cars/
      cars.jsx
      car-details.jsx
  store/
    car-slice.ts
  App.jsx
  main.jsx
public/
  index.html
```

---

## 🚀 Main Technologies

- **React**: SPA with functional components and hooks.
- **Redux Toolkit**: State management, async thunks, and slices.
- **React Router**: Routing for pages and car details.
- **Axios**: API calls to backend.
- **Lucide Icons**: SVG icons.
- **Tailwind CSS** (or similar): UI styling.

---

## 📦 State Management

### Car Slice (`store/car-slice.ts`)

- Manages car state: all cars, categories, brands, filters, pagination, errors, loading states.
- Uses **Redux Toolkit's createSlice** and **createAsyncThunk** for async actions.
- Handles:
  - Fetching all cars (`getAllCars`)
  - Fetching category cars (`getLuxuryCars`, etc.)
  - Fetching cars by brand
  - Fetching car by id
  - Fetching related cars
  - Incrementing view count
- Includes selectors for each type of car data.

---

## 🔄 API Integration

- All API calls use a configured Axios instance.
- API endpoints are mapped to Redux thunks.
- Rate limiting and error handling are implemented on the client for better UX.

### Example API Usage

```js
// In useCars hook
const { data, isLoading } = useSelector(selectCars);
const dispatch = useDispatch();

useEffect(() => {
  dispatch(getAllCars({ page: 1, limit: 12 }));
}, []);
```

---

## 🏷️ Components

- **CarCard**: Displays car info, status, badges, and actions.
- **ImageGallery**: Responsive image carousel for car images.
- **LoadingSpinner**: Shown during API calls.
- **Navbar, Footer**: Layout components.
- **UI Components**: Button, Input, Select, Badge, Card, Sheet, Tabs, Alert.

---

## 📄 Pages

### `CarsPage`

- Displays car listing with tabs for category.
- Implements filters, sorting, search, pagination, grid/list view.
- Handles rate limiting and loading states gracefully.

### `CarDetails`

- Shows detailed car info, specs, features, images, and related cars.
- No price information is shown as per requirements.
- Includes WhatsApp and call-to-action buttons for inquiries.

---

## 🧭 Routing

- `/cars` – Car listing page
- `/cars/:id` – Car details page
- Other routes for home, etc.

---

## 💡 Features

- **Category tabs**: Loads cars per category using category-specific API endpoints.
- **Filters/search**: Brand, transmission, fuel type, seats, year, sort.
- **Responsive UI**: Works on desktop and mobile.
- **Debounced API calls**: Prevents excessive requests.
- **Error handling**: User-friendly error and rate limit alerts.
- **View count**: View tracking per car.
- **Related cars**: Displays similar cars on details page.

---

## ⚠️ Rate Limiting

- Rate limit warnings shown.
- API calls are debounced and controlled to avoid repeated requests.

---

## 🛠️ Extending & Customizing

- Add new categories or filters by extending car-slice and UI components.
- Customize UI using Tailwind or your preferred CSS.

---

## 📝 Notes

- No price fields are shown or used.
- All category and brand data are fetched from the backend.
- Components are reusable and modular.

---

## 🧑‍💻 Developer Tips

- All async logic is in Redux thunks for testability.
- Use selectors to get any car data from the store.
- For new API endpoints, add a thunk and call from your components/hooks.

---
