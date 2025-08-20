// Types
import {
  SidebarItem,
  Notification,
  User,
  Course,
  QuizQuestion,
  AssignmentQuiz,
  DiscussionComment,
  CourseLesson,
  CourseContent,
  CourseModule,
  StudyPlanFormData,
  StudyPlanWithMilestones,
  weeklyDataProps,
} from "../src/types/types";

// Notifications Data
export const notifications: Notification[] = [
  {
    id: 1,
    title: "New assignment available",
    message: "Linear Algebra Quiz is now available",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Study reminder",
    message: "Time for your daily AI fundamentals study",
    time: "4 hours ago",
    unread: true,
  },
  {
    id: 3,
    title: "Course completed",
    message: "Congratulations! You completed Python Basics",
    time: "1 day ago",
    unread: false,
  },
];

// User Data
export const userData: User = {
  name: "John Doe",
  email: "john@example.com",
  initials: "JD",
  avatar: "https://github.com/shadcn.png",
};

// Courses Data
export const coursesData: Course[] = [
  {
    id: 1,
    title: "Introduction to Artificial Intelligence",
    description: "Learn the fundamentals of AI and machine learning",
    progress: 75,
    duration: "8 weeks",
    level: "Beginner",
    image: "🤖",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Deep dive into ML algorithms and applications",
    progress: 45,
    duration: "12 weeks",
    level: "Intermediate",
    image: "🧠",
  },
  {
    id: 3,
    title: "Data Science with Python",
    description: "Master data analysis and visualization",
    progress: 90,
    duration: "10 weeks",
    level: "Intermediate",
    image: "🐍",
  },
  {
    id: 4,
    title: "Neural Networks & Deep Learning",
    description: "Advanced concepts in deep learning",
    progress: 20,
    duration: "16 weeks",
    level: "Advanced",
    image: "🔗",
  },
];

// Recommended Courses Data
export const recommendedCourses = [
  { title: "Computer Vision Basics", image: "👁️", level: "Intermediate" },
  { title: "Natural Language Processing", image: "💬", level: "Advanced" },
  { title: "Robotics Fundamentals", image: "🤖", level: "Beginner" },
  { title: "Quantum Computing Intro", image: "⚛️", level: "Advanced" },
];

// AI Tutor Data
export const quickQuestions = [
  "Explain machine learning basics",
  "What is neural network?",
  "Help with Python syntax",
  "Data structures overview",
];

export const studyTopics = [
  { name: "Mathematics", icon: "📊" },
  { name: "Programming", icon: "💻" },
  { name: "Science", icon: "🔬" },
  { name: "Languages", icon: "🌍" },
];

// Study Plans Data
export const studyPlansData = [
  {
    id: 1,
    title: "AI Fundamentals Mastery",
    description: "Complete guide to understanding artificial intelligence",
    duration: "8 weeks",
    progress: 65,
    status: "active",
    subjects: ["Machine Learning", "Neural Networks", "Data Science"],
    nextTask: "Complete Linear Algebra Review",
    dueDate: "2024-01-15",
    totalHours: 80,
    completedHours: 52,
    weeklySchedule: [
      { day: "Mon", hours: 2, topics: ["Linear Algebra", "Vectors"] },
      { day: "Wed", hours: 3, topics: ["Probability", "Sets"] },
      { day: "Fri", hours: 2, topics: ["ML Basics", "Supervised vs Unsupervised"] },
    ],
  },
  {
    id: 2,
    title: "Python Programming Bootcamp",
    description: "From beginner to advanced Python development",
    duration: "12 weeks",
    progress: 30,
    status: "active",
    subjects: ["Python Basics", "OOP", "Web Development"],
    nextTask: "Functions and Modules Assignment",
    dueDate: "2024-01-20",
    totalHours: 120,
    completedHours: 36,
    weeklySchedule: [
      { day: "Tue", hours: 2.5, topics: ["Functions", "Modules"] },
      { day: "Thu", hours: 3, topics: ["OOP", "Classes", "Inheritance"] },
      { day: "Sat", hours: 2, topics: ["Flask", "APIs"] },
    ],
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Master computer science fundamentals",
    duration: "16 weeks",
    progress: 100,
    status: "completed",
    subjects: ["Arrays", "Trees", "Graphs", "Sorting"],
    nextTask: "Course Completed",
    dueDate: "2023-12-30",
    totalHours: 160,
    completedHours: 160,
    weeklySchedule: [
      { day: "Mon", hours: 3, topics: ["Arrays", "Linked Lists"] },
      { day: "Wed", hours: 3, topics: ["Trees", "BST"] },
      { day: "Fri", hours: 4, topics: ["Graphs", "Dijkstra"] },
    ],
  },
];

