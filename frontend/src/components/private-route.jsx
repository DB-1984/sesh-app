import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const isLoggedIn = useSelector((state) => !!state.user.userInfo); // adjust based on your slice
  return isLoggedIn ? <Outlet /> : <Navigate to="/users/login" />;
}
