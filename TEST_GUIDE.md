# 🧪 Guia de Testes - Integração OpenAI Assistant

Guia prático para testar a integração com o OpenAI Assistant localmente.

---

## 🔑 Pré-requisitos

### 1. OpenAI API Key

Você **precisa** de uma OpenAI API Key válida:

1. Acesse: https://platform.openai.com/api-keys
2. Faça login (ou crie uma conta)
3. Clique em **"Create new secret key"**
4. Copie a chave (começa com `sk-proj-...`)

⚠️ **IMPORTANTE**: Guarde a chave em local seguro! Ela não será mostrada novamente.

### 2. Configurar a API Key

```bash
# Editar arquivo de ambiente
nano apps/api/.env

# Substituir a linha:
OPENAI_API_KEY=sk-proj-SUA_CHAVE_REAL_AQUI

# Salvar: Ctrl+O, Enter, Ctrl+X
```

O arquivo `.env` deve ficar assim:

```env
# Server
PORT=3101
NODE_ENV=development

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-ABC123XYZ...  ← SUA CHAVE AQUI
OPENAI_ASSISTANT_ID=asst_7RhlVBzVzK2AEKo0i9pPO67N

# CORS
CORS_ORIGIN=http://localhost:3100
```

---

## 🚀 Iniciar o Backend

### Opção 1: Terminal Único

```bash
cd apps/api
pnpm dev
```

### Opção 2: Com Logs Detalhados

```bash
cd apps/api
NODE_ENV=development pnpm dev
```

**Você verá**:

```
[Nest] 12345  - 23/10/2024, 21:00:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 23/10/2024, 21:00:00     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 23/10/2024, 21:00:00     LOG [RoutesResolver] HealthController {/health}:
[Nest] 12345  - 23/10/2024, 21:00:00     LOG [RouterExplorer] Mapped {/health, GET} route
[Nest] 12345  - 23/10/2024, 21:00:01     LOG [NestApplication] Nest application successfully started
🚀 API rodando em: http://localhost:3101
```

---

## 🧪 Testes Automatizados

### Executar Script de Teste

```bash
# Na raiz do projeto
./test-assistant.sh
```

Este script testa automaticamente:
- ✅ Health check do backend
- ✅ Conexão com o Assistant
- ✅ Informações do Assistant
- ✅ Geração de sugestão real

---

## 📡 Testes Manuais

### Teste 1: Health Check

```bash
curl http://localhost:3101/health
```

**Resposta esperada**:
```json
{
  "status": "ok",
  "timestamp": "2024-10-23T21:00:00.000Z"
}
```

---

### Teste 2: Testar Conexão

```bash
curl http://localhost:3101/api/assistant/test
```

**Resposta esperada** (sucesso):
```json
{
  "connected": true,
  "assistantId": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "message": "Conexão com o Assistente OpenAI estabelecida com sucesso!"
}
```

**Resposta esperada** (erro - API Key inválida):
```json
{
  "connected": false,
  "assistantId": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "message": "Falha ao conectar com o Assistente OpenAI"
}
```

---

### Teste 3: Informações do Assistant

```bash
curl http://localhost:3101/api/assistant/info
```

**Resposta esperada**:
```json
{
  "id": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "name": "Nome do Assistente Areluna",
  "model": "gpt-4-turbo-preview",
  "instructions": "Você é um especialista em vendas...",
  "tools": [...]
}
```

---

### Teste 4: Gerar Sugestão

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Está muito caro",
    "conversationContext": [
      "Comercial: Olá! Como posso ajudar?",
      "Lead: Gostaria de saber sobre os tratamentos"
    ],
    "knowledgeContext": "Consulta dermatológica: R$ 350,00"
  }'
```

**Resposta esperada**:
```json
{
  "suggestion": "Entendo sua preocupação com o investimento. Na verdade, nossa consulta de R$ 350 inclui não apenas a avaliação com dermatologista especializado, mas também dermatoscopia digital e um plano de tratamento personalizado. Muitos clientes percebem o valor quando veem que é um serviço completo.",
  "timestamp": "2024-10-23T21:00:00.000Z"
}
```

---

## 🎯 Cenários de Teste

### Cenário 1: Objeção de Preço

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "O preço está acima do que eu esperava",
    "conversationContext": [
      "Comercial: Nosso tratamento de harmonização facial custa R$ 2.500",
      "Lead: É mais caro do que pensei"
    ],
    "knowledgeContext": "Harmonização Facial: R$ 2.500 - Inclui consulta, aplicação de toxina botulínica em 3 áreas, preenchimento com ácido hialurônico, retorno em 15 dias. Médico especializado com mais de 1000 procedimentos realizados."
  }'
```

---

### Cenário 2: Dúvida sobre Segurança

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Tenho medo de ficar com resultado artificial",
    "conversationContext": [
      "Comercial: Recomendo o preenchimento labial",
      "Lead: Mas não quero ficar com aquela boca de pato"
    ],
    "knowledgeContext": "Preenchimento Labial: Usamos técnica conservadora com ácido hialurônico de alta qualidade. O resultado é natural e proporcional ao rosto. Podemos começar com volume sutil e aumentar gradualmente. Reversível se necessário."
  }'
