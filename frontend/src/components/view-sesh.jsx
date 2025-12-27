/**
 * VIEW SESH COMPONENT
 *
 * Purpose:
 * - Displays a single session (sesh) with its title, date, and exercises.
 * - Allows users to delete exercises or add new exercises via the ExerciseForm component.
 *
 * Features & Integration:
 * - Uses React Router's `useParams` to get the session ID from the URL.
 * - Fetches seshes from the backend via `useGetSeshesQuery`.
 * - Adds new exercises via `useAddExerciseMutation`.
 * - Deletes exercises via `useDeleteExerciseMutation`.
 * - Passes `defaultValues` and `onSubmit` to ExerciseForm for controlled form behavior.
 * - Displays comments for each exercise if available.
 *
 * Props:
 * - None. Component derives its data entirely from the URL and Redux query hooks.
 */

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetSeshesQuery,
  useAddExerciseMutation,
  useDeleteExerciseMutation,
} from "../slices/seshApiSlice";
import { ExerciseForm } from "@/components/exercise-form";
import { Button } from "@/components/ui/button";

export default function ViewSesh() {
  const { id } = useParams(); // session ID from URL
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();
  const [addExercise] = useAddExerciseMutation();
  const [deleteExercise] = useDeleteExerciseMutation();

  const [currentSesh, setCurrentSesh] = useState(null);

  // Fetch the current sesh based on URL param
  useEffect(() => {
    if (isError) toast.error("Failed to load session");
    else if (!isLoading && seshes.length) {
      const sesh = seshes.find((s) => s._id === id);
      if (sesh) setCurrentSesh(sesh);
      else toast.warning("Sesh not found");
    }
  }, [isError, isLoading, seshes, id]);

  if (isLoading || !currentSesh) return null;

  // Delete an exercise
  const handleDeleteExercise = async (exercise) => {
    try {
      await deleteExercise({ seshId: currentSesh._id, exercise }).unwrap();
      toast.success("Exercise deleted!");

      setCurrentSesh({
        ...currentSesh,
        exercises: currentSesh.exercises.filter((e) => e._id !== exercise._id),
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete exercise");
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 p-4">
        {/* Session title input */}
        <input
          type="text"
          value={currentSesh.title}
          onChange={(e) =>
            setCurrentSesh({ ...currentSesh, title: e.target.value })
          }
          className="
    text-xl font-heading font-semibold tracking-tight
    bg-transparent border-none px-0
    focus-visible:ring-0 focus-visible:outline-none
  "
        />

        {/* Session date */}
        <p className="text-sm text-muted-foreground">
          {new Date(currentSesh.date).toLocaleDateString()}
        </p>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Exercises</h3>

          {/* List of exercises */}
          {currentSesh.exercises?.length ? (
            <div className="flex flex-col gap-3">
              {currentSesh.exercises.map((exercise) => (
                <div
                  key={exercise._id}
                  className="
                  rounded-lg border bg-card p-4
                  transition-shadow hover:shadow-sm
                "
                >
                  <div className="flex items-start flex-wrap justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium">{exercise.exercise}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {exercise.sets}×{exercise.reps} @ {exercise.weight}kg ·
                        rest {exercise.rest}s
                      </p>
                      {exercise.comments && (
                        <p className="mt-2 text-sm text-muted-foreground">
                          {exercise.comments}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <Link
                        to={`/users/dashboard/sesh/${currentSesh._id}/exercise/${exercise._id}/edit`}
                      >
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteExercise(exercise)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No exercises yet — add your first one below.
            </p>
          )}
          <div className="mt-6 rounded-xl border bg-muted/40 p-4">
            <h3 className="mb-4 font-heading font-semibold tracking-tight">
              Add exercise
            </h3>
            {/* ExerciseForm component */}
            <ExerciseForm
              defaultValues={{
                exercise: "",
                weight: "",
                reps: "",
                sets: "",
                rest: "",
                comments: "",
              }}
              onSubmit={async (data) => {
                try {
                  // verify a new exercise from the db (and therefore an exercise._id)
                  const newExercise = await addExercise({
                    seshId: currentSesh._id,
                    exercise: data,
                  }).unwrap();
                  toast.success("Exercise added!");

                  setCurrentSesh({
                    ...currentSesh,
                    exercises: [...currentSesh.exercises, newExercise], // now it has _id
                  });
                } catch (err) {
                  toast.error(err?.data?.message || "Failed to add exercise");
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
