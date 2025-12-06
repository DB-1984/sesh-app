/**
 * WORKOUT FORM COMPONENT
 *
 * Supports both creating a new workout AND editing an existing workout.
 * Pre-fills fields when defaultValues change (e.g., after API load).
 */

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function WorkoutForm({
  onSubmit,
  defaultValues,
  title = "Add Workout",
  submitLabel = "Save Workout",
}) {
  // Initialize form with initial values
  const form = useForm({ defaultValues });

  // ⬅️ IMPORTANT: update form when defaultValues change (e.g. editing mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // Called when form is submitted
  const handleSubmit = async (values) => {
    await onSubmit(values);     // pass values to parent
    // If adding a workout, reset back to blank defaults
    // In edit mode, parent can navigate away instead
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Card className="w-full border-none shadow-none mx-auto">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input {...form.register("exercise", { required: true })} placeholder="Exercise" />
          <Input {...form.register("weight", { required: true, valueAsNumber: true })} type="number" placeholder="Weight (kg)" />
          <Input {...form.register("reps", { required: true, valueAsNumber: true })} type="number" placeholder="Reps" />
          <Input {...form.register("sets", { required: true, valueAsNumber: true })} type="number" placeholder="Sets" />
          <Input {...form.register("rest", { required: true, valueAsNumber: true })} type="number" placeholder="Rest (seconds)" />
          <Textarea {...form.register("comments")} placeholder="Comments" rows={3} />
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
