// all seshes goes to the <Outlet /> in Dashboard.jsx
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { SeshCard } from "./sesh-card";
import { useGetSeshesQuery, useAddSeshMutation } from "../slices/seshApiSlice";

export default function AllSeshes() {
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();
  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();

  const handleAddSesh = async () => {
    try {
      const newSesh = await addSesh({
        title: "New Sesh",
        date: new Date().toISOString(),
        workouts: [],
      }).unwrap();

      toast.success(`Sesh "${newSesh.title}" created!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create sesh");
    }
  };

  const handleDelete = (id) => {
    console.log("Delete sesh with id:", id);
    // hook up delete mutation later
  };

  if (isLoading) return <p>Loading seshes...</p>;
  if (isError) return <p>Failed to load seshes</p>;

  return (
    <>
      {seshes.map((sesh) => (
        <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
      ))}

      <Button
        onClick={handleAddSesh}
        className="w-full"
        disabled={addSeshLoading}
      >
        {addSeshLoading ? "Adding..." : "Add New Sesh"}
      </Button>
    </>
  );
}
