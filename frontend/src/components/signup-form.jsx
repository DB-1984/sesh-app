import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/slices/userApiSlice.js";

//in the signup form, we gather data with the useForm hook, which is 
// passed to the handleSubmit function (in this case, submitHandler), 
// in order to get the data object to pass to the mutation function

export function SignupForm() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success("Account created!");
      navigate("/users/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-background p-8 rounded-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name">Name</label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", { required: "Please confirm password" })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? "Creating..." : "Sign Up"}
          </Button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <a href="/users/login" className="underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
