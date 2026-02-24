import { useRef, useState, useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetSeshesQuery } from "../slices/seshApiSlice";
import { format, parseISO, startOfDay } from "date-fns";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { setMode, resetMode } from "../slices/modeSlice";

export default function Header() {
  // Define user from store js
  const { userInfo } = useSelector((state) => state.user);

  // Check current mode
  const { mode } = useSelector((state) => state.mode);

  // Utils..
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure these are defined so Outlet context isn't undefined
  const [selectedDate, setSelectedDate] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null); // For back button context
  // For showing date picker
  const isDashboard = location.pathname === "/users/dashboard";
  const showCalendar = isDashboard || isAllSeshes;

  // Simplifies to: if it's not the root/dashboard, show back.
  const isAtRoot = /^\/users\/(dashboard)?\/?$/.test(location.pathname);
  const showBack = !isAtRoot;

  const handleBack = () => {
    // If you want the calendar to reset whenever they leave a sub-page:
    setSelectedDate(null);
    navigate("/users/dashboard", { replace: true });
  };

  // Theme Sync - for tailwind's CSS to fire
  useEffect(() => {
    const root = document.documentElement;
    mode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [mode]);

  // Dynamic Header Height using ResizeObserver API
  useEffect(() => {
    if (headerRef.current) {
      const updateHeight = () =>
        setHeaderHeight(headerRef.current.offsetHeight);
      updateHeight();
      const ro = new ResizeObserver(updateHeight);
      ro.observe(headerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  const handleClear = () => {
    setSelectedDate(null);
    navigate("/users/dashboard");
  };

  // For Avatar
  const getInitials = (name = "") =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  const { data: workouts = [] } = useGetSeshesQuery();

  // 3. Extract the dates for the calendar dots
  const workoutDates = useMemo(() => {
    return workouts.map((sesh) => startOfDay(parseISO(sesh.date)));
  }, [workouts]);

  return (
    <div className="min-h-[100dvh] bg-background">
      <header
        ref={headerRef}
        className="fixed top-0 p-3 left-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Left: Logo & User */}
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Link to="/users/dashboard" className="flex items-center gap-3">
                <span className="logo-text text-3xl font-bold text-foreground">
                  SESH
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold hidden lg:block">
                  {userInfo?.name}
                </span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                <Label className="text-sm font-normal">Theme</Label>
                <Switch
                  checked={mode === "dark"}
                  onCheckedChange={(checked) =>
                    dispatch(setMode(checked ? "dark" : "light"))
                  }
                  className="scale-75"
                />
              </div>

              <div className="flex items-center gap-2">
                {showBack && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBack}
                    className="h-8 text-sm gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back
                  </Button>
                )}

                {showCalendar && (
                  <div className="flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-8 text-sm gap-1"
                        >
                          <span className="hidden sm:inline">
                            {selectedDate
                              ? format(selectedDate, "MMM d")
                              : "Filter By Date"}
                          </span>
                          <span className="sm:hidden">
                            {selectedDate
                              ? format(selectedDate, "MM/dd")
                              : "Filter By Date"}
                          </span>
                          <CalendarIcon className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          modifiers={{ hasWorkout: workoutDates }}
                          modifiersClassNames={{
                            hasWorkout:
                              "bg-black text-white dark:bg-white dark:text-black rounded",
                          }}
                        /> 
                      </PopoverContent>
                    </Popover>
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClear()}
                        className="h-8 px-2 text-sm text-destructive"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: `${headerHeight}px` }}>
        {/* Supply datepicker context to nested Router Routes after /user */}
        <Outlet
          context={{
            selectedDate,
            setSelectedDate,
            isDashboard,
          }}
        />
      </main>
    </div>
  );
}
