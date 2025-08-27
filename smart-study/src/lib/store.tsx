"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Assignment, Course } from "@/types/types";
import { assignmentsData } from "../../data";

type StoreContextValue = {
  courses: Course[];
  assignments: Assignment[];
  createCourse: (
    input: Omit<Course, "id" | "progress"> & { progress?: number }
  ) => Course;
  createAssignment: (input: Omit<Assignment, "id">) => Assignment;
  updateAssignment: (id: number, patch: Partial<Assignment>) => void;
  recordQuizAttempt: (id: number, score: number) => void;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const initialCourses: Course[] = [];
const initialAssignments: Assignment[] = [];

let nextCourseId = 1000;
let nextAssignmentId = 5000;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [assignments, setAssignments] = useState<Assignment[]>(
    initialAssignments
  );

  // Hydrate assignments from localStorage or seed from data on first mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("studymate.assignments");
      if (raw) {
        const parsed = JSON.parse(raw) as Assignment[];
        setAssignments(parsed);
      } else {
        // seed from demo data
        setAssignments(assignmentsData as unknown as Assignment[]);
      }
    } catch (e) {
      console.warn("Failed to hydrate assignments from localStorage", e);
      setAssignments(assignmentsData as unknown as Assignment[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist assignments to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "studymate.assignments",
        JSON.stringify(assignments)
      );
    } catch (e) {
      console.warn("Failed to persist assignments to localStorage", e);
    }
  }, [assignments]);

  const createAssignment = (input: Omit<Assignment, "id">): Assignment => {
    const assignment: Assignment = { id: nextAssignmentId++, ...input };
    setAssignments((prev) => [assignment, ...prev]);
    return assignment;
  };

  const updateAssignment: StoreContextValue["updateAssignment"] = (
    id,
    patch
  ) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
  };

  const recordQuizAttempt: StoreContextValue["recordQuizAttempt"] = (
    id,
    score
  ) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const attempts = (a.attempts ?? 0) + 1;
        // Mark completed and store latest score
        return { ...a, attempts, score, status: "completed" };
      })
    );
  };

  const createCourse: StoreContextValue["createCourse"] = (input) => {
    const course: Course = {
      id: nextCourseId++,
      progress: input.progress ?? 0,
      title: input.title,
      description: input.description,
      duration: input.duration,
      level: input.level,
      image: (input as any).image ?? "📘",
    };
    setCourses((prev) => [course, ...prev]);

    // Auto-create a linked starter assignment for this course
    createAssignment({
      title: `${course.title} – Intro Quiz`,
      courseId: course.id,
      course: course.title,
      type: "Quiz",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      status: "pending",
      points: 20,
      timeLimit: "15 minutes",
      attempts: 0,
      maxAttempts: 3,
    });

    return course;
  };

  const value = useMemo<StoreContextValue>(
    () => ({
      courses,
      assignments,
      createCourse,
      createAssignment,
      updateAssignment,
      recordQuizAttempt,
    }),
    [courses, assignments]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
