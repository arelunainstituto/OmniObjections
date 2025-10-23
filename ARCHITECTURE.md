# 🏛️ Arquitetura - OmniObjections

Documentação técnica da arquitetura do sistema.

---

## 📐 Visão Geral

OmniObjections é construído como um **monorepo modular** usando **pnpm workspaces**, com separação clara entre frontend, backend e bibliotecas compartilhadas.

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Landing Page │  │  Dashboard   │  │  Call UI     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────┬────────────────────────────────────────────┘
             │ REST + WebSocket
             │
┌────────────▼────────────────────────────────────────────┐
│                   BACKEND (NestJS)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  REST API    │  │  WebSocket   │  │  AI Engine   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────┬────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│                 DATABASE (Supabase)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  PostgreSQL  │  │   Realtime   │  │   Storage    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│              EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ OpenAI API   │  │  Whisper API │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Princípios de Design

1. **Modularidade**: Código organizado em packages independentes
2. **Type Safety**: TypeScript em toda a codebase
3. **Real-time First**: WebSocket para comunicação bidirecional
4. **AI-Driven**: IA no centro das decisões
5. **Escalabilidade**: Arquitetura preparada para crescimento

---

## 📦 Estrutura de Packages

### `apps/web` - Frontend

**Stack**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui

```
apps/web/
├── src/
│   ├── app/              # App Router (Next.js 14)
│   │   ├── page.tsx      # Landing page
│   │   ├── call/         # Interface de chamada
│   │   └── dashboard/    # Dashboard de métricas
│   ├── components/       # Componentes React
│   │   ├── ui/          # shadcn/ui components
│   │   └── call/        # Componentes da chamada
│   ├── stores/          # Zustand stores
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilidades
└── public/              # Assets estáticos
```

**Responsabilidades**:
- Interface do usuário
- Captura de áudio via WebRTC
- Comunicação WebSocket com backend
- Exibição de transcrições e sugestões
- Gerenciamento de estado local (Zustand)

### `apps/api` - Backend

**Stack**: NestJS, Socket.IO, TypeScript

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── call/          # Gerenciamento de chamadas
│   │   ├── knowledge/     # Base de conhecimento
│   │   ├── objection/     # Objeções
│   │   ├── suggestion/    # Sugestões
│   │   └── realtime/      # WebSocket Gateway
│   ├── main.ts
│   └── app.module.ts
└── test/
```

**Responsabilidades**:
- API REST para operações CRUD
- WebSocket para comunicação real-time
- Orquestração dos serviços de IA
- Persistência no banco de dados
- Validação e autenticação

### `packages/types` - Tipos Compartilhados

```
packages/types/
├── src/
│   ├── user.ts           # User, UserRole
│   ├── call.ts           # Call, TranscriptSegment
│   ├── objection.ts      # Objection, ObjectionCategory
│   ├── knowledge.ts      # KnowledgeItem, KnowledgeType
│   ├── suggestion.ts     # Suggestion, SuggestionType
│   ├── events.ts         # Eventos do sistema
│   └── websocket.ts      # Mensagens WebSocket
└── index.ts
```

**Responsabilidades**:
- Tipos TypeScript compartilhados
- Interfaces e enums
- Contratos de API

### `packages/db` - Database

```
packages/db/
├── src/
│   ├── client.ts         # Supabase client
│   └── repositories/     # Data access layer
│       ├── user.repository.ts
│       ├── call.repository.ts
│       ├── objection.repository.ts
│       ├── knowledge.repository.ts
│       └── suggestion.repository.ts
└── supabase/
    ├── config.toml       # Configuração local
    ├── migrations/       # SQL migrations
    └── seed.sql          # Dados de exemplo
