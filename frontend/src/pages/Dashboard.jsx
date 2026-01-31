import { useOutletContext, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useAddSeshMutation } from "../slices/seshApiSlice";

const Dashboard = () => {
  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();

  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleAddSesh = async () => {
    try {
      const newSesh = await addSesh({
        title: "New Sesh",
        date: new Date().toISOString(),
        exercises: [],
      }).unwrap();
      toast.success(`Sesh "${newSesh.title}" created!`);
      navigate(`/users/sesh/${newSesh._id}`);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || "Failed to create sesh");
    }
  };
  return (
    <div>
      <p>{userInfo.email}</p>
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
};

export default Dashboard;
