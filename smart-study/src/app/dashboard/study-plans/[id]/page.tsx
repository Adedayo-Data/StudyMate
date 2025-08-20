"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import StudyPlanProgressTracker from "@/components/shared/StudyPlanProgressTracker";
import { mockStudyPlans } from "../../../../../data/index";

export default function StudyPlanDetailPage() {
  const params = useParams();
  const studyPlanId = params.id as string;

  const [studyPlan] = useState(() => {
    return (
      mockStudyPlans.find((plan) => plan.id === studyPlanId) ||
      mockStudyPlans[0]
    );
  });

  const handleUpdateProgress = (milestoneId: string, completed: boolean) => {
    console.log(`Updated milestone ${milestoneId} to ${completed}`);
  };

  const handleClose = () => {
    window.history.back();
  };

  return (
    <div>
      <StudyPlanProgressTracker
        studyPlan={studyPlan}
        onUpdateProgress={handleUpdateProgress}
        onClose={handleClose}
      />
    </div>
  );
}