```

**Responsabilidades**:
- Cliente Supabase configurado
- Repositórios para acesso aos dados
- Migrations e seeds
- Abstração do banco de dados

### `packages/ai` - AI Services

```
packages/ai/
├── src/
│   ├── services/
│   │   ├── audio-processor.service.ts       # Buffer de áudio
│   │   ├── transcription.service.ts         # Whisper API
│   │   ├── objection-detector.service.ts    # NLP
│   │   └── suggestion-engine.service.ts     # GPT-4
│   └── config.ts
└── test/
```

**Responsabilidades**:
- Processamento de chunks de áudio
- Transcrição com Whisper
- Detecção de objeções com NLP
- Geração de sugestões com GPT-4

---

## 🔄 Fluxo de Dados Detalhado

### 1. Iniciar Chamada

```
Frontend                Backend                 Database
   |                       |                       |
   |-- POST /api/calls --->|                       |
   |                       |--- INSERT call ------>|
   |                       |<------ call id -------|
   |<----- call obj -------|                       |
   |                       |                       |
   |-- WS: call.start ---->|                       |
   |<- WS: call.started ---|                       |
```

### 2. Processar Áudio

```
Frontend                Backend                 OpenAI
   |                       |                       |
   |-- WS: audio.chunk --->|                       |
   |                       |-- Buffer chunks ----->|
   |                       |                       |
   |                   [5s buffer]                 |
   |                       |                       |
   |                       |--- Whisper API ------>|
   |                       |<-- transcription -----|
   |<- WS: transcript -----|                       |
```

### 3. Detectar Objeção e Gerar Sugestão

```
Backend              ObjectionDetector     KnowledgeBase      GPT-4
   |                       |                    |              |
   |--- detect() --------->|                    |              |
   |<-- objection found ---|                    |              |
   |                       |                    |              |
   |--- search() ----------------------------->|              |
   |<-- knowledge items ----------------------- |              |
   |                                            |              |
   |--- generate() -------------------------------------------->|
   |<-- suggestion ---------------------------------------------|
   |                                                            |
   |-- save to DB                                               |
   |-- emit to frontend                                         |
```

---

## 🔐 Segurança

### Autenticação

- Supabase Auth para gerenciamento de usuários
- JWT tokens para sessões
- Row Level Security (RLS) no PostgreSQL

### Autorização

Políticas RLS por role:
- **admin**: acesso total
- **comercial**: apenas suas próprias chamadas
- **suporte**: leitura de métricas agregadas

### API Keys

- OpenAI API key armazenada apenas no backend
- Variáveis de ambiente nunca expostas ao frontend
- Service role key do Supabase protegida

---

## 📊 Escalabilidade

### Horizontal

- Frontend: Next.js pode ser facilmente replicado
- Backend: NestJS permite múltiplas instâncias
- WebSocket: Socket.IO suporta clustering

### Vertical

- Database: Supabase escala automaticamente
- AI Services: Requisições podem ser enfileiradas

### Cache

- Objections e Knowledge em memória
- Transcrições cacheadas no banco
- Redis para cache distribuído (futuro)

---

## 🧪 Testing Strategy

```
Unit Tests
├── packages/types     # Validação de tipos
├── packages/ai        # Testes de serviços IA
└── packages/db        # Testes de repositórios

Integration Tests
├── apps/api          # Testes de endpoints
└── apps/web          # Testes E2E com Playwright

Load Tests
└── k6/               # Testes de carga
```

---

## 🚀 Deploy Strategy

### Development
- Local: pnpm dev
- Database: Supabase local
- Hot reload ativo

### Staging
- Frontend: Vercel Preview
- Backend: Railway staging
- Database: Supabase staging

### Production
- Frontend: Vercel Production
- Backend: Railway/Render
- Database: Supabase Cloud
- CDN: Cloudflare

---

## 🔮 Futuras Melhorias

### Fase 2
- [ ] Diarização de speakers (identificar quem fala automaticamente)
- [ ] Análise de sentimento em tempo real
- [ ] Cache com Redis
- [ ] Rate limiting avançado

### Fase 3
- [ ] Integração com Google Meet/Zoom SDK
- [ ] Gravação e replay de chamadas
- [ ] Dashboard de analytics avançado
- [ ] Webhooks para integrações

### Fase 4
- [ ] Fine-tuning de modelo próprio
- [ ] Mobile app (React Native)
- [ ] Multi-tenancy
- [ ] API pública para parceiros

---

## 📚 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Socket.IO Documentation](https://socket.io/docs/v4/)

---

**Arquitetura mantida por**: Equipe de Engenharia - Grupo Areluna

