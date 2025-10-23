# 🎯 OmniObjections

Sistema inteligente de suporte a videochamadas comerciais desenvolvido para o **Grupo Areluna**.

> **Ouve em tempo real as conversas de vendas** e **sugere respostas e soluções para objeções dos leads**, utilizando IA e a base de conhecimento da clínica.

---

## 📋 Visão Geral

OmniObjections é uma plataforma completa que:

- 🎤 **Intercepta áudio** de videochamadas comerciais em tempo real
- 📝 **Transcreve conversas** usando Whisper API (OpenAI)
- 🧠 **Detecta objeções** automaticamente com NLP
- 💡 **Gera sugestões contextuais** baseadas na base de conhecimento Areluna
- 📊 **Apresenta métricas** e insights pós-chamada

---

## 🏗️ Arquitetura

```
omni-objections/
├── apps/
│   ├── web/          # Next.js 14 (App Router, Tailwind, shadcn/ui)
│   └── api/          # NestJS (REST + WebSocket)
├── packages/
│   ├── types/        # Tipos TypeScript compartilhados
│   ├── db/           # Supabase client e migrations
│   └── ai/           # Processamento de áudio, NLP, sugestões
└── pnpm-workspace.yaml
```

### Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand |
| **Backend** | NestJS, Socket.IO, TypeScript |
| **Database** | Supabase (PostgreSQL + Realtime) |
| **AI/ML** | OpenAI (Whisper + GPT-4), LangChain |
| **Infrastructure** | pnpm workspaces, Turbo |

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- pnpm 8+
- Conta OpenAI (com créditos)
- Conta Supabase

### 1. Instalação

```bash
# Clone o repositório
git clone https://github.com/grupo-areluna/omni-objections.git
cd omni-objections

# Instale as dependências
pnpm install

# Configure o Supabase local
cd packages/db
pnpm db:start
```

### 2. Configuração

Crie arquivos `.env` baseados nos `.env.example`:

**`packages/db/.env`**
```env
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_key_here
```

**`apps/api/env.example`** → **`apps/api/.env`**
```env
PORT=3001
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_key_here
OPENAI_API_KEY=sk-your-key-here
CORS_ORIGIN=http://localhost:3000
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### 3. Iniciar Database

```bash
cd packages/db

# Iniciar Supabase local
pnpm db:start

# Aplicar migrations
pnpm db:reset

# Seed com dados de exemplo
psql postgresql://postgres:postgres@localhost:54322/postgres < supabase/seed.sql
```

### 4. Executar o Projeto

```bash
# Na raiz do projeto

# Desenvolvimento (todos os apps)
pnpm dev

# Ou individualmente:
pnpm dev:web    # Frontend em http://localhost:3000
pnpm dev:api    # Backend em http://localhost:3001
```

---

## 📚 Estrutura de Packages

### `@omni/types`

Tipos TypeScript compartilhados entre frontend e backend.

```typescript
import { User, Call, Suggestion, TranscriptSegment } from '@omni/types';
```

### `@omni/db`

Cliente Supabase e repositórios para acesso ao banco de dados.

```typescript
import { getSupabaseClient, CallRepository } from '@omni/db';

const supabase = getSupabaseClient();
const callRepo = new CallRepository(supabase);
```

### `@omni/ai`

Serviços de processamento de áudio, transcrição, detecção de objeções e geração de sugestões.

```typescript
import {
  TranscriptionService,
  ObjectionDetectorService,
  SuggestionEngineService,
} from '@omni/ai';
```

---

## 🎯 Fluxo de Funcionamento

```mermaid
graph LR
    A[Videochamada] --> B[Captura Áudio]
    B --> C[WebSocket]
    C --> D[Transcrição Whisper]
    D --> E[Detecção Objeções]
    E --> F[Busca Conhecimento]
    F --> G[Geração Sugestão GPT]
    G --> H[Envio ao Frontend]
    H --> I[Exibição ao Comercial]
