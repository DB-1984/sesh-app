import { apiSlice } from "./apiSlice";
import { SESH_URL } from "../constants"; // "/api/seshes"

export const seshApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSeshes: builder.query({
      query: () => SESH_URL,          // GET /api/seshes
      providesTags: ["Sesh"],        // tag for caching - keyed to userInfo._id in all-seshes.jsx
    }),  
    addSesh: builder.mutation({
      query: (newSesh) => ({
        url: SESH_URL,                // POST /api/seshes
        method: "POST",
        body: newSesh,
      }),
      invalidatesTags: ["Sesh"],     // invalidate cache after adding
    }),
    deleteSesh: builder.mutation({
      query: (id) => ({
        url: `${SESH_URL}/${id}`,     // DELETE /api/seshes/:id
        method: "DELETE",
      }),
      invalidatesTags: ["Sesh"],     // triggers refetch for getSeshes
    }),
  }),
});

export const {
  useGetSeshesQuery,
  useAddSeshMutation,
  useDeleteSeshMutation,
} = seshApiSlice;
