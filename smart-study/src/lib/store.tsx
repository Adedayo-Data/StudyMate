"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { Assignment, Course } from "@/types/types";

type StoreContextValue = {
  courses: Course[];
  assignments: Assignment[];
  createCourse: (
    input: Omit<Course, "id" | "progress"> & { progress?: number }
  ) => Course;
  createAssignment: (input: Omit<Assignment, "id">) => Assignment;
};

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const initialCourses: Course[] = [];
const initialAssignments: Assignment[] = [];

let nextCourseId = 1000;
let nextAssignmentId = 5000;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);

  const createAssignment = (input: Omit<Assignment, "id">): Assignment => {
    const assignment: Assignment = { id: nextAssignmentId++, ...input };
    setAssignments((prev) => [assignment, ...prev]);
    return assignment;
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
    () => ({ courses, assignments, createCourse, createAssignment }),
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
