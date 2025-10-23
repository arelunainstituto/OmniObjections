#!/bin/bash

# Script de Teste da Integração OpenAI Assistant
# OmniObjections - Grupo Areluna

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 TESTE DE INTEGRAÇÃO - OPENAI ASSISTANT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se o backend está rodando
echo "🔍 Verificando se o backend está rodando..."
if curl -s http://localhost:3101/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend está rodando!${NC}"
else
    echo -e "${RED}❌ Backend não está rodando${NC}"
    echo ""
    echo "Inicie o backend com:"
    echo "  cd apps/api && pnpm dev"
    echo ""
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 TESTE 1: Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

curl -s http://localhost:3101/health | jq '.' || curl -s http://localhost:3101/health
echo ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 TESTE 2: Testar Conexão com Assistant"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "GET http://localhost:3101/api/assistant/test"
echo ""

RESPONSE=$(curl -s http://localhost:3101/api/assistant/test)
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"

# Verificar se conectou
if echo "$RESPONSE" | grep -q '"connected":true' 2>/dev/null; then
    echo ""
    echo -e "${GREEN}✅ CONEXÃO COM ASSISTANT ESTABELECIDA!${NC}"
else
    echo ""
    echo -e "${YELLOW}⚠️  Verifique sua OpenAI API Key em apps/api/.env${NC}"
fi

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 TESTE 3: Informações do Assistant"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "GET http://localhost:3101/api/assistant/info"
echo ""

curl -s http://localhost:3101/api/assistant/info | jq '.' 2>/dev/null || curl -s http://localhost:3101/api/assistant/info

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📡 TESTE 4: Gerar Sugestão para Objeção"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "POST http://localhost:3101/api/assistant/generate"
echo ""
echo -e "${BLUE}Objeção:${NC} \"Está muito caro\""
echo ""

SUGGESTION=$(curl -s -X POST http://localhost:3101/api/assistant/generate \
  -H "Content-Type: application/json" \
  -d '{
    "objectionText": "Está muito caro",
    "conversationContext": [
      "Comercial: Olá! Como posso ajudar você hoje?",
      "Lead: Gostaria de saber sobre os tratamentos de harmonização facial",
      "Comercial: Temos diversos tratamentos! O mais procurado é o preenchimento labial.",
      "Lead: Quanto custa?"
    ],
    "knowledgeContext": "Preenchimento Labial: A partir de R$ 1.200,00. Inclui consulta com dermatologista, anestesia tópica, preenchedor de ácido hialurônico premium (Juvederm ou similar), acompanhamento pós-procedimento. Duração: 12-18 meses. Resultado natural e seguro."
  }')

echo "$SUGGESTION" | jq '.' 2>/dev/null || echo "$SUGGESTION"

# Verificar se gerou sugestão
if echo "$SUGGESTION" | grep -q '"suggestion"' 2>/dev/null; then
    echo ""
    echo -e "${GREEN}✅ SUGESTÃO GERADA COM SUCESSO!${NC}"
    echo ""
    echo -e "${BLUE}💡 Sugestão do Assistente:${NC}"
    echo "$SUGGESTION" | jq -r '.suggestion' 2>/dev/null || echo "$SUGGESTION"
else
    echo ""
    echo -e "${YELLOW}⚠️  Não foi possível gerar sugestão. Verifique a API Key.${NC}"
fi

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO DOS TESTES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Endpoints testados:"
echo "   • GET  /health"
echo "   • GET  /api/assistant/test"
echo "   • GET  /api/assistant/info"
echo "   • POST /api/assistant/generate"
echo ""
echo "🎯 Para configurar sua OpenAI API Key:"
echo "   1. Acesse: https://platform.openai.com/api-keys"
echo "   2. Crie uma nova API Key"
echo "   3. Edite: apps/api/.env"
echo "   4. Substitua: OPENAI_API_KEY=sua_chave_aqui"
echo "   5. Reinicie o backend"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

