import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosResponse } from "axios";

// Configure axios instance for auth
const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_PORT,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth operations
authApiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for auth operations
authApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastLoginTime: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  message?: string;
}

interface CheckAuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginTime: null,
};

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText;
      return `Server Error (${error.response.status}): ${message}`;
    } else if (error.request) {
      return "Network Error: Unable to connect to server. Please check your internet connection.";
    } else {
      return `Request Error: ${error.message}`;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

// Async thunks
export const loginAdmin = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApiClient.post<LoginResponse>(
        "/api/auth/admin/login",
        credentials
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("adminToken", response.data.accessToken);

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const logoutAdmin = createAsyncThunk<LogoutResponse, void>(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApiClient.post<LogoutResponse>(
        "/api/auth/admin/logout"
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Logout failed");
      }

      // Clear stored tokens
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");

      return response.data;
    } catch (error) {
      // Even if the request fails, clear local tokens
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const refreshToken = createAsyncThunk<{ accessToken: string }, void>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApiClient.post<RefreshTokenResponse>(
        "/api/auth/refresh-token"
      );

      if (!response.data.success) {
        return rejectWithValue(response.data.message || "Token refresh failed");
      }

      // Update stored token
      localStorage.setItem("adminToken", response.data.accessToken);

      return { accessToken: response.data.accessToken };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const checkAuthStatus = createAsyncThunk<User, void>(
  "auth/checkAuthStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token =
        state.auth.accessToken ||
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");

      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await authApiClient.get<CheckAuthResponse>(
        "/api/auth/check-auth"
      );

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Authentication check failed"
        );
      }

      return response.data.user;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Change password thunk
export const changePassword = createAsyncThunk<
  { success: boolean; message: string },
  { currentPassword: string; newPassword: string }
>(
  "auth/changePassword",
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authApiClient.post<{
        success: boolean;
        message: string;
      }>("/api/auth/change-password", { currentPassword, newPassword });

      if (!response.data.success) {
        return rejectWithValue(
          response.data.message || "Password change failed"
        );
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Forgot password thunk
export const forgotPassword = createAsyncThunk<
  { success: boolean; message: string },
  { email: string }
>("auth/forgotPassword", async ({ email }, { rejectWithValue }) => {
  try {
    const response = await authApiClient.post<{
      success: boolean;
      message: string;
    }>("/api/auth/forgot-password", { email });

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Password reset failed");
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

// Reset password thunk
export const resetPassword = createAsyncThunk<
  { success: boolean; message: string },
  { token: string; newPassword: string }
>("auth/resetPassword", async ({ token, newPassword }, { rejectWithValue }) => {
  try {
    const response = await authApiClient.post<{
      success: boolean;
      message: string;
    }>("/api/auth/reset-password", { token, newPassword });

    if (!response.data.success) {
      return rejectWithValue(response.data.message || "Password reset failed");
    }

    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setCredentialsFromStorage: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    resetAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastLoginTime = null;

      // Clear stored tokens
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Manual logout without API call
    forceLogout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastLoginTime = null;

      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    // Login Admin
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.lastLoginTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload as string;
      });

    // Logout Admin
    builder
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.lastLoginTime = null;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still clear auth state even if logout request fails
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.lastLoginTime = null;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCredentialsFromStorage,
  resetAuthState,
  updateUserProfile,
  setLoading,
  forceLogout,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectLastLoginTime = (state: { auth: AuthState }) =>
  state.auth.lastLoginTime;

// Computed selectors
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.user?.role === "admin";

export const selectUserInfo = (state: { auth: AuthState }) => ({
  id: state.auth.user?.id || null,
  email: state.auth.user?.email || null,
  name: state.auth.user?.name || null,
  role: state.auth.user?.role || null,
  isAuthenticated: state.auth.isAuthenticated,
  lastLoginTime: state.auth.lastLoginTime,
});

export default authSlice.reducer;

export { authApiClient };
