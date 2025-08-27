"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { recommendedCourses } from "../../../../data";
import { useStore } from "@/lib/store";
import { courseApi, progressApi } from "@/lib/api";
import type { Course as BackendCourse } from "@/lib/api";

const CoursesPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { courses: localCourses, createCourse } = useStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [durationHours, setDurationHours] = useState<number>(10);
  const [icon, setIcon] = useState<string>("📘");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type DisplayCourse = {
    id: string | number;
    title: string;
    description: string;
    duration: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    image: string;
    progress: number;
  };

  const [myCourses, setMyCourses] = useState<DisplayCourse[]>([]);

  const getReaderProgress = (id: string | number): number | null => {
    try {
      const raw = localStorage.getItem(`course-progress-${id}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { percentage?: number; currentPage?: number; totalPages?: number };
      if (typeof parsed?.percentage === "number") return Math.max(0, Math.min(100, Math.round(parsed.percentage)));
      if (typeof parsed?.currentPage === "number" && typeof parsed?.totalPages === "number" && parsed.totalPages > 0) {
        return Math.max(0, Math.min(100, Math.round((parsed.currentPage / parsed.totalPages) * 100)));
      }
      return null;
    } catch {
      return null;
    }
  };

  const mapDifficulty = (d: string) => {
    if (!d) return "Beginner" as const;
    switch (d.toUpperCase()) {
      case "INTERMEDIATE":
        return "Intermediate" as const;
      case "ADVANCED":
        return "Advanced" as const;
      default:
        return "Beginner" as const;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await courseApi.getMyCourses(0, 20);
        if (!res.success || !res.data) {
          throw new Error(res.error || res.message || "Failed to load courses");
        }
        const base: DisplayCourse[] = (res.data.content || []).map((c: BackendCourse) => ({
          id: c.id,
          title: c.title,
          description: c.description ?? "",
          duration: `${c.duration} hours`,
          level: mapDifficulty(c.difficulty),
          image: "📘",
          progress: 0,
        }));

        if (!isMounted) return;
        setMyCourses(base);

        // Load per-course progress in parallel
        const progressResults = await Promise.allSettled(
          base.map((c) => progressApi.getCourseProgress(String(c.id)))
        );
        if (!isMounted) return;
        const withProgress = base.map((c, idx) => {
          const pr = progressResults[idx];
          if (
            pr.status === "fulfilled" &&
            pr.value.success &&
            pr.value.data &&
            typeof pr.value.data.progress === "number"
          ) {
            return { ...c, progress: Math.round(pr.value.data.progress) };
          }
          return c;
        });
        // Overlay local PDF reader progress if available
        const withReaderOverlay = withProgress.map((c) => {
          const lp = getReaderProgress(c.id);
          return typeof lp === "number" ? { ...c, progress: lp } : c;
        });
        setMyCourses(withReaderOverlay);
      } catch (e: any) {
        setError(e?.message || "An unexpected error occurred");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Re-apply local reader progress overlay when page gains focus or visibility changes
  useEffect(() => {
    const refreshOverlay = () => {
      setMyCourses((prev) =>
        prev.map((c) => {
          const lp = getReaderProgress(c.id);
          return typeof lp === "number" ? { ...c, progress: lp } : c;
        })
      );
    };
    window.addEventListener("focus", refreshOverlay);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") refreshOverlay();
    });
    return () => {
      window.removeEventListener("focus", refreshOverlay);
      document.removeEventListener("visibilitychange", refreshOverlay as any);
    };
  }, []);

  const ICONS = ["📘","📗","📙","📕","📚","🧠","💡","🔧","🧪","💻","📊","🔬","🌍","⚙️","🧮"];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const created = createCourse({
        title,
        description: category ? `Category: ${category}` : "User created course",
        duration: `${Math.max(1, Number(durationHours) || 1)} hours`,
        level: difficulty,
        image: icon,
        progress: 0,
      });
      // If a PDF was provided, persist a session-scoped object URL so the reader can load it
      if (pdfFile && created?.id != null) {
        try {
          const objectUrl = URL.createObjectURL(pdfFile);
          sessionStorage.setItem(`course-pdf-url-${created.id}`, objectUrl);
        } catch (err) {
          console.error("Failed to create object URL for PDF", err);
        }
      }
      setIsSubmitting(false);
      setShowCreateModal(false);
      setTitle("");
      setCategory("");
      setDifficulty("Beginner");
      setDurationHours(10);
      setIcon("📘");
      setPdfFile(null);
    }, 300);
  };

  const isValid = title.trim().length > 0 && durationHours > 0 && !!icon;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground">
              Continue your learning journey with personalized courses
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-primary/90"
            onClick={() => setShowCreateModal(true)}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Course
          </Button>
        </div>
      </div>

      {/* Loading / Error States */}
      {isLoading && (
        <div className="text-sm text-muted-foreground">Loading your courses…</div>
      )}
      {error && !isLoading && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...myCourses, ...localCourses.map((lc) => {
          const lp = getReaderProgress(lc.id);
          return {
          id: lc.id,
          title: lc.title,
          description: lc.description,
          duration: lc.duration,
          level: (lc.level as "Beginner" | "Intermediate" | "Advanced") ?? "Beginner",
          image: lc.image,
          progress: typeof lp === "number" ? lp : lc.progress,
        };
        })].map((course) => (
          <div
            key={course.id}
            className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Course Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{course.image}</div>
                <div className="flex-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      course.level === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : course.level === "Intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {course.level}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {course.duration}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="px-6 pb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              <div className="mt-4">
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/courses/${course.id}/reader`}>
                    {course.progress > 0 ? "Continue Learning" : "Start Course"}
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Recommended Courses */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommendedCourses.map((course, index) => (
            <div
              key={index}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-2">{course.image}</div>
              <h3 className="font-semibold mb-1">{course.title}</h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.level === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : course.level === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {course.level}
              </span>
              <Button className="w-full mt-3" variant="outline" size="sm">
                Coming soon
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="w-full max-w-lg bg-card border rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Create Course</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="px-6 py-5 space-y-5">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Course Title</label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Introduction to Data Science"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Input
                    id="category"
                    name="category"
                    type="text"
                    placeholder="e.g., Data Science"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-sm font-medium">Difficulty</label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    className="w-full border rounded-md h-10 px-3 bg-background"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration (hours)</label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min={1}
                  value={durationHours}
                  onChange={(e) => setDurationHours(parseInt(e.target.value, 10) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Thumbnail Icon</label>
                  <span className="text-xs text-muted-foreground">Choose one</span>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {ICONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      className={`h-10 rounded-md border flex items-center justify-center text-lg ${icon === i ? "border-primary ring-2 ring-primary/30" : "hover:bg-muted"}`}
                      onClick={() => setIcon(i)}
                      aria-label={`Choose ${i}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="pdf" className="text-sm font-medium">Course PDF (optional)</label>
                <Input
                  id="pdf"
                  name="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                />
                <p className="text-xs text-muted-foreground">Attach a PDF to read in the in-app reader. Stored for this session only.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
