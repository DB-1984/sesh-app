import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import UserInfo from "../components/user-info";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="min-h-screen app-bg bg-background">
      {/* Header */}
      <header>
        <div className="mx-auto max-w-7xl px-6 py-4">
          <UserInfo
            variant="header"
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(null)}
            >
              Clear date
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl p-6">
        <Outlet context={{ selectedDate }} />
      </main>
    </div>
  );
}
