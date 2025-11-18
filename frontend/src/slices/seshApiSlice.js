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
    addWorkout: builder.mutation({
      query: ({ seshId, workout }) => ({
        url: `${SESH_URL}/${seshId}/workouts`,
        method: "POST",
        body: workout,
      }),
      invalidatesTags: ["Sesh"],
    }),
    deleteWorkout: builder.mutation({
      query: ({ seshId, workout }) => ({
        url: `${SESH_URL}/${seshId}/workouts`,
        method: "DELETE",
        body: workout,
      }),
      invalidatesTags: ["Sesh"],
    }),
    getSeshById: builder.query({
      query: (id) => `${SESH_URL}/${id}`, // fetch /sesh/:id
      providesTags: (result, error, id) => [{ type: "Sesh", id }], // cache tracking
    }),
    editWorkout: builder.mutation({
    // We have to find the sesh, then the related workout from the id array of associated workouts to that sesh:
    // pass the workout id to identify which workout to edit in the database
    // pass the updated workout data created in edit-workout component level state
    query: ({ seshId, workoutId, updatedWorkout }) => ({
      url: `${SESH_URL}/${seshId}/workouts/${workoutId}`,
      method: "PUT",
      body: updatedWorkout,
    }),
    invalidatesTags: ["Sesh"],
  }),
  }),
});

export const {
  useGetSeshesQuery,
  useAddSeshMutation,
  useGetSeshByIdQuery,
  useDeleteSeshMutation,
  useAddWorkoutMutation,
  useDeleteWorkoutMutation,
  useEditWorkoutMutation
} = seshApiSlice;
