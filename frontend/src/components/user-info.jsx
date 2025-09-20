// components/UserInfo.jsx
import { useSelector, useDispatch } from "react-redux";
import { Card, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logoutUser } from "../slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <Card className="flex flex-col items-center p-4">
      <Avatar className="w-20 h-20 mb-4">
        <AvatarFallback>{getInitials(userInfo?.name)}</AvatarFallback>
      </Avatar>
      <CardTitle>{userInfo?.name}</CardTitle>

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
