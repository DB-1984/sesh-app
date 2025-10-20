/**
 * WORKOUT FORM COMPONENT
 *
 * Purpose:
 * Captures workout data from the user. Uses react-hook-form to manage form state.
 *
 * Props:
 * - defaultValues: an object specifying the initial values for each form field
 *   (e.g., { exercise: "", reps: "", sets: "", rest: "", comments: "" })
 * - onSubmit: a callback function provided by the parent component (VIEW SESH)
 *   that is called with the form data when the user submits the form.
 *
 * How it works:
 * - useForm initializes form state with defaultValues.
 * - handleSubmit wraps the parent's onSubmit:
 *     1. Calls the parent's onSubmit with the data.
 *     2. Resets the form to defaultValues.
 * - Each Input/Textarea is registered with useForm for validation and state management.
 * - When the user clicks "Save Workout", react-hook-form's handleSubmit calls
 *   our handleSubmit, sending the data up to the parent.
 *
 * Flow:
 * WORKOUT FORM -> (onSubmit) -> VIEW SESH -> (RTK mutation) -> Backend
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function WorkoutForm({ onSubmit, defaultValues }) {
  // Initialize form state with react-hook-form
  const form = useForm({ defaultValues });

  // Called when form is submitted
  const handleSubmit = async (data) => {
    // Send data to parent component via onSubmit prop
    await onSubmit(data);

    // Reset form fields to default values for a clean form
    form.reset(defaultValues);
  };

  // useForm's handleSubmit wraps our handleSubmit
  // It ensures validation rules run before calling our actual handleSubmit
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add Workout</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input {...form.register("exercise", { required: true })} placeholder="Exercise" />
          <Input {...form.register("weight", { required: true })} type="number" placeholder="Weight (kg)" />
          <Input {...form.register("reps", { required: true, valueAsNumber: true })} type="number" placeholder="Reps" />
          <Input {...form.register("sets", { required: true, valueAsNumber: true })} type="number" placeholder="Sets" />
          <Input {...form.register("rest", { required: true, valueAsNumber: true })} type="number" placeholder="Rest (seconds)" />
          <Textarea {...form.register("comments")} placeholder="Comments" rows={3} />
          <Button type="submit" className="w-full">Save Workout</Button>
        </CardContent>
      </Card>
    </form>
  );
}
