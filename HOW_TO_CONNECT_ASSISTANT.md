# 🤖 Como Conectar seu Assistente OpenAI

**Guia Passo a Passo Completo**

Tutorial prático para conectar o Assistente OpenAI `asst_7RhlVBzVzK2AEKo0i9pPO67N` ao sistema OmniObjections.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Passo 1: Verificar seu Assistente](#passo-1-verificar-seu-assistente)
3. [Passo 2: Obter API Key](#passo-2-obter-api-key)
4. [Passo 3: Configurar no Projeto](#passo-3-configurar-no-projeto)
5. [Passo 4: Testar Conexão](#passo-4-testar-conexão)
6. [Passo 5: Usar na Prática](#passo-5-usar-na-prática)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Pré-requisitos

Antes de começar, você precisa:

- [ ] Conta na OpenAI (https://platform.openai.com)
- [ ] Créditos disponíveis na conta (mínimo $5)
- [ ] Projeto OmniObjections instalado
- [ ] Terminal aberto na pasta do projeto

---

## 📍 Passo 1: Verificar seu Assistente

### 1.1 Acessar Dashboard de Assistentes

```
🌐 URL: https://platform.openai.com/assistants
```

### 1.2 Localizar seu Assistente

1. Faça login na OpenAI
2. No menu lateral, clique em **"Assistants"**
3. Procure por: `asst_7RhlVBzVzK2AEKo0i9pPO67N`

```
┌─────────────────────────────────────────┐
│ 🤖 Assistants                          │
├─────────────────────────────────────────┤
│                                         │
│  📝 Assistente Areluna                 │
│     ID: asst_7RhlVBzVzK2AEKo0i9pPO67N │
│     Model: gpt-4-turbo-preview         │
│     Created: XX/XX/XXXX                │
│                                         │
│     [View Details] [Edit] [Delete]     │
│                                         │
└─────────────────────────────────────────┘
```

### 1.3 Verificar Configurações

Clique em **"View Details"** e confirme:

- ✅ **Model**: `gpt-4-turbo-preview` ou `gpt-4`
- ✅ **Instructions**: Configuradas para vendas
- ✅ **Tools**: Ativadas (retrieval, function calling, etc)
- ✅ **Status**: Active

**💡 Dica**: Se não encontrar o assistente, anote o ID de qualquer assistente que você tenha e use-o no lugar.

---

## 🔑 Passo 2: Obter API Key

### 2.1 Acessar Página de API Keys

```
🌐 URL: https://platform.openai.com/api-keys
```

### 2.2 Criar Nova Chave

1. Clique em **"+ Create new secret key"**
2. Preencha o formulário:

```
┌─────────────────────────────────────────┐
│ Create new secret key                   │
├─────────────────────────────────────────┤
│                                         │
│ Name: [OmniObjections_Production]      │
│                                         │
│ Permissions: [All]                     │
│                                         │
│ ⚠️  This key will only be shown once   │
│                                         │
│        [Cancel]  [Create secret key]   │
│                                         │
└─────────────────────────────────────────┘
```

3. Clique em **"Create secret key"**

### 2.3 Copiar a Chave

```
┌─────────────────────────────────────────┐
│ ✅ API key created                      │
├─────────────────────────────────────────┤
│                                         │
│ sk-proj-ABC123XYZ...789                │
│                                         │
│    [Copy]         [Done]                │
│                                         │
│ ⚠️  Make sure to copy it - you won't   │
│    be able to see it again!            │
│                                         │
└─────────────────────────────────────────┘
```

**⚠️ IMPORTANTE**: 
- Clique em **[Copy]** imediatamente
- Cole em um local seguro (Notes, 1Password, etc)
- Esta é a única vez que verá a chave completa!

### 2.4 Guardar com Segurança

Salve a chave em um gerenciador de senhas ou arquivo seguro:

```
📝 Anotações Seguras:

OpenAI API Key - OmniObjections
─────────────────────────────────
Criada em: 23/10/2024
Nome: OmniObjections_Production
Chave: sk-proj-ABC123XYZ...789
Uso: Integração Assistente Areluna
─────────────────────────────────
```

---

## ⚙️ Passo 3: Configurar no Projeto

### 3.1 Abrir Terminal

```bash
# Navegar até o projeto
cd /Users/dr.saraiva/Documents/TRAe-Projects/OmniObjections
```

### 3.2 Método A: Script Automático (RECOMENDADO)

```bash
# Executar script de configuração
./configure-openai.sh
```

Você verá:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 CONFIGURAÇÃO DA OPENAI API KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 PASSO 1: Obter OpenAI API Key
   ...instruções...

🔐 Cole sua OpenAI API Key:
(A chave não será exibida por segurança)
█
```

**Cole** sua API Key e pressione **Enter**.

O script irá:
1. ✅ Validar o formato da chave
2. ✅ Fazer backup do `.env` atual
3. ✅ Salvar a nova chave
4. ✅ Confirmar a configuração

Resultado esperado:

```
✅ API Key recebida
✅ Backup do .env criado
✅ API Key configurada no .env

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VERIFICANDO CONFIGURAÇÃO:

✅ OPENAI_API_KEY: sk-***...XYZ
✅ OPENAI_ASSISTANT_ID: asst_7RhlVBzVzK2AEKo0i9pPO67N

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.3 Método B: Edição Manual

Se preferir editar manualmente:

```bash
# Opção 1: Nano (Terminal)
nano apps/api/.env

# Opção 2: TextEdit (Mac)
open -e apps/api/.env

# Opção 3: VS Code
code apps/api/.env
```

**Encontre** esta linha:
```env
OPENAI_API_KEY=sk-proj-SUBSTITUA_PELA_SUA_CHAVE_AQUI
```

**Substitua** por:
```env
OPENAI_API_KEY=sk-proj-ABC123XYZ...789
```
*(Use sua chave real)*

**Verifique** que esta linha também está presente:
```env
OPENAI_ASSISTANT_ID=asst_7RhlVBzVzK2AEKo0i9pPO67N
```

**Salve** o arquivo:
- Nano: `Ctrl+O`, `Enter`, `Ctrl+X`
- TextEdit: `Cmd+S`
- VS Code: `Cmd+S`

### 3.4 Verificar Configuração

```bash
# Ver configuração (sem expor a chave completa)
cat apps/api/.env | grep OPENAI
```

Deve mostrar:
```
OPENAI_API_KEY=sk-proj-ABC...
OPENAI_ASSISTANT_ID=asst_7RhlVBzVzK2AEKo0i9pPO67N
```

---

## 🔄 Passo 4: Testar Conexão

### 4.1 Reiniciar Backend

```bash
# Parar processos antigos
pkill -f "nest"

# Aguardar 2 segundos
sleep 2

# Iniciar backend
cd apps/api && pnpm dev
```

Ou use o script:

```bash
./restart-backend.sh
```

### 4.2 Aguardar Inicialização

Você verá nos logs:

```
[Nest] 12345  - XX/XX/XXXX, XX:XX:XX     LOG [NestFactory] Starting...
✅ OpenAI Assistant configurado com sucesso    ← ISSO É BOM!
[Nest] 12345  - XX/XX/XXXX, XX:XX:XX     LOG [InstanceLoader] AssistantModule...
...
🚀 API servidor rodando em http://localhost:3101
```

**✅ Se ver**: `"✅ OpenAI Assistant configurado com sucesso"` → Tudo OK!

**⚠️ Se ver**: `"⚠️ OpenAI API Key não configurada - usando modo DEMO"` → Configuração falhou, revise o passo 3.

### 4.3 Teste 1: Health Check

```bash
# Verificar se o backend está rodando
curl http://localhost:3101/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-10-23T21:30:00.000Z"
}
```

### 4.4 Teste 2: Verificar Modo

```bash
# Testar conexão com assistente
curl http://localhost:3101/api/assistant/test
```

**Resposta esperada** (PRODUCTION MODE):
```json
{
  "connected": true,
  "assistantId": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "mode": "PRODUCTION",
  "message": "✅ Conexão com o Assistente OpenAI estabelecida com sucesso!"
}
```

✅ **SUCESSO!** Se `"mode": "PRODUCTION"` → Tudo funcionando!

### 4.5 Teste 3: Info do Assistente

```bash
# Obter detalhes do assistente
curl http://localhost:3101/api/assistant/info | python3 -m json.tool
```

**Resposta esperada**:
```json
{
  "id": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "name": "Nome do seu Assistente",
  "model": "gpt-4-turbo-preview",
  "instructions": "Você é um especialista em vendas...",
  "tools": [
    {
      "type": "retrieval"
    },
    {
      "type": "function",
      "function": {...}
    }
  ],
  "demoMode": false
}
```

✅ **Perfeito!** Seu assistente está conectado e ativo!

---

## 💡 Passo 5: Usar na Prática

### 5.1 Gerar Primeira Sugestão

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Está muito caro para mim",
    "conversationContext": [
      "Comercial: Nosso tratamento de harmonização facial custa R$ 2.500",
      "Lead: Esse valor está acima do que eu esperava"
    ],
    "knowledgeContext": "Harmonização Facial completa: R$ 2.500 - Inclui consulta médica especializada, toxina botulínica em 3 áreas, preenchimento com ácido hialurônico premium, acompanhamento por 30 dias. Parcelamento em até 10x sem juros."
  }' | python3 -m json.tool
```

**Resposta esperada** (gerada pela IA real):
```json
{
  "suggestion": "Entendo completamente sua preocupação com o investimento. O valor de R$ 2.500 realmente representa um investimento significativo, mas deixe-me mostrar o que está incluído: consulta com médico especialista, toxina botulínica em 3 áreas, preenchimento premium e 30 dias de acompanhamento completo. Além disso, oferecemos parcelamento em até 10x sem juros, o que fica em R$ 250 por mês. Muitos dos nossos pacientes começam assim e ficam muito satisfeitos com os resultados duradouros. Que tal agendar uma consulta sem compromisso para conhecer melhor o procedimento?",
  "timestamp": "2024-10-23T21:35:00.000Z",
  "mode": "PRODUCTION"
}
```

✨ **Nota**: Esta resposta foi **gerada pela IA real** com base no contexto que você forneceu!

### 5.2 Testar Diferentes Objeções

**Teste com indecisão:**
```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Preciso pensar melhor",
    "conversationContext": [
      "Lead: Me interessei mas preciso decidir com calma"
    ],
    "knowledgeContext": "Promoção válida até sexta-feira com 20% de desconto"
  }'
```

**Teste com medo:**
```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Tenho medo de fazer procedimentos estéticos",
    "conversationContext": [
      "Lead: Nunca fiz nada assim antes"
    ],
    "knowledgeContext": "Procedimentos minimamente invasivos com anestesia tópica, realizados por médicos com mais de 1000 casos de sucesso"
  }'
```

### 5.3 Integrar no Frontend

Agora você pode usar no código JavaScript/TypeScript:

```typescript
// apps/web/src/lib/assistant.ts

export async function gerarSugestao(
  objecao: string,
  contexto: string[],
  conhecimento: string
) {
  const response = await fetch('http://localhost:3101/api/assistant/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      objectionText: objecao,
      conversationContext: contexto,
      knowledgeContext: conhecimento,
    }),
  });

  const data = await response.json();
  return data.suggestion;
}