```

### Passo a Passo

1. **Captura de Áudio**: WebRTC captura o áudio da chamada
2. **Streaming**: Chunks enviados via WebSocket para o backend
3. **Transcrição**: Whisper API converte áudio em texto
4. **Detecção**: NLP identifica objeções nas falas do lead
5. **Busca**: Sistema consulta base de conhecimento Areluna
6. **Geração**: GPT-4 cria sugestão contextual personalizada
7. **Exibição**: Frontend mostra sugestão em tempo real

---

## 🗄️ Schema do Banco de Dados

```sql
-- Usuários
users (id, email, name, role)

-- Chamadas
calls (id, agent_id, lead_name, status, transcript, suggestions, metrics)

-- Objeções conhecidas
objections (id, keyword, category, patterns, default_reply)

-- Base de conhecimento
knowledge_items (id, type, title, content, metadata, search_vector)

-- Sugestões geradas
suggestions (id, call_id, type, suggestion, sources, confidence, feedback)
```

---

## 🔌 API Endpoints

### REST API

```
GET    /api/calls              # Listar chamadas
POST   /api/calls              # Criar chamada
GET    /api/calls/:id          # Obter chamada
PUT    /api/calls/:id          # Atualizar chamada
GET    /api/calls/:id/metrics  # Métricas da chamada

GET    /api/knowledge          # Listar conhecimento
GET    /api/knowledge/search   # Buscar conhecimento
POST   /api/knowledge          # Criar item

GET    /api/objections         # Listar objeções
POST   /api/objections         # Criar objeção

GET    /api/suggestions/call/:callId  # Sugestões de uma chamada
POST   /api/suggestions/generate      # Gerar sugestão
```

### WebSocket Events

**Cliente → Servidor:**
- `call.start` - Iniciar chamada
- `audio.chunk` - Enviar chunk de áudio
- `call.end` - Encerrar chamada

**Servidor → Cliente:**
- `transcript.segment` - Segmento transcrito
- `objection.alert` - Objeção detectada
- `suggestion` - Nova sugestão gerada
- `metrics.update` - Atualização de métricas

---

## 🧪 Testes

```bash
# Executar todos os testes
pnpm test

# Testes com coverage
pnpm test:cov

# Testes em watch mode
pnpm test:watch
```

---

## 📦 Build e Deploy

### Build de Produção

```bash
# Build completo
pnpm build

# Build individual
pnpm build:web
pnpm build:api
```

### Deploy

#### Frontend (Vercel)

```bash
cd apps/web
vercel --prod
```

#### Backend (Railway/Render)

```bash
cd apps/api
# Configurar variáveis de ambiente
# Deploy via Git
```

#### Database (Supabase Cloud)

```bash
# Criar projeto no Supabase
# Aplicar migrations
supabase db push
```

---

## 🛠️ Desenvolvimento

### Scripts Úteis

```bash
# Lint
pnpm lint

# Type check
pnpm type-check

# Limpar builds
pnpm clean

# Gerar tipos do Supabase
cd packages/db
pnpm db:gen-types
```

### Estrutura de Commits

Seguimos o padrão Conventional Commits:

```
feat: adiciona detecção de sentimento
fix: corrige buffer de áudio
docs: atualiza README
refactor: melhora performance da transcrição
```

---

## 📈 Roadmap

- [x] Transcrição em tempo real
- [x] Detecção de objeções
- [x] Geração de sugestões
- [x] Interface de chamada
- [ ] Diarização de speakers (identificar automaticamente quem fala)
- [ ] Análise de sentimento
- [ ] Integração com Google Meet/Zoom
- [ ] Dashboard de analytics avançado
- [ ] Treinamento de modelo customizado
- [ ] Mobile app (React Native)

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📄 Licença

Copyright © 2024 Grupo Areluna. Todos os direitos reservados.

---

## 👥 Equipe

Desenvolvido com ❤️ pela equipe de tecnologia do **Grupo Areluna**.

---

## 📞 Suporte

Para suporte técnico, entre em contato:
- 📧 Email: tech@areluna.com
- 💬 Slack: #omni-objections

---

## 🙏 Agradecimentos

- OpenAI pela API Whisper e GPT-4
- Supabase pelo backend open-source
- Vercel pelo hosting do Next.js
- Toda a equipe Areluna

