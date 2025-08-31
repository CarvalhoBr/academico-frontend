import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  BookOpen,
  Mail,
  Loader2,
  GraduationCap,
  Clock,
  User
} from 'lucide-react';
import { Subject } from '@/types/course';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

const Subjects = () => {
  const { courseId, semesterId } = useParams<{ courseId: string; semesterId: string }>();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseInfo, setCourseInfo] = useState<{ name: string; code: string; semesterCode: string } | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!courseId || !semesterId) {
        setError('Parâmetros inválidos');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await apiService.courses.getSubjects(courseId, semesterId);
        
        if (response.success) {
          setSubjects(response.data);
          // Extrair informações do curso e semestre do primeiro item (se existir)
          if (response.data.length > 0) {
            const firstSubject = response.data[0];
            setCourseInfo({
              name: firstSubject.course_name,
              code: firstSubject.course_code,
              semesterCode: firstSubject.semester_code
            });
          }
        } else {
          setError('Erro ao carregar disciplinas');
        }
      } catch (err) {
        setError('Erro ao conectar com a API');
        toast.error('Erro ao carregar disciplinas');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [courseId, semesterId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando disciplinas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
          Voltar para o Curso
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/courses/${courseId}`)}
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
              <h1 className="text-3xl font-bold text-foreground">Disciplinas</h1>
              {courseInfo && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="font-mono">
                    {courseInfo.code}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{courseInfo.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="secondary">
                    Semestre {courseInfo.semesterCode}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">{subjects.length}</div>
              <div className="text-sm text-muted-foreground">Disciplinas</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {subjects.reduce((total, subject) => total + subject.credits, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Créditos Totais</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <User className="h-8 w-8 text-warning" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {new Set(subjects.map(s => s.teacher_id)).size}
              </div>
              <div className="text-sm text-muted-foreground">Professores</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Disciplinas</CardTitle>
          <CardDescription>
            Disciplinas oferecidas neste semestre
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma disciplina cadastrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {subject.code}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <span className="font-medium">{subject.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {subject.credits} créditos
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium">
                          {subject.teacher_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm">{subject.teacher_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {subject.teacher_email}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;
