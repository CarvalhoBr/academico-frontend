
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/contexts/PermissionsContext';
import { RESOURCE_ROUTES } from '@/types/permissions';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText,
  UserCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { user, logout } = useAuth();
  const { getAvailableResources, hasPermission } = usePermissions();
  const location = useLocation();
  const navigate = useNavigate();

  // Mapear recursos para ícones
  const getResourceIcon = (resourceName: string) => {
    switch (resourceName) {
      case 'users': return Users;
      case 'courses': return BookOpen;
      case 'semesters': return Calendar;
      case 'subjects': return FileText;
      case 'enrollments': return UserCheck;
      case 'reports': return FileText;
      default: return FileText;
    }
  };

  // Criar itens de navegação baseados nas permissões do usuário
  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      isAllowed: true // Dashboard sempre visível
    },
    ...getAvailableResources()
      .filter(resource => hasPermission(resource.name, 'read')) // Só mostrar se tem permissão de leitura
      .map(resource => ({
        title: resource.label,
        icon: getResourceIcon(resource.name),
        path: RESOURCE_ROUTES[resource.name] || `/${resource.name}`,
        isAllowed: true,
        resource: resource.name
      }))
  ];

  const filteredItems = navigationItems.filter(item => item.isAllowed);

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      coordinator: 'Coordenador',
      teacher: 'Professor',
      student: 'Estudante'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <div className={cn(
      "flex h-full w-64 flex-col border-r bg-sidebar shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sidebar-foreground">Academic</span>
          <span className="text-xs text-sidebar-foreground/60">Sistema</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-11",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-medium">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60">
              {getRoleDisplayName(user?.role || '')}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-destructive border-destructive/20 hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
