import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SeshCard } from "./sesh-card";
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

  if (isLoading) return <p>Loading seshes...</p>;
  if (isError) return <p>Failed to load seshes</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <section className="flex-1 p-4 flex flex-col">
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
      </section>
    </div>
  );
}
