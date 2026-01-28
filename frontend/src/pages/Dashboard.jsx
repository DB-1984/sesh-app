import { useRef, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import UserInfo from "@/components/user-info";

export default function DashboardLayout() {
  // Keep your state
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const isDashboard = location.pathname === "/users/dashboard";

  // Header height for dynamic padding
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState();

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);

      const resizeObserver = new ResizeObserver(() => {
        setHeaderHeight(headerRef.current.offsetHeight + 30);
      });
      resizeObserver.observe(headerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="min-h-[100dvh] px-6 app-bg bg-background">
      {/* Header */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-1 flex items-center justify-around">
          {/* Calendar / User info */}
          <UserInfo
            variant="header"
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Clear date button */}
          {selectedDate && isDashboard && (
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
      <main style={{ paddingTop: `${headerHeight}px` }}>
        <Outlet context={{ selectedDate, setSelectedDate, isDashboard }} />
      </main>
    </div>
  );
}
