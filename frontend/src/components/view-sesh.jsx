import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetSeshesQuery, useAddWorkoutMutation } from "../slices/seshApiSlice";
import { WorkoutForm } from "@/components/workout-form"; 
import { Button } from "@/components/ui/button";

export default function ViewSesh() {
  const { id } = useParams();
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();
  const [addWorkout, { isLoading: addWorkoutLoading }] = useAddWorkoutMutation();

  const [currentSesh, setCurrentSesh] = useState(null);

  useEffect(() => {
    if (isError) toast.error("Failed to load session");
    else if (!isLoading && seshes.length) {
      const sesh = seshes.find((s) => s._id === id);
      if (sesh) setCurrentSesh(sesh);
      else toast.warning("Sesh not found");
    }
  }, [isError, isLoading, seshes, id]);

  if (isLoading || !currentSesh) return null;

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      <input
        type="text"
        value={currentSesh.title}
        onChange={(e) => setCurrentSesh({ ...currentSesh, title: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <p>Date: {new Date(currentSesh.date).toLocaleDateString()}</p>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Workouts</h3>
        {currentSesh.workouts?.length ? (
          <ul className="list-disc pl-5">
            {currentSesh.workouts.map((w, i) => (
              <li key={i}>
                {w.exercise} — {w.sets}x{w.reps}, rest {w.rest}s
              </li>
            ))}
          </ul>
        ) : (
          <p>No workouts yet</p>
        )}

        <WorkoutForm
          defaultValues={{
            exercise: "",
            reps: "",
            sets: "",
            rest: "",
            comments: "",
          }}
          onSubmit={async (data) => {
            try {
              await addWorkout({ seshId: currentSesh._id, workout: data }).unwrap();
              toast.success("Workout added!");
              // update local state for instant UI
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
