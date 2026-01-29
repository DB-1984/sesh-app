import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, Eye, Trash2 } from "lucide-react";

export function SeshCard({ sesh, onDelete }) {
  const exerciseCount = sesh.exercises?.length || 0;

  return (
    <Card
      className="
    flex flex-col justify-around
    h-full p-4
    bg-white/60 dark:bg-gray-800/80  /* Use standard colors with opacity */
    backdrop-blur-md                /* This makes the translucency look premium */
    rounded-2xl shadow-md 
    transition-shadow duration-200
  "
    >
      {/* Card Header */}
      <CardHeader className="pb-0 gap-2">
        <CardTitle className="text-2xl pt-4 font-black tracking-tight">
          {sesh.title}
        </CardTitle>
        <p className="text-md tracking-tight font-medium">
          {new Date(sesh.date).toLocaleDateString()}
        </p>
        <span className="flex items-center text-sm text-zinc-800 gap-2">
          {exerciseCount > 0 ? (
            <>
              {exerciseCount} {exerciseCount === 1 ? "Exercise" : "Exercises"}
            </>
          ) : (
            "No exercises yet..."
          )}
        </span>
      </CardHeader>

      {/* Card Body */}
      {/* Card Body */}
      <CardContent className="flex flex-col flex-1 pb-6">
        {/* Action Buttons - These will now stay at the bottom */}
        <div className="flex flex-col gap-3 mt-auto">
          <Link to={`sesh/${sesh._id}`} className="w-full">
            <Button className="w-full bg-zinc-200 text-black border hover:bg-white-700 h-12">
              <Eye className="mr-2 h-4 w-4" />
              View / Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            className="w-full h-12"
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
