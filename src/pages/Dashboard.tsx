
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - in real app, fetch from API
  const stats = {
    totalUsers: 156,
    totalCourses: 12,
    totalSubjects: 89,
    totalEnrollments: 342
  };

  const recentActivities = [
    {
      id: 1,
      type: 'enrollment',
      description: 'Nova matrícula em Algoritmos e Estruturas de Dados',
      time: '2 minutos atrás',
      user: 'Ana Silva'
    },
    {
      id: 2,
      type: 'course',
      description: 'Novo curso criado: Engenharia de Software',
      time: '15 minutos atrás',
      user: 'João Santos'
    },
    {
      id: 3,
      type: 'subject',
      description: 'Disciplina atualizada: Banco de Dados II',
      time: '1 hora atrás',
      user: 'Maria Costa'
    }
  ];

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Painel Administrativo',
          description: 'Gerencie todo o sistema acadêmico',
          stats: [
            { title: 'Total de Usuários', value: stats.totalUsers, icon: Users, trend: { value: 8, isPositive: true } },
            { title: 'Cursos Ativos', value: stats.totalCourses, icon: BookOpen, trend: { value: 2, isPositive: true } },
            { title: 'Disciplinas', value: stats.totalSubjects, icon: FileText, trend: { value: 12, isPositive: true } },
            { title: 'Matrículas', value: stats.totalEnrollments, icon: GraduationCap, trend: { value: 15, isPositive: true } }
          ]
        };
      case 'coordinator':
        return {
          title: 'Painel do Coordenador',
          description: 'Gerencie seu curso e disciplinas',
          stats: [
            { title: 'Estudantes', value: 87, icon: Users, trend: { value: 5, isPositive: true } },
            { title: 'Professores', value: 12, icon: Users, trend: { value: 0, isPositive: true } },
            { title: 'Disciplinas', value: 24, icon: FileText, trend: { value: 8, isPositive: true } },
            { title: 'Matrículas Ativas', value: 156, icon: GraduationCap, trend: { value: 12, isPositive: true } }
          ]
        };
      case 'teacher':
        return {
          title: 'Painel do Professor',
          description: 'Acompanhe suas disciplinas e alunos',
          stats: [
            { title: 'Minhas Disciplinas', value: 4, icon: FileText },
            { title: 'Total de Alunos', value: 89, icon: Users },
            { title: 'Aulas Esta Semana', value: 12, icon: Calendar },
            { title: 'Atividades Pendentes', value: 7, icon: Clock }
          ]
        };
      case 'student':
        return {
          title: 'Painel do Estudante',
          description: 'Acompanhe suas disciplinas e progresso',
          stats: [
            { title: 'Disciplinas Matriculadas', value: 6, icon: FileText },
            { title: 'Créditos Este Semestre', value: 24, icon: Award },
            { title: 'Próximas Aulas', value: 8, icon: Calendar },
            { title: 'Atividades Pendentes', value: 3, icon: Clock }
          ]
        };
      default:
        return {
          title: 'Dashboard',
          description: 'Bem-vindo ao sistema',
          stats: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="flex-1 space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          {getWelcomeMessage()}, {user?.name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          {content.description}
        </p>
      </div>

      {/* Stats Grid */}
      {content.stats.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas atividades no sistema acadêmico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={activity.id}
                className="flex items-center space-x-4 p-3 rounded-lg bg-accent/50 transition-colors hover:bg-accent/70"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.time}</span>
                    <span>•</span>
                    <span>{activity.user}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.role === 'admin' && (
              <>
                <div className="p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Criar Usuário</div>
                  <div className="text-xs text-muted-foreground">Adicionar novo usuário ao sistema</div>
                </div>
                <div className="p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Novo Curso</div>
                  <div className="text-xs text-muted-foreground">Criar um novo curso</div>
                </div>
              </>
            )}
            {['coordinator', 'admin'].includes(user?.role || '') && (
              <div className="p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                <div className="text-sm font-medium">Nova Disciplina</div>
                <div className="text-xs text-muted-foreground">Criar uma nova disciplina</div>
              </div>
            )}
            {user?.role === 'student' && (
              <>
                <div className="p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Minhas Disciplinas</div>
                  <div className="text-xs text-muted-foreground">Ver disciplinas matriculadas</div>
                </div>
                <div className="p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <div className="text-sm font-medium">Nova Matrícula</div>
                  <div className="text-xs text-muted-foreground">Matricular em disciplina</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
