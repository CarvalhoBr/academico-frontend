// Tipos para o sistema de cursos

export interface Semester {
  id: string;
  code: string;
  course_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  course_id: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  coordinator_id: string | null;
  created_at: string;
  updated_at: string;
  coordinator_name?: string | null;
  coordinator_email?: string | null;
}

export interface CourseDetail extends Course {
  semesters: Semester[];
  students: Student[];
}

// Tipos para as respostas da API
export interface CoursesListResponse {
  success: boolean;
  data: Course[];
  message: string;
}

export interface CourseDetailResponse {
  success: boolean;
  data: CourseDetail;
  message: string;
}

// Tipos para estatísticas
export interface CourseStats {
  totalStudents: number;
  totalSemesters: number;
  activeSemesters: number;
  currentSemester?: Semester;
}
