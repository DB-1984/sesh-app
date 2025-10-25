/**
 * VIEW SESH COMPONENT
 *
 * Purpose:
 * - Displays a single session (sesh) with its title, date, and workouts.
 * - Allows users to delete workouts or add new workouts via the WORKOUT-FORM component.
 *
 * Features & Integration:
 * - Uses React Router's `useParams` to get the session ID from the URL.
 * - Fetches seshes from the backend via `useGetSeshesQuery`.
 * - Adds new workouts via `useAddWorkoutMutation`.
 * - Deletes workouts via `useDeleteWorkoutMutation`.
 * - Passes `defaultValues` and `onSubmit` to WORKOUT-FORM for controlled form behavior.
 * - Displays comments for each workout if available.
 *
 * Props:
 * - None. Component derives its data entirely from the URL and Redux query hooks.
 *
 * State:
 * - `currentSesh` — the currently selected session, updated when fetching, adding, or deleting workouts.
 *
 * Functions:
 * - `handleDeleteWorkout(workout)` — deletes a workout both in the backend and local state.
 *
 * Notes:
 * - WORKOUT-FORM handles capturing workout data using `react-hook-form`. 
 *   When submitted, it triggers the `onSubmit` function provided by this component.
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetSeshesQuery, useAddWorkoutMutation, useDeleteWorkoutMutation } from "../slices/seshApiSlice";
import { WorkoutForm } from "@/components/workout-form"; 
import { Button } from "@/components/ui/button";


// the ID param pulls the correct sesh from the list of all seshes, as per our controller logic
export default function ViewSesh() {
  const { id } = useParams(); // session ID from URL
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery(); // fetch all sessions
  const [addWorkout] = useAddWorkoutMutation(); // mutation to add a workout
  const [deleteWorkout] = useDeleteWorkoutMutation(); // mutation to delete a workout

  const [currentSesh, setCurrentSesh] = useState(null); // local state for the current session

  // Fetch the current sesh based on URL param - this isn't local state, but derived from the actual data
  // we have currentSesh now as the actual sesh object we want to display, useful for deleting/adding workouts
  useEffect(() => {
    if (isError) toast.error("Failed to load session");
    else if (!isLoading && seshes.length) {
      const sesh = seshes.find((s) => s._id === id);
      if (sesh) setCurrentSesh(sesh);
      else toast.warning("Sesh not found");
    }
  }, [isError, isLoading, seshes, id]);

  if (isLoading || !currentSesh) return null; // show nothing while loading or if no sesh found

    // Edits a workout
  const handleEditWorkout = async (workout) => {
    try {
      // Call the deleteWorkout mutation with session ID and workout data
      await deleteWorkout({ seshId: currentSesh._id, workout }).unwrap();
      toast.success("Workout deleted!");

      // Update local state to remove the workout immediately for UI responsiveness
      setCurrentSesh({
        ...currentSesh,
        workouts: currentSesh.workouts.filter(w => w._id !== workout._id),
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete workout");
    }
  };


  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      {/* Session title input */}
      <input
        type="text"
        value={currentSesh.title}
        onChange={(e) => setCurrentSesh({ ...currentSesh, title: e.target.value })}
        className="border p-2 rounded w-full"
      />

      {/* Session date */}
      <p>Date: {new Date(currentSesh.date).toLocaleDateString()}</p>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Workouts</h3>

        {/* List of workouts */}
        {currentSesh.workouts?.length ? (
          <ul className="list-disc pl-5">
            {currentSesh.workouts.map((workout, i) => (
              <li key={i} className="flex flex-col py-3">
                <div className="flex items-center justify-between">
                  <span>
                    {workout.exercise} — {workout.sets}x{workout.reps} @ {workout.weight}kg, rest {workout.rest}s
                  </span>
              
                 <div className="flex gap-2">
                   <Link
                    to={`/users/dashboard/sesh/${currentSesh._id}/workout/${workout._id}/edit`}
                  >
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </Link>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteWorkout(workout)}>
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Optional workout comments */}
                {workout.comments && (
                  <p className="text-sm text-gray-500 mt-1 ml-2">{workout.comments}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts yet</p>
        )}

        {/* WORKOUT-FORM component */}
        <WorkoutForm
          defaultValues={{
            exercise: "",
            weight: "",
            reps: "",
            sets: "",
            rest: "",
            comments: "",
          }}
          // onSubmit: called by WorkoutForm when the user submits a workout
          // Adds the workout to the backend and updates local state
          // WorkoutForm collects the user’s input and says: “Parent, here’s the data.”
          // ViewSesh takes that data and says: “Okay, I’ll send it to the backend and update the UI.”
          // WorkoutForm resets itself to blank (using its own defaultValues).
          onSubmit={async (data) => {
            try {
              await addWorkout({ seshId: currentSesh._id, workout: data }).unwrap();
              toast.success("Workout added!");

              // Update local state immediately for responsive UI
              setCurrentSesh({
                ...currentSesh,
                workouts: [...currentSesh.workouts, data],
              });
            } catch (err) {
              toast.error(err?.data?.message || "Failed to add workout");
            }
          }}
        />
      </div>
    </div>
  );
}
