
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/types/academic';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, AuthUser> = {
  'admin@academic.com': {
    id: '1',
    name: 'João Silva',
    email: 'admin@academic.com',
    role: 'admin'
  },
  'coord@academic.com': {
    id: '2',
    name: 'Maria Santos',
    email: 'coord@academic.com',
    role: 'coordinator',
    courseId: 'course-1'
  },
  'teacher@academic.com': {
    id: '3',
    name: 'Pedro Costa',
    email: 'teacher@academic.com',
    role: 'teacher',
    courseId: 'course-1'
  },
  'student@academic.com': {
    id: '4',
    name: 'Ana Oliveira',
    email: 'student@academic.com',
    role: 'student',
    courseId: 'course-1'
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('academic_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    if (mockUser && password === 'admin123') {
      setUser(mockUser);
      localStorage.setItem('academic_user', JSON.stringify(mockUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('academic_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
