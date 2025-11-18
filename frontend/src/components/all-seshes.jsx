// all seshes goes to the <Outlet /> in Dashboard.jsx
import { Button } from "@/components/ui/button"; // Import UI button component
import { toast } from "react-toastify"; // Import library for displaying notifications
import { useSelector } from "react-redux"; // Import Redux hook for accessing state
import { SeshCard } from "./sesh-card"; // Import component to display a single 'Sesh' (session)
import { useGetSeshesQuery, useAddSeshMutation } from "../slices/seshApiSlice"; // Import RTK Query hooks for fetching/adding sessions

export default function AllSeshes() {

  const { userInfo } = useSelector((state) => state.user); // Extract logged-in user information from Redux store

  // Fetch sessions data for the specific user using RTK Query
  // pass the logged-in user's _id to the getSeshes hook so RTK Query keeps cache separate per user
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery(userInfo._id);
  // Get the mutation function and loading state for adding a new session
  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();

  const handleAddSesh = async () => {
    try {
      // Call the RTK Query mutation to create a new session with default values
      const newSesh = await addSesh({
        title: "New Sesh",
        date: new Date().toISOString(),
        workouts: [],
      }).unwrap();

      toast.success(`Sesh "${newSesh.title}" created!`); // Show success notification
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create sesh"); // Show error notification on failure
    }
  };

  const handleDelete = (id) => {
    console.log("Delete sesh with id:", id); // Placeholder: Log the ID of the session to be deleted
    // Placeholder: Future implementation for delete functionality
  };

  if (isLoading) return <p>Loading seshes...</p>; // Display loading state while fetching data
  if (isError) return <p>Failed to load seshes</p>; // Display error state if fetching fails

  return (
    <>
      {/* Map through the fetched sessions and render a SeshCard for each */}
      {seshes.map((sesh) => (
        <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
      ))}

      {/* Button to trigger the addition of a new session */}
      <Button
        onClick={handleAddSesh} // Call the handler to add a new session
        className="w-full"
        disabled={addSeshLoading} // Disable the button while an addition request is in progress
      >
        {addSeshLoading ? "Adding..." : "Add New Sesh"} {/* Dynamic button text based on loading state */}
      </Button>
    </>
  );
}