/**
 * exercise FORM COMPONENT
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
import { Dumbbell } from "lucide-react";

export function ExerciseForm({
  onSubmit,
  defaultValues,
  title = "Add Exercise",
  submitLabel = "Save Exercise",
}) {
  // Initialize form with initial values
  const form = useForm({ defaultValues });

  // ⬅️ IMPORTANT: update form when defaultValues change (e.g. editing mode)
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full max-w-3xl border-none bg-none rounded shadow-none mx-auto">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4" /> {title}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            {...form.register("exercise", { required: true })}
            placeholder="Exercise"
          />
          <Input
            {...form.register("weight", {
              required: true,
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Weight (kg)"
          />
          <Input
            {...form.register("reps", { required: true, valueAsNumber: true })}
            type="number"
            placeholder="Reps"
          />
          <Input
            {...form.register("sets", { required: true, valueAsNumber: true })}
            type="number"
            placeholder="Sets"
          />
          <Input
            {...form.register("rest", { required: true, valueAsNumber: true })}
            type="number"
            placeholder="Rest (seconds)"
          />
          <Textarea
            {...form.register("comments")}
            placeholder="Comments"
            rows={3}
          />
          <Button type="submit" className="w-full">
            {submitLabel}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