export const upcomingTasks = [
  {
    id: 1,
    title: "Complete Linear Algebra Review",
    course: "AI Fundamentals Mastery",
    dueDate: "Today",
    priority: "high",
  },
  {
    id: 2,
    title: "Python Functions Quiz",
    course: "Python Programming Bootcamp",
    dueDate: "Tomorrow",
    priority: "medium",
  },
  {
    id: 3,
    title: "Neural Networks Assignment",
    course: "AI Fundamentals Mastery",
    dueDate: "Jan 18",
    priority: "low",
  },
];

// Progress Data
export const weeklyData = [
  { day: "Mon", hours: 2.5, completed: 3 },
  { day: "Tue", hours: 3.2, completed: 4 },
  { day: "Wed", hours: 1.8, completed: 2 },
  { day: "Thu", hours: 4.1, completed: 5 },
  { day: "Fri", hours: 2.9, completed: 3 },
  { day: "Sat", hours: 3.5, completed: 4 },
  { day: "Sun", hours: 2.1, completed: 2 },
];

export const achievements = [
  {
    id: 1,
    title: "First Course Completed",
    description: "Completed your first course",
    icon: "🎓",
    earned: true,
    date: "Dec 15, 2023",
  },
  {
    id: 2,
    title: "Study Streak Master",
    description: "Studied for 7 consecutive days",
    icon: "🔥",
    earned: true,
    date: "Dec 20, 2023",
  },
  {
    id: 3,
    title: "AI Explorer",
    description: "Completed 5 AI-related lessons",
    icon: "🤖",
    earned: true,
    date: "Dec 25, 2023",
  },
  {
    id: 4,
    title: "Speed Learner",
    description: "Complete 10 lessons in one day",
    icon: "⚡",
    earned: false,
    progress: 70,
  },
];

export const subjects = [
  { name: "Artificial Intelligence", progress: 75, color: "bg-blue-500" },
  { name: "Machine Learning", progress: 60, color: "bg-green-500" },
  { name: "Python Programming", progress: 90, color: "bg-yellow-500" },
  { name: "Data Science", progress: 45, color: "bg-purple-500" },
  { name: "Neural Networks", progress: 30, color: "bg-red-500" },
];

