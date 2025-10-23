#!/bin/bash

# Script para configurar OpenAI API Key
# OmniObjections - Grupo Areluna

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 CONFIGURAÇÃO DA OPENAI API KEY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se .env existe
if [ ! -f "apps/api/.env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo ""
    echo "Criando arquivo .env..."
    cp apps/api/env.example apps/api/.env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
fi

echo "📋 PASSO 1: Obter OpenAI API Key"
echo ""
echo "   1. Acesse: https://platform.openai.com/api-keys"
echo "   2. Faça login"
echo "   3. Clique em 'Create new secret key'"
echo "   4. Copie a chave (sk-proj-...)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Solicitar API Key
echo -e "${BLUE}🔐 Cole sua OpenAI API Key:${NC}"
echo -e "${YELLOW}(A chave não será exibida por segurança)${NC}"
read -s API_KEY

echo ""

# Validar formato da chave
if [[ ! $API_KEY =~ ^sk- ]]; then
    echo -e "${RED}❌ API Key inválida! Deve começar com 'sk-'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API Key recebida${NC}"
echo ""

# Fazer backup do .env
cp apps/api/.env apps/api/.env.backup
echo -e "${GREEN}✅ Backup do .env criado${NC}"

# Atualizar .env
if grep -q "OPENAI_API_KEY=" apps/api/.env; then
    # Substituir linha existente
    sed -i '' "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$API_KEY|" apps/api/.env
else
    # Adicionar nova linha
    echo "OPENAI_API_KEY=$API_KEY" >> apps/api/.env
fi

echo -e "${GREEN}✅ API Key configurada no .env${NC}"
echo ""

# Verificar configuração
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 VERIFICANDO CONFIGURAÇÃO:"
echo ""

KEY_SET=$(grep "OPENAI_API_KEY=" apps/api/.env | cut -d'=' -f2)
if [[ $KEY_SET == sk-* ]]; then
    echo -e "${GREEN}✅ OPENAI_API_KEY: sk-***...${KEY_SET: -4}${NC}"
else
    echo -e "${RED}❌ OPENAI_API_KEY: não configurada${NC}"
fi

ASSISTANT_ID=$(grep "OPENAI_ASSISTANT_ID=" apps/api/.env | cut -d'=' -f2)
echo -e "${GREEN}✅ OPENAI_ASSISTANT_ID: $ASSISTANT_ID${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🔄 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Reiniciar o backend:"
echo "   pkill -f \"nest\""
echo "   cd apps/api && pnpm dev"
echo ""
echo "2. Testar conexão:"
echo "   curl http://localhost:3101/api/assistant/test"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo ""

