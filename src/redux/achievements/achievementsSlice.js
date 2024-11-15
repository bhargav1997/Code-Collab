import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CONFIG } from '../../config';

// Helper function to get the token
const getToken = () => {
  return localStorage.getItem('token');
};

export const fetchAchievements = createAsyncThunk(
  'achievements/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/achievements`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch achievements');
    }
  }
);

export const addAchievement = createAsyncThunk(
  'achievements/addAchievement',
  async (achievementData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CONFIG.API_URL}/achievements`,
        achievementData,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create achievement');
    }
  }
);

export const markAchievementSeen = createAsyncThunk(
  'achievements/markSeen',
  async (achievementId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${CONFIG.API_URL}/achievements/${achievementId}/seen`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to mark achievement as seen');
    }
  }
);

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState: {
    achievements: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAchievement.fulfilled, (state, action) => {
        state.achievements.unshift(action.payload);
      })
      .addCase(markAchievementSeen.fulfilled, (state, action) => {
        const achievement = state.achievements.find(
          a => a._id === action.payload._id
        );
        if (achievement) {
          achievement.isNew = false;
        }
      });
  }
});

export default achievementsSlice.reducer;