// Uso:
const sugestao = await gerarSugestao(
  "Está muito caro",
  ["Lead: Quanto custa?"],
  "Consulta: R$ 350"
);

console.log(sugestao);
```

---

## 🐛 Troubleshooting

### Problema 1: "Invalid API Key"

**Sintoma:**
```json
{
  "error": "Invalid API Key"
}
```

**Causas possíveis:**
- API Key incorreta
- Espaços extras na chave
- Chave expirada ou revogada

**Solução:**
```bash
# 1. Verificar a chave no .env
cat apps/api/.env | grep OPENAI_API_KEY

# 2. Se estiver errada, reconfigurar
./configure-openai.sh

# 3. Ou gerar nova chave em:
# https://platform.openai.com/api-keys
```

---

### Problema 2: "Assistant not found"

**Sintoma:**
```json
{
  "error": "Assistant asst_7RhlVBzVzK2AEKo0i9pPO67N not found"
}
```

**Causas possíveis:**
- Assistant ID incorreto
- Assistente foi deletado
- Conta OpenAI diferente

**Solução:**

1. **Verificar seus assistentes:**
   ```
   https://platform.openai.com/assistants
   ```

2. **Copiar o ID correto** do assistente que você quer usar

3. **Atualizar o .env:**
   ```bash
   nano apps/api/.env
   ```
   
   Alterar para:
   ```env
   OPENAI_ASSISTANT_ID=asst_SEU_ID_REAL_AQUI
   ```

4. **Reiniciar:**
   ```bash
   ./restart-backend.sh
   ```

---

### Problema 3: "Insufficient credits"

**Sintoma:**
```json
{
  "error": "You exceeded your current quota"
}
```

**Causa:**
- Créditos OpenAI esgotados

**Solução:**

1. **Verificar saldo:**
   ```
   https://platform.openai.com/account/billing/overview
   ```

2. **Adicionar créditos:**
   - Clique em "Add to credit balance"
   - Adicione pelo menos $5-10 USD
   - Configure auto-recharge (recomendado)

3. **Aguardar** alguns minutos para processar

4. **Testar** novamente

---

### Problema 4: "Rate limit exceeded"

**Sintoma:**
```json
{
  "error": "Rate limit exceeded"
}
```

**Causa:**
- Muitas requisições em pouco tempo
- Limite do plano gratuito atingido

**Solução:**

1. **Aguardar** 1-2 minutos

2. **Verificar limites:**
   ```
   https://platform.openai.com/account/limits
   ```

3. **Upgrade de plano** se necessário

4. **Implementar rate limiting** no código:
   ```typescript
   // Aguardar entre requisições
   await new Promise(resolve => setTimeout(resolve, 2000));
   ```

---

### Problema 5: Modo DEMO não sai

**Sintoma:**
```
⚠️  OpenAI API Key não configurada - usando modo DEMO
```

**Causa:**
- `.env` não foi salvo
- Backend não foi reiniciado
- Chave inválida

**Solução:**

1. **Verificar arquivo:**
   ```bash
   cat apps/api/.env | grep OPENAI
   ```

2. **Se vazio ou errado, reconfigurar:**
   ```bash
   ./configure-openai.sh
   ```

3. **Garantir que salvou:**
   ```bash
   # Ver última modificação
   ls -la apps/api/.env
   ```

4. **Matar todos os processos:**
   ```bash
   pkill -9 -f "nest"
   pkill -9 -f "node.*api"
   ```

5. **Reiniciar limpo:**
   ```bash
   cd apps/api && pnpm dev
   ```

---

## 📊 Monitoramento

### Ver Uso em Tempo Real

```
🌐 https://platform.openai.com/usage
```

Aqui você verá:
- Requisições por dia
- Tokens utilizados
- Custo acumulado
- Breakdown por modelo

### Configurar Alertas de Budget

1. Acesse: https://platform.openai.com/account/billing
2. Clique em **"Usage limits"**
3. Configure:
   - **Hard limit**: $20/mês (exemplo)
   - **Soft limit**: $15/mês (aviso)
   - **Email alerts**: Seu email

### Logs do Sistema

```bash
# Ver logs em tempo real
cd apps/api && pnpm dev

