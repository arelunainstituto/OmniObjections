#!/bin/bash

# Script para reiniciar o backend após configurar API Key

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 REINICIANDO BACKEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Parar processos existentes
echo "🛑 Parando processos do backend..."
pkill -f "nest" 2>/dev/null
sleep 2

# Limpar porta
echo "🧹 Limpando porta 3101..."
lsof -ti:3101 | xargs kill -9 2>/dev/null

sleep 2

# Verificar se API Key está configurada
if grep -q "OPENAI_API_KEY=sk-" apps/api/.env; then
    echo -e "${GREEN}✅ OpenAI API Key encontrada${NC}"
    MODE="PRODUCTION"
else
    echo -e "${YELLOW}⚠️  OpenAI API Key não configurada - modo DEMO${NC}"
    MODE="DEMO"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Iniciando backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   Modo: $MODE"
echo "   Porta: 3101"
echo ""
echo "   Logs aparecerão abaixo..."
echo "   Pressione Ctrl+C para parar"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar backend
cd apps/api && pnpm dev

