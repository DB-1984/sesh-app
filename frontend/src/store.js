import { configureStore } from "@reduxjs/toolkit";
import { api } from "./slices/apiSlice";
import userReducer from "./slices/userSlice";  // grab default export

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,   // state.user.userInfo
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});