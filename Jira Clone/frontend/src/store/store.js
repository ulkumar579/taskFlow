// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import projectReducer from "./slice/projectSlice";
import memberReduce from "./slice/memberSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    member: memberReduce,
  },
});