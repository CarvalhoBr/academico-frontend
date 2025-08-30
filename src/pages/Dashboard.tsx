
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/dashboard/StatsCard';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar,
  UserCheck,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { key: 'users', title: 'Total de Usuários', value: 127, icon: Users, trend: { value: 12, isPositive: true } },
          { key: 'courses', title: 'Cursos Ativos', value: 8, icon: BookOpen, trend: { value: 2, isPositive: true } },
          { key: 'students', title: 'Estudantes', value: 89, icon: GraduationCap, trend: { value: 8, isPositive: true } },
          { key: 'semesters', title: 'Semestres', value: 16, icon: Calendar, trend: { value: 0, isPositive: true } }
        ];
      case 'coordinator':
        return [
          { key: 'course-students', title: 'Estudantes do Curso', value: 45, icon: GraduationCap, trend: { value: 5, isPositive: true } },
          { key: 'subjects', title: 'Disciplinas', value: 24, icon: FileText, trend: { value: 2, isPositive: true } },
          { key: 'enrollments', title: 'Matrículas Ativas', value: 168, icon: UserCheck, trend: { value: 15, isPositive: true } },
          { key: 'semesters', title: 'Semestres', value: 4, icon: Calendar, trend: { value: 0, isPositive: true } }
        ];
      case 'teacher':
        return [
          { key: 'subjects', title: 'Minhas Disciplinas', value: 3, icon: FileText, trend: { value: 0, isPositive: true } },
          { key: 'students', title: 'Estudantes', value: 72, icon: GraduationCap, trend: { value: 8, isPositive: true } },
          { key: 'enrollments', title: 'Matrículas', value: 85, icon: UserCheck, trend: { value: 12, isPositive: true } },
          { key: 'classes', title: 'Turmas', value: 6, icon: Calendar, trend: { value: 1, isPositive: true } }
        ];
      case 'student':
        return [
          { key: 'enrollments', title: 'Disciplinas Matriculadas', value: 7, icon: UserCheck, trend: { value: 1, isPositive: true } },
          { key: 'completed', title: 'Disciplinas Concluídas', value: 12, icon: FileText, trend: { value: 3, isPositive: true } },
          { key: 'semester', title: 'Semestre Atual', value: '2025-01', icon: Calendar, trend: null },
          { key: 'credits', title: 'Créditos Cursados', value: 89, icon: GraduationCap, trend: { value: 18, isPositive: true } }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      coordinator: 'Coordenador', 
      teacher: 'Professor',
      student: 'Estudante'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground animate-fade-in">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-muted-foreground animate-slide-up">
          Acesso como <span className="font-medium">{getRoleDisplayName(user?.role || '')}</span> • 
          Sistema Acadêmico
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={stat.key}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="animate-slide-up">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user?.role === 'admin' && (
            <>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Gerenciar Usuários</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Criar, editar e remover usuários do sistema
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Gerenciar Cursos</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Administrar cursos e coordenadores
                </p>
              </div>
            </>
          )}
          
          {user?.role === 'coordinator' && (
            <>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Gerenciar Semestres</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Criar e organizar semestres do curso
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Gerenciar Disciplinas</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Administrar disciplinas e professores
                </p>
              </div>
            </>
          )}

          {user?.role === 'teacher' && (
            <>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Minhas Disciplinas</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Visualizar e gerenciar suas disciplinas
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Gerenciar Matrículas</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Visualizar estudantes matriculados
                </p>
              </div>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Minhas Matrículas</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Visualizar disciplinas matriculadas
                </p>
              </div>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Cronograma</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Visualizar horários e calendário acadêmico
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
