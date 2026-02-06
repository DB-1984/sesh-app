import { useNavigate, useOutletContext, Link, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  User,
  Scale,
  Activity,
  CalendarIcon,
  ArrowRight,
  KeyRound,
  Dumbbell,
  Loader2,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SeshCard } from "@/components/SeshCard";

import {
  useAddSeshMutation,
  useGetSeshesQuery,
  useDeleteSeshMutation,
} from "../slices/seshApiSlice";
import { useGetProfileQuery } from "../slices/userApiSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { selectedDate, setSelectedDate } = useOutletContext();

  // both the stats and the /profile component rely on this
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();

  const dateString = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;
  const { data: allSeshes = [], isLoading: seshesLoading } = useGetSeshesQuery(
    { userId: userInfo?._id, date: dateString },
    { skip: !userInfo?._id }
  );

  const latestSeshes = allSeshes.slice(0, 3);

  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();
  const [deleteSesh] = useDeleteSeshMutation();

  const handleAddSesh = async () => {
    try {
      const newSesh = await addSesh({
        title: "New Sesh",
        date: new Date().toISOString(),
        exercises: [],
      }).unwrap();
      toast.success(`Sesh created!`);
      navigate(`/users/sesh/${newSesh._id}`);
    } catch (err) {
      toast.error("Failed to create sesh");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSesh(id).unwrap();
      toast.success("Sesh deleted!");
    } catch (err) {
      toast.error("Failed to delete Sesh");
    }
  };

  return (
    /* Changed grid-cols-2 to a custom 1:1.5 ratio */
    <div className="grid min-h-[calc(100vh-64px)] items-center lg:grid-cols-2 overflow-hidden">
      {" "}
      {/* LEFT PANEL: The Dynamic Side (Slimmer) */}
      <div className="flex flex-col h-[calc(100vh-64px)] p-8 md:p-12 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto scroll-smooth">
        <div className="w-full max-w-sm mx-auto">
          <Outlet context={{ profile, profileLoading }} />
        </div>
      </div>
      {/* RIGHT PANEL: The Activity Side (Wider & Scrollable) */}
      <div className="relative flex flex-col p-8 md:p-12 mr-2 app-bg overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6" />
            <h2 className="text-2xl font-black tracking-tight">Recent</h2>
          </div>
        </div>

        {/* This inner div handles the scroll so the button can stay fixed */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-24 pr-2">
          {seshesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : latestSeshes.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-3xl">
              <p className="font-bold text-zinc-500">No sessions found.</p>
            </div>
          ) : (
            <>
              {latestSeshes.map((sesh) => (
                <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
              ))}

              {allSeshes.length > 3 && (
                <Button
                  asChild
                  variant="link"
                  className="w-full py-6 font-semibold text-zinc-600 hover:text-black dark:hover:text-white"
                >
                  <Link to="/users/all-seshes">
                    View all {allSeshes.length} sessions
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Floating Button at the bottom of the right panel */}
        <div className="flex justify-end">
          <Button
            onClick={handleAddSesh}
            disabled={addSeshLoading}
            className="py-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xl shadow-xl hover:scale-[1.01] transition-all"
          >
            {addSeshLoading ? "..." : "+ ADD SESH"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
