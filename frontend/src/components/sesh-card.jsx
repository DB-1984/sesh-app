import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function SeshCard({ sesh, onDelete }) {
  return (
    <Card className="card-bare w-full flex flex-col gap-4">
      <CardHeader>
        <CardTitle>{sesh.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1">
          <p>{new Date(sesh.date).toLocaleDateString()}</p>
          <p className="text-sm opacity-70">
            {sesh.exercises?.length > 0
              ? `${sesh.exercises.length} ${
                  sesh.exercises.length === 1 ? "Exercise" : "Exercises"
                }`
              : "No Exercises"}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <Link to={`sesh/${sesh._id}`}>
            <Button variant="outline" className="whitespace-nowrap">
              View
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => onDelete(sesh._id)}>
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
