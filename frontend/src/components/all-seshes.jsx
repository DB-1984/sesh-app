import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SeshCard } from "./sesh-card";
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
    <div className="p-8">
      {seshes.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          No sessions found for this date.
        </p>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6 min-w-max pb-8">
            {seshes.map((sesh) => (
              <div key={sesh._id} className="flex-shrink-0 min-w-[300px]">
                <SeshCard sesh={sesh} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Add button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleAddSesh}
          className="p-8 bg-black/90 text-white border border-black rounded-4xl font-black shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
        >
          {addSeshLoading ? "Adding..." : "+ New Sesh"}
        </Button>
      </div>
    </div>
  );
}
