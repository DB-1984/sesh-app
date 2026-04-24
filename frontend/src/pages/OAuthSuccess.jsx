import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "../slices/userApiSlice";
import { setUserInfo } from "../slices/userSlice";
import { toast } from "react-toastify";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Trigger the 'getProfile' query.
  // Because 'credentials: include' is in baseQuery,
  // the browser sends the 'jwt' cookie automatically.
  const { data, isSuccess, isError, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (isSuccess && data) {
      // 1. Sync Redux
      dispatch(setUserInfo(data));

      // 2. Logic for the Toast
      if (data.isNewUser) {
        toast.success("Welcome to Sesh!");
      } else {
        toast.success(`Welcome back, ${data.name}!`);
      }

      // 3. Move to Dashboard
      // Using { replace: true } prevents them from "going back" to this loading screen
      navigate("/users/dashboard", { replace: true });
    }

    if (isError) {
      navigate("/users/login?error=oauth_sync_failed");
    }
  }, [isSuccess, isError, data, navigate, dispatch]);

  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="flex items-end gap-1 h-8">
        <div className="w-1.5 h-4 bg-foreground/70 animate-[bounce_1s_infinite]" />
        <div className="w-1.5 h-6 bg-foreground/70 animate-[bounce_1s_infinite_0.1s]" />
        <div className="w-1.5 h-8 bg-foreground/70 animate-[bounce_1s_infinite_0.2s]" />
        <div className="w-1.5 h-6 bg-foreground/70 animate-[bounce_1s_infinite_0.3s]" />
        <div className="w-1.5 h-4 bg-foreground/70 animate-[bounce_1s_infinite_0.4s]" />
      </div>
    </div>
  );
}
