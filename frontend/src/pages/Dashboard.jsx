import { Outlet } from "react-router-dom";
import UserInfo from "../components/user-info";

export default function Dashboard() {

  // we're using nested Routes to dynamically load a single sesh to view/edit, or all seshes, in the Outlet
  // whilst keeping the UserInfo component mounted on the left side of the dashboard
  return (
    <div className="grid lg:grid-cols-3 gap-6 p-6">
      {/* Left column = user info */}
      <UserInfo />

      {/* Right column = seshes or outlet content */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Default = AllSeshes, nested route = ViewSesh */}
        <Outlet />
      </div>
    </div>
  );
}
