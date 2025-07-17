import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  loginAdmin,
  logoutAdmin,
  checkAuthStatus,
  refreshToken,
  clearError,
  setCredentialsFromStorage,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken,
} from "../store/auth-slice";

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const accessToken = useAppSelector(selectAccessToken);

  // Initialize auth on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");

      if (token) {
        try {
          // Check if token is still valid
          await dispatch(checkAuthStatus()).unwrap();
        } catch (error) {
          // Token is invalid, try to refresh
          try {
            await dispatch(refreshToken()).unwrap();
            await dispatch(checkAuthStatus()).unwrap();
          } catch (refreshError) {
            // Refresh failed, clear storage
            localStorage.removeItem("adminToken");
            sessionStorage.removeItem("adminToken");
          }
        }
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // Set up token refresh interval (every 14 minutes for 15-minute tokens)
      const refreshInterval = setInterval(() => {
        dispatch(refreshToken());
      }, 14 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, accessToken, dispatch]);

  // Auth functions
  const login = async (
    credentials: { email: string; password: string },
    rememberMe = false
  ) => {
    try {
      const result = await dispatch(loginAdmin(credentials)).unwrap();

      // Store token based on remember me option
      if (rememberMe) {
        localStorage.setItem("adminToken", result.accessToken);
      } else {
        sessionStorage.setItem("adminToken", result.accessToken);
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
    } catch (error) {
      // Continue with logout even if server request fails
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const checkAuth = async () => {
    try {
      await dispatch(checkAuthStatus()).unwrap();
    } catch (error) {
      throw error;
    }
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    lastLoginTime: auth.lastLoginTime,

    // Actions
    login,
    logout,
    clearAuthError,
    checkAuth,
  };
};
