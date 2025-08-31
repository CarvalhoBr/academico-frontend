// API Configuration
export const API_CONFIG = {
  // Base URL da API - pode ser alterado através de variável de ambiente
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  // Timeout para requisições (em ms)
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  
  // Headers padrão
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      WHOAMI: '/auth/whoami',
    },
    USERS: '/users',
    COURSES: '/courses',
    SEMESTERS: '/semesters',
  }
} as const;

// Função para obter o token do localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

// Função para salvar o token no localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

// Função para remover o token do localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
};

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
