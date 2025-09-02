import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  User, 
  Calendar,
  Loader2,
  Plus,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { Semester, Subject } from '@/types/course';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import CreateSubjectModal from './CreateSubjectModal';
import PermissionGuard from '@/components/common/PermissionGuard';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { formatDate } from '@/utils/dateUtils';

interface SubjectsListProps {
  courseId: string;
  semesters: Semester[];
}

interface SemesterWithSubjects extends Semester {
  subjects: Subject[];
  loading?: boolean;
}

const SubjectsList: React.FC<SubjectsListProps> = ({ courseId, semesters }) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const [semestersWithSubjects, setSemestersWithSubjects] = useState<SemesterWithSubjects[]>([]);
  const [expandedSemesters, setExpandedSemesters] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enrollingSubjects, setEnrollingSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    const initialSemesters = semesters.map(semester => ({
      ...semester,
      subjects: [],
      loading: false,
    }));
    setSemestersWithSubjects(initialSemesters);
    
    // Carregar disciplinas para todos os semestres ao montar o componente
    if (semesters.length > 0) {
      setIsLoading(true);
      const loadAllSubjects = async () => {
        try {
          await Promise.all(
            semesters.map(semester => fetchSubjectsForSemester(semester.id))
          );
        } catch (error) {
          toast.error('Erro ao carregar disciplinas');
        } finally {
          setIsLoading(false);
        }
      };
      loadAllSubjects();
    }
  }, [semesters]);

  const fetchSubjectsForSemester = async (semesterId: string) => {
    try {
      const response = await apiService.courses.getSubjects(courseId, semesterId);
      if (response.success) {
        setSemestersWithSubjects(prev => 
          prev.map(semester => 
            semester.id === semesterId 
              ? { ...semester, subjects: response.data, loading: false }
              : semester
          )
        );
      } else {
        throw new Error('Erro ao carregar disciplinas');
      }
    } catch (error) {
      setSemestersWithSubjects(prev => 
        prev.map(semester => 
          semester.id === semesterId 
            ? { ...semester, loading: false }
            : semester
        )
      );
      throw error;
    }
  };

  const toggleSemester = (semesterId: string) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semesterId)) {
      newExpanded.delete(semesterId);
    } else {
      newExpanded.add(semesterId);
    }
    setExpandedSemesters(newExpanded);
  };

  const handleSubjectCreated = () => {
    // Recarregar disciplinas para todos os semestres expandidos
    expandedSemesters.forEach(semesterId => {
      fetchSubjectsForSemester(semesterId);
    });
  };

  const handleEnrollSubject = async (subjectId: string, semesterId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setEnrollingSubjects(prev => new Set(prev).add(subjectId));

    try {
      await apiService.courses.enrollSubject(courseId, subjectId, user.id);
      
      // Atualizar estado local
      setSemestersWithSubjects(prev => 
        prev.map(semester => 
          semester.id === semesterId 
            ? {
                ...semester,
                subjects: semester.subjects.map(subject =>
                  subject.id === subjectId
                    ? { ...subject, enrolled: true }
                    : subject
                )
              }
            : semester
        )
      );

      toast.success('Inscrito na disciplina com sucesso!');
    } catch (error) {
      console.error('Erro ao inscrever na disciplina:', error);
      toast.error('Erro ao inscrever na disciplina');
    } finally {
      setEnrollingSubjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(subjectId);
        return newSet;
      });
    }
  };

  const handleUnenrollSubject = async (subjectId: string, semesterId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setEnrollingSubjects(prev => new Set(prev).add(subjectId));

    try {
      await apiService.courses.unenrollSubject(courseId, subjectId, user.id);
      
      // Atualizar estado local
      setSemestersWithSubjects(prev => 
        prev.map(semester => 
          semester.id === semesterId 
            ? {
                ...semester,
                subjects: semester.subjects.map(subject =>
                  subject.id === subjectId
                    ? { ...subject, enrolled: false }
                    : subject
                )
              }
            : semester
        )
      );

      toast.success('Desinscrição realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao desinscrever da disciplina:', error);
      toast.error('Erro ao desinscrever da disciplina');
    } finally {
      setEnrollingSubjects(prev => {
        const newSet = new Set(prev);
        newSet.delete(subjectId);
        return newSet;
      });
    }
  };



  const getCurrentSemester = () => {
    const now = new Date();
    return semestersWithSubjects.find(semester => {
      const start = new Date(semester.start_date);
      const end = new Date(semester.end_date);
      return now >= start && now <= end;
    });
  };

  const currentSemester = getCurrentSemester();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Disciplinas do Curso</h2>
          <p className="text-muted-foreground">
            Disciplinas organizadas por semestre
          </p>
        </div>
        
        <PermissionGuard resource="courses" action="createSubject">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Disciplina
          </Button>
        </PermissionGuard>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Carregando disciplinas...</h3>
            <p className="text-muted-foreground text-center">
              Aguarde enquanto carregamos as disciplinas de todos os semestres.
            </p>
          </CardContent>
        </Card>
      ) : semestersWithSubjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum semestre encontrado</h3>
            <p className="text-muted-foreground text-center">
              Não há semestres cadastrados para este curso.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {semestersWithSubjects.map((semester) => {
            const isExpanded = expandedSemesters.has(semester.id);
            const now = new Date();
            const start = new Date(semester.start_date);
            const end = new Date(semester.end_date);
            const isActive = now >= start && now <= end;
            const isPast = now > end;
            const isFuture = now < start;
            const isCurrent = currentSemester?.id === semester.id;

            return (
              <Card key={semester.id} className="overflow-hidden">
                <Collapsible open={isExpanded} onOpenChange={() => toggleSemester(semester.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {semester.code}
                              {isCurrent && (
                                <Badge variant="default" className="text-xs">
                                  Atual
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(semester.start_date)} - {formatDate(semester.end_date)}
                              </span>
                              <Badge 
                                variant={isActive ? 'default' : isPast ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {isActive ? 'Ativo' : isPast ? 'Finalizado' : 'Futuro'}
                              </Badge>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {semester.subjects.length} disciplinas
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                       {semester.subjects.length === 0 ? (
                        <div className="text-center py-8">
                          <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
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
                              <TableHead>Data de Criação</TableHead>
                              {hasPermission('courses', 'enrollSubject') && (
                                <TableHead>Ações</TableHead>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {semester.subjects.map((subject) => {
                              const isEnrolled = subject.enrolled ?? false;
                              const isProcessing = enrollingSubjects.has(subject.id);
                              
                              return (
                                <TableRow key={subject.id}>
                                  <TableCell className="font-mono">
                                    {subject.code}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {subject.name}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {subject.credits} créditos
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <User className="h-3 w-3 text-muted-foreground" />
                                      <span>{subject.teacher_name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(subject.created_at)}
                                  </TableCell>
                                  {hasPermission('courses', 'enrollSubject') && (
                                    <TableCell>
                                      {isEnrolled ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleUnenrollSubject(subject.id, semester.id)}
                                          disabled={isProcessing}
                                          className="text-destructive hover:text-destructive"
                                        >
                                          {isProcessing ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          ) : (
                                            <UserMinus className="h-3 w-3 mr-1" />
                                          )}
                                          Desinscrever-se
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEnrollSubject(subject.id, semester.id)}
                                          disabled={isProcessing}
                                          className="text-primary hover:text-primary"
                                        >
                                          {isProcessing ? (
                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                          ) : (
                                            <UserPlus className="h-3 w-3 mr-1" />
                                          )}
                                          Inscrever-se
                                        </Button>
                                      )}
                                    </TableCell>
                                  )}
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}

      <CreateSubjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        courseId={courseId}
        semesters={semesters}
        onSubjectCreated={handleSubjectCreated}
      />
    </div>
  );
};

export default SubjectsList;
