export interface SidebarItem {
  title: string;
  href: string;
  iconName: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export interface User {
  name: string;
  email: string;
  initials: string;
  avatar: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
  duration: string;
  level: string;
  image: string;
}

export interface Assignment {
  id: number;
  title: string;
  courseId: number;
  course: string;
  type: "Quiz" | "Assignment" | "Project" | "Exam" | string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "overdue" | string;
  points: number;
  timeLimit: string;
  attempts: number;
  maxAttempts: number;
  score?: number;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: string[];
  correctIndex: number; // used only for local scoring
}

export interface AssignmentQuiz {
  assignmentId: number;
  title: string;
  instructions: string;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}

export interface DiscussionComment {
  id: number;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
}

export interface CourseLesson {
  id: number;
  title: string;
  duration: string;
  content: string;
}

export interface CourseModule {
  id: number;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseContent {
  courseId: number;
  summary: string;
  modules: CourseModule[];
}

export interface StudyPlanFormData {
  title: string;
  description: string;
  duration: string;
  subjects: string[];
  difficulty: string;
  studyHoursPerWeek: number;
  startDate: string;
  goals: string[];
  prerequisites: string[];
}

export interface StudyPlan {
  id: number;
  title: string;
  description: string;
  duration: string;
  progress: number;
  status: string;
  subjects: string[];
  nextTask: string;
  dueDate: string;
  difficulty?: string;
  studyHoursPerWeek?: number;
  startDate?: string;
  goals?: string[];
  prerequisites?: string[];
  totalHours?: number;
  completedHours?: number;
  weeklySchedule?: { day: string; hours: number; topics: string[] }[];
  milestones?: {
    description: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface StudyPlanDetailsProps {
  studyPlan: StudyPlan | StudyPlanWithMilestones;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isOpen: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  week: number;
  completed: boolean;
}

export interface StudyPlanWithMilestones extends StudyPlanFormData {
  id: string;
  milestones: Milestone[];
  startDate: string;
  createdAt: string;
}

export type weeklyDataProps = {
  day: string;
  hours: number;
  completed: number;
};
