import { useNavigate, useOutletContext, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import {
  User,
  Scale,
  Activity,
  CalendarIcon,
  History,
  ArrowRight,
  KeyRound,
} from "lucide-react";

// UI Components
import { StatCard } from "../components/StatCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// API Slices
import { useAddSeshMutation } from "../slices/seshApiSlice";
import { useGetProfileQuery } from "../slices/userApiSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  // Pulling the stable UI state from the Header/Outlet context
  const { selectedDate, setSelectedDate } = useOutletContext();

  const { data: profile, isLoading: profileLoading } = useGetProfileQuery();
  const [addSesh, { isLoading: addSeshLoading }] = useAddSeshMutation();

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
      toast.error(err?.data?.message || "Failed to create sesh");
    }
  };

  return (
    <div className="relative px-6 py-8">
      <h1 className="text-2xl logo-text rounded bg-muted/50 mb-8 p-3 font-black tracking-tight">
        Dashboard
      </h1>

      {/* Grid Layout */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start">
        {/* 1. Overview Card */}
        <StatCard
          title="Overview"
          subtitle={userInfo?.email}
          icon={User}
          footer={
            <Button
              asChild
              variant="ghost"
              className="w-full justify-between text-xs font-bold p-0 h-auto hover:bg-transparent text-black dark:text-white"
            >
              <Link
                to="/users/profile"
                className="flex items-center justify-between w-full"
              >
                Update Health Data <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          }
        >
          <div className="text-2xl font-black truncate mb-4 text-black dark:text-white">
            {userInfo?.name || "User"}
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-zinc-200 dark:border-zinc-700 pt-4">
            <div>
              <p className="flex items-center gap-1 text-[10px] font-bold text-black dark:text-white">
                <Scale className="h-3 w-3" /> Weight
              </p>
              <p className="text-xl font-black text-black dark:text-white">
                {profileLoading ? "..." : `${profile?.weight || "--"} kg`}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-1 text-[10px] font-bold text-black dark:text-white">
                <Activity className="h-3 w-3" /> BMI
              </p>
              <p className="text-xl font-black text-black dark:text-white">
                {profileLoading ? "..." : profile?.bmi || "--"}
              </p>
            </div>
          </div>
        </StatCard>

        {/* 2. Calendar Filter Card */}
        <StatCard
          title="Quick Filter"
          icon={CalendarIcon}
          footer={<div className="h-2" />}
        >
          <p className="text-2xl font-black mb-4 text-black dark:text-white">
            Search completion date
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-black text-xs border-zinc-300 dark:border-zinc-600"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </StatCard>

        {/* 3. Navigation Links Column */}
        <div className="grid gap-6">
          <StatCard title="History" icon={History}>
            <Link
              to="/users/all-seshes"
              className="flex items-center justify-between group text-black dark:text-white"
            >
              <span className="font-black hover:underline tracking-tight">
                All Seshes
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </StatCard>

          <StatCard title="Security" icon={KeyRound}>
            <Link
              to="/users/profile"
              className="flex items-center justify-between group text-black dark:text-white"
            >
              <span className="font-black hover:underline tracking-tight">
                Reset Password
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </StatCard>
        </div>
      </div>

      {/* Floating Add button */}
      <Button
        onClick={handleAddSesh}
        disabled={addSeshLoading}
        className="
          fixed bottom-6 right-6 z-50
          rounded-2xl bg-black dark:bg-white px-6 py-7
          font-black text-white dark:text-black text-lg
          shadow-xl transition-all
          hover:shadow-2xl active:scale-95
        "
      >
        {addSeshLoading ? "Adding…" : "+ Sesh"}
      </Button>
    </div>
  );
};

export default Dashboard;
