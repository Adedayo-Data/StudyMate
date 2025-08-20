"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CreateStudyPlanForm from "@/components/shared/CreateStudyPlanForm";
import StudyPlanDetails from "@/components/shared/StudyPlanDetails";
import { studyPlansData, upcomingTasks } from "../../../../data";

const StudyPlansPage = () => {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleCreatePlan = (planData: any) => {
    console.log("Creating new study plan:", planData);
    setShowCreateForm(false);
  };

  const handleViewDetails = (plan: any) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  const handleContinue = (planId: number) => {
    router.push(`/dashboard/study-plans/${planId}`);
  };

  const handleEditPlan = () => {
    console.log("Edit plan:", selectedPlan);
    setShowDetails(false);
  };

  const handleDeletePlan = () => {
    console.log("Delete plan:", selectedPlan);
    setShowDetails(false);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Plans</h1>
            <p className="text-muted-foreground">
              Organize your learning with personalized study plans
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-primary to-primary/90"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Study Plans */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Your Study Plans</h2>

          {studyPlansData.map((plan) => (
            <div key={plan.id} className="bg-card border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{plan.title}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.status === "active"
                          ? "bg-green-100 text-green-800"
                          : plan.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {plan.description}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <span>{plan.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <span>Due: {plan.dueDate}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{plan.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${plan.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Next Task:</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.nextTask}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(plan)}
                      >
                        View Details
                      </Button>
                      {plan.status === "active" && (
                        <Button
                          size="sm"
                          onClick={() => handleContinue(plan.id)}
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Upcoming Tasks</h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.course}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Due: {task.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Statistics */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">This Week</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Study Hours</span>
                <span className="font-semibold">12.5h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tasks Completed</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Streak</span>
                <span className="font-semibold">5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Study Plan Form Modal */}
      <CreateStudyPlanForm
        isOpen={showCreateForm}
        onSubmit={handleCreatePlan}
        onCancel={() => setShowCreateForm(false)}
      />

      {/* Study Plan Details Modal */}
      {selectedPlan && (
        <StudyPlanDetails
          studyPlan={selectedPlan}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
        />
      )}
    </div>
  );
};

export default StudyPlansPage;
