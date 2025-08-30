
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/academic';
import { apiService, ApiException } from '@/services/api';
import { setAuthToken, removeAuthToken, getAuthToken, isAuthenticated } from '@/config/api';
import { Resource, UserData } from '@/types/permissions';

interface AuthContextType {
  user: AuthUser | null;
  resources: Resource[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Verificar se há token de acesso armazenado
        if (isAuthenticated()) {
          // Obter informações completas do usuário e permissões
          const whoamiResponse = await apiService.auth.whoami();
          
          if (whoamiResponse.success) {
            const { user: userData, resources: userResources } = whoamiResponse.data;
            
            // Converter UserData para AuthUser (compatibilidade)
            const authUser: AuthUser = {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role as any, // Manter compatibilidade com tipos existentes
            };
            
            setUser(authUser);
            setResources(userResources);
            localStorage.setItem('academic_user', JSON.stringify(authUser));
            localStorage.setItem('user_resources', JSON.stringify(userResources));
          }
        }
      } catch (error) {
        // Se houver erro, remover token e dados inválidos
        removeAuthToken();
        localStorage.removeItem('academic_user');
        localStorage.removeItem('user_resources');
        setUser(null);
        setResources([]);
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
      
      // O access_token está dentro de response.data
      const { access_token: accessToken, user: loginUser } = response.data;
      
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado na resposta da API');
      }
      
      // Salvar o token de acesso no localStorage
      setAuthToken(accessToken);
      
      // Após login bem-sucedido, obter permissões completas
      const whoamiResponse = await apiService.auth.whoami();
      
      if (whoamiResponse.success) {
        const { user: userData, resources: userResources } = whoamiResponse.data;
        
        // Converter UserData para AuthUser (compatibilidade)
        const authUser: AuthUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as any,
        };
        
        setUser(authUser);
        setResources(userResources);
        localStorage.setItem('academic_user', JSON.stringify(authUser));
        localStorage.setItem('user_resources', JSON.stringify(userResources));
      } else {
        // Fallback para dados básicos do login se whoami falhar
        const fallbackUser: AuthUser = {
          id: loginUser.id,
          name: loginUser.name,
          email: loginUser.email,
          role: loginUser.role as any,
        };
        setUser(fallbackUser);
        localStorage.setItem('academic_user', JSON.stringify(fallbackUser));
      }
      
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
      // Continuar com logout local mesmo se a API falhar
    } finally {
      // Limpar dados locais
      setUser(null);
      setResources([]);
      removeAuthToken();
      localStorage.removeItem('academic_user');
      localStorage.removeItem('user_resources');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, resources, login, logout, isLoading, error }}>
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
