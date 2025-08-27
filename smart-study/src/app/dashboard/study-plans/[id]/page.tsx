"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import StudyPlanProgressTracker from "@/components/shared/StudyPlanProgressTracker";
import { mockStudyPlans } from "../../../../../data/index";
import type { Milestone, StudyPlanWithMilestones } from "@/types/types";

export default function StudyPlanDetailPage() {
  const params = useParams();
  const idParam = params.id as string;

  const studyPlan = useMemo<StudyPlanWithMilestones>(() => {
    // 1) Try mock plans (string ids like "1")
    const fromMock = mockStudyPlans.find((plan) => plan.id === idParam);
    if (fromMock) return fromMock;

    // 2) Try session-created plans (numeric ids)
    let createdPlan: any | null = null;
    try {
      const raw = sessionStorage.getItem("created-sp-plans");
      const list = raw ? JSON.parse(raw) : [];
      const numId = Number(idParam);
      if (Array.isArray(list)) {
        createdPlan = list.find((p: any) => Number(p.id) === numId) || null;
      }
    } catch {
      createdPlan = null;
    }

    if (createdPlan) {
      // Build StudyPlanWithMilestones
      const strId = String(createdPlan.id);

      // Prefer session-saved milestones if present
      let milestones: Milestone[] | null = null;
      try {
        const raw = sessionStorage.getItem(`sp-state-${createdPlan.id}`);
        if (raw) {
          const saved = JSON.parse(raw);
          if (Array.isArray(saved.milestones)) {
            milestones = saved.milestones as Milestone[];
          }
        }
      } catch {
        // ignore
      }

      if (!milestones) {
        // Generate simple milestones from duration weeks
        let weeks = 8;
        try {
          weeks = parseInt((createdPlan.duration || "").split(" ")[0]) || 8;
        } catch {}
        milestones = Array.from({ length: weeks }, (_, i) => ({
          id: `gen-${i + 1}-${strId}`,
          title: `Week ${i + 1} milestone`,
          description: `Complete planned study tasks for week ${i + 1}.`,
          week: i + 1,
          completed: false,
        }));
      }

      const built: StudyPlanWithMilestones = {
        id: strId,
        title: createdPlan.title,
        description: createdPlan.description,
        duration: createdPlan.duration,
        subjects: createdPlan.subjects || [],
        difficulty: createdPlan.difficulty,
        studyHoursPerWeek: createdPlan.studyHoursPerWeek,
        startDate: createdPlan.startDate || "",
        createdAt: createdPlan.startDate || new Date().toISOString().slice(0, 10),
        goals: createdPlan.goals || [],
        prerequisites: createdPlan.prerequisites || [],
        milestones,
      };
      return built;
    }

    // 3) Fallback to first mock plan
    return mockStudyPlans[0];
  }, [idParam]);

  const handleUpdateProgress = (milestoneId: string, completed: boolean) => {
    // No-op here; persistence handled inside tracker (sessionStorage)
    // This remains for future backend sync.
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
