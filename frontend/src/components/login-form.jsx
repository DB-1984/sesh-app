import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function LoginForm({ onSubmit }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const submitHandler = async (data) => {
    try {
      await onSubmit(data); // login mutation
      // Redirect after successful login
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={cn("flex flex-col gap-6")}>
      <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email", { required: "Email required" })} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password", { required: "Password required" })} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </div>
      <div className="text-center text-sm">
        Don’t have an account?{" "}
        <a href="/users/register" className="underline underline-offset-4">Sign up</a>
      </div>
    </form>
  );
}
