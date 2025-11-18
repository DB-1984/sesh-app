import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetSeshByIdQuery,
  useEditWorkoutMutation,
} from "../slices/seshApiSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { WorkoutForm } from "@/components/workout-form";

export default function EditWorkout() {
  const { seshId, workoutId } = useParams(); // get the sesh and workout id to use mutations
  const navigate = useNavigate(); // for post submission action

  const { data: sesh } = useGetSeshByIdQuery(seshId); // pass the param id to get data as 'sesh'
  const workout = sesh?.workouts.find((w) => w._id === workoutId); // workout to edit = the one matching the param id

  // component state to manage edit temporarily (matches ODM fields)
  const [updated, setUpdated] = useState({
    // 'updated' is alised to 'updatedWorkout', which the query expects
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    rest: "",
    comments: "",
  });
  // On mount give the current data
  useEffect(() => {
    if (workout) {
      setUpdated({
        exercise: workout.exercise,
        sets: workout.sets,
        reps: workout.reps,
        weight: workout.weight,
        rest: workout.rest,
        comments: workout.comments,
      });
    }
  }, [workout]);

  const [editWorkout] = useEditWorkoutMutation(); // the mutation for the database

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // we give it the sehid and workoutid (both from params, PLUS the useState-level updatedWorkout)
      await editWorkout({
        seshId,
        workoutId,
        updatedWorkout: updated,
      }).unwrap();
      toast.success("Workout updated!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update workout");
    }
  };

  if (!workout) return <p>Loading...</p>;

  // give each of the updated workout fields an input and handleSubmit (on save) fires 'editWorkout' above
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {Object.entries(updated).map(([key, value]) => (
        <input
          key={key}
          className="input"
          value={value}
          onChange={(e) => setUpdated({ ...updated, [key]: e.target.value })}
        />
      ))}
      <Button type="submit" className="w-full">
        Save changes
      </Button>
    </form>
  );
}