// Assignments Data
export const assignmentsData = [
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

// Quiz mock data for assignments (only id 1 for now)

export const assignmentQuizData: Record<number, AssignmentQuiz> = {
  1: {
    assignmentId: 1,
    title: "Linear Algebra Fundamentals Quiz",
    instructions:
      "Answer all questions. Choose the best option. This is a simple mock quiz for demo purposes.",
    timeLimitMinutes: 15,
    questions: [
      {
        id: 1,
        prompt: "Which of the following is a scalar?",
        options: ["[1, 2, 3]", "5", "(1, 2)", "[[1, 0], [0, 1]]"],
        correctIndex: 1,
      },
      {
        id: 2,
        prompt: "What is the dot product of vectors (1, 2) and (3, 4)?",
        options: ["7", "11", "14", "24"],
        correctIndex: 2,
      },
      {
        id: 3,
        prompt: "The identity matrix multiplied by any vector returns:",
        options: [
          "Zero vector",
          "The same vector",
          "A scalar",
          "A transposed vector",
        ],
        correctIndex: 1,
      },
    ],
  },
};

// Community Data
export const discussions = [
  {
    id: 1,
    title: "Best practices for learning machine learning?",
    author: "Sarah Chen",
    avatar: "👩‍💻",
    course: "Machine Learning Fundamentals",
    replies: 12,
    likes: 24,
    timeAgo: "2 hours ago",
    tags: ["machine-learning", "tips", "beginner"],
  },
  {
    id: 2,
    title: "Help with Python list comprehensions",
    author: "Mike Johnson",
    avatar: "👨‍💼",
    course: "Python Programming Bootcamp",
    replies: 8,
    likes: 15,
    timeAgo: "4 hours ago",
    tags: ["python", "help", "syntax"],
  },
  {
    id: 3,
    title: "Neural network architecture recommendations",
    author: "Dr. Emily Rodriguez",
    avatar: "👩‍🔬",
    course: "Neural Networks & Deep Learning",
    replies: 18,
    likes: 42,
    timeAgo: "6 hours ago",
    tags: ["neural-networks", "architecture", "advanced"],
  },
  {
    id: 4,
    title: "Study group for AI fundamentals - Join us!",
    author: "Alex Kim",
    avatar: "👨‍🎓",
    course: "AI Fundamentals Mastery",
    replies: 25,
    likes: 38,
    timeAgo: "1 day ago",
    tags: ["study-group", "collaboration", "ai"],
  },
];

export const studyGroups = [
  {
    id: 1,
    name: "AI Enthusiasts",
    members: 156,
    description: "Discussing latest trends in artificial intelligence",
    activity: "Very Active",
    image: "🤖",
  },
  {
    id: 2,
    name: "Python Developers",
    members: 203,
    description: "Python programming tips, tricks, and projects",
    activity: "Active",
    image: "🐍",
  },
  {
    id: 3,
    name: "Data Science Hub",
    members: 89,
    description: "Data analysis, visualization, and insights",
    activity: "Moderate",
    image: "📊",
  },
];

export const leaderboard = [
  { rank: 1, name: "Sarah Chen", points: 2450, avatar: "👩‍💻" },
  { rank: 2, name: "Mike Johnson", points: 2380, avatar: "👨‍💼" },
  { rank: 3, name: "Emily Rodriguez", points: 2290, avatar: "👩���🔬" },
  { rank: 4, name: "Alex Kim", points: 2150, avatar: "👨‍🎓" },
  { rank: 5, name: "You", points: 1980, avatar: "👤" },
];

// Community comments mock data (for detail view)

export const discussionCommentsData: Record<number, DiscussionComment[]> = {
  1: [
    {
      id: 101,
      author: "Mike Johnson",
      avatar: "👨‍💼",
      timeAgo: "1 hour ago",
      content:
        "I recommend starting with Andrew Ng's ML course. Also, practice by implementing algorithms from scratch.",
      likes: 12,
    },
    {
      id: 102,
      author: "Emily Rodriguez",
      avatar: "👩‍🔬",
      timeAgo: "45 minutes ago",
      content:
        "Build small projects like a spam classifier or an image recognizer. It helps connect theory and practice.",
      likes: 9,
    },
  ],
};

// Settings Data
export const settingsTabs = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "account", label: "Account", icon: "⚙️" },
  { id: "notifications", label: "Notifications", icon: "🔔" },
  { id: "privacy", label: "Privacy", icon: "🔒" },
  { id: "billing", label: "Billing", icon: "💳" },
];

export const defaultProfileData = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  username: "johndoe",
  bio: "Passionate learner exploring AI and machine learning",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
};

export const defaultPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  studyReminders: true,
  darkMode: false,
  language: "English",
  timezone: "PST",
};

export const courseContentData: Record<number, CourseContent> = {
  1: {
    courseId: 1,
    summary:
      "A beginner-friendly introduction to AI concepts, terminology, and practical applications.",
    modules: [
      {
        id: 1,
        title: "Foundations of AI",
        lessons: [
          {
            id: 1,
            title: "What is Artificial Intelligence?",
            duration: "8 min",
            content:
              "Artificial Intelligence (AI) refers to systems that perform tasks typically requiring human intelligence, such as perception, reasoning, learning, and decision-making.",
          },
          {
            id: 2,
            title: "AI vs. Machine Learning vs. Deep Learning",
            duration: "12 min",
            content:
              "Machine Learning is a subset of AI that learns from data; Deep Learning uses neural networks to model complex patterns. This lesson clarifies the relationships with examples.",
          },
          {
            id: 3,
            title: "Real-World Applications",
            duration: "10 min",
            content:
              "Explore applications like image recognition, language translation, recommendation systems, and autonomous driving.",
          },
        ],
      },
      {
        id: 2,
        title: "Getting Practical",
        lessons: [
          {
            id: 1,
            title: "Datasets and Features",
            duration: "9 min",
            content:
              "Learn how datasets are structured and how features represent information. Understand training, validation, and test splits.",
          },
          {
            id: 2,
            title: "Building a Simple Classifier",
            duration: "14 min",
            content:
              "Walk through a conceptual workflow for training a basic classifier, from preprocessing to evaluation.",
          },
        ],
      },
    ],
  },
};

// Topic-level dropdown mock data (applies to Topic 1 and Topic 2 across weeks)
// Keyed by topic number within a week (1-based): e.g., Topic 1, Topic 2
export const topicDropdownData: Record<number, string[]> = {
  1: [
    "Overview",
    "Lecture Notes",
    "Practice Quiz",
    "Further Reading",
  ],
  2: [
    "Reading List",
    "Worked Examples",
    "Assignments",
    "Cheat Sheet",
  ],
};

