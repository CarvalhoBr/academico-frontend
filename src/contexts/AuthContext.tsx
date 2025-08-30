
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/academic';
import { apiService, ApiException } from '@/services/api';
import { setAuthToken, removeAuthToken, getAuthToken, isAuthenticated } from '@/config/api';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Verificar se há token de acesso armazenado
        if (isAuthenticated()) {
          // Tentar obter informações do usuário atual
          const userData = await apiService.auth.me();
          setUser(userData as AuthUser);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        // Se houver erro, remover token inválido
        removeAuthToken();
        localStorage.removeItem('academic_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fazer requisição de login para a API
      const response = await apiService.auth.login({ email, password });
      
      // Salvar o token de acesso no localStorage
      setAuthToken(response.access_token);
      
      // Salvar informações do usuário
      setUser(response.user as AuthUser);
      localStorage.setItem('academic_user', JSON.stringify(response.user));
      
    } catch (error) {
      // Tratar erros da API
      if (error instanceof ApiException) {
        setError(error.message);
        throw new Error(error.message);
      } else {
        const errorMessage = 'Erro ao fazer login. Tente novamente.';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Tentar fazer logout na API (opcional)
      if (isAuthenticated()) {
        await apiService.auth.logout();
      }
    } catch (error) {
      console.error('Erro ao fazer logout na API:', error);
      // Continuar com logout local mesmo se a API falhar
    } finally {
      // Limpar dados locais
      setUser(null);
      removeAuthToken();
      localStorage.removeItem('academic_user');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
