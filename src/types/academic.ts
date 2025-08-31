
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'coordinator' | 'admin';
  courseId?: string;
  courseName?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  coordinatorId?: string;
  coordinatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  id: string;
  code: string;
  courseId: string;
  courseName?: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semesterId: string;
  teacherId?: string;
  teacherName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  studentName?: string;
  subjectId: string;
  subjectName?: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  courseId?: string;
  courseName?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalSubjects: number;
  totalEnrollments: number;
}

export interface UsersListResponse {
  success: boolean;
  data: User[];
  message: string;
}

export interface UserDetailResponse {
  success: boolean;
  data: User;
  message: string;
}

export interface UserCoursesResponse {
  success: boolean;
  data: Course[];
  message: string;
}

export interface UserUpdateRequest {
  name: string;
  email: string;
  role: User['role'];
}

export interface UserCourseRequest {
  courseId: string;
}
