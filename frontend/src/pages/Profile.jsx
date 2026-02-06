import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/slices/userApiSlice";
import { setUserInfo } from "../slices/userSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { data: profileData, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      weight: "",
      height: "",
      goal: "General",
      targets: "",
    },
  });

  // Populate form by merging Auth (userInfo) and Database (profileData)
  useEffect(() => {
    // If we have profileData, it's the most accurate.
    // Otherwise, fallback to userInfo (Auth state).
    const source = profileData || userInfo;

    if (source) {
      reset({
        name: source.name || "",
        email: source.email || "",
        password: "",
        weight: source.weight || "",
        height: source.height || "",
        goal: source.goal || "General",
        targets: source.targets || "",
      });
    }
  }, [profileData, userInfo, reset]); // Watch BOTH here

  const onSubmit = async (data) => {
    try {
      const updated = await updateProfile(data).unwrap();
      dispatch(setUserInfo(updated));
      toast.success("Profile updated!");
      reset({ ...data, password: "" }); // clear password after update
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>Loading profile</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12 text-destructive">
        Failed to load profile
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Profile unavailable
      </div>
    );
  }

  return (
    <div className="relative px-6 py-8">
      <h1 className="text-2xl logo-text rounded bg-muted/50 mb-8 p-3 font-black tracking-tight">
        Profile
      </h1>
      <main className="max-w-3xl mx-auto px-6 pt- pb-10">
        <Card className="rounded-xl border shadow-sm">
          <CardHeader>
            <CardTitle className="logo-text text-3xl">Update Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Name */}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email (disabled) */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  disabled
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  {...register("password")}
                />
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    {...register("weight", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    {...register("height", { valueAsNumber: true })}
                  />
                </div>
              </div>

              {/* Goal */}
              <div>
                <Label htmlFor="goal">Goal</Label>
                <select id="goal" {...register("goal")}>
                  <option value="Strength">Strength</option>
                  <option value="Hypertrophy">Hypertrophy</option>
                  <option value="Endurance">Endurance</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* Targets */}
              <div>
                <Label htmlFor="targets">Targets</Label>
                <textarea
                  id="targets"
                  placeholder="List your fitness targets"
                  {...register("targets")}
                  className="w-full border rounded px-2 py-1 mt-1"
                />
              </div>

              <Button type="submit" disabled={isUpdating} className="mt-4">
                {isUpdating ? "Updating…" : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