```

---

### Cenário 3: Comparação com Concorrência

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Vi mais barato em outra clínica",
    "conversationContext": [
      "Comercial: Nosso laser custa R$ 800 por sessão",
      "Lead: Achei uma clínica que cobra R$ 400"
    ],
    "knowledgeContext": "Laser Fracionado: R$ 800/sessão - Utilizamos equipamento Halo (tecnologia híbrida), médico dermatologista aplica, protocolo personalizado, acompanhamento completo. Clínica certificada pela Anvisa. Garantia de resultados."
  }'
```

---

### Cenário 4: Necessidade de Parcelamento

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Não consigo pagar à vista",
    "conversationContext": [
      "Comercial: O tratamento completo fica em R$ 3.500",
      "Lead: Posso parcelar?"
    ],
    "knowledgeContext": "Formas de Pagamento: Parcelamos em até 10x sem juros no cartão. Também aceitamos PIX com 5% de desconto à vista. Para pacotes de tratamento, condições especiais em até 12x."
  }'
```

---

## 📊 Teste de Performance

### Medir Tempo de Resposta

```bash
time curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Preciso pensar melhor",
    "conversationContext": ["Lead está indeciso"],
    "knowledgeContext": "Promoção válida até o final do mês"
  }'
```

**Tempo esperado**: 2-5 segundos (depende da API OpenAI)

---

## 🔍 Debugging

### Ver Logs do Backend

Os logs aparecem automaticamente no terminal onde você executou `pnpm dev`.

**Logs importantes**:

```
✅ Conexão estabelecida com assistente
🤖 Thread criada: thread_abc123
💡 Sugestão gerada em 2.3s
❌ Erro ao gerar sugestão: Invalid API Key
```

### Problemas Comuns

#### 1. "Cannot connect to localhost:3101"

**Causa**: Backend não está rodando

**Solução**:
```bash
cd apps/api
pnpm dev
```

---

#### 2. "Unauthorized" ou "Invalid API Key"

**Causa**: API Key inválida ou não configurada

**Solução**:
```bash
# Verificar se a key está configurada
cat apps/api/.env | grep OPENAI_API_KEY

# Se não estiver, configurar
nano apps/api/.env
```

---

#### 3. "Assistant not found"

**Causa**: Assistant ID incorreto ou assistente foi deletado

**Solução**:
- Verificar no dashboard da OpenAI: https://platform.openai.com/assistants
- Confirmar que o ID `asst_7RhlVBzVzK2AEKo0i9pPO67N` existe

---

#### 4. "Rate limit exceeded"

**Causa**: Muitas requisições em pouco tempo

**Solução**:
- Aguardar 1 minuto
- Reduzir frequência de testes
- Verificar plano da conta OpenAI

---

## 📈 Monitoramento

### Ver Status da API OpenAI

```bash
curl https://status.openai.com/api/v2/status.json
```

### Verificar Uso de Créditos

1. Acesse: https://platform.openai.com/usage
2. Veja o consumo em tempo real
3. Configure alertas de billing

---

## 🎨 Teste no Frontend

### 1. Iniciar Frontend

```bash
# Em outro terminal
cd apps/web
pnpm dev
```

### 2. Acessar Interface

```
http://localhost:3100/call
```

### 3. Testar Fluxo Completo

1. Clicar em "Iniciar Chamada"
2. Permitir acesso ao microfone
3. Falar uma objeção (ex: "Está muito caro")
4. Ver transcrição aparecer
5. Ver sugestão do assistente

---

## 💡 Dicas de Teste

### 1. Use jq para Formatar JSON

```bash
# Instalar jq
brew install jq  # macOS

# Usar nos testes
curl http://localhost:3101/api/assistant/test | jq '.'
```

### 2. Salvar Respostas em Arquivo

```bash
curl http://localhost:3101/api/assistant/info > assistant-info.json
```

### 3. Teste com Diferentes Objeções

Crie um arquivo `test-cases.json`:

```json
[
  {
    "objection": "Está muito caro",
    "context": "Consulta: R$ 350"
  },
  {
    "objection": "Preciso pensar",
    "context": "Promoção até amanhã"
  },
  {
    "objection": "Meu marido não vai gostar",
    "context": "Tratamento seguro e aprovado"
  }
]
```

---

## 🎯 Checklist de Testes

Antes de considerar o sistema pronto:

- [ ] Backend iniciando sem erros
- [ ] Health check respondendo
- [ ] Conexão com Assistant OK
- [ ] Info do Assistant retornando dados
- [ ] Geração de sugestão funcionando
- [ ] Tempo de resposta < 5s
- [ ] Sugestões contextualizadas
- [ ] Sugestões em português
- [ ] Frontend recebendo sugestões via WebSocket
- [ ] Transcrição aparecendo na interface

---

## 📚 Recursos Adicionais

### Documentação OpenAI

- **Assistants API**: https://platform.openai.com/docs/assistants
- **GPT-4**: https://platform.openai.com/docs/models/gpt-4
- **Rate Limits**: https://platform.openai.com/docs/guides/rate-limits

### Dashboard OpenAI

- **API Keys**: https://platform.openai.com/api-keys
- **Usage**: https://platform.openai.com/usage
- **Assistants**: https://platform.openai.com/assistants

---

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs do backend
2. Testar conexão com `curl`
3. Verificar créditos na conta OpenAI
4. Consultar documentação em `ASSISTANT_INTEGRATION.md`

---

**Última Atualização**: 23/10/2024  
**Versão**: 1.0.0

