import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  achievements: [],
  loading: false,
  error: null
};

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    addAchievement: (state, action) => {
      state.achievements.unshift({
        ...action.payload,
        id: Date.now(),
        date: new Date().toISOString(),
        isNew: true
      });
    },
    markAchievementSeen: (state, action) => {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement) {
        achievement.isNew = false;
      }
    }
  }
});

export const { addAchievement, markAchievementSeen } = achievementsSlice.actions;
export default achievementsSlice.reducer;
