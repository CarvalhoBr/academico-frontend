
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  BookOpen,
  Users,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { Course } from '@/types/academic';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - replace with API call
  const mockCourses: Course[] = [
    {
      id: 'course-1',
      name: 'Ciência da Computação',
      code: 'CC',
      description: 'Curso de graduação em Ciência da Computação com foco em programação, algoritmos e sistemas.',
      coordinatorId: 'coord-1',
      coordinatorName: 'Dr. Maria Santos',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z'
    },
    {
      id: 'course-2',
      name: 'Sistemas de Informação',
      code: 'SI',
      description: 'Curso voltado para análise, desenvolvimento e gestão de sistemas de informação.',
      coordinatorId: 'coord-2',
      coordinatorName: 'Prof. João Silva',
      createdAt: '2024-02-10T14:30:00Z',
      updatedAt: '2025-01-10T14:30:00Z'
    },
    {
      id: 'course-3',
      name: 'Análise e Desenvolvimento de Sistemas',
      code: 'ADS',
      description: 'Curso tecnológico focado no desenvolvimento de software e aplicações.',
      coordinatorId: 'coord-3',
      coordinatorName: 'Dra. Ana Costa',
      createdAt: '2024-03-05T09:15:00Z',
      updatedAt: '2025-01-05T09:15:00Z'
    },
    {
      id: 'course-4',
      name: 'Engenharia de Software',
      code: 'ES',
      description: 'Curso focado em metodologias e práticas de engenharia para desenvolvimento de software.',
      coordinatorName: 'Em definição',
      createdAt: '2024-12-20T16:45:00Z',
      updatedAt: '2024-12-20T16:45:00Z'
    }
  ];

  const filteredCourses = mockCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.coordinatorName && course.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mock statistics for each course
  const getCourseStats = (courseId: string) => {
    const stats = {
      'course-1': { students: 120, subjects: 28, semesters: 8 },
      'course-2': { students: 95, subjects: 24, semesters: 8 },
      'course-3': { students: 150, subjects: 18, semesters: 6 },
      'course-4': { students: 0, subjects: 0, semesters: 0 }
    };
    return stats[courseId as keyof typeof stats] || { students: 0, subjects: 0, semesters: 0 };
  };

  return (
    <div className="flex-1 space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Cursos</h1>
          <p className="text-muted-foreground">
            Gerencie os cursos do sistema acadêmico
          </p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course, index) => {
          const stats = getCourseStats(course.id);
          
          return (
            <Card 
              key={course.id}
              className="animate-slide-up hover:shadow-lg transition-shadow duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      {course.name}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-mono">
                      {course.code}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {course.description && (
                  <CardDescription className="text-sm line-clamp-2">
                    {course.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Coordinator */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Coordenador:</span>
                  <span className="font-medium text-foreground">
                    {course.coordinatorName || 'Não definido'}
                  </span>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="text-lg font-semibold text-foreground">{stats.students}</div>
                    <div className="text-xs text-muted-foreground">Estudantes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-lg font-semibold text-foreground">{stats.subjects}</div>
                    <div className="text-xs text-muted-foreground">Disciplinas</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="h-4 w-4 text-warning" />
                    </div>
                    <div className="text-lg font-semibold text-foreground">{stats.semesters}</div>
                    <div className="text-xs text-muted-foreground">Semestres</div>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Criado em {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="animate-slide-up">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum curso encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Não há cursos que correspondam aos seus critérios de busca.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Courses;
