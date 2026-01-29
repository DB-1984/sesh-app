import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SeshCard } from "@/components/SeshCard";
import { Loader2, Dumbbell, ArrowLeft, Ellipsis } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { format } from "date-fns";
import {
  useGetSeshesQuery,
  useAddSeshMutation,
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

  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();
  const [deleteSesh] = useDeleteSeshMutation();

  const handleAddSesh = async () => {
    try {
      const newSesh = await addSesh({
        title: "New Sesh",
        date: new Date().toISOString(),
        exercises: [],
      }).unwrap();
      toast.success(`Sesh "${newSesh.title}" created!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create sesh");
    }
  };

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
      <h1 className="text-3xl logo-text pb-8 font-black tracking-tight">
        Latest Seshes
      </h1>
      {seshes.length === 0 ? (
        <p className="mt-4 text-center text-muted-foreground">
          No sessions found for this date.
        </p>
      ) : (
        <section
          aria-label="Training sessions"
          className="
            grid gap-6
            grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
          "
        >
          {seshes.map((sesh) => (
            <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
          ))}
        </section>
      )}

      {/* Floating Add button */}
      <Button
        onClick={handleAddSesh}
        className="
          fixed bottom-4 right-4 z-50
          rounded-2xl bg-black/90 px-8 py-6
          font-black text-white
          shadow-md transition-all
          hover:shadow-lg active:scale-[0.98]
        "
      >
        {addSeshLoading ? "Adding…" : "+ New Sesh"}
      </Button>
    </div>
  );
}
