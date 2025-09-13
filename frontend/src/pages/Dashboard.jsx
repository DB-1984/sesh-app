import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WorkoutForm } from "../components/workout-form";

export default function Dashboard() {
  // Dummy user
  const user = {
    name: "Jane Doe",
    initials: "JD",
  };

  // Dummy workouts
  const workouts = [
    { id: "1", name: "Chest Day", description: "Bench, Flyes, Pushups" },
    { id: "2", name: "Leg Day", description: "Squats, Deadlifts, Lunges" },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-6">
      {/* User card */}
      <Card className="flex flex-col items-center p-4">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
      </Card>

      {/* Workouts section */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {workouts.map((w) => (
          <WorkoutForm
            key={w.id}
            defaultValues={w}
            onSubmit={(data) => handleSaveWorkout(w.id, data)}
          />
        ))}

        {/* Add new workout */}
        <WorkoutForm onSubmit={(data) => handleSaveWorkout(null, data)} />
      </div>
    </div>
  );
}
