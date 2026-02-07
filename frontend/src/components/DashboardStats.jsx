import { Link, useOutletContext } from "react-router-dom";
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
import { setMode, resetMode } from "../slices/modeSlice";

export default function DashboardStats() {
  // Grab the data passed down from the Dashboard Outlet
  const { profile, profileLoading } = useOutletContext();

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser()); // clean session
    dispatch(resetMode()); // set back to Light
    dispatch(apiSlice.util.resetApiState()); // clear RTK cache
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-12">
        <LayoutDashboard className="h-6 w-6" />
        <h2 className="text-4xl font-black tracking-tight">Dashboard</h2>
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

        <section className="space-y-2">
          <p className="text-2xl font-black tracking-tighter">Stats</p>

          <div className="grid grid-cols-2 gap-6 mb-2">
            {/* Body Weight */}
            <div>
              <p className="text-[10px] font-black text-zinc-600 flex tracking-tight items-center gap-1 mb-1">
                <Scale className="h-3 w-3" /> Body Weight
              </p>
              <p className="text-2xl font-black">
                {profileLoading ? "..." : `${profile?.weight || "--"}kg`}
              </p>
            </div>

            {/* BMI Index */}
            <div>
              <p className="text-[10px] font-black text-zinc-600 tracking-tight flex items-center gap-1 mb-1">
                <Activity className="h-3 w-3" /> BMI
              </p>
              <p className="text-2xl font-black">
                {profileLoading ? "..." : profile?.bmi || "--"}
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className="text-2xl mt-3 font-black tracking-tighter mb-1">
            Targets
          </p>
          <p className="text-md font-normal tracking-tighter">
            {profile?.targets ||
              "No targets set. Update your profile to add some."}
          </p>
        </section>

        <div className="mt-12 border-t border-zinc-100 pt-8 pb-14 dark:border-zinc-900 px-4 sm:px-0">
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
              className="group flex h-16 w-full items-center justify-between rounded-2xl bg-red-50/50 px-5 transition-all hover:bg-red-50 dark:bg-red-950/10 dark:hover:bg-red-950/20"
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
    </>
  );
}
