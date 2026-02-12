// src/components/ForgotPasswordForm.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/slices/userApiSlice";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, isSuccess, isError, error }] =
    useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
    } catch (err) {
      // Keep UI generic to avoid leaking whether email exists
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-center">Reset your password</h2>

      <p className="text-sm text-muted-foreground text-center">
        Enter the email you used for your account and we’ll send you a reset
        link.
      </p>

      <input
        type="email"
        placeholder="Email address"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <button type="submit" disabled={isLoading} className="btn-primary">
        {isLoading ? "Sending..." : "Send reset link"}
      </button>

      {/* Success: always generic */}
      {isSuccess && (
        <p className="text-sm text-center text-muted-foreground">
          If that email exists, we’ve sent a reset link.
        </p>
      )}

      {/* Error: keep it generic */}
      {isError && (
        <p className="text-sm text-center text-destructive">
          Something went wrong. Please try again.
        </p>
      )}

      <div className="text-sm text-center">
        <Link to="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </form>
  );
}
