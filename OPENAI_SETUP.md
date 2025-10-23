# 🔑 Configuração da OpenAI API Key

Guia rápido para ativar o modo PRODUCTION com a API real da OpenAI.

---

## 🚀 Opção 1: Script Automático (RECOMENDADO)

### Passo a Passo:

```bash
# 1. Execute o script de configuração
./configure-openai.sh

# 2. Cole sua API Key quando solicitado
# (A chave não será exibida por segurança)

# 3. Reinicie o backend
./restart-backend.sh

# 4. Teste a conexão
curl http://localhost:3101/api/assistant/test
```

---

## ✏️ Opção 2: Configuração Manual

### 1. Obter API Key

1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em **"+ Create new secret key"**
4. Dê um nome: `OmniObjections`
5. Copie a chave (começa com `sk-proj-...`)

⚠️ **IMPORTANTE**: A chave só é mostrada UMA VEZ! Guarde em local seguro.

### 2. Editar .env

```bash
# Abrir arquivo
nano apps/api/.env

# Ou use seu editor preferido
code apps/api/.env
```

### 3. Substituir a linha

Procure:
```env
OPENAI_API_KEY=sk-proj-SUBSTITUA_PELA_SUA_CHAVE_AQUI
```

Substitua por:
```env
OPENAI_API_KEY=sk-proj-SUA_CHAVE_REAL_COMPLETA_AQUI
```

### 4. Salvar e reiniciar

```bash
# Salvar o arquivo (Ctrl+O, Enter, Ctrl+X no nano)

# Parar backend
pkill -f "nest"

# Reiniciar backend
cd apps/api && pnpm dev
```

---

## 🧪 Testar Configuração

### Teste 1: Verificar Modo

```bash
curl http://localhost:3101/api/assistant/test
```

**Resposta esperada (PRODUCTION)**:
```json
{
  "connected": true,
  "assistantId": "asst_7RhlVBzVzK2AEKo0i9pPO67N",
  "mode": "PRODUCTION",
  "message": "✅ Conexão com o Assistente OpenAI estabelecida com sucesso!"
}
```

### Teste 2: Gerar Sugestão Real

```bash
curl -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Está muito caro",
    "conversationContext": [
      "Comercial: Nosso tratamento custa R$ 2.500",
      "Lead: É mais caro do que esperava"
    ],
    "knowledgeContext": "Harmonização Facial: R$ 2.500 - Procedimento completo"
  }'
```

**Resposta esperada**: Sugestão gerada pela IA real da OpenAI!

---

## 💰 Custos Estimados

| Serviço | Custo por | Estimativa |
|---------|-----------|------------|
| **Whisper API** | ~$0.006/min | Transcrição de áudio |
| **GPT-4 Turbo** | ~$0.01/1K tokens | Geração de texto |
| **Assistants API** | Similar GPT-4 | Respostas contextuais |
| **TOTAL por chamada** | **~$0.10** | Chamada de 10 minutos |

### Dicas para Economizar:

- Use modo DEMO para desenvolvimento e testes
- Configure limits na conta OpenAI
- Monitore uso em: https://platform.openai.com/usage
- Configure alertas de billing

---

## 🔒 Segurança

### ✅ Boas Práticas:

- [ ] NUNCA commitar o `.env` com a API Key
- [ ] Adicionar `.env` ao `.gitignore`
- [ ] Rotacionar a API Key periodicamente
- [ ] Usar variáveis de ambiente em produção
- [ ] Limitar rate de requisições
- [ ] Monitorar uso de créditos
- [ ] Revogar chaves não utilizadas

### ⚠️ O que NÃO fazer:

- ❌ Compartilhar a API Key
- ❌ Colocar no código fonte
- ❌ Enviar para GitHub
- ❌ Usar em múltiplos projetos
- ❌ Deixar sem monitoramento

---

## 🐛 Troubleshooting

### Erro: "Invalid API Key"

**Causa**: API Key incorreta ou inválida

**Solução**:
```bash
# Verificar se a chave está correta
cat apps/api/.env | grep OPENAI_API_KEY

# Deve começar com sk-proj- ou sk-
# Se não, reconfigurar com ./configure-openai.sh
```

---

### Erro: "Rate limit exceeded"

**Causa**: Muitas requisições em pouco tempo

**Solução**:
- Aguardar 1 minuto
- Verificar plano da conta: https://platform.openai.com/account/limits
- Fazer upgrade do plano se necessário

---

### Erro: "Insufficient credits"

**Causa**: Créditos da conta OpenAI esgotados

**Solução**:
- Verificar saldo: https://platform.openai.com/account/billing
- Adicionar créditos
- Configurar auto-recharge

---

### Erro: "Assistant not found"

**Causa**: Assistant ID incorreto ou assistente deletado

**Solução**:
```bash
# Verificar assistente no dashboard
# https://platform.openai.com/assistants

# Verificar ID no .env
cat apps/api/.env | grep OPENAI_ASSISTANT_ID
```

---

## 📊 Monitoramento

### Ver Uso em Tempo Real

```bash
# Dashboard OpenAI
https://platform.openai.com/usage

# Verificar custos
https://platform.openai.com/account/billing/overview
```

### Configurar Alertas

1. Acesse: https://platform.openai.com/account/billing
2. Configure **Budget alerts**
3. Defina limites diários/mensais
4. Adicione email para notificações

---

## 🔄 Voltar para Modo DEMO

Se quiser voltar para o modo DEMO (sem custos):

```bash
# Editar .env
nano apps/api/.env

# Substituir por:
OPENAI_API_KEY=sk-proj-SUBSTITUA_PELA_SUA_CHAVE_AQUI

# Reiniciar
pkill -f "nest"
cd apps/api && pnpm dev
```

---

## 📚 Recursos Adicionais

### Documentação OpenAI

- **API Keys**: https://platform.openai.com/api-keys
- **Assistants**: https://platform.openai.com/docs/assistants
- **Pricing**: https://openai.com/pricing
- **Usage**: https://platform.openai.com/usage

### Scripts Disponíveis

```bash
./configure-openai.sh   # Configurar API Key
./restart-backend.sh    # Reiniciar backend
./test-assistant.sh     # Testar integração
```

### Documentação do Projeto

- `ASSISTANT_INTEGRATION.md` - Integração completa
- `TEST_GUIDE.md` - Guia de testes
- `DEMO_TEST_RESULTS.md` - Resultados dos testes
- `ARCHITECTURE.md` - Arquitetura do sistema

---

## ✅ Checklist

Antes de ir para produção:

- [ ] API Key configurada e testada
- [ ] Modo PRODUCTION confirmado
- [ ] Custos estimados e aprovados
- [ ] Limites de budget configurados
- [ ] Monitoramento ativo
- [ ] Backup da API Key guardado
- [ ] Frontend conectado ao backend
- [ ] Testes end-to-end realizados
- [ ] Documentação revisada
- [ ] Equipe treinada

---

## 🎉 Pronto!

Após configurar a API Key, seu sistema estará usando a **IA real da OpenAI** para gerar sugestões inteligentes e contextualizadas!

**Qualquer dúvida**, consulte a documentação ou execute:
```bash
./test-assistant.sh
```

---

**Última atualização**: 23/10/2024  
**Versão**: 1.0.0

