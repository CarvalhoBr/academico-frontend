import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Save, 
  Loader2, 
  User, 
  Mail, 
  BookOpen,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { User as UserType, Course } from '@/types/academic';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { formatDate } from '@/utils/dateUtils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const EditUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [user, setUser] = useState<UserType | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isRemovingCourse, setIsRemovingCourse] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchAvailableCourses();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar dados do usuário
      const userResponse = await apiService.users.getById(userId!);
      if (userResponse.success) {
        setUser(userResponse.data);
      } else {
        throw new Error(userResponse.message || 'Erro ao carregar usuário');
      }

      // Buscar cursos vinculados ao usuário
      const coursesResponse = await apiService.users.getCourses(userId!);
      if (coursesResponse.success) {
        setCourses(coursesResponse.data);
      } else {
        throw new Error(coursesResponse.message || 'Erro ao carregar cursos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados do usuário';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await apiService.courses.list();
      if (response.success) {
        setAvailableCourses(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos disponíveis:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      const response = await apiService.users.update(userId!, {
        name: user.name,
        email: user.email, // Mantém o email original
        role: user.role
      });

      if (response.success) {
        toast.success('Usuário atualizado com sucesso!');
        navigate('/users');
      } else {
        throw new Error(response.message || 'Erro ao atualizar usuário');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCourse = async () => {
    if (!selectedCourseId) return;

    try {
      setIsAddingCourse(true);
      const response = await apiService.users.addCourse(userId!, selectedCourseId);
      
      if (response.success) {
        toast.success('Curso vinculado com sucesso!');
        setSelectedCourseId('');
        fetchUserData(); // Recarregar dados
      } else {
        throw new Error(response.message || 'Erro ao vincular curso');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao vincular curso';
      toast.error(errorMessage);
    } finally {
      setIsAddingCourse(false);
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    try {
      setIsRemovingCourse(true);
      const response = await apiService.users.removeCourse(userId!, courseId);
      
      if (response.success) {
        toast.success('Curso removido com sucesso!');
        fetchUserData(); // Recarregar dados
      } else {
        throw new Error(response.message || 'Erro ao remover curso');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover curso';
      toast.error(errorMessage);
    } finally {
      setIsRemovingCourse(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      coordinator: 'Coordenador',
      teacher: 'Professor',
      student: 'Estudante'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'coordinator':
        return 'default';
      case 'teacher':
        return 'secondary';
      case 'student':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getAvailableCoursesForSelection = () => {
    return availableCourses.filter(course => 
      !courses.some(userCourse => userCourse.id === course.id)
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Carregando usuário...</h3>
            <p className="text-muted-foreground text-center">
              Aguarde enquanto carregamos os dados do usuário.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar usuário</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchUserData} variant="outline">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Editar Usuário</h1>
          <p className="text-muted-foreground">
            Edite as informações do usuário e gerencie cursos vinculados
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informações do Usuário
            </CardTitle>
            <CardDescription>
              Edite as informações básicas do usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Nome do usuário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
                placeholder="Email do usuário"
              />
              <p className="text-xs text-muted-foreground">
                O email não pode ser alterado por questões de segurança
              </p>
            </div>

            <div className="space-y-2">
              <Label>Perfil</Label>
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  (Não pode ser alterado)
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Data de Criação</Label>
              <p className="text-sm text-muted-foreground">
                {formatDate(user.created_at)}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Última Atualização</Label>
              <p className="text-sm text-muted-foreground">
                {formatDate(user.updated_at)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cursos Vinculados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Cursos Vinculados
            </CardTitle>
            <CardDescription>
              Gerencie os cursos vinculados a este usuário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar Curso */}
            <div className="space-y-2">
              <Label htmlFor="course-select">Adicionar Curso</Label>
              <div className="flex gap-2">
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCoursesForSelection().map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAddCourse} 
                  disabled={!selectedCourseId || isAddingCourse}
                  size="sm"
                >
                  {isAddingCourse ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Lista de Cursos */}
            <div className="space-y-2">
              <Label>Cursos Vinculados ({courses.length})</Label>
              {courses.length === 0 ? (
                <div className="text-center py-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum curso vinculado
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">
                          {course.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.code}</Badge>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={isRemovingCourse}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover Curso</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover o curso "{course.name}" deste usuário?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveCourse(course.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditUser;
