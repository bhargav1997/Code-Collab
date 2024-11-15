import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CONFIG } from "../../config";
import { addAchievement } from "../achievements/achievementsSlice";

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

export const updateChallenge = createAsyncThunk(
  "challenges/updateChallenge",
  async (challengeData, { dispatch, getState, rejectWithValue }) => {
    try {
      const dataToSend = {
        _id: challengeData._id,
        currentDay: challengeData.currentDay,
        lastCompletedDay: challengeData.lastCompletedDay,
        lastCompletedAt: challengeData.lastCompletedAt
      };

      const response = await axios.put(
        `${CONFIG.API_URL}/challenges/${challengeData._id}`,
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );

      // Check for achievements after successful update
      const state = getState();
      const challenge = state.challenges.challenges.find(
        c => c._id === challengeData._id
      );

      // First challenge completion
      if (challenge && challenge.currentDay === 1) {
        dispatch(addAchievement({
          type: 'challenge',
          title: 'First Steps',
          description: 'Completed your first challenge day!'
        }));
      }

      // Challenge completion
      if (challenge && challenge.currentDay === challenge.duration) {
        dispatch(addAchievement({
          type: 'challenge',
          title: `Challenge Champion: ${challenge.name}`,
          description: `Successfully completed the ${challenge.name} challenge!`
        }));

        // Check total completed challenges
        const completedChallenges = state.challenges.challenges.filter(
          c => c.currentDay === c.duration
        ).length;

        if (completedChallenges === 5) {
          dispatch(addAchievement({
            type: 'milestone',
            title: 'Challenge Master',
            description: 'Completed 5 learning challenges'
          }));
        }
      }

      // Check for streaks
      const today = new Date();
      const lastCompleted = new Date(challenge?.lastCompletedAt);
      const streak = calculateStreak(lastCompleted, today);

      if (streak === 7) {
        dispatch(addAchievement({
          type: 'streak',
          title: 'Week Warrior',
          description: 'Maintained a 7-day learning streak!'
        }));
      } else if (streak === 30) {
        dispatch(addAchievement({
          type: 'streak',
          title: 'Monthly Master',
          description: 'Maintained a 30-day learning streak!'
        }));
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update challenge");
    }
  }
);

// Helper function to calculate streak
const calculateStreak = (lastDate, currentDate) => {
  if (!lastDate) return 0;
  
  const diffTime = Math.abs(currentDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1 ? diffDays : 0; // Only count consecutive days
};

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