# Ver apenas erros
cd apps/api && pnpm dev 2>&1 | grep ERROR

# Salvar logs em arquivo
cd apps/api && pnpm dev > api.log 2>&1 &
```

---

## 💰 Custos Estimados

### Por Requisição

| Operação | Modelo | Custo | Exemplo |
|----------|--------|-------|---------|
| Geração de Sugestão | GPT-4 Turbo | ~$0.02-0.05 | Por objeção |
| Transcrição (futuro) | Whisper | ~$0.006/min | Por minuto de áudio |
| Busca no Assistente | Retrieval | Incluído | Consultas à base |

### Cenários Reais

**Caso 1: Teste e Desenvolvimento**
- 50 sugestões/dia
- Custo: ~$2.50/dia = $75/mês

**Caso 2: Uso Moderado**
- 200 sugestões/dia
- Custo: ~$10/dia = $300/mês

**Caso 3: Produção Ativa**
- 1000 sugestões/dia
- Custo: ~$50/dia = $1500/mês

**💡 Dica**: Comece com $20-30 de créditos e monitore o uso nos primeiros dias.

---

## ✅ Checklist Final

Antes de considerar concluído:

- [ ] API Key obtida e guardada
- [ ] `.env` configurado corretamente
- [ ] Backend reiniciado
- [ ] Teste `/test` retorna `"mode": "PRODUCTION"`
- [ ] Teste `/info` retorna dados do assistente
- [ ] Teste `/generate` retorna sugestão real
- [ ] Monitoramento configurado
- [ ] Limites de budget definidos
- [ ] Documentação lida
- [ ] Equipe treinada

---

## 🎯 Próximos Passos

Agora que está conectado:

1. **Teste com casos reais** da clínica Areluna
2. **Refine as instruções** do assistente se necessário
3. **Adicione knowledge base** específica da clínica
4. **Integre com frontend** para uso em produção
5. **Configure Supabase** para persistir dados
6. **Ative transcrição de áudio** com Whisper
7. **Implemente métricas** e analytics

---

## 📚 Recursos Adicionais

### Documentação OpenAI

- **Assistants API**: https://platform.openai.com/docs/assistants
- **API Reference**: https://platform.openai.com/docs/api-reference
- **Best Practices**: https://platform.openai.com/docs/guides/production-best-practices

### Documentação do Projeto

- `ASSISTANT_INTEGRATION.md` - Detalhes técnicos da integração
- `TEST_GUIDE.md` - Guia completo de testes
- `OPENAI_SETUP.md` - Setup da OpenAI
- `ARCHITECTURE.md` - Arquitetura do sistema

### Scripts Úteis

```bash
./configure-openai.sh    # Configurar API Key
./restart-backend.sh     # Reiniciar backend
./test-assistant.sh      # Testar integração completa
```

---

## 🆘 Suporte

Se tiver problemas:

1. **Revise este guia** do início
2. **Confira os logs** do backend
3. **Teste cada endpoint** individualmente
4. **Verifique créditos** na OpenAI
5. **Consulte o Troubleshooting** acima

**Ainda com dúvidas?**
- Documentação OpenAI: https://platform.openai.com/docs
- Status da API: https://status.openai.com

---

## 🎉 Conclusão

Parabéns! Seu Assistente OpenAI está **conectado e funcionando** em modo PRODUCTION! 🚀

Agora você tem:
- ✅ IA generativa real respondendo objeções
- ✅ Respostas contextualizadas e inteligentes
- ✅ Base de conhecimento da Areluna integrada
- ✅ Sistema pronto para produção

**Próximo passo**: Teste com casos reais e refine conforme necessário!

---

**Guia criado em**: 23/10/2024  
**Versão**: 1.0.0  
**Assistente**: `asst_7RhlVBzVzK2AEKo0i9pPO67N`  
**Sistema**: OmniObjections

