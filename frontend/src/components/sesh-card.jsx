import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, Eye, Trash2 } from "lucide-react";

export function SeshCard({ sesh, onDelete }) {
  const exerciseCount = sesh.exercises?.length || 0;

  return (
    <Card
      className="
        group relative
        w-full
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        dark:hover:shadow-black/30
      "
    >
      <CardHeader className="pb-2">
        <CardTitle className="tracking-tight">
          {sesh.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex justify-between items-center flex-wrap gap-4">
        {/* Meta */}
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(sesh.date).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span>
              {exerciseCount > 0
                ? `${exerciseCount} ${exerciseCount === 1 ? "Exercise" : "Exercises"}`
                : "No exercises yet"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="
          flex gap-2 shrink-0
          opacity-70 group-hover:opacity-100
          transition-opacity
        ">
          <Link to={`sesh/${sesh._id}`}>
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(sesh._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
