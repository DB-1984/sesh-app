import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function WorkoutForm({ onSubmit, defaultValues }) {
  // Remove the <WorkoutFormData> part
  const form = useForm({ defaultValues });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            {...form.register("name", { required: true })}
            placeholder="Workout Name"
          />
          <Textarea
            {...form.register("description")}
            placeholder="Workout Description"
            rows={4}
          />
          <Button type="submit" className="w-full">
            Save Workout
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
