import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface CheckAuthProps {
  isAuthenticated: boolean;
  user: User | null;
  children: ReactNode;
}

function CheckAuth({ isAuthenticated, user, children }: CheckAuthProps) {
  const location = useLocation();

  console.log(
    `[2025-07-20 16:49:38] Route: ${
      location.pathname
    }, Auth: ${isAuthenticated}, User: ${user?.role || "guest"}`
  );

  // Admin routes protection
  if (location.pathname.includes("/admin")) {
    // Admin login page - allow access if not authenticated
    if (location.pathname === "/admin/login") {
      // If already authenticated admin, redirect to dashboard
      if (isAuthenticated && user?.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
      // Allow access to login page
      return <>{children}</>;
    }

    // Other admin routes - require authentication
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }

    // Check if user is actually an admin
    if (user?.role !== "admin") {
      return <Navigate to="/unauth" replace />;
    }

    // Admin is authenticated, allow access
    return <>{children}</>;
  }

  // Handle /admin route (without /login or /dashboard)
  if (location.pathname === "/admin") {
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/unauth" replace />;
  }

  // Public routes - allow access to everyone (both authenticated and non-authenticated users)
  if (
    location.pathname === "/" ||
    location.pathname === "/home" ||
    location.pathname.includes("/cars") ||
    location.pathname.includes("/about") ||
    location.pathname.includes("/contact") ||
    location.pathname.includes("/luxury") ||
    location.pathname.includes("/sports") ||
    location.pathname.includes("/suv") ||
    location.pathname.includes("/sedan") ||
    location.pathname.includes("/convertible") ||
    location.pathname.includes("/coupe")
  ) {
    // These are public routes - accessible to everyone
    return <>{children}</>;
  }

  // Default - allow access
  return <>{children}</>;
}

export default CheckAuth;
