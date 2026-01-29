import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/slices/userApiSlice.js";
import { setUserInfo } from "../slices/userSlice";

//in the signup form, we gather data with the useForm hook, which is
// passed to the handleSubmit function (in this case, submitHandler),
// in order to get the data object to pass to the mutation function

export function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register, // useForm registration of inputs, not RTK
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      dispatch(setUserInfo(res));
      toast.success("Account created!");
      navigate("/users/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-card p-6">
        <div className="flex items-center gap-3 pb-4">
          <span className="logo-text flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white text-2xl font-bold">
            S
          </span>
          <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        </div>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="flex flex-col gap-5"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-muted-foreground"
            >
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-muted-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-muted-foreground"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-semibold text-muted-foreground"
            >
              Confirm password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword", {
                required: "Please confirm password",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="
              mt-2 w-full gap-2
              transition-all duration-200 ease-out
              hover:-translate-y-0.5 hover:shadow-md
              active:translate-y-0 active:shadow-sm
              disabled:pointer-events-none disabled:opacity-70
            "
          >
            <UserRoundPlus className="h-4 w-4" />
            {isLoading ? "Creating…" : "Sign up"}
          </Button>

          <p className="pt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/users/login"
              className="font-medium underline-offset-4 hover:underline"
            >
              Log in
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
