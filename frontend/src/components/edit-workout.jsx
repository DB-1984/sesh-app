import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetSeshByIdQuery, useEditWorkoutMutation } from "../slices/seshApiSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function EditWorkout() {
  const { seshId, workoutId } = useParams();
  const navigate = useNavigate();

  const { data: sesh } = useGetSeshByIdQuery(seshId);
  const workout = sesh?.workouts.find((w) => w._id === workoutId);

  const [updated, setUpdated] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    rest: "",
  });

  useEffect(() => {
    if (workout) {
      setUpdated({
        exercise: workout.exercise,
        sets: workout.sets,
        reps: workout.reps,
        weight: workout.weight,
        rest: workout.rest,
      });
    }
  }, [workout]);

  const [editWorkout] = useEditWorkoutMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editWorkout({ seshId, workoutId, updatedWorkout: updated }).unwrap();
      toast.success("Workout updated!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update workout");
    }
  };

  if (!workout) return <p>Loading...</p>;

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
      <Button type="submit" className="w-full">Save changes</Button>
    </form>
  );
}
