import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMode, resetMode } from "../slices/modeSlice";
import { apiSlice } from "../slices/apiSlice";
import { logoutUser } from "../slices/userSlice";
import { useNavigate, useLocation, Link } from "react-router-dom";
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

import { CalendarIcon, Ellipsis, Pencil } from "lucide-react";
import { format } from "date-fns";

export default function UserInfo({ selectedDate, onDateChange }) {
  const { userInfo } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.mode);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isHeader = true;
  // const isHeader = variant === "header";
  const isNested = location.pathname !== "/users/dashboard";
  const isEdit = location.pathname.includes("/sesh/");
  const isDash = location.pathname.startsWith("/users/dashboard");

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
    dispatch(resetMode()); // resets mode to light
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
          <Link
            to={userInfo ? "/users/dashboard" : "/"}
            className="flex items-center gap-2 font-medium"
          >
            <span className="logo-text mx-auto text-4xl font-bold text-foreground">
              Sesh
            </span>
          </Link>
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-base truncate">
              {userInfo?.name}
            </CardTitle>
          </div>
        </div>
        {/* RIGHT: controls */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center md:gap-4">
          {isEdit && isNested && (
            <div className="flex justify-center items-center gap-4 pb-0">
              <Pencil
                size={16}
                strokeWidth={5}
                className="cursor-pointer text-sm hover:text-black transition-colors"
              />
              <h1 className="text-lg font-black tracking-tight">View / Edit</h1>
            </div>
          )}
          {isDash && !isNested && (
            <div className="flex justify-center items-center gap-4 pb-0">
              <Ellipsis
                size={16}
                strokeWidth={5}
                className="h-6 w-6 cursor-pointer hover:text-black transition-colors"
              />
              <h1 className="text-lg font-black tracking-tight">
                Latest Seshes
              </h1>
            </div>
          )}
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
              className="flex items-center gap-2 w-auto shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 w-auto shrink-0"
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
            </div>
          )}
          {/* Logout */}
          <div className="flex justify-center">
            <Button
              className="flex align-center items-center w-25 gap-2"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
