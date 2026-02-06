import { useRef, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
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

// Dark/Light mode reducers
import { setMode, resetMode } from "../slices/modeSlice";
// Logout reducer for clearing session
import { logoutUser } from "../slices/userSlice";

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
  const isAllSeshes = location.pathname === "/users/all-seshes";
  const showCalendar = isDashboard || isAllSeshes;

  // Used to track current path value
  const prevPathRef = useRef(null);

  // Update the "Referrer" every time the path changes
  useEffect(() => {
    // This runs after the component renders with the NEW path
    // So we store the current path in the ref for the NEXT change
    return () => {
      prevPathRef.current = location.pathname;
    };
  }, [location.pathname]);

  const lastLocation = prevPathRef.current;

  // LOGIC: Show back if we aren't on the "Home" base (Dashboard)
  // Or if we have a recorded last location to go back to
  const showBack =
    location.pathname !== "/users/dashboard" ||
    (lastLocation && lastLocation !== location.pathname);

  const handleBack = () => {
    // If we are on the filtered page, clear the filter as we go back
    if (location.pathname === "/users/all-seshes") {
      setSelectedDate(null);
      navigate("/users/dashboard");
      return; // Exit early
    }

    // Standard back logic for everything else
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/users/dashboard");
    }
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
        setHeaderHeight(headerRef.current.offsetHeight + 10);
      updateHeight();
      const ro = new ResizeObserver(updateHeight);
      ro.observe(headerRef.current);
      return () => ro.disconnect();
    }
  }, []);

  // Redirect logic
  useEffect(() => {
    if (selectedDate && isDashboard) {
      navigate("/users/all-seshes", { replace: true }); // update history stack
    }
  }, [selectedDate, isDashboard, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser()); // clean session
    dispatch(resetMode()); // set back to Light
    dispatch(apiSlice.util.resetApiState()); // clear RTK cache
    navigate("/");
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

  return (
    <div className="min-h-[100dvh] px-6 bg-background">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm border-b"
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
                <span className="text-sm font-medium hidden lg:block">
                  {userInfo?.name}
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleLogout}
                className="md:hidden h-8 text-xs"
              >
                Log out
              </Button>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 px-2 py-1 rounded-md">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                  Theme
                </Label>
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
                    className="h-8 text-xs gap-1"
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
                          size="sm"
                          className="h-8 text-xs gap-1"
                        >
                          <span className="hidden sm:inline">
                            {selectedDate
                              ? format(selectedDate, "MMM d")
                              : "Filter Date"}
                          </span>
                          <span className="sm:hidden">
                            {selectedDate
                              ? format(selectedDate, "MM/dd")
                              : "Filter"}
                          </span>
                          <CalendarIcon className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                        />
                      </PopoverContent>
                    </Popover>
                    {selectedDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(null)}
                        className="h-8 px-2 text-xs text-destructive"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleLogout}
                  className="hidden md:flex h-8 text-xs"
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: `${headerHeight}px` }} className="pb-10">
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
