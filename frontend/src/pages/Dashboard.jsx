import { Outlet } from "react-router-dom";
import { useState } from "react";
import UserInfo from "../components/user-info";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null); // null defaults to prevent errors

// All the logic for the date changing is contained in userInfo, but becuase outlet shows this component throughout the app, we have to set null defaults in Dashboard

  return (
    <div className="grid lg:grid-cols-2 gap-2 min-h-screen p-6">
      {/* Left column = centered user info */}
      <div className="flex items-center justify-center">
        <UserInfo selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Right column = seshes / outlet */}
      <div className="flex flex-col gap-4">
        <Outlet context={{ selectedDate }} />
      </div>
    </div>
  );
}
