import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   events: [],
   notificationsShown: false,
};

const calendarSlice = createSlice({
   name: "calendar",
   initialState,
   reducers: {
      addEvent: (state, action) => {
         state.events.push(action.payload);
      },
      setEvents: (state, action) => {
         state.events = action.payload;
      },
      updateEvent: (state, action) => {
         console.log("state.events", state.events);
         console.log("action.payload", action.payload);
         const index = state.events.findIndex((event) => event._id === action.payload._id);
         console.log("index", index);
         if (index !== -1) {
            state.events[index] = action.payload;
         }
      },
      deleteEvent: (state, action) => {
         state.events = state.events.filter((event) => event._id !== action.payload);
      },
      setNotificationsShown: (state, action) => {
         state.notificationsShown = action.payload;
      },
   },
});

export const { addEvent, setEvents, updateEvent, deleteEvent, setNotificationsShown } = calendarSlice.actions;
export default calendarSlice.reducer;
