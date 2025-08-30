import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { ResourceAction } from '@/types/permissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  children: React.ReactNode;
  resource: string;
  action: ResourceAction;
  fallback?: React.ReactNode;
  showError?: boolean;
}

/**
 * Componente para proteger conteúdo baseado em permissões
 * 
 * @param children - Conteúdo a ser renderizado se o usuário tiver permissão
 * @param resource - Nome do recurso (ex: 'users', 'courses')
 * @param action - Ação requerida (ex: 'create', 'update', 'delete')
 * @param fallback - Componente alternativo se não tiver permissão
 * @param showError - Se deve mostrar mensagem de erro (padrão: false)
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  resource,
  action,
  fallback = null,
  showError = false,
}) => {
  const { hasPermission } = usePermissions();

  const hasRequiredPermission = hasPermission(resource, action);

  if (!hasRequiredPermission) {
    if (showError) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Você não tem permissão para {action === 'create' ? 'criar' : 
                                      action === 'update' ? 'editar' : 
                                      action === 'delete' ? 'excluir' : 
                                      action === 'read' ? 'visualizar' : 'acessar'} este recurso.
          </AlertDescription>
        </Alert>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
