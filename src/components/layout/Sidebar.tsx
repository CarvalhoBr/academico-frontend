
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/',
      roles: ['admin', 'coordinator', 'teacher', 'student']
    },
    {
      title: 'Usuários',
      icon: Users,
      path: '/users',
      roles: ['admin', 'coordinator']
    },
    {
      title: 'Cursos',
      icon: BookOpen,
      path: '/courses',
      roles: ['admin', 'coordinator']
    },
    {
      title: 'Semestres',
      icon: Calendar,
      path: '/semesters',
      roles: ['admin', 'coordinator', 'teacher']
    },
    {
      title: 'Disciplinas',
      icon: FileText,
      path: '/subjects',
      roles: ['admin', 'coordinator', 'teacher', 'student']
    },
    {
      title: 'Matrículas',
      icon: UserCheck,
      path: '/enrollments',
      roles: ['admin', 'coordinator', 'teacher', 'student']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

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
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
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
          <div className="w-8 h-8 rounded-full bg-gradient-secondary flex items-center justify-center text-white text-sm font-medium">
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
