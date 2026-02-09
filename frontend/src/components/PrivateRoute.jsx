import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; // Import this
import { useGetProfileQuery } from "../slices/userApiSlice";

export default function PrivateRoute() {
  // 1. Check if we *think* we are logged in locally (from Redux)
  const { userInfo: localUser } = useSelector((state) => state.user);

  // 2. Only hit the server if we have a local user record
  // This prevents the "401 Unauthorized" noise on the console after logout
  const { data: serverUser, isLoading } = useGetProfileQuery(undefined, {
    skip: !localUser,
  });

  if (isLoading) return <div>Loading...</div>;

  // 3. If we have a local user AND the server confirmed it, show the page
  // Otherwise, kick them back to login
  return localUser && serverUser ? (
    <Outlet />
  ) : (
    <Navigate to="/users/login" replace />
  );
}
