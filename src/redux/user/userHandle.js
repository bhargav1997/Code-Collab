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
         signal: controller.signal
      });

      const data = await response.json();

      if (data.success) {
         dispatch(updateUserSettings(data.user.settings));
      } else {
         throw new Error(data.message);
      }
   } catch (error) {
      if (error.name === 'AbortError') {
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
         signal: controller.signal
      });

      const data = await response.json();

      if (data.success) {
         dispatch(updateUserSettings(data.user.settings));
         return data;
      } else {
         throw new Error(data.message);
      }
   } catch (error) {
      if (error.name === 'AbortError') {
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
