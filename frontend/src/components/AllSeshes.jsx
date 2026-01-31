import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SeshCard } from "@/components/SeshCard";
import { Loader2, Dumbbell, ArrowLeft, Ellipsis } from "lucide-react";
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
        <span>Loading seshes…</span>
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
    <div className="relative px-6 py-8">
      <h1 className="text-2xl logo-text rounded bg-muted/50 mb-8 p-3 font-black tracking-tight uppercase">
        Seshes
      </h1>
      {seshes.length === 0 ? (
        <p className="mt-4 text-center text-muted-foreground">
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
  );
}
