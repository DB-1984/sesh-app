import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SeshCard } from "@/components/SeshCard";
import { Loader2, Dumbbell, ArrowLeft, Ellipsis, Calendar } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import {
  useGetSeshesQuery,
  useDeleteSeshMutation,
} from "../slices/seshApiSlice";

export default function AllSeshes() {
  const { userInfo } = useSelector((state) => state.user);
  const { selectedDate } = useOutletContext();

  const shouldSkip = !userInfo?._id;
  const dateString = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;

  const {
    data: seshes = [],
    isLoading,
    isError,
  } = useGetSeshesQuery(
    { userId: userInfo?._id, date: dateString },
    { skip: shouldSkip }
  );

  const [deleteSesh] = useDeleteSeshMutation();

  const handleDelete = async (id) => {
    try {
      await deleteSesh(id).unwrap();
      toast.success("Sesh deleted!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete Sesh");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        Failed to load seshes
      </div>
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-64px)] app-bg lg:grid-cols-2 overflow-hidden bg-white dark:bg-zinc-950">
      <div className="relative px-6 py-8">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6" />
          <h2 className="text-4xl font-black tracking-tight">Recent</h2>
        </div>
        {seshes.length === 0 ? (
          <p className="text-zinc-800 font-bold tracking-tight text-md">
            No sessions found for this date.
          </p>
        ) : (
          <section
            className="
          grid gap-6
          /* Change auto-fit to auto-fill to prevent stretching */
          grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
          /* Or just cap the width of the whole section */
          max-w-5xl
        "
          >
            {seshes.map((sesh) => (
              <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
