"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { coursesData, courseContentData, topicDropdownData } from "../../../../../data";

export default function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const course = coursesData.find((c) => c.id === id);
  const content = courseContentData[id];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (modId: number, lessonId: number) => {
    const key = `${modId}-${lessonId}`;
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!course || !content) {
    return (
      <div className="p-8">
        <div className="bg-card border rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Course not found</h1>
          <p className="text-muted-foreground mb-4">
            We couldn't find details for this course.
          </p>
          <Link className="text-primary underline" href="/dashboard/courses">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link href="/dashboard/courses">
        <ArrowLeft className="w-8 h-8 border rounded-full text-black border-black hover:bg-gray-600 " />
      </Link>
      <div className="mb-6 flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{course.image}</div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {course.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {course.duration} • {course.level}
              </p>
            </div>
          </div>
          <div className="text-muted-foreground max-w-3xl">
            {content.summary}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {content.modules.map((mod, modIdx) => (
            <div key={mod.id} className="bg-card border rounded-lg">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Week {modIdx + 1}: {mod.title}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {mod.lessons.length} topics
                </span>
              </div>
              <div className="divide-y">
                {mod.lessons.map((lesson, lessonIdx) => {
                  const key = `${mod.id}-${lesson.id}`;
                  const isOpen = !!expanded[key];
                  const options = topicDropdownData[lessonIdx + 1];
                  return (
                    <div key={lesson.id} className="px-6 py-2">
                      <button
                        type="button"
                        onClick={() => toggle(mod.id, lesson.id)}
                        className="w-full flex items-center justify-between gap-4 py-3"
                        aria-expanded={isOpen}
                        aria-controls={`topic-panel-${key}`}
                      >
                        <div className="text-left">
                          <p className="font-medium">
                            Topic {lessonIdx + 1}: {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div id={`topic-panel-${key}`} className="pb-4 pl-2">
                          {options && (
                            <div className="mb-2">
                              <p className="text-xs font-semibold mb-1">Options</p>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {options.map((opt) => (
                                  <li key={opt}>{opt}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground">{lesson.content}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Progress</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {course.progress}% completed
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Next step</p>
            <p className="text-sm text-muted-foreground">
              Continue with Week 1, Topic 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
