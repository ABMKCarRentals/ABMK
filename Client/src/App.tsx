import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

import loader from "./assets/speedometer-loader-unscreen.gif";

// Components
import CheckAuth from "./components/common/Checkauth";

// Pages
import Home from "./pages/home/home";
import AdminLogin from "./components/auth/login";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/Dashboard";
import UnAuthPage from "./pages/unauth-page";
import NotFound from "./pages/not-found";

// Car Pages
import CarsPage from "./pages/cars/cars";
import CarDetails from "./pages/cars/car-details";
import LuxuryCars from "./pages/cars/luxury";
import SportsCars from "./pages/cars/sports";
import SUVCars from "./pages/cars/suv";
import SedanCars from "./pages/cars/sedan";
import ConvertibleCars from "./pages/cars/convertible";
import CoupeCars from "./pages/cars/coupe";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";

// Redux
import { useAuth } from "./hooks/useAuth";
import AdminCars from "./pages/admin/Cars";

function App() {
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show loader while app is initializing or auth is loading
  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <img
          src={loader}
          alt="Loading..."
          className="w-80 h-80 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Public Routes - Default for users */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Home />
            </CheckAuth>
          }
        />

        <Route
          path="/home"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Home />
            </CheckAuth>
          }
        />

        {/* Car Routes - Public */}
        <Route
          path="/cars"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <CarsPage />
            </CheckAuth>
          }
        />

        <Route
          path="/cars/:id"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <CarDetails />
            </CheckAuth>
          }
        />

        {/* Category Routes - Public */}
        <Route
          path="/luxury"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <LuxuryCars />
            </CheckAuth>
          }
        />

        <Route
          path="/sports"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <SportsCars />
            </CheckAuth>
          }
        />

        <Route
          path="/suv"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <SUVCars />
            </CheckAuth>
          }
        />

        <Route
          path="/sedan"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <SedanCars />
            </CheckAuth>
          }
        />

        <Route
          path="/convertible"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ConvertibleCars />
            </CheckAuth>
          }
        />

        <Route
          path="/coupe"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <CoupeCars />
            </CheckAuth>
          }
        />

        {/* Other Public Routes */}
        <Route
          path="/about"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AboutPage />
            </CheckAuth>
          }
        />

        <Route
          path="/contact"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ContactPage />
            </CheckAuth>
          }
        />

        {/* Admin Login Route - Separate route for admins */}
        <Route
          path="/admin/login"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLogin />
            </CheckAuth>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="cars" element={<AdminCars />} />
        </Route>

        {/* Error Routes */}
        <Route path="/unauth" element={<UnAuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
