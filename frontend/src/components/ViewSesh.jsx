import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetSeshesQuery,
  useAddExerciseMutation,
  useDeleteExerciseMutation,
  useRenameSeshMutation,
  useEditExerciseMutation,
} from "../slices/seshApiSlice";
import { ExerciseForm } from "@/components/ExerciseForm";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Dumbbell,
  History,
  Clock,
  ChevronRight,
  Edit,
  Trash2,
  CalendarIcon,
} from "lucide-react";

export default function ViewSesh() {
  const { id, exerciseId } = useParams(); // exerciseId comes from the nested route
  const navigate = useNavigate();

  // API Hooks
  const { data: seshes = [], isLoading, isError } = useGetSeshesQuery();
  const currentSesh = seshes.find((s) => s._id === id);

  // returns true if an exerciseId from params is there (set from the Router path)
  // and matches one of the exercises in our sesh
  const exerciseToEdit = currentSesh?.exercises?.find(
    (ex) => ex._id === exerciseId
  );

  const onFormComplete = () => {
    if (exerciseId) {
      // Navigate back to the base sesh URL to clear the edit mode
      navigate(`/users/sesh/${id}`);
    }
  };

  const [addExercise] = useAddExerciseMutation();
  const [deleteExercise] = useDeleteExerciseMutation();
  const [renameSesh] = useRenameSeshMutation();
  const [editExercise] = useEditExerciseMutation();

  // State for Title Editing
  const originalTitleRef = useRef("");
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    if (currentSesh?.title) setTitleDraft(currentSesh.title);
  }, [currentSesh?._id, currentSesh?.title]);

  useEffect(() => {
    if (isError) toast.error("Failed to load session");
  }, [isError]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <span className="ml-3 text-zinc-500 font-medium">Loading Sesh...</span>
      </div>
    );
  }

  if (!currentSesh)
    return <div className="p-10 text-center">Sesh not found.</div>;

  const handleDeleteExercise = async (exercise) => {
    try {
      await deleteExercise({ seshId: currentSesh._id, exercise }).unwrap();
      toast.success("Exercise deleted!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete exercise");
    }
  };

  const handleRename = async () => {
    const newTitle = titleDraft.trim();
    const oldTitle = originalTitleRef.current?.trim() || currentSesh.title;

    if (!newTitle || newTitle === oldTitle) return;

    try {
      await renameSesh({ id: currentSesh._id, title: newTitle }).unwrap();
      toast.success("Title updated!");
    } catch (err) {
      toast.error("Failed to save title");
      setTitleDraft(oldTitle);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2 overflow-hidden bg-white dark:bg-zinc-950">
      {/* LEFT PANEL: The Input/Edit Side */}
      <div className="flex flex-col h-[calc(100vh-64px)] border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto">
        <div className="w-full max-w-lg lg:max-w-md mx-auto p-6 md:p-12 space-y-8">
          {/* Sesh Header: Title & Date */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group">
              <input
                id="sesh-title"
                type="text"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onFocus={() => {
                  originalTitleRef.current = titleDraft;
                }}
                onBlur={handleRename}
                className="text-4xl font-black tracking-tight bg-transparent border-none p-0 w-full cursor-text focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none appearance-none"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-zinc-400 hover:text-black dark:hover:text-white"
                onClick={() => document.getElementById("sesh-title")?.focus()}
              >
                <Edit className="h-5 w-5" />
              </Button>
            </div>

            <p className="flex items-center gap-2 text-zinc-800 dark:text-zinc-400 text-sm tracking-tighter font-black">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span>
                {new Date(currentSesh.date).toLocaleDateString(undefined, {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          </div>

          {/* Dynamic Exercise Form (Add vs Edit) - exerciseToEdit is a ready-made object to pass */}
          <div className="rounded-sm bg-white dark:bg-zinc-900/50">
            <ExerciseForm
              title={exerciseId ? "Edit Exercise" : "Add Exercise"}
              submitLabel={exerciseId ? "Save Changes" : "Add to Sesh"}
              defaultValues={
                exerciseToEdit || {
                  exercise: "",
                  weight: "",
                  reps: "",
                  sets: "",
                  rest: "",
                  comments: "",
                }
              }
              onCancel={exerciseId ? () => navigate(`/users/sesh/${id}`) : null}
              onSubmit={async (data) => {
                try {
                  if (exerciseId) {
                    // Wrap the form data into the 'updatedExercise' key
                    await editExercise({
                      seshId: id,
                      exerciseId: exerciseId,
                      updatedExercise: data, // This matches my slice's 'body: updatedExercise'
                    }).unwrap();

                    toast.success("Changes saved!");
                  } else {
                    await addExercise({ seshId: id, exercise: data }).unwrap();
                    toast.success("Exercise added!");
                  }
                  onFormComplete();
                } catch (err) {
                  toast.error(err?.data?.message || "Something went wrong");
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: The Sesh Log */}
      <div className="relative flex flex-col p-8 md:p-12 app-bg dark:bg-black/20 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-zinc-800" />
            <h2 className="text-4xl font-black tracking-tight">Exercises</h2>
          </div>
          <span className="text-xs font-bold tracking-tight uppercase text-zinc-600 bg-zinc-200/50 dark:bg-zinc-800 px-3 py-1">
            {currentSesh.exercises?.length || 0} Exercises
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pb-12 pr-2 custom-scrollbar">
          {currentSesh.exercises?.length ? (
            currentSesh.exercises.map((exercise) => (
              <div
                key={exercise._id}
                className="group relative flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm hover:border-black dark:hover:border-white transition-all shadow-sm"
              >
                <div className="flex-1 flex items-center gap-4">
                  {/* Visual Mirror of SeshCard Box */}
                  <div className="flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                    <span className="text-[10px] font-black uppercase leading-none mb-0.5">
                      Sets
                    </span>
                    <span className="text-xl font-black leading-none">
                      {exercise.sets}
                    </span>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <h3 className="font-black text-lg leading-tight tracking-tightest text-black dark:text-white capitalize truncate">
                      {exercise.exercise}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      <span className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-zinc-700 dark:text-zinc-400">
                        <Dumbbell className="h-3 w-3" /> {exercise.weight}kg ×{" "}
                        {exercise.reps}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-zinc-500">
                        <Clock className="h-3 w-3" /> {exercise.rest}s rest
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Link to={`/users/sesh/${id}/exercise/${exercise._id}/edit`}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-zinc-300 hover:text-black dark:hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteExercise(exercise)}
                    className="text-zinc-300 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24">
              <p className="text-zinc-800 font-bold tracking-tight text-md">
                No exercises logged
              </p>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
