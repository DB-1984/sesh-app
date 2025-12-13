import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ExerciseForm } from "@/components/exercise-form";
import { Button } from "@/components/ui/button";
import {
  useGetSeshByIdQuery,
  useEditExerciseMutation,
} from "../slices/seshApiSlice";

export default function EditExercise() {
  const { seshId, exerciseId } = useParams();
  const navigate = useNavigate();

  // ✅ Hooks always at top level
  const { data: sesh, isLoading } = useGetSeshByIdQuery(seshId);
  const [editExercise] = useEditExerciseMutation();

  // Compute exercise after hooks
  const exercise = sesh?.exercises?.find((w) => w._id === exerciseId);

  // Early returns for loading / missing data
  if (isLoading || !sesh) return <p>Loading...</p>;
  if (!exercise) return <p>Exercise not found.</p>;

  // Submit handler
  const onSubmit = async (formValues) => {
    try {
      await editExercise({
        seshId,
        exerciseId,
        updatedexercise: formValues,
      }).unwrap();

      toast.success("Exercise updated!");
      navigate(-1);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update exercise");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <ExerciseForm
          defaultValues={exercise}
          onSubmit={onSubmit}
          title="Edit Exercise"
          submitLabel="Save Changes"
        />
      </div>
    </>
  );
}
