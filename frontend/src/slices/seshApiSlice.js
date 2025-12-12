import { apiSlice } from "./apiSlice";
import { SESH_URL } from "../constants"; // "/api/seshes"

export const seshApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSeshes: builder.query({
      query: () => SESH_URL,
      providesTags: ["Sesh"],
    }),
    addSesh: builder.mutation({
      query: (newSesh) => ({
        url: SESH_URL,
        method: "POST",
        body: newSesh,
      }),
      invalidatesTags: ["Sesh"],
    }),
    deleteSesh: builder.mutation({
      query: (id) => ({
        url: `${SESH_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sesh"],
    }),

    // ✅ Renamed from addWorkout → addExercise
    addExercise: builder.mutation({
      query: ({ seshId, exercise }) => ({
        url: `${SESH_URL}/${seshId}/exercises`, // updated path
        method: "POST",
        body: exercise,
      }),
      invalidatesTags: ["Sesh"],
    }),

    // ✅ Renamed from deleteWorkout → deleteExercise
    deleteExercise: builder.mutation({
      query: ({ seshId, exercise }) => ({
        url: `${SESH_URL}/${seshId}/exercises`, // updated path
        method: "DELETE",
        body: exercise,
      }),
      invalidatesTags: ["Sesh"],
    }),

    getSeshById: builder.query({
      query: (id) => `${SESH_URL}/${id}`,
      providesTags: (result, error, id) => [{ type: "Sesh", id }],
    }),

    // ✅ Renamed from editWorkout → editExercise
    editExercise: builder.mutation({
      query: ({ seshId, exerciseId, updatedExercise }) => ({
        url: `${SESH_URL}/${seshId}/exercises/${exerciseId}`, // updated path
        method: "PUT",
        body: updatedExercise,
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
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useEditExerciseMutation,
} = seshApiSlice;
