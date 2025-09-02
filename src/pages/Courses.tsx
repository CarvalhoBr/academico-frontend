
import React, { useState, useEffect } from 'react';
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
  MoreHorizontal,
  Eye,
  Loader2
} from 'lucide-react';
import { Course } from '@/types/course';
import { apiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@/utils/dateUtils';
import { usePermissions } from '@/contexts/PermissionsContext';
import CreateCourseModal from '@/components/courses/CreateCourseModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.courses.list();
      
      if (response.success) {
        setCourses(response.data);
      } else {
        setError('Erro ao carregar cursos');
      }
    } catch (err) {
      setError('Erro ao conectar com a API');
    } finally {
      setLoading(false);
    }
  };

  // Carregar cursos da API
  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.coordinator_name && course.coordinator_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
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
        {hasPermission('courses', 'create') && (
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Curso
          </Button>
        )}
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

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Carregando cursos...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => {
          
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
                      <DropdownMenuItem onClick={() => handleViewCourse(course.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </DropdownMenuItem>
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
                    {course.coordinator_name || 'Não definido'}
                  </span>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                  </Button>
                </div>

                {/* Creation Date */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Criado em {formatDate(course.created_at)}
                </div>
              </CardContent>
            </Card>
          );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredCourses.length === 0 && (
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

      <CreateCourseModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={fetchCourses}
      />
    </div>
  );
};

export default Courses;
