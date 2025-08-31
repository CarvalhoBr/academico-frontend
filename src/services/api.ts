import { API_CONFIG, getAuthToken } from '@/config/api';
import { WhoAmIResponse } from '@/types/permissions';
import { 
  CoursesListResponse, 
  CourseDetailResponse, 
  SubjectsResponse,
  SemestersListResponse,
  CreateSemesterRequest,
  UpdateSemesterRequest
} from '@/types/course';

// Tipos para as requisições
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// Classe customizada para erros da API
export class ApiException extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// Função utilitária para fazer requisições HTTP
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Headers padrão
  const headers: Record<string, string> = {
    ...API_CONFIG.DEFAULT_HEADERS,
    ...((options.headers as Record<string, string>) || {}),
  };

  // Adicionar token de autenticação se disponível
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Configuração da requisição
  const config: RequestInit = {
    ...options,
    headers,
    signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
  };

  try {
    const response = await fetch(url, config);
    
    // Verificar se a resposta é JSON
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    
    // Processar resposta
    const data = isJson ? await response.json() : await response.text();
    
    // Verificar se a requisição foi bem-sucedida
    if (!response.ok) {
      throw new ApiException(
        data?.message || `HTTP Error: ${response.status}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    // Re-throw ApiException
    if (error instanceof ApiException) {
      throw error;
    }
    
    // Tratar outros erros (rede, timeout, etc.)
    if (error instanceof Error) {
      throw new ApiException(
        error.name === 'TimeoutError' 
          ? 'Timeout: A requisição demorou muito para responder'
          : error.message,
        0,
        error
      );
    }
    
    // Erro desconhecido
    throw new ApiException('Erro desconhecido na requisição', 0, error);
  }
}

// Serviços da API
export const apiService = {
  // Autenticação
  auth: {
    /**
     * Realiza login do usuário
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
      return apiRequest<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },

    /**
     * Realiza logout do usuário
     */
    async logout(): Promise<void> {
      return apiRequest<void>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
      });
    },

    /**
     * Obtém informações do usuário atual
     */
    async me(): Promise<LoginResponse['data']['user']> {
      return apiRequest<LoginResponse['data']['user']>(API_CONFIG.ENDPOINTS.AUTH.ME);
    },

    /**
     * Obtém informações completas do usuário e suas permissões
     */
    async whoami(): Promise<WhoAmIResponse> {
      return apiRequest<WhoAmIResponse>(API_CONFIG.ENDPOINTS.AUTH.WHOAMI);
    },

    /**
     * Atualiza o token de acesso
     */
    async refresh(): Promise<{ access_token: string }> {
      return apiRequest<{ access_token: string }>(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
      });
    },
  },

  // Usuários
  users: {
    /**
     * Lista todos os usuários
     */
    async list(): Promise<any[]> {
      return apiRequest<any[]>(API_CONFIG.ENDPOINTS.USERS);
    },

    /**
     * Cria um novo usuário
     */
    async create(user: any): Promise<any> {
      return apiRequest<any>(API_CONFIG.ENDPOINTS.USERS, {
        method: 'POST',
        body: JSON.stringify(user),
      });
    },

    /**
     * Atualiza um usuário
     */
    async update(id: string, user: any): Promise<any> {
      return apiRequest<any>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
      });
    },

    /**
     * Remove um usuário
     */
    async delete(id: string): Promise<void> {
      return apiRequest<void>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
        method: 'DELETE',
      });
    },
  },

  // Cursos
  courses: {
    /**
     * Lista todos os cursos
     */
    async list(): Promise<CoursesListResponse> {
      return apiRequest<CoursesListResponse>(API_CONFIG.ENDPOINTS.COURSES);
    },

    /**
     * Obtém detalhes de um curso específico com semestres e alunos
     */
    async getById(id: string): Promise<CourseDetailResponse> {
      return apiRequest<CourseDetailResponse>(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`);
    },

    /**
     * Cria um novo curso
     */
    async create(course: any): Promise<any> {
      return apiRequest<any>(API_CONFIG.ENDPOINTS.COURSES, {
        method: 'POST',
        body: JSON.stringify(course),
      });
    },

    /**
     * Atualiza um curso
     */
    async update(id: string, course: any): Promise<any> {
      return apiRequest<any>(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(course),
      });
    },

    /**
     * Remove um curso
     */
    async delete(id: string): Promise<void> {
      return apiRequest<void>(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`, {
        method: 'DELETE',
      });
    },

    /**
     * Obtém as disciplinas de um semestre específico
     */
    async getSubjects(courseId: string, semesterId: string): Promise<SubjectsResponse> {
      return apiRequest<SubjectsResponse>(`${API_CONFIG.ENDPOINTS.COURSES}/${courseId}/${semesterId}/subjects`);
    },
  },

  // Semestres
  semesters: {
    /**
     * Lista todos os semestres
     */
    async list(): Promise<SemestersListResponse> {
      return apiRequest<SemestersListResponse>(API_CONFIG.ENDPOINTS.SEMESTERS);
    },

    /**
     * Cria um novo semestre
     */
    async create(data: CreateSemesterRequest): Promise<any> {
      return apiRequest<any>(API_CONFIG.ENDPOINTS.SEMESTERS, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    /**
     * Atualiza um semestre
     */
    async update(id: string, data: UpdateSemesterRequest): Promise<any> {
      return apiRequest<any>(`${API_CONFIG.ENDPOINTS.SEMESTERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    /**
     * Remove um semestre
     */
    async delete(id: string): Promise<void> {
      return apiRequest<void>(`${API_CONFIG.ENDPOINTS.SEMESTERS}/${id}`, {
        method: 'DELETE',
      });
    },
  },
};

export default apiService;
