import React, { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';
import { Semester, Teacher, CreateSubjectRequest } from '@/types/course';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  semesters: Semester[];
  onSubjectCreated: () => void;
}

const CreateSubjectModal: React.FC<CreateSubjectModalProps> = ({
  isOpen,
  onClose,
  courseId,
  semesters,
  onSubjectCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [formData, setFormData] = useState<CreateSubjectRequest>({
    name: '',
    code: '',
    credits: 0,
    semesterId: '',
    teacherId: '',
  });

  useEffect(() => {
    if (isOpen && courseId) {
      fetchTeachers();
    }
  }, [isOpen, courseId]);

  const fetchTeachers = async () => {
    try {
      const response = await apiService.courses.getTeachers(courseId);
      if (response.success) {
        setTeachers(response.data);
      } else {
        toast.error('Erro ao carregar professores');
      }
    } catch (error) {
      toast.error('Erro ao carregar professores');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.semesterId || !formData.teacherId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.credits <= 0) {
      toast.error('O número de créditos deve ser maior que zero');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.courses.createSubject(courseId, formData);
      
      if (response.success) {
        toast.success('Disciplina criada com sucesso!');
        onSubjectCreated();
        onClose();
        setFormData({
          name: '',
          code: '',
          credits: 0,
          semesterId: '',
          teacherId: '',
        });
      } else {
        toast.error('Erro ao criar disciplina');
      }
    } catch (error) {
      toast.error('Erro ao criar disciplina');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateSubjectRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Nova Disciplina
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da nova disciplina para o curso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Disciplina *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Programação Web Avançada"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="Ex: PWA001"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Créditos *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => handleInputChange('credits', parseInt(e.target.value) || 0)}
                placeholder="4"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre *</Label>
              <Select
                value={formData.semesterId}
                onValueChange={(value) => handleInputChange('semesterId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Professor *</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) => handleInputChange('teacherId', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um professor" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Disciplina
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubjectModal;
