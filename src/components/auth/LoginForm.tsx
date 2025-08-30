
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GraduationCap, Loader2 } from 'lucide-react';

const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!email.trim() || !password.trim()) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      await login(email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      // O erro já é tratado no contexto, apenas exibir toast
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Sistema Acadêmico</h1>
          <p className="text-muted-foreground mt-2">Faça login para continuar</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle>Entrar na conta</CardTitle>
            <CardDescription>
              Use suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground text-center">
                Contas de demonstração:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('admin@academic.com')}
                  className="h-auto p-2 flex-col"
                >
                  <span className="font-medium">Admin</span>
                  <span className="text-muted-foreground">admin@academic.com</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('coord@academic.com')}
                  className="h-auto p-2 flex-col"
                >
                  <span className="font-medium">Coordenador</span>
                  <span className="text-muted-foreground">coord@academic.com</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('teacher@academic.com')}
                  className="h-auto p-2 flex-col"
                >
                  <span className="font-medium">Professor</span>
                  <span className="text-muted-foreground">teacher@academic.com</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickLogin('student@academic.com')}
                  className="h-auto p-2 flex-col"
                >
                  <span className="font-medium">Estudante</span>
                  <span className="text-muted-foreground">student@academic.com</span>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Senha para todos: <code className="bg-muted px-1 rounded">admin123</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
