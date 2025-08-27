"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  BookOpen,
  Calendar,
} from "lucide-react";
import { StudyPlanWithMilestones } from "@/types/types";

interface Milestone {
  id: string;
  completed: boolean;
  title: string;
  description: string;
  week: number;
}

interface StudyPlanProgressTrackerProps {
  studyPlan: StudyPlanWithMilestones;
  onUpdateProgress: (milestoneId: string, completed: boolean) => void;
  onClose: () => void;
}

const StudyPlanProgressTracker: React.FC<StudyPlanProgressTrackerProps> = ({
  studyPlan,
  onUpdateProgress,
  onClose,
}) => {
  const [milestones, setMilestones] = useState(studyPlan.milestones || []);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [notes, setNotes] = useState("");

  const storageKey = useMemo(() => `sp-state-${studyPlan.id}`, [studyPlan.id]);

  // Load saved state from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as {
          milestones?: typeof milestones;
          currentWeek?: number;
          notes?: string;
        };
        if (Array.isArray(saved.milestones)) setMilestones(saved.milestones);
        if (typeof saved.currentWeek === "number") setCurrentWeek(saved.currentWeek);
        if (typeof saved.notes === "string") setNotes(saved.notes);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const persist = (next?: Partial<{ milestones: typeof milestones; currentWeek: number; notes: string }>) => {
    try {
      const payload = {
        milestones,
        currentWeek,
        notes,
        ...(next || {}),
      };
      sessionStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
  };

  const calculateProgress = () => {
    const completed = milestones.filter((m: Milestone) => m.completed).length;
    return Math.round((completed / milestones.length) * 100);
  };

  const handleMilestoneToggle = (milestoneId: string) => {
    const updatedMilestones = milestones.map((m: Milestone) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    setMilestones(updatedMilestones);
    // persist change
    persist({ milestones: updatedMilestones });
    onUpdateProgress(
      milestoneId,
      !milestones.find((m: Milestone) => m.id === milestoneId)?.completed
    );
  };

  const getWeekProgress = (week: number) => {
    const weekMilestones = milestones.filter((m: Milestone) => m.week === week);
    const completed = weekMilestones.filter(
      (m: Milestone) => m.completed
    ).length;
    return weekMilestones.length > 0
      ? Math.round((completed / weekMilestones.length) * 100)
      : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4 gap-5">
          <Button
            variant="outline"
            onClick={() => {
              persist();
              onClose();
            }}
          >
            Save Progress & Exit
          </Button>
          <Button variant="outline" onClick={onClose}>
            Back to Plans
          </Button>
        </div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {studyPlan.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                {studyPlan.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {studyPlan.difficulty && (
                  <Badge variant="secondary">Difficulty: {studyPlan.difficulty}</Badge>
                )}
                {typeof studyPlan.studyHoursPerWeek === "number" && (
                  <Badge variant="secondary">{studyPlan.studyHoursPerWeek} hrs/week</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={calculateProgress()} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {calculateProgress()}% Complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Duration: {studyPlan.duration}</p>
              <p className="text-sm">Start: {studyPlan.startDate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {studyPlan.subjects.map((subject: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals & Prerequisites */}
        {(studyPlan.goals?.length || studyPlan.prerequisites?.length) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {studyPlan.goals?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {studyPlan.goals.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}

            {studyPlan.prerequisites?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {studyPlan.prerequisites.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        {/* Weekly Progress */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Weekly Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((week) => (
              <Card key={week}>
                <CardHeader>
                  <CardTitle className="text-lg">Week {week}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={getWeekProgress(week)} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {getWeekProgress(week)}% Complete
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Milestones Checklist */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Milestones & Checklist
          </h2>
          <div className="space-y-4">
            {milestones.map((milestone: Milestone) => (
              <Card
                key={milestone.id}
                className={milestone.completed ? "bg-green-50" : ""}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      {milestone.completed ? (
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="mr-2 h-5 w-5 text-muted-foreground" />
                      )}
                      {milestone.title}
                    </div>
                    <Badge
                      variant={milestone.completed ? "default" : "secondary"}
                    >
                      {milestone.completed ? "Completed" : "Pending"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{milestone.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Week {milestone.week}
                    </span>
                    <Button
                      variant={milestone.completed ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleMilestoneToggle(milestone.id)}
                    >
                      {milestone.completed
                        ? "Mark Incomplete"
                        : "Mark Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Study Guide Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Study Guide Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Daily Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Morning review: 30 minutes</li>
                  <li>• Focus study: 2-3 hours</li>
                  <li>• Practice exercises: 1 hour</li>
                  <li>• Evening review: 30 minutes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Complete all assigned readings</li>
                  <li>• Practice exercises for each topic</li>
                  <li>• Review previous week's material</li>
                  <li>• Take weekly assessment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div></div>
      </div>
    </div>
  );
};

export default StudyPlanProgressTracker;
