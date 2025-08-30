
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'coordinator' | 'admin';
  courseId?: string;
  courseName?: string;
  createdAt: string;
  updatedAt: string;
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
}

export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalSubjects: number;
  totalEnrollments: number;
}
