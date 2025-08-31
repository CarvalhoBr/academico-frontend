# Sistema de Permissões - Sistema Acadêmico

## Visão Geral

O sistema de permissões é baseado em **recursos** e **ações**. Cada usuário possui acesso a determinados recursos com ações específicas permitidas.

## Estrutura da Resposta `/auth/whoami`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "name": "Admin Sistema",
      "email": "admin@academic.com",
      "role": "admin"
    },
    "resources": [
      {
        "name": "users",
        "label": "Usuários",
        "actions": ["create", "read", "update", "delete"]
      },
      {
        "name": "courses",
        "label": "Cursos", 
        "actions": ["create", "read", "update", "delete"]
      }
    ]
  },
  "message": "User data retrieved successfully"
}
```

## Recursos Disponíveis

| Recurso | Nome | Descrição |
|---------|------|-----------|
| `users` | Usuários | Gerenciamento de usuários do sistema |
| `courses` | Cursos | Gerenciamento de cursos acadêmicos |
| `semesters` | Semestres | Gerenciamento de períodos letivos |
| `subjects` | Disciplinas | Gerenciamento de matérias/disciplinas |
| `enrollments` | Inscrições | Gerenciamento de matrículas |
| `reports` | Relatórios | Visualização e exportação de relatórios |

## Ações Disponíveis

| Ação | Descrição |
|------|-----------|
| `create` | Criar novos registros |
| `read` | Visualizar/listar registros |
| `update` | Editar registros existentes |
| `delete` | Excluir registros |
| `export` | Exportar dados |
| `import` | Importar dados |
| `approve` | Aprovar solicitações |
| `reject` | Rejeitar solicitações |
| `createSubject` | Criar disciplinas (específico para cursos) |

## Como Usar

### 1. Hook de Permissões

```tsx
import { usePermissions } from '@/contexts/PermissionsContext';

const MyComponent = () => {
  const { hasPermission, getAvailableResources } = usePermissions();
  
  // Verificar se pode criar usuários
  const canCreateUsers = hasPermission('users', 'create');
  
  // Verificar se pode criar disciplinas
  const canCreateSubjects = hasPermission('courses', 'createSubject');
  
  // Obter todos os recursos disponíveis
  const resources = getAvailableResources();
  
  return (
    <div>
      {canCreateUsers && (
        <button>Criar Usuário</button>
      )}
    </div>
  );
};
```

### 2. Hooks Específicos

```tsx
import { useHasPermission, useResourceActions } from '@/contexts/PermissionsContext';

const UserManagement = () => {
  // Verificar permissão específica
  const canDeleteUsers = useHasPermission('users', 'delete');
  
  // Obter todas as ações permitidas para um recurso
  const userActions = useResourceActions('users');
  
  return (
    <div>
      {canDeleteUsers && <button>Excluir</button>}
      <p>Ações permitidas: {userActions.join(', ')}</p>
    </div>
  );
};
```

### 3. Componente de Proteção

```tsx
import PermissionGuard from '@/components/common/PermissionGuard';

const UserList = () => {
  return (
    <div>
      <h1>Lista de Usuários</h1>
      
      {/* Botão só aparece se tiver permissão */}
      <PermissionGuard resource="users" action="create">
        <button>Novo Usuário</button>
      </PermissionGuard>
      
      {/* Com mensagem de erro */}
      <PermissionGuard 
        resource="users" 
        action="delete" 
        showError={true}
      >
        <button>Excluir Usuário</button>
      </PermissionGuard>
      
      {/* Com fallback personalizado */}
      <PermissionGuard 
        resource="users" 
        action="update"
        fallback={<p>Você não pode editar usuários</p>}
      >
        <button>Editar Usuário</button>
      </PermissionGuard>
    </div>
  );
};
```

## Fluxo de Autenticação

1. **Login**: Usuário faz login com email/senha
2. **Token**: Sistema recebe e armazena o `access_token`
3. **Whoami**: Sistema chama `/auth/whoami` automaticamente
4. **Permissões**: Recursos e ações são carregados e armazenados
5. **Interface**: Sidebar e componentes são renderizados baseados nas permissões

## Sidebar Dinâmica

A sidebar é automaticamente gerada baseada nos recursos que o usuário tem permissão de `read`. Apenas os itens permitidos aparecem no menu de navegação.

## Armazenamento Local

- **access_token**: Armazenado em `localStorage` como `access_token`
- **user**: Dados do usuário em `localStorage` como `academic_user`  
- **resources**: Permissões em `localStorage` como `user_resources`

## Tratamento de Erros

- Se o token for inválido, o usuário é redirecionado para login
- Se `/auth/whoami` falhar, permissões são limpas
- Dados locais são limpos automaticamente em caso de erro

## Exemplos de Uso por Perfil

### Administrador
```json
{
  "resources": [
    {
      "name": "users",
      "actions": ["create", "read", "update", "delete"]
    },
    {
      "name": "courses", 
      "actions": ["create", "read", "update", "delete"]
    },
    {
      "name": "reports",
      "actions": ["read", "export"]
    }
  ]
}
```

### Professor
```json
{
  "resources": [
    {
      "name": "subjects",
      "actions": ["read", "update"]
    },
    {
      "name": "enrollments",
      "actions": ["read"]
    }
  ]
}
```

### Estudante
```json
{
  "resources": [
    {
      "name": "enrollments",
      "actions": ["create", "read"]
    },
    {
      "name": "subjects",
      "actions": ["read"]
    }
  ]
}
```
