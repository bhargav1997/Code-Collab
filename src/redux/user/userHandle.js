import { createAsyncThunk } from "@reduxjs/toolkit";
import { CONFIG } from "../../config";
import { setUser, clearUser, setLoading, setError, updateUserSettings } from "./userSlice";

// Add API base URL to a constant
const API_BASE_URL = CONFIG.API_URL;

// Get user settings with request cancellation
export const getUserSettings = () => async (dispatch) => {
   const controller = new AbortController();
   dispatch(setLoading(true));

   try {
      const response = await fetch(`${API_BASE_URL}/users/settings`, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
         },
         signal: controller.signal,
      });

      const data = await response.json();

      if (data.success) {
         dispatch(updateUserSettings(data.user.settings));
      } else {
         throw new Error(data.message);
      }
   } catch (error) {
      if (error.name === "AbortError") {
         // Handle abort error silently
         return;
      }
      dispatch(setError(error.message));
      throw error;
   } finally {
      dispatch(setLoading(false));
   }

   return () => controller.abort();
};

// Update user settings with request cancellation
export const updateSettings = (settings) => async (dispatch) => {
   const controller = new AbortController();
   dispatch(setLoading(true));

   try {
      const response = await fetch(`${API_BASE_URL}/users/settings`, {
         method: "PUT",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ settings }),
         signal: controller.signal,
      });

      const data = await response.json();

      if (data.success) {
         dispatch(updateUserSettings(data.user.settings));
         return data;
      } else {
         throw new Error(data.message);
      }
   } catch (error) {
      if (error.name === "AbortError") {
         // Handle abort error silently
         return;
      }
      dispatch(setError(error.message));
      throw error;
   } finally {
      dispatch(setLoading(false));
   }
};

export const getUser = (user) => async (dispatch) => {
   dispatch(setUser(user));
};

export const deleteUser = () => async (dispatch) => {
   dispatch(clearUser());
};

// export const fetchConnections = () => async (dispatch) => {
//    dispatch(setLoading(true));
//    try {
//       const data = await fetchUserConnections();
//       dispatch(setConnections(data));
//    } catch (error) {
//       console.error("Error fetching connections:", error);
//       dispatch(setError(error.message));
//    } finally {
//       dispatch(setLoading(false));
//    }
// };

// Helper function for error handling
const handleError = (error, dispatch) => {
   const errorMessage = error.response?.data?.message || error.message || "An error occurred";
   dispatch(setError(errorMessage));
   return errorMessage;
};

export const deleteAccount = createAsyncThunk("user/deleteAccount", async ({ reason }, { rejectWithValue, dispatch }) => {
   try {
      dispatch(setLoading(true));
      const token = localStorage.getItem("token");

      const response = await fetch(`${CONFIG.API_URL}/account/delete-account`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
         },
         body: JSON.stringify({
            deletionReason: reason,
            confirmDeletion: true,
         }),
      });

      const data = await response.json();

      if (!response.ok) {
         const error = handleError(data, dispatch);
         return rejectWithValue(error);
      }

      dispatch(setLoading(false));
      dispatch(setUser(null));
      return data;
   } catch (error) {
      const errorMessage = handleError(error, dispatch);
      return rejectWithValue(errorMessage);
   } finally {
      dispatch(setLoading(false));
   }
});

// Check account status
export const checkAccountStatus = createAsyncThunk(
   "user/checkAccountStatus",
   async ({ email }, { rejectWithValue }) => {
      try {
         const response = await fetch(`${CONFIG.API_URL}/account/check-status`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
         });

         const data = await response.json();

         console.log(response.ok);

         if (!response.ok) {
            return rejectWithValue(data.message || `Error: ${response.status}`);
         }

         return data;
      } catch (error) {
         return rejectWithValue(error.message || "Failed to check account status");
      }
   }
);

// Cancel account deletion
export const cancelDeletion = createAsyncThunk(
   "user/cancelDeletion",
   async ({ email }, { rejectWithValue }) => {
      try {
         const response = await fetch(`${CONFIG.API_URL}/account/cancel-deletion`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
         });

         const data = await response.json();

         if (!response.ok) {
            return rejectWithValue(data.message || "Failed to cancel deletion");
         }

         return data;
      } catch (error) {
         return rejectWithValue(error.message || "Network error occurred");
      }
   }
);

// Add this new thunk
export const loginUser = createAsyncThunk("user/login", async ({ email, password, rememberMe }, { rejectWithValue }) => {
   try {
      const response = await fetch(`${CONFIG.API_URL}/users/login`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
         return rejectWithValue(data.message || "Login failed");
      }

      return data;
   } catch (error) {
      return rejectWithValue("Network error occurred");
   }
});
