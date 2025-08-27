const API_BASE_URL = 'http://localhost:8080/api';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User types
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthMessage {
  token: string;
  user: UserDto;
  message: string;
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number; // in hours
  enrolledStudents: number;
  rating: number;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  isCompleted?: boolean;
}

// Assignment types
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  submittedAt?: string;
  score?: number;
  feedback?: string;
}

// Study Plan types
export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetDate: string;
  courses: string[]; // course IDs
  dailyStudyHours: number;
  progress: number; // percentage
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
}

// Progress types
export interface UserProgress {
  userId: string;
  totalCoursesEnrolled: number;
  completedCourses: number;
  totalLessonsCompleted: number;
  totalStudyHours: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}

// Community types
export interface Discussion {
  id: string;
  courseId?: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  replies: Reply[];
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

export interface Reply {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

// AI Tutor types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface TutorSession {
  id: string;
  userId: string;
  subject: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Generic API client
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthMessage>> {
    return this.request<AuthMessage>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignupRequest): Promise<ApiResponse<AuthMessage>> {
    return this.request<AuthMessage>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    // Simple logout - just clear token and redirect
    this.clearToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/Login';
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
  }

  // User endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Course endpoints
  async getCourses(page = 0, size = 10, category?: string): Promise<ApiResponse<{ content: Course[]; totalElements: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (category) params.append('category', category);
    
    return this.request<{ content: Course[]; totalElements: number }>(`/courses?${params}`);
  }

