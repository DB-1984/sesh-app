import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/slices/userSlice";
import { useLoginMutation } from "@/slices/userApiSlice";

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const user = await login(data).unwrap();
      dispatch(setUserInfo(user));

      toast.success("Welcome back!", {
        delay: 100, // 🔸 Gives react-toastify a tick to mount/render
      });

      setTimeout(() => {
        navigate("/users/dashboard");
      }, 200); // 🔸 Ensures toast renders before redirect
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err?.data?.message || "Invalid email or password", {
        autoClose: 3000,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-6"
    >
      <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Track your training. Build consistency. One sesh at a time.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", { required: "Email required" })}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: "Password required" })}
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="
    w-full
    transition-all
    duration-200
    ease-out
    hover:translate-y-[-1px]
    hover:shadow-md
    active:translate-y-[1px]
    active:shadow-sm
    disabled:opacity-70
    disabled:pointer-events-none
  "
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Signing you in…
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" />
              Log in
            </span>
          )}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don’t have an account?{" "}
        <a href="/users/register" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
