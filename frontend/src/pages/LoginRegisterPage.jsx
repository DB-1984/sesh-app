import seshSqWh from "@/assets/sesh-sq-white.png";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import seshSm from "@/assets/sesh-sm.png";

export default function LoginRegisterPage({ mode = "login" }) {

// Use a mode prop to determine which form to show with a nested component - passed from the Route in main.tsx

// Because we use a combined LoginRegisterPage for both /login and /register routes
// and import a login and signup form component separately, we can conditionally render
// the appropriate form based on the mode prop, which is passed the path from the Route
const FormComponent = mode === "login" ? LoginForm : SignupForm;

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <img src={seshSm} alt="Sesh logo" className="mx-auto w-24" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <FormComponent />
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 relative hidden lg:block p-8">
        <img src={seshSqWh} alt="Sesh logo" className="mx-auto" />
      </div>
    </div>
  );
}
