/**
 * @file UserInfo.jsx
 * @description
 * A presentational component that displays the currently authenticated user's
 * basic account information (name, avatar initials, and logo) and provides a
 * logout action. It integrates with Redux for state management and RTK Query
 * for API cache handling.
 *
 * ───────────────────────────────────────────────
 * 📦 Data Flow:
 * - Reads `userInfo` from Redux state (userSlice).
 * - On logout:
 *    1. Dispatches `logoutUser()` to clear auth state from Redux.
 *    2. Dispatches `apiSlice.util.resetApiState()` to clear RTK Query cache.
 *    3. Navigates the user back to the home page.
 *
 * 🧭 Responsibilities:
 * - Render user initials in an avatar (derived from full name).
 * - Show the app logo for visual context.
 * - Provide a single, predictable logout entry point.
 *
 * 🚫 Not Responsible For:
 * - Authenticating users (handled by login flow elsewhere).
 * - Fetching or mutating user data (comes from Redux already).
 *
 * 📡 Dependencies:
 * - Redux state: userInfo (from userSlice)
 * - RTK Query API slice (for cache reset)
 * - React Router for navigation
 *
 * 🧰 UI Components Used:
 * - Card, CardTitle, Avatar, AvatarFallback, Button
 *
 * @example
 * // Used in a dashboard layout:
 * <UserInfo />
 */

// components/UserInfo.jsx
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMode } from "../slices/modeSlice"; // or themeSlice
import { Card, CardTitle } from "@/components/ui/card";
import { apiSlice } from "../slices/apiSlice";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../slices/userSlice";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function UserInfo() {
  const { userInfo } = useSelector((state) => state.user);
  const { mode } = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { seshId, workoutId } = useParams();

  const handleLogout = () => {
    dispatch(logoutUser()); // handles redux state
    const root = document.documentElement;
    dispatch(apiSlice.util.resetApiState()); // clears cached data
    navigate("/");
  };

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const isNested = location.pathname !== "/users/dashboard";
  const isEdit = /\/users\/dashboard\/sesh\/[^/]+\/workout\/[^/]+\/edit/.test(
    location.pathname
  );

  // Toggle the `.dark` class on the <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return (
    <Card className="flex flex-col items-center p-4 bg-transparent border-none shadow-none text-inherit">
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

      <span className="logo-text mx-auto text-4xl font-bold text-foreground">
        Sesh
      </span>
      <Avatar className="w-20 h-20 mb-4">
        <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
      </Avatar>
      <CardTitle>{userInfo?.name}</CardTitle>

      {isNested && (
        <Button
          variant="outline"
          className="mt-2 w-50"
          onClick={() => navigate("/users/dashboard")}
        >
          Home
        </Button>
      )}

      {isEdit && (
        <Button
          variant="outline"
          className="w-50"
          onClick={() => navigate(`/users/dashboard/sesh/${seshId}`)}
        >
          Back
        </Button>
      )}

      <Button variant="outline" className="w-50" onClick={handleLogout}>
        Log out
      </Button>
    </Card>
  );
}
