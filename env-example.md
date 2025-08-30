# Configuração de Variáveis de Ambiente

Para configurar a integração com a API, crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=10000

# Environment
VITE_NODE_ENV=development
```

## Variáveis Disponíveis:

- **VITE_API_BASE_URL**: URL base da sua API (padrão: http://localhost:3000/api)
- **VITE_API_TIMEOUT**: Timeout para requisições em milissegundos (padrão: 10000)
- **VITE_NODE_ENV**: Ambiente de execução (development, production)

## Exemplo de uso:

1. Copie este arquivo para `.env` na raiz do projeto
2. Ajuste a URL da API conforme seu servidor
3. Reinicie o servidor de desenvolvimento

## Endpoints esperados pela API:

- `POST /auth/login` - Login do usuário
- `POST /auth/logout` - Logout do usuário  
- `GET /auth/me` - Informações do usuário atual
- `POST /auth/refresh` - Renovar token de acesso
