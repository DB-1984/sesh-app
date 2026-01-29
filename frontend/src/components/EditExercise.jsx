import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ExerciseForm } from "@/components/ExerciseForm";
import { Button } from "@/components/ui/button";
import {
  useGetSeshByIdQuery,
  useEditExerciseMutation,
} from "../slices/seshApiSlice";
import { Loader2 } from "lucide-react";

export default function EditExercise() {
  const { seshId, exerciseId } = useParams();
  const navigate = useNavigate();

  const { data: sesh, isLoading, isError } = useGetSeshByIdQuery(seshId);
  const [editExercise] = useEditExerciseMutation();

  // Compute exercise after hooks
  const exercise = sesh?.exercises?.find((w) => w._id === exerciseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading exercises</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        Failed to load exercises
      </div>
    );
  }

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
