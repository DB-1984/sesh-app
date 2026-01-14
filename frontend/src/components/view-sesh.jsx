import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetSeshesQuery,
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useRenameSeshMutation,
} from "../slices/seshApiSlice";
import { ExerciseForm } from "@/components/exercise-form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ViewSesh() {
  const { id } = useParams();

  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();
  const currentSesh = seshes.find((s) => s._id === id);

  const [addExercise] = useAddExerciseMutation();
  const [deleteExercise] = useDeleteExerciseMutation();
  const [renameSesh] = useRenameSeshMutation();

  const originalTitleRef = useRef("");
  const [titleDraft, setTitleDraft] = useState("");

  // When sesh loads/changes, sync the draft title
  useEffect(() => {
    if (currentSesh?.title) setTitleDraft(currentSesh.title);
  }, [currentSesh?._id, currentSesh?.title]);

  // Toast once if error happens
  useEffect(() => {
    if (isError) toast.error("Failed to load session");
  }, [isError]);

  if (isLoading) return <p>Loading...</p>;
  if (!currentSesh) return <p>Session not found.</p>;

  const handleDeleteExercise = async (exercise) => {
    try {
      await deleteExercise({ seshId: currentSesh._id, exercise }).unwrap();
      toast.success("Exercise deleted!");
      // ✅ no local setState needed if RTK invalidates/refetches correctly
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete exercise");
    }
  };

  const handleRename = async () => {
    const newTitle = titleDraft.trim();
    const oldTitle = originalTitleRef.current.trim();

    if (!newTitle) return;
    if (newTitle === oldTitle) return;

    try {
      await renameSesh({ id: currentSesh._id, title: newTitle }).unwrap();
      toast.success("New title saved!");
      originalTitleRef.current = newTitle;
      // ✅ draft will resync after RTK refetch updates the sesh title
    } catch (err) {
      console.error("Failed to rename sesh", err);
      toast.error("Failed to save title");
      setTitleDraft(oldTitle); // revert UI
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-4 p-4">
        {/* Title row */}
        <div className="flex items-center gap-2">
          <div className="relative inline-flex items-center">
            <Pencil className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

            <input
              id="sesh-title"
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onFocus={() => {
                originalTitleRef.current = titleDraft;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") {
                  setTitleDraft(originalTitleRef.current);
                  e.currentTarget.blur();
                }
              }}
              onBlur={handleRename}
              className="
                text-xl font-heading font-semibold tracking-tight
                bg-transparent border-none pl-6 pr-1
                focus-visible:ring-0 focus-visible:outline-none
                cursor-text
              "
            />
          </div>

          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => document.getElementById("sesh-title")?.focus()}
          >
            Edit
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {new Date(currentSesh.date).toLocaleDateString()}
        </p>

        {/* Exercises */}
        {currentSesh.exercises?.length ? (
          <div className="flex flex-col gap-3">
            {currentSesh.exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start flex-wrap justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium">{exercise.exercise}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {exercise.sets}×{exercise.reps} @ {exercise.weight}kg ·
                      rest {exercise.rest}s
                    </p>
                    {exercise.comments && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {exercise.comments}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Link
                      to={`/users/dashboard/sesh/${currentSesh._id}/exercise/${exercise._id}/edit`}
                    >
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteExercise(exercise)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No exercises yet — add your first one below.
          </p>
        )}

        <div className="mt-6 rounded-xl border p-4">
          <ExerciseForm
            defaultValues={{
              exercise: "",
              weight: "",
              reps: "",
              sets: "",
              rest: "",
              comments: "",
            }}
            onSubmit={async (data) => {
              try {
                await addExercise({
                  seshId: currentSesh._id,
                  exercise: data,
                }).unwrap();

                toast.success("Exercise added!");
                // let RTK refetch update the list
              } catch (err) {
                toast.error(err?.data?.message || "Failed to add exercise");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