export const mockStudyPlan: StudyPlanWithMilestones = {
  id: "1",
  title: "Advanced Web Development Mastery",
  description:
    "Master modern web development technologies including React, Node.js, TypeScript, and advanced CSS techniques through hands-on projects and real-world applications.",
  duration: "12 weeks",
  subjects: ["React", "TypeScript", "Node.js", "CSS", "MongoDB", "Testing"],
  difficulty: "Advanced",
  studyHoursPerWeek: 15,
  startDate: "2024-01-15",
  createdAt: "2024-01-15",
  goals: [
    "Build 3 full-stack applications",
    "Master React hooks and advanced patterns",
    "Implement comprehensive testing strategies",
    "Deploy applications to production",
  ],
  prerequisites: [
    "Basic JavaScript knowledge",
    "HTML/CSS fundamentals",
    "Git version control",
  ],
  milestones: [
    {
      id: "m1",
      title: "Set up development environment",
      description:
        "Install and configure all necessary tools including VS Code, Node.js, Git, and project dependencies",
      week: 1,
      completed: true,
    },
    {
      id: "m2",
      title: "Master React fundamentals",
      description:
        "Complete React tutorial covering components, props, state, and lifecycle methods",
      week: 1,
      completed: true,
    },
    {
      id: "m3",
      title: "Build first React application",
      description:
        "Create a todo application with CRUD operations using React hooks",
      week: 2,
      completed: true,
    },
    {
      id: "m4",
      title: "Learn TypeScript basics",
      description:
        "Understand TypeScript syntax, interfaces, generics, and type definitions",
      week: 2,
      completed: false,
    },
    {
      id: "m5",
      title: "Implement state management",
      description:
        "Learn and implement Redux Toolkit for complex state management",
      week: 3,
      completed: false,
    },
    {
      id: "m6",
      title: "Build RESTful API",
      description: "Create a Node.js Express API with MongoDB integration",
      week: 3,
      completed: false,
    },
    {
      id: "m7",
      title: "Authentication system",
      description: "Implement JWT authentication and authorization in the API",
      week: 4,
      completed: false,
    },
    {
      id: "m8",
      title: "Database design",
      description: "Design and implement MongoDB schemas for the application",
      week: 4,
      completed: false,
    },
    {
      id: "m9",
      title: "Frontend-backend integration",
      description: "Connect React frontend with Node.js backend API",
      week: 5,
      completed: false,
    },
    {
      id: "m10",
      title: "Testing implementation",
      description:
        "Write unit and integration tests for both frontend and backend",
      week: 6,
      completed: false,
    },
    {
      id: "m11",
      title: "Deployment preparation",
      description:
        "Prepare applications for deployment to production environment",
      week: 7,
      completed: false,
    },
    {
      id: "m12",
      title: "Final project completion",
      description: "Deploy full-stack application and complete final testing",
      week: 8,
      completed: false,
    },
  ],
};

export const mockStudyPlans: StudyPlanWithMilestones[] = [
  mockStudyPlan,
  {
    id: "2",
    title: "Data Science Fundamentals",
    description:
      "Learn the basics of data science including Python, statistics, machine learning, and data visualization.",
    duration: "8 weeks",
    subjects: [
      "Python",
      "Statistics",
      "Machine Learning",
      "Data Visualization",
      "Pandas",
      "NumPy",
    ],
    difficulty: "Intermediate",
    studyHoursPerWeek: 10,
    startDate: "2024-01-20",
    createdAt: "2024-01-20",
    goals: [
      "Master Python for data analysis",
      "Understand statistical concepts",
      "Build machine learning models",
      "Create data visualizations",
    ],
    prerequisites: ["Basic programming knowledge", "High school mathematics"],
    milestones: [
      {
        id: "ds1",
        title: "Python fundamentals",
        description:
          "Learn Python syntax, data structures, and basic programming concepts",
        week: 1,
        completed: true,
      },
      {
        id: "ds2",
        title: "NumPy and Pandas",
        description:
          "Master data manipulation with NumPy arrays and Pandas DataFrames",
        week: 2,
        completed: true,
      },
      {
        id: "ds3",
        title: "Data visualization",
        description:
          "Create compelling visualizations using Matplotlib and Seaborn",
        week: 3,
        completed: false,
      },
    ],
  },
];
