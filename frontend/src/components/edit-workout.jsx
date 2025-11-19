import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  useGetSeshByIdQuery,
  useEditWorkoutMutation,
} from "../slices/seshApiSlice";
import { toast } from "react-toastify";
import { WorkoutForm } from "@/components/workout-form";
import { useForm } from "react-hook-form";

export default function EditWorkout() {
  const { seshId, workoutId } = useParams();
  const navigate = useNavigate();

  const { data: sesh, isLoading } = useGetSeshByIdQuery(seshId);

  // 3️⃣ workout comes AFTER the query
  const workout = sesh?.workouts?.find((w) => w._id === workoutId);

  // 4️⃣ Block render until workout exists
  if (isLoading || !sesh) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found.</p>;

  const [editWorkout] = useEditWorkoutMutation();

  // 5️⃣ Submit handler receives formValues from RHF
  const onSubmit = async (formValues) => {
    try {
      await editWorkout({
        seshId,
        workoutId,
        updatedWorkout: formValues,
      }).unwrap();

      toast.success("Workout updated!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update workout");
    }
  };

  return (
    <WorkoutForm
      defaultValues={workout}
      onSubmit={onSubmit}
      title="Edit Workout"
      submitLabel="Save Changes"
    />
  );
}
