import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resource, ResourceAction, PermissionsContextType } from '@/types/permissions';

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: React.ReactNode;
  resources: Resource[];
}

export function PermissionsProvider({ children, resources }: PermissionsProviderProps) {
  const [userResources, setUserResources] = useState<Resource[]>(resources);

  // Atualizar recursos quando mudarem
  useEffect(() => {
    setUserResources(resources);
  }, [resources]);

  /**
   * Verifica se o usuário tem permissão para uma ação específica em um recurso
   */
  const hasPermission = (resourceName: string, action: ResourceAction): boolean => {
    const resource = userResources.find(r => r.name === resourceName);
    return resource ? resource.actions.includes(action) : false;
  };

  /**
   * Obtém todas as ações permitidas para um recurso
   */
  const getResourceActions = (resourceName: string): ResourceAction[] => {
    const resource = userResources.find(r => r.name === resourceName);
    return resource ? resource.actions : [];
  };

  /**
   * Obtém todos os recursos disponíveis para o usuário
   */
  const getAvailableResources = (): Resource[] => {
    return userResources;
  };

  return (
    <PermissionsContext.Provider 
      value={{ 
        resources: userResources, 
        hasPermission, 
        getResourceActions, 
        getAvailableResources 
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}

// Hook para verificar permissões específicas
export function useHasPermission(resourceName: string, action: ResourceAction): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(resourceName, action);
}

// Hook para obter ações de um recurso específico
export function useResourceActions(resourceName: string): ResourceAction[] {
  const { getResourceActions } = usePermissions();
  return getResourceActions(resourceName);
}
