import { format } from "date-fns";
import { Trash2, ChevronRight, Clock, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const SeshCard = ({ sesh, onDelete }) => {
  return (
    <div className="group relative flex items-center justify-between p-5 bg-white dark:bg-zinc-900 border-1 border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-black dark:hover:border-white transition-all shadow-sm">
      <Link
        to={`/users/sesh/${sesh._id}`}
        className="flex-1 flex items-center gap-4"
      >
        {/* Date Icon */}
        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
          <span className="text-[10px] font-black uppercase leading-none">
            {format(new Date(sesh.date), "MMM")}
          </span>
          <span className="text-xl font-black leading-none">
            {format(new Date(sesh.date), "dd")}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h3 className="font-black text-lg leading-tight tracking-tightest text-black dark:text-white">
            {sesh.title || "Untitled Sesh"}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-700">
              <Dumbbell className="h-3 w-3" /> {sesh.exercises?.length || 0}{" "}
              Exercises
            </span>
            <span className="flex items-center gap-2 text-sm tracking-tight font-bold text-zinc-700">
              <Clock className="h-3 w-3" /> {format(new Date(sesh.date), "p")}
            </span>
          </div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(sesh._id)}
          className="text-zinc-300 hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};
