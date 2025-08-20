"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

const AssignmentsPage = () => {
  const [viewAssignmentId, setViewAssignmentId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "in-progress" | "completed"
  >("all");
  // Fallback static assignments (existing demo data)
  const staticAssignments = [
    {
      id: 1,
      title: "Linear Algebra Fundamentals Quiz",
      course: "AI Fundamentals Mastery",
      type: "Quiz",
      dueDate: "2024-01-15",
      status: "pending",
      points: 100,
      timeLimit: "45 minutes",
      attempts: 0,
      maxAttempts: 3,
    },
    {
      id: 2,
      title: "Python Functions Assignment",
      course: "Python Programming Bootcamp",
      type: "Assignment",
      dueDate: "2024-01-20",
      status: "in-progress",
      points: 150,
      timeLimit: "No limit",
      attempts: 1,
      maxAttempts: 5,
    },
    {
      id: 3,
      title: "Neural Network Implementation",
      course: "AI Fundamentals Mastery",
      type: "Project",
      dueDate: "2024-01-25",
      status: "pending",
      points: 200,
      timeLimit: "No limit",
      attempts: 0,
      maxAttempts: 3,
    },
    {
      id: 4,
      title: "Data Structures Final Exam",
      course: "Data Structures & Algorithms",
      type: "Exam",
      dueDate: "2023-12-30",
      status: "completed",
      points: 250,
      timeLimit: "2 hours",
      attempts: 1,
      maxAttempts: 1,
      score: 92,
    },
  ];

  const { assignments: dynamicAssignments } = useStore();
  const assignments = [...dynamicAssignments, ...staticAssignments];
  const selected = assignments.find((a: any) => a.id === viewAssignmentId);

  const pending = assignments.filter((a: any) => a.status === "pending");
  const inProgress = assignments.filter((a: any) => a.status === "in-progress");
  const completed = assignments.filter((a: any) => a.status === "completed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Quiz":
        return (
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "Assignment":
        return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "Project":
        return (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
      case "Exam":
        return (
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderAssignmentCard = (assignment: any) => (
    <div key={assignment.id} className="bg-card border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {getTypeIcon(assignment.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  assignment.status
                )}`}
              >
                {assignment.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {assignment.course}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                  />
                </svg>
                Due: {assignment.dueDate}
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-1 h-4 w-4"
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
                {assignment.timeLimit}
              </div>
              <div className="flex items-center">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {assignment.points} points
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <span>
            Attempts: {assignment.attempts}/{assignment.maxAttempts}
          </span>
          {assignment.status === "completed" && (assignment as any).score && (
            <span className="font-medium text-green-600">
              Score: {(assignment as any).score}%
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {assignment.status === "completed" ? (
            <Button variant="outline" size="sm">
              View Results
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewAssignmentId(assignment.id)}
              >
                View Details
              </Button>
              <Button size="sm" asChild>
                <Link href={`/dashboard/assignments/${assignment.id}`}>
                  {assignment.status === "in-progress" ? "Continue" : "Start"}
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          Complete your assignments and track your academic progress
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={activeFilter === "all" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button
            variant={activeFilter === "pending" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
            onClick={() => setActiveFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={activeFilter === "in-progress" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
            onClick={() => setActiveFilter("in-progress")}
          >
            In Progress
          </Button>
          <Button
            variant={activeFilter === "completed" ? "default" : "ghost"}
            size="sm"
            className="rounded-md"
            onClick={() => setActiveFilter("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Assignments List */}
        <div className="lg:col-span-2 space-y-4">
          {activeFilter === "all" ? (
            <>
              {pending.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Pending</h2>
                  {pending.map(renderAssignmentCard)}
                </div>
              )}
              {inProgress.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">In Progress</h2>
                  {inProgress.map(renderAssignmentCard)}
                </div>
              )}
              {completed.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold">Completed</h2>
                  {completed.map(renderAssignmentCard)}
                </div>
              )}
            </>
          ) : activeFilter === "pending" ? (
            pending.map(renderAssignmentCard)
          ) : activeFilter === "in-progress" ? (
            inProgress.map(renderAssignmentCard)
          ) : (
            completed.map(renderAssignmentCard)
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Linear Algebra Quiz</p>
                  <p className="text-xs text-muted-foreground">Due today</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Python Assignment</p>
                  <p className="text-xs text-muted-foreground">Due in 5 days</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Neural Network Project</p>
                  <p className="text-xs text-muted-foreground">
                    Due in 10 days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Statistics */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Assignments</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <span className="font-semibold text-green-600">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">In Progress</span>
                <span className="font-semibold text-blue-600">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <span className="font-semibold text-yellow-600">3</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Score</span>
                  <span className="font-semibold">87.5%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Study Tips */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Study Tips</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <svg
                  className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Use AI Tutor for difficult concepts</span>
              </div>
              <div className="flex items-start space-x-2">
                <svg
                  className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
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
                <span>Start assignments early to avoid rush</span>
              </div>
              <div className="flex items-start space-x-2">
                <svg
                  className="h-4 w-4 text-primary mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <span>Review feedback from completed assignments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setViewAssignmentId(null)}
        >
          <div
            className="w-full max-w-lg bg-card border rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setViewAssignmentId(null)}
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
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                Course: {selected.course}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>Type: {selected.type}</span>
                <span>Due: {selected.dueDate}</span>
                <span>Points: {selected.points}</span>
                <span>Time Limit: {selected.timeLimit}</span>
                <span>
                  Attempts: {selected.attempts}/{selected.maxAttempts}
                </span>
              </div>
              <p className="text-sm">
                Overview: This assignment tests your understanding of key
                concepts. Make sure to review your notes before starting.
              </p>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setViewAssignmentId(null)}
              >
                Close
              </Button>
              <Button asChild>
                <Link href={`/dashboard/assignments/${selected.id}`}>
                  Start
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
