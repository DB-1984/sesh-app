import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetSeshesQuery, /* useUpdateSeshMutation */ } from "../slices/seshApiSlice";
import { Button } from "@/components/ui/button";

export default function ViewSesh() {
  const { id } = useParams(); // get the sesh ID from the URL
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery(); 
  // fetch all seshes; will be used to find the current sesh
  // const [updateSesh] = useUpdateSeshMutation(); // mutation for saving changes to the sesh (not made yet)

  const [currentSesh, setCurrentSesh] = useState(null); // local state for the sesh being viewed
  const [newWorkout, setNewWorkout] = useState(""); // temporary input value for adding a workout

  // useEffect to find the current sesh once data is loaded and show toasts for errors/not found
  useEffect(() => {
    if (isError) {
      toast.error("Failed to load session"); // show error if fetch fails
    } else if (!isLoading && seshes.length) {
      const sesh = seshes.find((s) => s._id === id);
      if (sesh) {
        setCurrentSesh(sesh); // set the current sesh state
      } else {
        toast.warning("Sesh not found"); // show warning if id doesn't match any sesh
      }
    }
  }, [isError, isLoading, seshes, id]);

  // add a new workout to currentSesh state
  const handleAddWorkout = () => {
    if (!newWorkout.trim()) return; // ignore empty input
    setCurrentSesh({ // spread existing sesh and add new workout (setCurrentSesh is now using the found sesh)
      ...currentSesh,
      workouts: [...currentSesh.workouts, { name: newWorkout }],
    });
    setNewWorkout(""); // clear input after adding
  };

  // save the current sesh using the updateSesh mutation
  const handleSave = async () => {
    try {
      await updateSesh({ id: currentSesh._id, updates: currentSesh }).unwrap();
      toast.success("Sesh saved successfully!"); // success toast
    } catch (err) {
      toast.error("Failed to save sesh"); // error toast
    }
  };

  if (isLoading || !currentSesh) return null; // optionally show a spinner or skeleton here

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      {/* Sesh title edit */}
      <input
        type="text"
        value={currentSesh.title}
        onChange={(e) => setCurrentSesh({ ...currentSesh, title: e.target.value })}
        className="border p-2 rounded w-full"
      />

      <p>Date: {new Date(currentSesh.date).toLocaleDateString()}</p>

      {/* Workouts section */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold">Workouts</h3>
        {currentSesh.workouts.length ? (
          <ul className="list-disc pl-5">
            {currentSesh.workouts.map((w, i) => (
              <li key={i}>{w.name}</li>
            ))}
          </ul>
        ) : (
          <p>No workouts yet</p>
        )}

        {/* Add new workout input + button */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="New workout name"
            value={newWorkout}
            onChange={(e) => setNewWorkout(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <Button onClick={handleAddWorkout}>Add Workout</Button>
        </div>
      </div>

      {/* Save sesh button */}
      <Button onClick={handleSave}>Save Sesh</Button>
    </div>
  );
}
