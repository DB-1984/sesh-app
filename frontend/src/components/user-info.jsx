import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMode } from "../slices/modeSlice";
import { apiSlice } from "../slices/apiSlice";
import { logoutUser } from "../slices/userSlice";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

export default function UserInfo({
  selectedDate,
  onDateChange,
  variant = "sidebar", // "sidebar" | "header"
}) {
  const { userInfo } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.mode);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { seshId } = useParams();

  const isHeader = variant === "header";
  const isNested = location.pathname !== "/users/dashboard";
  const isEdit = /\/users\/dashboard\/sesh\/[^/]+\/exercise\/[^/]+\/edit/.test(
    location.pathname
  );

  /* -------------------------------
     Effects
  --------------------------------*/

  useEffect(() => {
    const root = document.documentElement;
    mode === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [mode]);

  /* -------------------------------
     Helpers
  --------------------------------*/

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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/users/dashboard");
    }
  };

  /* -------------------------------
     Layout
  --------------------------------*/

  return (
    <Card
      className={`bg-transparent border-none shadow-none ${
        isHeader ? "w-full" : ""
      }`}
    >
      <div
        className={
          isHeader
            ? "grid gap-6 items-center md:grid-cols-[1fr_auto] md:items-center"
            : "flex flex-col items-center gap-4"
        }
      >
        {/* LEFT: identity */}
        <div className="flex items-center gap-3 justify-center md:justify-start text-center md:text-left">
          <a href="/" className="flex items-center gap-2 font-medium">
            <span className="logo-text mx-auto text-4xl font-bold text-foreground">
              Sesh
            </span>
          </a>
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <CardTitle className="text-base truncate">
              {userInfo?.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Your sessions</p>
          </div>
        </div>
        {/* RIGHT: controls */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center md:gap-4">
          {/* Theme */}
          <div className="flex items-center justify-center gap-2">
            <Label htmlFor="theme-mode" className="text-sm">
              Theme
            </Label>
            <div className="flex items-center gap-2">
              <Switch
                id="theme-mode"
                checked={mode === "dark"}
                onCheckedChange={(checked) =>
                  dispatch(setMode(checked ? "dark" : "light"))
                }
              />
              <span className="text-sm">
                {mode === "dark" ? "Dark" : "Light"}
              </span>
            </div>
          </div>
          {/* Date filter */}
          {isNested ? (
            <Button
              size="sm"
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto justify-between"
                >
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Filter by date"}
                  <CalendarIcon className="h-4 w-4 ml-2" />
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
          )}
          {/* Logout */}
          <Button
            size="sm"
            variant="default"
            className="w-full sm:w-auto"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </Card>
  );
}
