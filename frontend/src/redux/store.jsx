import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./models/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
