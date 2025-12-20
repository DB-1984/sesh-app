import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMode } from "../slices/modeSlice";
import { Card, CardTitle } from "@/components/ui/card";
import { apiSlice } from "../slices/apiSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../slices/userSlice";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function UserInfo({ selectedDate, onDateChange }) {
  const { userInfo } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { seshId, exerciseId } = useParams();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(apiSlice.util.resetApiState());
    navigate("/");
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const isNested = location.pathname !== "/users/dashboard";
  const isEdit = /\/users\/dashboard\/sesh\/[^/]+\/exercise\/[^/]+\/edit/.test(
    location.pathname
  );

  // Toggle the `.dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [mode]);

  return (
    <Card className="flex flex-col items-center bg-transparent border-none shadow-none text-inherit">
      {/* Theme toggle */}
      <div className="flex items-center space-x-2 p-4">
        <Switch
          id="theme-mode"
          checked={mode === "dark"}
          onCheckedChange={(checked) =>
            dispatch(setMode(checked ? "dark" : "light"))
          }
        />
        <Label htmlFor="theme-mode">
          {mode === "dark" ? "Dark Mode" : "Light Mode"}
        </Label>
      </div>

      {/* Avatar and user info */}
      <span className="logo-text mx-auto text-4xl font-bold text-foreground">
        Sesh
      </span>
      <Avatar className="w-20 h-20 mb-4">
        <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
      </Avatar>
      <CardTitle className="mb-6">{userInfo?.name}</CardTitle>

      {/* Navigation buttons */}
      {isNested && (
        <Button
          variant="outline"
          className="mt-2 w-75"
          onClick={() => navigate("/users/dashboard")}
        >
          Home
        </Button>
      )}

      {isEdit && (
        <Button
          variant="outline"
          className="mt-2 w-75"
          onClick={() => navigate(`/users/dashboard/sesh/${seshId}`)}
        >
          Back
        </Button>
      )}

      <Button
        className="mt-2 w-75 bg-gray-400 hover:bg-gray-500 text-white"
        onClick={handleLogout}
      >
        Log out
      </Button>

      {!isNested && (
        <div className="mt-4 flex flex-col items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-75 flex items-center justify-between"
              >
                {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <p className="mt-1 text-sm text-gray-500">Search by date</p>
        </div>
      )}
      {selectedDate && (
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => onDateChange(null)}
        >
          Show All Records
        </Button>
      )}
    </Card>
  );
}
