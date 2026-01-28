import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

export default function LoginRegisterPage({ mode = "login" }) {
  // Use a mode prop to determine which form to show with a nested component - passed from the Route in main.tsx

  // Because we use a combined LoginRegisterPage for both /login and /register routes
  // and import a login and signup form component separately, we can conditionally render
  // the appropriate form based on the mode prop, which is passed the path from the Route
  const FormComponent = mode === "login" ? LoginForm : SignupForm;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 app-bg md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <span className="logo-text mx-auto text-4xl font-bold text-foreground">
              Sesh
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full w-full max-w-md bg-background p-8 shadow-lg rounded-lg">
            <FormComponent />
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 relative hidden lg:flex items-center justify-center p-8">
        <span className="logo-text-large text-4xl font-bold animate-bounce text-foreground">
          Sesh
        </span>
      </div>
    </div>
  );
}