  // Convenience: fetch only the current user's enrolled courses
  async getMyCourses(page = 0, size = 20): Promise<ApiResponse<{ content: Course[]; totalElements: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      enrolled: 'true',
    });
    return this.request<{ content: Course[]; totalElements: number }>(`/courses?${params}`);
  }

  async getCourse(courseId: string): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${courseId}`);
  }

  async enrollInCourse(courseId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  async getCourseLessons(courseId: string): Promise<ApiResponse<Lesson[]>> {
    return this.request<Lesson[]>(`/courses/${courseId}/lessons`);
  }

  async markLessonComplete(courseId: string, lessonId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/courses/${courseId}/lessons/${lessonId}/complete`, {
      method: 'POST',
    });
  }

  // Assignment endpoints
  async getAssignments(courseId?: string): Promise<ApiResponse<Assignment[]>> {
    const endpoint = courseId ? `/assignments?courseId=${courseId}` : '/assignments';
    return this.request<Assignment[]>(endpoint);
  }

  async getAssignment(assignmentId: string): Promise<ApiResponse<Assignment>> {
    return this.request<Assignment>(`/assignments/${assignmentId}`);
  }

  async submitAssignment(assignmentId: string, submission: any): Promise<ApiResponse<void>> {
    return this.request<void>(`/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submission),
    });
  }

  // Study Plan endpoints
  async getStudyPlans(): Promise<ApiResponse<StudyPlan[]>> {
    return this.request<StudyPlan[]>('/study-plans');
  }

  async createStudyPlan(studyPlan: Omit<StudyPlan, 'id' | 'userId' | 'createdAt' | 'progress' | 'status'>): Promise<ApiResponse<StudyPlan>> {
    return this.request<StudyPlan>('/study-plans', {
      method: 'POST',
      body: JSON.stringify(studyPlan),
    });
  }

  async updateStudyPlan(planId: string, updates: Partial<StudyPlan>): Promise<ApiResponse<StudyPlan>> {
    return this.request<StudyPlan>(`/study-plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteStudyPlan(planId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/study-plans/${planId}`, {
      method: 'DELETE',
    });
  }

  // Progress endpoints
  async getUserProgress(): Promise<ApiResponse<UserProgress>> {
    return this.request<UserProgress>('/progress/me');
  }

  async getDashboardStats(): Promise<ApiResponse<{
    activeCourses: number;
    studyStreak: number;
    completedLessons: number;
    totalStudyHours: number;
  }>> {
    return this.request<{
      activeCourses: number;
      studyStreak: number;
      completedLessons: number;
      totalStudyHours: number;
    }>('/progress/dashboard-stats');
  }

  // Get progress for a specific course
  async getCourseProgress(courseId: string): Promise<ApiResponse<{ progress: number }>> {
    return this.request<{ progress: number }>(`/progress/courses/${courseId}`);
  }

  // Community endpoints
  async getDiscussions(courseId?: string, page = 0, size = 10): Promise<ApiResponse<{ content: Discussion[]; totalElements: number }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (courseId) params.append('courseId', courseId);
    
    return this.request<{ content: Discussion[]; totalElements: number }>(`/discussions?${params}`);
  }

  async createDiscussion(discussion: { courseId?: string; title: string; content: string }): Promise<ApiResponse<Discussion>> {
    return this.request<Discussion>('/discussions', {
      method: 'POST',
      body: JSON.stringify(discussion),
    });
  }

  async replyToDiscussion(discussionId: string, content: string): Promise<ApiResponse<Reply>> {
    return this.request<Reply>(`/discussions/${discussionId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async likeDiscussion(discussionId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/discussions/${discussionId}/like`, {
      method: 'POST',
    });
  }

  // AI Tutor endpoints
  async getTutorSessions(): Promise<ApiResponse<TutorSession[]>> {
    return this.request<TutorSession[]>('/ai-tutor/sessions');
  }

  async createTutorSession(subject: string): Promise<ApiResponse<TutorSession>> {
    return this.request<TutorSession>('/ai-tutor/sessions', {
      method: 'POST',
      body: JSON.stringify({ subject }),
    });
  }

  async sendMessage(sessionId: string, message: string): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>(`/ai-tutor/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    });
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export convenience functions
export const authApi = {
  login: (credentials: LoginRequest) => apiClient.login(credentials),
  signup: (userData: SignupRequest) => apiClient.signup(userData),
  logout: () => apiClient.logout(),
  getCurrentUser: () => apiClient.getCurrentUser(),
  setToken: (token: string) => apiClient.setToken(token),
  clearToken: () => apiClient.clearToken(),
};

export const courseApi = {
  getCourses: (page?: number, size?: number, category?: string) => 
    apiClient.getCourses(page, size, category),
  getMyCourses: (page?: number, size?: number) => apiClient.getMyCourses(page, size),
  getCourse: (courseId: string) => apiClient.getCourse(courseId),
  enrollInCourse: (courseId: string) => apiClient.enrollInCourse(courseId),
  getCourseLessons: (courseId: string) => apiClient.getCourseLessons(courseId),
  markLessonComplete: (courseId: string, lessonId: string) => 
    apiClient.markLessonComplete(courseId, lessonId),
};

export const assignmentApi = {
  getAssignments: (courseId?: string) => apiClient.getAssignments(courseId),
  getAssignment: (assignmentId: string) => apiClient.getAssignment(assignmentId),
  submitAssignment: (assignmentId: string, submission: any) => 
    apiClient.submitAssignment(assignmentId, submission),
};

export const studyPlanApi = {
  getStudyPlans: () => apiClient.getStudyPlans(),
  createStudyPlan: (studyPlan: Omit<StudyPlan, 'id' | 'userId' | 'createdAt' | 'progress' | 'status'>) => 
    apiClient.createStudyPlan(studyPlan),
  updateStudyPlan: (planId: string, updates: Partial<StudyPlan>) => 
    apiClient.updateStudyPlan(planId, updates),
  deleteStudyPlan: (planId: string) => apiClient.deleteStudyPlan(planId),
};

export const progressApi = {
  getUserProgress: () => apiClient.getUserProgress(),
  getDashboardStats: () => apiClient.getDashboardStats(),
  getCourseProgress: (courseId: string) => apiClient.getCourseProgress(courseId),
};

export const communityApi = {
  getDiscussions: (courseId?: string, page?: number, size?: number) => 
    apiClient.getDiscussions(courseId, page, size),
  createDiscussion: (discussion: { courseId?: string; title: string; content: string }) => 
    apiClient.createDiscussion(discussion),
  replyToDiscussion: (discussionId: string, content: string) => 
    apiClient.replyToDiscussion(discussionId, content),
  likeDiscussion: (discussionId: string) => apiClient.likeDiscussion(discussionId),
};

export const tutorApi = {
  getTutorSessions: () => apiClient.getTutorSessions(),
  createTutorSession: (subject: string) => apiClient.createTutorSession(subject),
  sendMessage: (sessionId: string, message: string) => 
    apiClient.sendMessage(sessionId, message),
};
