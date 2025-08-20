"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateStudyPlanForm from "@/components/shared/CreateStudyPlanForm"; // Import the form component
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StudyPlan, StudyPlanDetailsProps, StudyPlanWithMilestones } from "../../types/types";

const StudyPlanDetails: React.FC<StudyPlanDetailsProps> = ({
  studyPlan,
  onClose,
  onEdit,
  onDelete,
  isOpen,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEditForm, setShowEditForm] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "progress", label: "Progress" },
    { id: "milestones", label: "Milestones" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Map current studyPlan (union) to StudyPlanFormData for edit form
  const toFormData = (): Omit<StudyPlanWithMilestones, "id" | "milestones" | "createdAt"> & {
    goals?: string[];
    prerequisites?: string[];
  } => {
    return {
      title: studyPlan.title,
      description: studyPlan.description,
      duration: studyPlan.duration,
      subjects: studyPlan.subjects || [],
      difficulty: (studyPlan as any).difficulty || "Beginner",
      studyHoursPerWeek: (studyPlan as any).studyHoursPerWeek ?? 5,
      startDate: (studyPlan as any).startDate || "",
      goals: (studyPlan as any).goals || [],
      prerequisites: (studyPlan as any).prerequisites || [],
    };
  };

  // Type guard to narrow to StudyPlan when fields like status/dueDate exist
  const isStudyPlan = (
    plan: StudyPlan | StudyPlanWithMilestones
  ): plan is StudyPlan => {
    return (plan as StudyPlan).status !== undefined || (plan as StudyPlan).dueDate !== undefined;
  };

  const computeProgress = () => {
    if (typeof (studyPlan as StudyPlan).progress === "number") {
      return (studyPlan as StudyPlan).progress as number;
    }
    const milestones = (studyPlan as StudyPlanWithMilestones).milestones;
    if (Array.isArray(milestones) && milestones.length > 0) {
      const completed = milestones.filter((m) => m.completed).length;
      return Math.round((completed / milestones.length) * 100);
    }
    return 0;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{studyPlan.description}</p>
        </CardContent>
      </Card>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{studyPlan.duration}</p>
          </CardContent>
        </Card>
        {isStudyPlan(studyPlan) && studyPlan.dueDate && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{studyPlan.dueDate}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={computeProgress()} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {computeProgress()}% Complete
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Study Hours/Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {studyPlan.studyHoursPerWeek || 0}h
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {studyPlan.subjects.map((subject, index) => (
              <Badge key={index} variant="secondary">
                {subject}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      {studyPlan.goals && studyPlan.goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {studyPlan.goals.map((goal, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Prerequisites */}
      {studyPlan.prerequisites && studyPlan.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {studyPlan.prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary">•</span>
                  <span>{prerequisite}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const weekly = isStudyPlan(studyPlan)
              ? studyPlan.weeklySchedule
              : undefined;
            return Array.isArray(weekly) && weekly.length > 0 ? (
              <div className="space-y-4">
                {weekly.map((schedule, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{schedule.day}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {schedule.hours} hours
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {schedule.topics.map((topic: string, topicIndex: number) => (
                        <Badge key={topicIndex} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No weekly schedule available</p>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Completion</span>
                <span>{computeProgress()}%</span>
              </div>
              <Progress value={computeProgress()} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">
                  {isStudyPlan(studyPlan) ? studyPlan.completedHours || 0 : 0}
                </p>
                <p className="text-sm text-muted-foreground">Completed Hours</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isStudyPlan(studyPlan) ? studyPlan.totalHours || 0 : 0}
                </p>
                <p className="text-sm text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          {studyPlan.milestones && studyPlan.milestones.length > 0 ? (
            <div className="space-y-4">
              {studyPlan.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Badge
                      variant={milestone.completed ? "default" : "secondary"}
                    >
                      {milestone.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone.description}
                  </p>
                  {"week" in milestone && typeof (milestone as any).week === "number" ? (
                    <p className="text-sm">Week: {(milestone as any).week}</p>
                  ) : (milestone as any).dueDate ? (
                    <p className="text-sm">Due: {(milestone as any).dueDate}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No milestones available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">{studyPlan.title}</h2>
              {isStudyPlan(studyPlan) && studyPlan.status && (
                <Badge className={getStatusColor(studyPlan.status)}>
                  {studyPlan.status}
                </Badge>
              )}
              {studyPlan.difficulty && (
                <Badge className={getDifficultyColor(studyPlan.difficulty)}>
                  {studyPlan.difficulty}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {(
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditForm(true)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "schedule" && renderSchedule()}
          {activeTab === "progress" && renderProgress()}
          {activeTab === "milestones" && renderMilestones()}
        </div>
      </div>

      {/* Edit Form Modal */}
      <CreateStudyPlanForm
        isOpen={showEditForm}
        mode="edit"
        title="Edit Study Plan"
        initialData={toFormData()}
        onCancel={() => setShowEditForm(false)}
        onSubmit={(data) => {
          // For now, just close and trigger optional onEdit callback used by parent
          console.log("Edited study plan data:", data);
          setShowEditForm(false);
          if (onEdit) onEdit();
        }}
      />
    </div>
  );
};

export default StudyPlanDetails;
