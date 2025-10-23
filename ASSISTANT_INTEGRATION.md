# 🤖 Integração com OpenAI Assistant

Sistema integrado com o **Assistente OpenAI** do Grupo Areluna.

**Assistant ID**: `asst_7RhlVBzVzK2AEKo0i9pPO67N`

---

## 🎯 O Que Foi Implementado

### 1. **Novo Serviço de Assistente** (`@omni/ai`)
- ✅ `AssistantService` - Integração com Assistants API
- ✅ Criação e gerenciamento de threads
- ✅ Execução do assistente com contexto
- ✅ Geração de sugestões contextualizadas

### 2. **Módulo de API** (`apps/api`)
- ✅ `/api/assistant/info` - Informações do assistente
- ✅ `/api/assistant/test` - Testar conexão
- ✅ `/api/assistant/generate` - Gerar sugestão

### 3. **Configuração**
- ✅ Assistant ID configurado em `.env`
- ✅ Variável `OPENAI_ASSISTANT_ID`
- ✅ Fallback para ID default

---

## 🔧 Como Usar

### Passo 1: Configurar OpenAI API Key

Você **precisa** de uma OpenAI API Key válida.

```bash
# Editar arquivo
nano apps/api/.env

# Substituir:
OPENAI_API_KEY=sk-proj-SUA_CHAVE_REAL_AQUI
```

**⚠️ IMPORTANTE**: O Assistant ID já está configurado como `asst_7RhlVBzVzK2AEKo0i9pPO67N`

### Passo 2: Iniciar Backend

```bash
cd apps/api
pnpm dev
```

O servidor iniciará na porta **3101**.

### Passo 3: Testar Conexão

Abra outra aba do terminal:

```bash
# Testar conexão com o assistente
curl http://localhost:3101/api/assistant/test

# Obter informações do assistente
curl http://localhost:3101/api/assistant/info
```

**Resposta Esperada** (test):
```json
{
  "connected": true,
  "assistantId": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "message": "Conexão com o Assistente OpenAI estabelecida com sucesso!"
}
```

**Resposta Esperada** (info):
```json
{
  "id": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "name": "Nome do Assistente",
  "model": "gpt-4-turbo-preview",
  "instructions": "...",
  "tools": [...]
}
```

---

## 📡 Endpoints da API

### 1. **GET /api/assistant/test**
Testa a conexão com o assistente.

```bash
curl http://localhost:3101/api/assistant/test
```

### 2. **GET /api/assistant/info**
Retorna informações do assistente configurado.

```bash
curl http://localhost:3101/api/assistant/info
```

### 3. **POST /api/assistant/generate**
Gera uma sugestão usando o assistente.

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Está muito caro",
    "conversationContext": [
      "Comercial: Olá! Como posso ajudar?",
      "Lead: Gostaria de saber sobre os tratamentos"
    ],
    "knowledgeContext": "Consulta dermatológica custa R$ 350,00"
  }'
```

**Resposta**:
```json
{
  "suggestion": "Entendo sua preocupação com o investimento. Na verdade, nossa consulta de R$ 350 inclui não apenas a avaliação com dermatologista especializado, mas também dermatoscopia digital e um plano de tratamento personalizado. Muitos clientes percebem o valor quando veem que é um serviço completo.",
  "timestamp": "2024-10-23T20:00:00.000Z"
}
```

---

## 🔄 Como Funciona

### Fluxo de Geração de Sugestões

```
1. Sistema detecta objeção do lead
   ↓
2. Busca conhecimento relevante da Areluna
   ↓
3. Cria thread no OpenAI Assistant
   ↓
4. Envia contexto + objeção + conhecimento
   ↓
5. Assistant processa e gera resposta
   ↓
6. Sistema retorna sugestão ao comercial
```

### Contexto Enviado ao Assistant

```
CONTEXTO DA CONVERSA:
[Últimas 5 falas da conversa]

OBJEÇÃO DO LEAD:
"[Texto da objeção detectada]"

INFORMAÇÕES RELEVANTES DA CLÍNICA:
[Dados da base de conhecimento]

Por favor, forneça uma resposta:
1. Empática e natural
2. Que aborde diretamente a objeção
3. Use as informações da clínica mencionadas
4. Máximo 2-3 frases
5. Em português do Brasil
```

---

## 💻 Usando no Código

### TypeScript/NestJS

```typescript
import { AssistantService } from '@omni/ai';

const assistantService = new AssistantService();

// Testar conexão
const connected = await assistantService.testConnection();

// Gerar sugestão
const suggestion = await assistantService.generateSuggestion(
  "Está muito caro",
  ["Comercial: Olá!", "Lead: Quero saber sobre tratamentos"],
  "Consulta: R$ 350"
);
```

### JavaScript/Node.js

```javascript
const { AssistantService } = require('@omni/ai');

const assistant = new AssistantService();

async function testAssistant() {
  const connected = await assistant.testConnection();
  console.log('Conectado:', connected);
  
  const info = await assistant.getAssistantInfo();
  console.log('Assistente:', info.name);
}
```

---

## 🔍 Verificação de Problemas

### Erro: "Assistant ID is required"

**Solução**: Verificar se `OPENAI_ASSISTANT_ID` está no `.env`:
```bash
grep OPENAI_ASSISTANT_ID apps/api/.env
```

### Erro: "Unauthorized" ou "401"

**Solução**: API Key inválida ou expirada. Gerar nova em:
https://platform.openai.com/api-keys

### Erro: "Assistant not found"

**Solução**: O Assistant ID pode estar incorreto ou o assistente foi deletado.
Verificar no dashboard da OpenAI.

---

## 📊 Monitoramento

### Logs do Backend

```bash
# Ver logs em tempo real
cd apps/api
pnpm dev

# Os logs mostrarão:
# ✅ Conexão estabelecida com assistente
# 🤖 Thread criada: thread_xxx
# 💡 Sugestão gerada em 2.3s
```

### Métricas

O sistema registra:
- ✅ Tempo de resposta do assistente
- ✅ Número de tokens utilizados
- ✅ Taxa de sucesso/falha
- ✅ Threads ativas

---

## 🔐 Segurança

### Boas Práticas

1. **NUNCA** commitar o `.env` com a API Key real
2. **SEMPRE** usar variáveis de ambiente em produção
3. **ROTACIONAR** a API Key periodicamente
4. **LIMITAR** taxa de requisições (já configurado)
5. **MONITORAR** uso de créditos OpenAI

### Custos

- **Whisper API**: ~$0.006 / minuto de áudio
- **GPT-4 Turbo**: ~$0.01 / 1K tokens (input)
- **Assistants API**: Similar ao GPT-4

**Estimativa**: ~$0.10 por chamada completa de 10 minutos

---

## 🚀 Próximos Passos

Após configurar o backend:

1. ✅ Testar conexão com `curl`
2. ✅ Iniciar chamada no frontend
3. ✅ Falar no microfone
4. ✅ Ver transcrições em tempo real
5. ✅ Receber sugestões do assistente

---

## 📞 Suporte

**Problemas com o Assistente?**

1. Verificar logs do backend
2. Testar endpoint `/api/assistant/test`
3. Verificar créditos na conta OpenAI
4. Ver documentação: https://platform.openai.com/docs/assistants

---

## 🎉 Pronto!

O sistema está **integrado** com o Assistente OpenAI `asst_7RhlVBzVzK2AEKo0i9pPO67N`.

**Configure sua OpenAI API Key e teste agora!** 🚀

---

**Última Atualização**: 23/10/2024  
**Versão**: 1.0.0

