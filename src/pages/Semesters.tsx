import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Edit, 
  Trash2, 
  Calendar,
  Loader2,
  Save,
  X,
  AlertTriangle
} from 'lucide-react';
import { SemesterListItem, CreateSemesterRequest, UpdateSemesterRequest } from '@/types/course';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

const Semesters = () => {
  const [semesters, setSemesters] = useState<SemesterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState<SemesterListItem | null>(null);
  const [deletingSemester, setDeletingSemester] = useState<SemesterListItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    code: '',
    startDate: '',
    endDate: ''
  });

  // Carregar semestres da API
  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.semesters.list();
      
      if (response.success) {
        setSemesters(response.data);
      } else {
        setError('Erro ao carregar semestres');
      }
    } catch (err) {
      setError('Erro ao conectar com a API');
      toast.error('Erro ao carregar semestres');
    } finally {
      setLoading(false);
    }
  };

  const filteredSemesters = semesters.filter(semester =>
    semester.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSemesterStatus = (semester: SemesterListItem) => {
    const now = new Date();
    const start = new Date(semester.start_date);
    const end = new Date(semester.end_date);
    
    if (now >= start && now <= end) return { status: 'Ativo', variant: 'default' as const };
    if (now > end) return { status: 'Finalizado', variant: 'secondary' as const };
    return { status: 'Futuro', variant: 'outline' as const };
  };

  const handleCreate = async () => {
    if (!formData.code || !formData.startDate || !formData.endDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('A data de início deve ser anterior à data de fim');
      return;
    }

    try {
      setIsSubmitting(true);
      const requestData: CreateSemesterRequest = {
        code: formData.code,
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      const response = await apiService.semesters.create(requestData);
      
      if (response.success) {
        toast.success('Semestre criado com sucesso!');
        setIsCreateDialogOpen(false);
        setFormData({ code: '', startDate: '', endDate: '' });
        fetchSemesters();
      } else {
        toast.error('Erro ao criar semestre');
      }
    } catch (err) {
      toast.error('Erro ao conectar com a API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingSemester || !formData.startDate || !formData.endDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('A data de início deve ser anterior à data de fim');
      return;
    }

    try {
      setIsSubmitting(true);
      const requestData: UpdateSemesterRequest = {
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      const response = await apiService.semesters.update(editingSemester.id, requestData);
      
      if (response.success) {
        toast.success('Semestre atualizado com sucesso!');
        setIsEditDialogOpen(false);
        setEditingSemester(null);
        setFormData({ code: '', startDate: '', endDate: '' });
        fetchSemesters();
      } else {
        toast.error('Erro ao atualizar semestre');
      }
    } catch (err) {
      toast.error('Erro ao conectar com a API');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingSemester) return;

    try {
      setIsSubmitting(true);
      await apiService.semesters.delete(deletingSemester.id);
      
      toast.success('Semestre excluído com sucesso!');
      setDeletingSemester(null);
      fetchSemesters();
    } catch (err) {
      toast.error('Erro ao excluir semestre');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (semester: SemesterListItem) => {
    setEditingSemester(semester);
    setFormData({
      code: semester.code,
      startDate: semester.start_date.split('T')[0],
      endDate: semester.end_date.split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Carregando semestres...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={fetchSemesters}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Semestres</h1>
          <p className="text-muted-foreground">
            Gerencie os semestres acadêmicos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Novo Semestre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Semestre</DialogTitle>
              <DialogDescription>
                Preencha as informações para criar um novo semestre acadêmico.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Código do Semestre</Label>
                <Input
                  id="code"
                  placeholder="Ex: 2025-01"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreate} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Criar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar semestres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Semesters Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Semestres</CardTitle>
          <CardDescription>
            Todos os semestres cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSemesters.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum semestre encontrado' : 'Nenhum semestre cadastrado'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Data de Fim</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSemesters.map((semester) => {
                  const status = getSemesterStatus(semester);
                  
                  return (
                    <TableRow key={semester.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {semester.code}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(semester.start_date)}</TableCell>
                      <TableCell>{formatDate(semester.end_date)}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(semester)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Semestre</DialogTitle>
                                <DialogDescription>
                                  Atualize as informações do semestre {semester.code}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="editCode">Código do Semestre</Label>
                                  <Input
                                    id="editCode"
                                    value={formData.code}
                                    disabled
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editStartDate">Data de Início</Label>
                                  <Input
                                    id="editStartDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editEndDate">Data de Fim</Label>
                                  <Input
                                    id="editEndDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleEdit} disabled={isSubmitting}>
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Salvando...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="mr-2 h-4 w-4" />
                                      Salvar
                                    </>
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingSemester(semester)}
                              >
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o semestre <strong>{semester.code}</strong>?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingSemester(null)}>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  disabled={isSubmitting}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Excluindo...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </>
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Semesters;
