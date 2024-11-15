import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../config";

// Helper function to get the token
const getToken = () => {
  return localStorage.getItem('token');
};

export const fetchChallenges = createAsyncThunk("challenges/fetchChallenges", async (_, { rejectWithValue }) => {
   try {
      const response = await axios.get(`${CONFIG.API_URL}/challenges`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
   } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch challenges");
   }
});

export const createChallenge = createAsyncThunk("challenges/createChallenge", async (challengeData, { rejectWithValue }) => {
   try {
      const dataToSend = {
         name: challengeData.name,
         description: challengeData.description,
         duration: Number(challengeData.duration || challengeData.customDuration),
         tasks: challengeData.tasks.filter(task => task.trim() !== "")
      };

      const response = await axios.post(`${CONFIG.API_URL}/challenges`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
   } catch (error) {
      return rejectWithValue(error.message || "Failed to create challenge");
   }
});

export const updateChallenge = createAsyncThunk("challenges/updateChallenge", async (challengeData, { rejectWithValue }) => {
   try {
      const dataToSend = {
         _id: challengeData._id,
         currentDay: challengeData.currentDay,
         lastCompletedDay: challengeData.lastCompletedDay,
         lastCompletedAt: challengeData.lastCompletedAt
      };

      const response = await axios.put(`${CONFIG.API_URL}/challenges/${challengeData._id}`, dataToSend, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
   } catch (error) {
      return rejectWithValue(error.message || "Failed to update challenge");
   }
});

export const deleteChallenge = createAsyncThunk(
  'challenges/deleteChallenge',
  async (challengeId, { rejectWithValue }) => {
    try {
      await axios.delete(`${CONFIG.API_URL}/challenges/${challengeId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return challengeId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete challenge');
    }
  }
);

const challengesSlice = createSlice({
   name: "challenges",
   initialState: {
      challenges: [],
      status: "idle",
      error: null,
   },
   reducers: {
      clearError: (state) => {
         state.error = null;
      }
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchChallenges.pending, (state) => {
            state.status = "loading";
            state.error = null;
         })
         .addCase(fetchChallenges.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.challenges = action.payload;
            state.error = null;
         })
         .addCase(fetchChallenges.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
         })
         .addCase(createChallenge.fulfilled, (state, action) => {
            state.challenges.push(action.payload);
            state.error = null;
         })
         .addCase(createChallenge.rejected, (state, action) => {
            state.error = action.payload;
         })
         .addCase(updateChallenge.pending, (state) => {
            state.status = "loading";
            state.error = null;
         })
         .addCase(updateChallenge.fulfilled, (state, action) => {
            const index = state.challenges.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
               state.challenges[index] = {
                  ...state.challenges[index],
                  ...action.payload,
                  lastCompletedAt: action.payload.lastCompletedAt || null
               };
            }
            state.status = "succeeded";
            state.error = null;
         })
         .addCase(updateChallenge.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
         })
         .addCase(deleteChallenge.fulfilled, (state, action) => {
            state.challenges = state.challenges.filter(c => c._id !== action.payload);
            state.error = null;
         })
         .addCase(deleteChallenge.rejected, (state, action) => {
            state.error = action.payload;
         });
   },
});

export const { clearError } = challengesSlice.actions;

export default challengesSlice.reducer;
