import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  lastLoginTime: null,
};

// Async thunks
export const loginAdmin = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const logoutAdmin = createAsyncThunk<void, void>(
  "auth/logoutAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Logout failed");
      }

      // Clear stored tokens
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminToken");
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

export const refreshToken = createAsyncThunk<{ accessToken: string }, void>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for refresh token
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Token refresh failed");
      }

      return { accessToken: data.accessToken };
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
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

      const response = await fetch("/api/auth/check-auth", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.success) {
        return rejectWithValue(data.message || "Authentication check failed");
      }

      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Set credentials from storage (on app init)
    setCredentialsFromStorage: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    // Reset auth state
    resetAuthState: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.lastLoginTime = null;
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
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
      });

    // Refresh Token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
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
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  setCredentialsFromStorage,
  resetAuthState,
  updateUserProfile,
  setLoading,
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

// Export reducer
export default authSlice.reducer;
