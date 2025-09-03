import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { apiService } from '@/services/api';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { User, Course } from '@/types/academic';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userCourses, setUserCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const fetchUserCourses = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoadingCourses(true);
      const response = await apiService.users.getCourses(user.id);
      if (response.success) {
        setUserCourses(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos do usuário:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  }, [user]);

  const fetchAvailableCourses = useCallback(async () => {
    try {
      const response = await apiService.courses.list();
      if (response.success) {
        setAvailableCourses(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos disponíveis:', error);
    }
  }, []);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
      });
      fetchUserCourses();
      fetchAvailableCourses();
    }
  }, [user, isOpen, fetchUserCourses, fetchAvailableCourses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.name || !formData.email) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.users.update(user.id, {
        name: formData.name,
        email: formData.email,
        role: user.role,
      });

      if (response.success) {
        toast.success('Usuário atualizado com sucesso!');
        onSuccess();
        handleClose();
      } else {
        throw new Error(response.message || 'Erro ao atualizar usuário');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!user || !selectedCourseId) return;

    try {
      const response = await apiService.users.addCourse(user.id, selectedCourseId);
      if (response.success) {
        toast.success('Curso adicionado com sucesso!');
        setSelectedCourseId('');
        fetchUserCourses();
      } else {
        throw new Error(response.message || 'Erro ao adicionar curso');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar curso';
      toast.error(errorMessage);
    }
  };

  const handleRemoveCourse = async (courseId: string) => {
    if (!user) return;

    try {
      await apiService.users.removeCourse(user.id, courseId);
      toast.success('Curso removido com sucesso!');
      fetchUserCourses();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover curso';
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
    });
    setSelectedCourseId('');
    setUserCourses([]);
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário e gerencie seus cursos.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Perfil</Label>
                <Input
                  value={user.role === 'admin' ? 'Administrador' : 
                         user.role === 'coordinator' ? 'Coordenador' : 
                         user.role === 'teacher' ? 'Professor' : 'Estudante'}
                  disabled
                  className="bg-muted"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCourses
                      .filter(course => !userCourses.find(uc => uc.id === course.id))
                      .map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAddCourse} 
                  disabled={!selectedCourseId}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Cursos Vinculados</Label>
                {isLoadingCourses ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : userCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Nenhum curso vinculado
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userCourses.map(course => (
                      <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-muted-foreground">{course.code}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCourse(course.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
