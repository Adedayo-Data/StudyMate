"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { assignmentQuizData } from "../../../../../data";
import { useStore } from "@/lib/store";

export default function QuizPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const quiz = assignmentQuizData[id];
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { recordQuizAttempt, assignments } = useStore();

  // Load any saved answers for this quiz from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`studymate.quiz.${id}.answers`);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<number, number | null>;
        setAnswers(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, [id]);

  // Persist answers as they change
  useEffect(() => {
    try {
      localStorage.setItem(
        `studymate.quiz.${id}.answers`,
        JSON.stringify(answers)
      );
    } catch (e) {
      // ignore
    }
  }, [answers, id]);

  const score = useMemo(() => {
    if (!quiz || !submitted) return 0;
    return quiz.questions.reduce((acc, q) => {
      const chosen = answers[q.id];
      return acc + (chosen === q.correctIndex ? 1 : 0);
    }, 0);
  }, [answers, quiz, submitted]);

  if (!quiz) {
    return (
      <div className="p-8">
        <div className="bg-card border rounded-lg p-6">
          <h1 className="text-xl font-semibold mb-2">Quiz not found</h1>
          <p className="text-muted-foreground mb-4">
            We couldn't find a quiz for this assignment.
          </p>
          <Link
            className="text-primary underline"
            href="/dashboard/assignments"
          >
            Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  const handleSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowResult(true);
    const total = quiz?.questions.length ?? 0;
    const raw = quiz
      ? quiz.questions.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0)
      : 0;
    const percent = total > 0 ? Math.round((raw / total) * 100) : 0;
    // Record attempt in global store
    recordQuizAttempt(id, percent);
    // Save submission snapshot
    try {
      localStorage.setItem(
        `studymate.quiz.${id}.result`,
        JSON.stringify({ answers, raw, total, percent, at: new Date().toISOString() })
      );
    } catch (e) {
      // ignore
    }
  };

  const total = quiz.questions.length;
  const currentAssignment = assignments.find((a) => a.id === id);
  const attempts = currentAssignment?.attempts ?? 0;
  const maxAttempts = currentAssignment?.maxAttempts ?? undefined;

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            {quiz.instructions} • Time limit: {quiz.timeLimitMinutes} minutes
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Attempts: {attempts}
            {typeof maxAttempts === "number" ? `/${maxAttempts}` : ""}
          </p>
        </div>
        <Link className="text-primary underline" href="/dashboard/assignments">
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-card border rounded-lg p-5">
            <p className="font-medium mb-3">
              Question {idx + 1} of {total}: {q.prompt}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const selected = answers[q.id] === optIdx;
                return (
                  <label
                    key={optIdx}
                    className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                      selected
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      className="h-4 w-4"
                      checked={selected}
                      onChange={() => handleSelect(q.id, optIdx)}
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <Button type="submit">Submit</Button>
        </div>
      </form>

      {showResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowResult(false)}
        >
          <div
            className="w-full max-w-md bg-card border rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Quiz Result</h2>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowResult(false)}
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-muted-foreground">{quiz.title}</p>
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold">
                  {score}/{total}
                </p>
                <p className="text-sm">{Math.round((score / total) * 100)}% correct</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Retry: reset answers and submission state
                  setAnswers({});
                  setSubmitted(false);
                  setShowResult(false);
                }}
              >
                Retry
              </Button>
              <Button variant="outline" onClick={() => setShowResult(false)}>
                Close
              </Button>
              <Button asChild>
                <Link href="/dashboard/assignments">Back to Assignments</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
