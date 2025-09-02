
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'coordinator' | 'admin';
  course_id?: string;
  course_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  coordinator_id?: string;
  coordinator_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Semester {
  id: string;
  code: string;
  course_id: string;
  course_name?: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester_id: string;
  teacher_id?: string;
  teacher_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  student_name?: string;
  subject_id: string;
  subject_name?: string;
  enrollment_date: string;
  status: 'active' | 'completed' | 'dropped';
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  course_id?: string;
  course_name?: string;
}

export interface DashboardStats {
  total_users: number;
  total_courses: number;
  total_subjects: number;
  total_enrollments: number;
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
  course_id: string;
}
