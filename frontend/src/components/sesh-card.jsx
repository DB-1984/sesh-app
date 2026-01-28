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
    w-full min-w-[320px] 
    h-full p-8
    bg-white/80 dark:bg-gray-800/80  /* Use standard colors with opacity */
    backdrop-blur-md                /* This makes the translucency look premium */
    rounded-2xl shadow-md 
    transition-shadow duration-200
  "
    >
      {/* Card Header */}
      <CardHeader className="pb-0 gap-6">
        <CardTitle className="text-3xl logo-text font-normal tracking-tight">
          {sesh.title}
        </CardTitle>
        <p className="text-md tracking-tight font-medium mt-1">
          {new Date(sesh.date).toLocaleDateString()}
        </p>
        <span className="flex logo-text items-center text-md text-zinc-600 gap-2">
          {exerciseCount > 0 ? (
            <>
              {exerciseCount} {exerciseCount === 1 ? "Exercise" : "Exercises"}
            </>
          ) : (
            "No exercises yet"
          )}
        </span>
      </CardHeader>

      {/* Card Body */}
      {/* Card Body */}
      <CardContent className="flex flex-col flex-1 pb-6">
        {/* Action Buttons - These will now stay at the bottom */}
        <div className="flex flex-col gap-3 mt-auto">
          <Link to={`sesh/${sesh._id}`} className="w-full">
            <Button className="w-full bg-cyan-600 text-white hover:bg-cyan-700 h-12">
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
