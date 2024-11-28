import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./example/exampleSlice";
import userReducer from "./user/userSlice";
import learningJourneyReducer from "./learningJourney/learningJourneySlice";
import calendarReducer from "./calendar/calendarSlice";
import postsReducer from "./posts/postsSlice";
import challengesReducer from "./challenges/challengesSlice";
import achievementsReducer from "./achievements/achievementsSlice";

const store = configureStore({
   reducer: {
      example: exampleReducer,
      user: userReducer,
      learningJourney: learningJourneyReducer,
      calendar: calendarReducer,
      posts: postsReducer,
      challenges: challengesReducer,
      achievements: achievementsReducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }),
});

export default store;
