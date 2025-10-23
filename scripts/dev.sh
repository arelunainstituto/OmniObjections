#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento

echo "🚀 Iniciando OmniObjections..."
echo ""

# Verificar se Supabase está rodando
if ! curl -s http://localhost:54321/health > /dev/null 2>&1; then
    echo "⚠️  Supabase não está rodando!"
    echo ""
    read -p "Deseja iniciar o Supabase agora? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd packages/db
        pnpm db:start
        cd ../..
        echo "✓ Supabase iniciado"
    else
        echo "❌ Continuando sem Supabase (algumas funcionalidades não funcionarão)"
    fi
else
    echo "✓ Supabase já está rodando"
fi

echo ""
echo "Iniciando aplicação..."
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo "Supabase Studio: http://localhost:54323"
echo ""

# Iniciar aplicação
pnpm dev

