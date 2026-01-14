import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SeshCard } from "./sesh-card";
import { Loader2 } from "lucide-react";
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

  // Skip fetching if userInfo is not yet available
  const shouldSkip = !userInfo?._id;

  // Because we gave a context prop to Outlet in Dashboard, representing the selected date (which is the only mutable value as onDateChange is a fixed function), the all-seshes component, responsible for results, can redisplay the correct seshes using the hook (which is a modified version of our get all seshes query, handling a parameter), and just pass 'undefined' if none is set

  // Convert date to ISO string if selectedDate exists
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
    <div className="flex flex-col md:flex-row gap-6">
      <section className="flex-1 p-6 flex flex-col">
        {seshes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seshes.map((sesh) => (
                <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
              ))}
            </div>

            <div className="mt-6">
              <Button
                onClick={handleAddSesh}
                className="w-full md:w-auto px-4 py-2 bg-background text-foreground border border-border rounded hover:bg-card hover:text-card-foreground transition-colors duration-200"
                disabled={addSeshLoading}
              >
                {addSeshLoading ? "Adding..." : "Add New Sesh"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No sessions found for this date.
          </p>
        )}
      </section>
    </div>
  );
}
