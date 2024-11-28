import { createSlice } from "@reduxjs/toolkit";
import { deleteAccount, loginUser, cancelDeletion, checkAccountStatus } from "./userHandle";

const initialState = {
   user: null,
   isLoading: false,
   error: null,
   deletionStatus: null,
   settings: null,
   accountStatus: null,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setUser: (state, action) => {
         state.user = action.payload;
         state.isLoading = false;
         state.error = null;
      },
      setLoading: (state, action) => {
         state.isLoading = action.payload;
      },
      setError: (state, action) => {
         state.error = action.payload;
         state.isLoading = false;
      },
      updateUserAchievements: (state, action) => {
         if (state.user) {
            state.user.achievements = state.user.achievements || [];
            state.user.achievements.push(action.payload);
         }
      },
      clearUser: (state) => {
         state.user = null;
         state.deletionStatus = null;
         state.error = null;
         state.settings = null;
      },
      clearError: (state) => {
         state.error = null;
      },
      updateUserSettings: (state, action) => {
         if (state.user) {
            state.user.settings = {
               ...state.user.settings,
               ...action.payload,
            };
         }
         state.settings = {
            ...state.settings,
            ...action.payload,
         };
      },
      clearAccountStatus: (state) => {
         state.accountStatus = null;
         state.error = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(deleteAccount.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(deleteAccount.fulfilled, (state) => {
            state.isLoading = false;
            state.user = null;
            state.deletionStatus = "pending";
            state.error = null;
         })
         .addCase(deleteAccount.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.error = null;
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         })
         .addCase(checkAccountStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(checkAccountStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.accountStatus = action.payload;
            state.error = null;
         })
         .addCase(checkAccountStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.accountStatus = null;
         })
         .addCase(cancelDeletion.pending, (state) => {
            state.isLoading = true;
            state.error = null;
         })
         .addCase(cancelDeletion.fulfilled, (state) => {
            state.isLoading = false;
            state.accountStatus = null;
            state.error = null;
         })
         .addCase(cancelDeletion.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
         });
   },
});

export const { setUser, setLoading, setError, clearUser, clearError, updateUserSettings, clearAccountStatus, updateUserAchievements } = userSlice.actions;
export default userSlice.reducer;
