import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

// apiSlice is the central RTK Query slice.
// - `baseQuery` defines the starting URL for all endpoints ("/api")
// - `reducerPath` is just a namespace in Redux state ("api")
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_URL,
    credentials: "include", // 🔑 ensures JWT cookie is sent automatically
  }),
  tagTypes: ["Sesh", "User"], // optional, for cache invalidation
  endpoints: () => ({}), 
});