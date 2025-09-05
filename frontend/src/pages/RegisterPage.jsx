import { SignupForm } from "@/components/signup-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left half: signup form */}
      <div className="w-1/2 flex items-center justify-center bg-muted">
        <div className="w-full max-w-md p-8">
          <SignupForm />
        </div>
      </div>

      {/* Right half: branding/image */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}
      >
        <div className="flex h-full items-center justify-center">
          <h1 className="text-white text-3xl font-bold">Welcome to Sesh</h1>
        </div>
      </div>
    </div>
  );
}
