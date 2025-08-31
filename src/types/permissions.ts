// Tipos para sistema de permissões e recursos

export type ResourceAction = 
  | 'create' 
  | 'read' 
  | 'update' 
  | 'delete' 
  | 'export'
  | 'import'
  | 'approve'
  | 'reject'
  | 'createSubject';

export interface Resource {
  name: string;
  label: string;
  actions: ResourceAction[];
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface WhoAmIResponse {
  success: boolean;
  data: {
    user: UserData;
    resources: Resource[];
  };
  message: string;
}

// Tipos para controle de permissões
export interface PermissionCheck {
  resource: string;
  action: ResourceAction;
}

// Interface para contexto de permissões
export interface PermissionsContextType {
  resources: Resource[];
  hasPermission: (resource: string, action: ResourceAction) => boolean;
  getResourceActions: (resource: string) => ResourceAction[];
  getAvailableResources: () => Resource[];
}

// Mapeamento de recursos para rotas
export const RESOURCE_ROUTES: Record<string, string> = {
  users: '/users',
  courses: '/courses',
  semesters: '/semesters',
} as const;

// Mapeamento de recursos para ícones (para usar na sidebar)
export const RESOURCE_ICONS: Record<string, string> = {
  users: 'Users',
  courses: 'BookOpen',
  semesters: 'Calendar',
} as const;
