import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

// Here we "inject" endpoints into the base apiSlice
// - USERS_URL = "/api/users"
// - So register → "/api/users/register"
// - login → "/api/users/login"
// Both of these exactly match your backend userRoutes
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`, // → /api/users/register
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`, // → /api/users/login
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// These hooks are automatically generated for use inside React components
export const { useRegisterMutation, useLoginMutation } = userApiSlice;
