import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export function WorkoutForm({ onSubmit, defaultValues }) {
  const form = useForm({ defaultValues });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input {...form.register("exercise", { required: true })} placeholder="Exercise" />
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
