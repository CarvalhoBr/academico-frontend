import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { CreateCourseRequest } from '@/types/course';
import { User } from '@/types/academic';

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [formData, setFormData] = useState<CreateCourseRequest>({
    name: '',
    code: '',
    description: '',
    coordinator_id: undefined,
  });

  useEffect(() => {
    if (open) {
      fetchCoordinators();
    }
  }, [open]);

  const fetchCoordinators = async () => {
    try {
      const response = await apiService.users.listByRole('coordinator');
      if (response.success) {
        setCoordinators(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar coordenadores');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error('Nome e código são obrigatórios');
      return;
    }

    if (formData.name.length < 2 || formData.name.length > 100) {
      toast.error('Nome deve ter entre 2 e 100 caracteres');
      return;
    }

    if (formData.code.length < 2 || formData.code.length > 10) {
      toast.error('Código deve ter entre 2 e 10 caracteres');
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(formData.code)) {
      toast.error('Código deve conter apenas letras e números');
      return;
    }

    if (formData.description && formData.description.length > 500) {
      toast.error('Descrição deve ter no máximo 500 caracteres');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.courses.create(formData);
      
      if (response.success) {
        toast.success('Curso criado com sucesso!');
        onSuccess();
        onOpenChange(false);
        resetForm();
      } else {
        toast.error(response.message || 'Erro ao criar curso');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar curso');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      coordinator_id: undefined,
    });
  };

  const handleInputChange = (field: keyof CreateCourseRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Curso
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo curso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome do curso"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="CÓDIGO"
                maxLength={10}
                className="font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição opcional do curso"
              maxLength={500}
              rows={3}
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.description?.length || 0}/500
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinator">Coordenador</Label>
            <Select
              value={formData.coordinator_id || 'none'}
              onValueChange={(value) => handleInputChange('coordinator_id', value === 'none' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um coordenador (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum coordenador</SelectItem>
                {coordinators.map((coordinator) => (
                  <SelectItem key={coordinator.id} value={coordinator.id}>
                    {coordinator.name} ({coordinator.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Curso
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
