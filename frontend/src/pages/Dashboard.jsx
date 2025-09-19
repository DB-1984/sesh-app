// Dashboard.jsx
import { useSelector } from "react-redux";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { SeshCard } from "../components/sesh-card.jsx";
import { useGetSeshesQuery, useAddSeshMutation } from "../slices/seshApiSlice";

export default function Dashboard() {

// get the state.userInfo property from Redux store - this is the specific data
// that is set to the decoded cookie's payload
const { userInfo } = useSelector((state) => state.user);

const [addSesh, { isLoading: addSeshisLoading, isError: addSeshIsError, error }] = useAddSeshMutation();

const handleAddSesh = async () => {
  try {
    const newSesh = await addSesh({
      title: "New Sesh",
      date: new Date().toISOString(),
      workouts: [],
    }).unwrap();

    toast.success(`Sesh "${newSesh.title}" created!`);
    // navigate(`/sesh/${newSesh._id}/edit`); // Uncomment if you want to navigate to the edit page
  } catch (err) {
    toast.error(err?.data?.message || "Failed to create sesh");
  }
};

  function getInitials(name = "") {
  return name
    .split(" ")                // split full name into words
    .map((n) => n[0])          // take first letter of each
    .join("")                  // join them
    .toUpperCase();            // make it uppercase
}

  // Fetch all seshes
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();

  // Optional: handle delete function (if you implement delete mutation later)
  const handleDelete = (id) => {
    console.log("Delete sesh with id:", id);
    // call delete mutation here
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load seshes</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-6">
      {/* User card */}
      <Card className="flex flex-col items-center p-4">
        <Avatar className="w-20 h-20 mb-4">
          <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
        </Avatar>
        <CardTitle>{userInfo?.name}</CardTitle>
      </Card>

      {/* Sesh list */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {seshes.map((sesh) => (
          <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
        ))}

        {/* Add new Sesh */}
       <Button 
          onClick={handleAddSesh} 
          className="w-full" 
          disabled={addSeshisLoading}
        >
          {addSeshisLoading ? "Adding..." : "Add New Sesh"}
        </Button>

      </div>
    </div>
  );
}
