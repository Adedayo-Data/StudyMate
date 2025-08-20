"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { coursesData, recommendedCourses } from "../../../../data";
import { useStore } from "@/lib/store";

const CoursesPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { courses, createCourse } = useStore();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      createCourse({
        title,
        description: "User created course",
        duration: "8 weeks",
        level: "Beginner",
        image: "📘",
      });
      setIsSubmitting(false);
      setShowCreateModal(false);
      setTitle("");
      setFile(null);
    }, 300);
  };

  const isValid = title.trim().length > 0 && !!file;

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

      {/* Course Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...courses, ...coursesData].map((course) => (
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
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
              <Button
                className="w-full"
                variant={course.progress > 0 ? "default" : "outline"}
                asChild
              >
                <Link href={`/dashboard/courses/${course.id}`}>
                  {course.progress > 0 ? "Continue Learning" : "Start Course"}
                </Link>
              </Button>
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
                Learn More
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
                <label htmlFor="title" className="text-sm font-medium">
                  Course Title
                </label>
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

              <div className="space-y-2">
                <label htmlFor="document" className="text-sm font-medium">
                  Course Source Document
                </label>
                <Input
                  id="document"
                  name="document"
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md"
                  onChange={(e) => handleFileChange(e)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload a document (.pdf, .docx, .txt, .md). The AI will use it
                  to draft the course content.
                </p>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
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
