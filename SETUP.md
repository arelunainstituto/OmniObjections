# 🛠️ Guia de Setup - OmniObjections

Este guia detalha o processo completo de configuração do ambiente de desenvolvimento.

---

## 📋 Pré-requisitos

### Ferramentas Necessárias

- **Node.js** 18.x ou superior ([Download](https://nodejs.org/))
- **pnpm** 8.x ou superior ([Instalação](https://pnpm.io/installation))
- **Git** ([Download](https://git-scm.com/))
- **Docker** (opcional, para Supabase local) ([Download](https://www.docker.com/))

### Contas Necessárias

1. **OpenAI Account** com créditos
   - Criar em: https://platform.openai.com/
   - Gerar API Key

2. **Supabase Account** (para produção)
   - Criar em: https://supabase.com/
   - Ou usar localmente com Docker

---

## 🚀 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/grupo-areluna/omni-objections.git
cd omni-objections
```

### 2. Instale pnpm (se necessário)

```bash
npm install -g pnpm
```

### 3. Instale Dependências

```bash
pnpm install
```

Isso instalará todas as dependências dos workspaces:
- `apps/web`
- `apps/api`
- `packages/types`
- `packages/db`
- `packages/ai`

---

## 🗄️ Configuração do Banco de Dados

### Opção A: Supabase Local (Recomendado para Dev)

1. **Instale Supabase CLI**

```bash
pnpm add -g supabase
```

2. **Inicie Supabase Localmente**

```bash
cd packages/db
pnpm db:start
```

Isso iniciará:
- PostgreSQL na porta `54322`
- Studio UI em `http://localhost:54323`
- API em `http://localhost:54321`

3. **Aplique Migrations**

```bash
pnpm db:reset
```

4. **Insira Dados de Exemplo**

```bash
# Via psql
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql

# Ou via Studio UI
# Acesse http://localhost:54323 e execute o SQL manualmente
```

### Opção B: Supabase Cloud

1. Crie um projeto em https://supabase.com/
2. Copie as credenciais (URL e anon key)
3. Configure no `.env` (veja abaixo)
4. Aplique migrations:

```bash
cd packages/db
supabase link --project-ref your-project-id
supabase db push
```

---

## ⚙️ Configuração de Variáveis de Ambiente

### 1. Backend API (`apps/api/.env`)

Copie o arquivo de exemplo:

```bash
cd apps/api
cp env.example .env
```

Edite `.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx

# CORS
CORS_ORIGIN=http://localhost:3000
```

**⚠️ IMPORTANTE**: Substitua `OPENAI_API_KEY` pela sua chave real da OpenAI.

### 2. Frontend Web (`apps/web/.env.local`)

```bash
cd apps/web
touch .env.local
```

Adicione:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Database (`packages/db/.env`)

```bash
cd packages/db
touch .env
```

Adicione:

```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🏃 Executando o Projeto

### Opção 1: Executar Tudo (Recomendado)

Na raiz do projeto:

```bash
pnpm dev
```

Isso iniciará:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- WebSocket: ws://localhost:3001

### Opção 2: Executar Separadamente

Terminal 1 - Frontend:
```bash
pnpm dev:web
```

Terminal 2 - Backend:
```bash
pnpm dev:api
```

---

## ✅ Verificação

### 1. Verificar Backend

```bash
curl http://localhost:3001/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "OmniObjections API",
  "version": "1.0.0"
}
```

### 2. Verificar Frontend

Acesse: http://localhost:3000

Você deve ver a landing page do OmniObjections.

### 3. Verificar Banco de Dados

Acesse o Supabase Studio: http://localhost:54323

- Usuário: `postgres`
- Senha: `postgres`

Verifique se as tabelas foram criadas:
- `users`
- `calls`
- `objections`
- `knowledge_items`
- `suggestions`

---

## 🧪 Testando a Aplicação

### 1. Criar Usuário de Teste

No Supabase Studio (http://localhost:54323), execute:

```sql
INSERT INTO users (email, name, role) VALUES
  ('comercial@test.com', 'Comercial Teste', 'comercial');
```

### 2. Testar Transcrição

```bash
# Na raiz do projeto
cd packages/ai
pnpm test
```

### 3. Testar API

```bash
cd apps/api
pnpm test
```

---

## 🐛 Troubleshooting

### Problema: Porta já em uso

```bash
# Listar processos nas portas
lsof -i :3000
lsof -i :3001
lsof -i :54321

# Matar processo
kill -9 <PID>
```

### Problema: Supabase não inicia

```bash
# Parar todos os containers
cd packages/db
pnpm db:stop

# Limpar volumes
docker volume prune

# Reiniciar
pnpm db:start
```

### Problema: Erro de OpenAI API

Verifique:
1. Sua chave API está correta
2. Você tem créditos disponíveis
3. A chave está no arquivo `.env` correto

### Problema: WebSocket não conecta

Verifique:
1. Backend está rodando
2. URL do WebSocket está correta no frontend
3. CORS está configurado corretamente

---

## 📝 Próximos Passos

Depois do setup:

1. ✅ Explorar a documentação no [README.md](./README.md)
2. ✅ Ver exemplos de uso na pasta `examples/`
3. ✅ Ler a arquitetura em [ARCHITECTURE.md](./ARCHITECTURE.md)
4. ✅ Contribuir! Veja [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🆘 Suporte

Problemas? Entre em contato:

- 📧 Email: tech@areluna.com
- 💬 Slack: #omni-objections
- 🐛 Issues: https://github.com/grupo-areluna/omni-objections/issues

---

**Pronto!** Seu ambiente está configurado e você pode começar a desenvolver! 🎉

