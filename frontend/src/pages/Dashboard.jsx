import { useNavigate, useOutletContext, Link } from "react-router-dom";
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

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();

  const dateString = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;
  const { data: allSeshes = [], isLoading: seshesLoading } = useGetSeshesQuery(
    { userId: userInfo?._id, date: dateString },
    { skip: !userInfo?._id }
  );

  const latestSeshes = allSeshes.slice(0, 5);

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
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2 overflow-hidden">
      {/* LEFT PANEL: The Identity Side (Static) */}
      <div className="flex flex-col p-8 md:p-12 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-1">
            Dashboard
          </h1>
        </div>

        <div className="flex-1 space-y-10">
          <section>
            <p className="text-2xl font-black tracking-tighter mb-1">
              Current Objective
            </p>
            <p className="text-md font-normal tracking-tighter">
              {profileLoading ? "..." : profile?.goal || "General"}
            </p>
          </section>

          <section className="space-y-4">
            {/* 1. Header stays at the top */}
            <p className="text-2xl font-black tracking-tighter">Stats</p>

            {/* 2. Flex/Grid container for the stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Body Weight */}
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1 mb-1">
                  <Scale className="h-3 w-3" /> Body Weight
                </p>
                <p className="text-3xl font-black">
                  {profileLoading ? "..." : `${profile?.weight || "--"}kg`}
                </p>
              </div>

              {/* BMI Index */}
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1 mb-1">
                  <Activity className="h-3 w-3" /> BMI Index
                </p>
                <p className="text-3xl font-black">
                  {profileLoading ? "..." : profile?.bmi || "--"}
                </p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-[10px] font-black uppercase text-zinc-400 mb-2">
              Bio
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic">
              "{profile?.bio || "No bio set. Update your profile to add one."}"
            </p>
          </section>
        </div>

        <div className="pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-4">
          <Button
            asChild
            variant="link"
            className="justify-start p-0 h-auto text-black dark:text-white font-black text-lg"
          >
            <Link to="/users/profile" className="flex items-center gap-2 group">
              Update Health Data{" "}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* RIGHT PANEL: The Activity Side (Capped at 5) */}
      <div className="flex flex-col p-8 md:p-12 app-bg overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6" />
            <h2 className="text-2xl font-black tracking-tight uppercase">
              Recent Activity
            </h2>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="rounded-xl border-2 font-black bg-white/50 backdrop-blur-sm"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMM dd") : "Filter"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 rounded-2xl border-2"
              align="end"
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1 space-y-4">
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

              {allSeshes.length > 5 && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full py-6 font-black text-zinc-500 hover:text-black dark:hover:text-white"
                >
                  <Link to="/users/all-seshes">
                    VIEW ALL {allSeshes.length} SESSIONS
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>

        <Button
          onClick={handleAddSesh}
          disabled={addSeshLoading}
          className="mt-8 w-full py-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-xl shadow-xl hover:scale-[1.01] transition-all"
        >
          {addSeshLoading ? "..." : "START NEW SESH"}
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
