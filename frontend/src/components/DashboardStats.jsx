import { Link, useOutletContext } from "react-router-dom";
import {
  Scale,
  Activity,
  ArrowRight,
  LayoutDashboard,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardStats() {
  // Grab the data passed down from the Dashboard Outlet
  const { profile, profileLoading } = useOutletContext();

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

        <div className="pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-900">
          <Button
            asChild
            variant="link"
            className="justify-start p-0 h-auto text-black dark:text-white font-black text-lg no-underline hover:no-underline"
          >
            <Link to="profile" className="flex items-center gap-2 group">
              {/* Icon moved inside the link for perfect alignment */}
              <UserPen className="h-5 w-5 text-zinc-600 group-hover:text-black dark:group-hover:text-white transition-colors" />

              <span>Update Health Data</span>

              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
