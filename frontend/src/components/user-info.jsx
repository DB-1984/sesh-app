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
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../slices/userSlice";
import { useNavigate, useLocation} from "react-router-dom";
import seshSm from "@/assets/sesh-sm.png";

export default function UserInfo() {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    dispatch(logoutUser()); // handles redux state
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

  return (
    <Card className="flex flex-col items-center p-4">
    <img src={seshSm} alt="Sesh logo" className="mx-auto w-24" />
      <Avatar className="w-20 h-20 mb-4">
        <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
      </Avatar>
      <CardTitle>{userInfo?.name}</CardTitle>

      {isNested && (
        <Button
          variant="outline"
          className="mt-2 w-full"
          onClick={() => navigate("/users/dashboard")}
        >
          Home
        </Button>
      )}


      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={handleLogout}
      >
        Log out
      </Button>
    </Card>
  );
}
