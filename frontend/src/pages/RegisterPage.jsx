import { GalleryVerticalEnd } from "lucide-react"
import { SignupForm } from "@/components/signup-form";
import seshSqWh from "@/assets/sesh-sq-white.png";
import seshSm from "@/assets/sesh-sm.png";

export default function RegisterPage() {

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
              <img src={seshSm} alt="Sesh logo" className="mx-auto w-24" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 relative hidden lg:block p-8">
         <img src={seshSqWh} alt="Sesh logo" className="mx-auto" />
      </div>
    </div>
  )
}
