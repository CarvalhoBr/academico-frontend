import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ArrowLeft,
  Calendar,
  Users,
  BookOpen,
  Mail,
  Loader2,
  CalendarDays,
  User,
  Eye,
  FileText
} from 'lucide-react';
import { CourseDetail, Semester, Student } from '@/types/course';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import SubjectsList from '@/components/subjects/SubjectsList';
import { usePermissions } from '@/contexts/PermissionsContext';
import { formatDate } from '@/utils/dateUtils';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) {
        setError('ID do curso não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.courses.getById(id);
        
        if (response.success) {
          setCourse(response.data);
        } else {
          setError('Erro ao carregar detalhes do curso');
        }
      } catch (err) {
        setError('Erro ao conectar com a API');
        toast.error('Erro ao carregar curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);



  const getCurrentSemester = (semesters: Semester[]) => {
    const now = new Date();
    return semesters.find(semester => {
      const start = new Date(semester.start_date);
      const end = new Date(semester.end_date);
      return now >= start && now <= end;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando curso...</span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error || 'Curso não encontrado'}</p>
        <Button variant="outline" onClick={() => navigate('/courses')}>
          Voltar para Cursos
        </Button>
      </div>
    );
  }

  const currentSemester = getCurrentSemester(course.semesters);

  return (
    <div className="flex-1 space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/courses')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{course.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono">
                  {course.code}
                </Badge>
                {currentSemester && (
                  <Badge variant="secondary">
                    Semestre Atual: {currentSemester.code}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        

      </div>

      {/* Course Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">Descrição</h4>
                <p className="text-muted-foreground">
                  {course.description || 'Nenhuma descrição disponível'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Coordenador</h4>
                  <p className="text-muted-foreground">
                    {course.coordinator_name || 'Não definido'}
                  </p>
                  {course.coordinator_email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {course.coordinator_email}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Data de Criação</h4>
                  <p className="text-muted-foreground">
                    {formatDate(course.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          {hasPermission('courses', 'listStudents') && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{course.students.length}</div>
                  <div className="text-sm text-muted-foreground">Estudantes</div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{course.semesters.length}</div>
                <div className="text-sm text-muted-foreground">Semestres</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Disciplinas
          </TabsTrigger>
          {hasPermission('courses', 'listStudents') && (
            <TabsTrigger value="students" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Alunos ({course.students.length})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Disciplinas Tab */}
        <TabsContent value="subjects">
          <SubjectsList courseId={course.id} semesters={course.semesters} />
        </TabsContent>

        {/* Estudantes Tab */}
        {hasPermission('courses', 'listStudents') && (
          <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Estudantes do Curso</CardTitle>
              <CardDescription>
                Lista de todos os estudantes matriculados neste curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.students.length === 0 ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum estudante matriculado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Data de Matrícula</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {student.email}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(student.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        )}
      </Tabs>


    </div>
  );
};

export default CourseDetails;
