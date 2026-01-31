import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.user);

  // RAW CHECK: Does the cookie/storage exist at all?
  const hasStorage = localStorage.getItem("userInfo");

  // If Redux is empty AND the browser storage is empty, THEN they are logged out.
  if (!userInfo && !hasStorage) {
    return <Navigate to="/users/login" replace />;
  }

  // Otherwise, let them through.
  // Redux will catch up and fill 'userInfo' in the next millisecond.
  return <Outlet />;
}
