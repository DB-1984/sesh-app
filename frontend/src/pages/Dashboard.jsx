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

  // 1. Define UI State
  const isFiltering = !!selectedDate;
  const dateString = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;

  // 2. Fetch Profile (for the Left Panel/Outlet)
  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();

  // 3. Fetch Sessions (One single query that reacts to dateString)
  const { data: allSeshes = [], isLoading: seshesLoading } = useGetSeshesQuery(
    { userId: userInfo?._id, date: dateString },
    { skip: !userInfo?._id }
  );

  // 4. Determine what to actually show in the list
  const displaySeshes = isFiltering ? allSeshes : allSeshes.slice(0, 5);

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
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2 overflow-hidden bg-white dark:bg-zinc-950">
      {/* LEFT PANEL: Profile/Stats (Remains the same) */}
      <div className="flex flex-col h-[calc(100vh-64px)] border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
        <div className="w-full max-w-lg lg:max-w-md mx-auto p-6 md:p-12">
          <Outlet context={{ profile, profileLoading }} />
        </div>
      </div>

      {/* RIGHT PANEL: The Activity Side */}
      <div className="relative flex flex-col p-8 md:p-12 mr-2 app-bg overflow-hidden">
        {/* Header: Changes based on state */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            {isFiltering ? (
              <>
                <CalendarIcon className="h-6 w-6" />
                <h2 className="text-4xl font-black tracking-tight">
                  {format(selectedDate, "MMM do")}
                </h2>
              </>
            ) : (
              <>
                <History className="h-6 w-6" />
                <h2 className="text-4xl font-black tracking-tight">Recent</h2>
              </>
            )}
          </div>

          {/* Optional: Clear Button if filtering */}
          {isFiltering && (
            <Button
              variant="ghost"
              onClick={() => setSelectedDate(null)}
              className="text-zinc-500 hover:text-black dark:hover:text-white"
            >
              Clear
            </Button>
          )}
        </div>

        {/* List: Handles scroll */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-12 pr-2">
          {seshesLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin" />
            </div>
          ) : displaySeshes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-800 font-bold tracking-tight text-md">
                {isFiltering
                  ? "No sessions on this date."
                  : "No recent sessions found."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {displaySeshes.map((sesh) => (
                <SeshCard key={sesh._id} sesh={sesh} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleAddSesh}
            disabled={addSeshLoading}
            className="py-8 px-8 rounded-2xl bg-black dark:bg-white logo-text text-white tracking-tight dark:text-black font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            {addSeshLoading ? <Loader2 className="animate-spin" /> : "+Sesh"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
