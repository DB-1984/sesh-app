import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { WorkoutForm } from "@/components/workout-form";
import { Button } from "@/components/ui/button";
import {
  useGetSeshByIdQuery,
  useEditWorkoutMutation,
} from "../slices/seshApiSlice";

export default function EditWorkout() {
  const { seshId, workoutId } = useParams();
  const navigate = useNavigate();

  // ✅ Hooks always at top level
  const { data: sesh, isLoading } = useGetSeshByIdQuery(seshId);
  const [editWorkout] = useEditWorkoutMutation();

  // Compute workout after hooks
  const workout = sesh?.workouts?.find((w) => w._id === workoutId);

  // Early returns for loading / missing data
  if (isLoading || !sesh) return <p>Loading...</p>;
  if (!workout) return <p>Workout not found.</p>;

  // Submit handler
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
    <>
    <div className="flex flex-col gap-4 p-4 border">
      <Button variant="outline"  className="w-50" onClick={() => navigate(`/users/dashboard/sesh/${seshId}`)}>
        Back
      </Button>

      <WorkoutForm
        defaultValues={workout}
        onSubmit={onSubmit}
        title="Edit Workout"
        submitLabel="Save Changes"
      />
      </div>
    </>
  );
}
