import { Link, useOutletContext, useNavigate } from "react-router-dom";
import {
  Scale,
  Activity,
  ArrowRight,
  LayoutDashboard,
  UserPen,
  LogOut,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../slices/userSlice";
import { apiSlice } from "../slices/apiSlice"; // for the util
import { useLogoutMutation } from "../slices/userApiSlice";

export default function DashboardStats() {
  // Grab the data passed down from the Dashboard Outlet
  const { profile, profileLoading } = useOutletContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutApiCall().unwrap(); // kill cookie
    dispatch(logoutUser()); // clean redux session
    dispatch(resetMode()); // set back to Light
    dispatch(apiSlice.util.resetApiState()); // clear RTK cache
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="h-6 w-6" />
        <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 space-y-10">
        <section>
          <p className="text-2xl font-black tracking-tighter mb-1">
            Current Objective
          </p>
          <p className="text-md font-normal tracking-tighter text-zinc-500">
            {profileLoading ? "..." : profile?.goal || "General"}
          </p>
        </section>

        <section className="space-y-4">
          <p className="text-2xl font-black tracking-tighter">Stats</p>
          <div className="grid grid-cols-2 gap-6">
            {/* Body Weight */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-black text-zinc-600 flex tracking-tight items-center gap-1 mb-1 uppercase">
                <Scale className="h-3 w-3" /> Body Weight
              </p>
              <p className="text-2xl font-black">
                {profileLoading ? "..." : `${profile?.weight || "--"}kg`}
              </p>
            </div>

            {/* BMI Index */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-black text-zinc-600 tracking-tight flex items-center gap-1 mb-1 uppercase">
                <Activity className="h-3 w-3" /> BMI
              </p>
              <p className="text-2xl font-black">
                {profileLoading ? "..." : profile?.bmi || "--"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-2xl font-black tracking-tighter mb-1">Targets</p>
          <p className="text-md font-normal tracking-tighter text-zinc-500">
            {profile?.targets ||
              "No targets set. Update your profile to add some."}
          </p>
        </section>
      </div>

      {/* ACTION SECTION: Pushed to bottom by flex-1 above */}
      <div className="mt-12 pt-8 pb-8 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col gap-3">
          {/* Update Health Data */}
          <Button
            asChild
            variant="ghost"
            className="group flex h-16 w-full items-center justify-between rounded-2xl bg-zinc-50 px-5 transition-all hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900"
          >
            <Link to="profile" className="no-underline">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-zinc-800">
                  <UserPen className="h-5 w-5 text-zinc-600 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white" />
                </div>
                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Update Health Data
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Log Out */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="group flex h-16 w-full items-center justify-between rounded-2xl bg-red-50/40 px-5 transition-all hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-zinc-800">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-base font-bold text-red-600 dark:text-red-400">
                Log out
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-red-300 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
