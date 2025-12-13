import { Outlet } from "react-router-dom";
import { useState } from "react";
import UserInfo from "../components/user-info";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null); // null defaults to prevent errors

  return (
    <div className="grid lg:grid-cols-3 gap-6 p-6">
      {/* Left column = user info */}
      <UserInfo
      // use of the props requires both a value here, and definition of props in the user-info component itself
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Right column = seshes or outlet content */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Outlet context={{ selectedDate }} />
      </div>
    </div>
  );
}
