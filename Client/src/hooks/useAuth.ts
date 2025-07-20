import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  loginAdmin,
  logoutAdmin,
  refreshToken,
  checkAuthStatus,
  changePassword,
  forgotPassword,
  resetPassword,
  clearError,
  setCredentialsFromStorage,
  resetAuthState,
  updateUserProfile,
  setLoading,
  forceLogout,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken,
  selectLastLoginTime,
  selectIsAdmin,
  selectUserInfo,
} from "../store/auth-slice";

interface LoginCredentials {
  email: string;
  password: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const auth = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const accessToken = useAppSelector(selectAccessToken);
  const lastLoginTime = useAppSelector(selectLastLoginTime);
  const isAdmin = useAppSelector(selectIsAdmin);
  const userInfo = useAppSelector(selectUserInfo);

  // Auth actions
  const login = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginAdmin(credentials));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutAdmin());
  }, [dispatch]);

  const refreshAuthToken = useCallback(() => {
    return dispatch(refreshToken());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(checkAuthStatus());
  }, [dispatch]);

  const updatePassword = useCallback(
    (passwordData: ChangePasswordData) => {
      return dispatch(changePassword(passwordData));
    },
    [dispatch]
  );

  const requestPasswordReset = useCallback(
    (email: string) => {
      return dispatch(forgotPassword({ email }));
    },
    [dispatch]
  );

  const resetUserPassword = useCallback(
    (resetData: ResetPasswordData) => {
      return dispatch(resetPassword(resetData));
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setAuthLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoading(loading));
    },
    [dispatch]
  );

  const updateProfile = useCallback(
    (
      profileData: Partial<{
        id: string;
        email: string;
        name: string;
        role: string;
      }>
    ) => {
      dispatch(updateUserProfile(profileData));
    },
    [dispatch]
  );

  const resetAuth = useCallback(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  const forceLogoutUser = useCallback(() => {
    dispatch(forceLogout());
  }, [dispatch]);

  const restoreFromStorage = useCallback(
    (token: string, userData: any) => {
      dispatch(setCredentialsFromStorage({ token, user: userData }));
    },
    [dispatch]
  );

  // Auto-check auth on mount
  useEffect(() => {
    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    if (token && !isAuthenticated && !user) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated, user]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // Set up token refresh interval (refresh every 30 minutes)
      const refreshInterval = setInterval(() => {
        refreshAuthToken();
      }, 30 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, accessToken, refreshAuthToken]);

  // Handle token expiry
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "adminToken" && !e.newValue && isAuthenticated) {
        // Token was removed from storage, force logout
        forceLogoutUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isAuthenticated, forceLogoutUser]);

  return {
    // State
    auth,
    user,
    isAuthenticated,
    isLoading,
    error,
    accessToken,
    lastLoginTime,
    isAdmin,
    userInfo,

    // Actions
    login,
    logout,
    refreshAuthToken,
    checkAuth,
    updatePassword,
    requestPasswordReset,
    resetUserPassword,
    clearAuthError,
    setAuthLoading,
    updateProfile,
    resetAuth,
    forceLogoutUser,
    restoreFromStorage,

    // Utility functions
    hasRole: (role: string) => user?.role === role,
    isTokenValid: () => !!accessToken && isAuthenticated,
    getAuthHeader: () => (accessToken ? `Bearer ${accessToken}` : null),
  };
};
