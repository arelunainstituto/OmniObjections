#!/bin/bash

# OmniObjections - Script de Setup Automático
# Este script configura o ambiente de desenvolvimento completo

set -e  # Parar em caso de erro

echo "🚀 OmniObjections - Setup Automático"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funções auxiliares
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "ℹ $1"
}

# Verificar Node.js
echo "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js versão 18+ é necessária. Você tem: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) encontrado"

# Verificar pnpm
echo ""
echo "Verificando pnpm..."
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm não encontrado. Instalando..."
    npm install -g pnpm
    print_success "pnpm instalado"
else
    print_success "pnpm $(pnpm -v) encontrado"
fi

# Instalar dependências
echo ""
echo "Instalando dependências..."
pnpm install
print_success "Dependências instaladas"

# Verificar Docker (para Supabase local)
echo ""
echo "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    print_warning "Docker não encontrado. Você precisará de Docker para rodar Supabase localmente."
    read -p "Continuar mesmo assim? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "Docker encontrado"
fi

# Configurar variáveis de ambiente
echo ""
echo "Configurando variáveis de ambiente..."

# API
if [ ! -f "apps/api/.env" ]; then
    cp apps/api/env.example apps/api/.env
    print_warning "Arquivo apps/api/.env criado. EDITE-O com suas chaves!"
else
    print_info "apps/api/.env já existe"
fi

# Web
if [ ! -f "apps/web/.env.local" ]; then
    cat > apps/web/.env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
EOL
    print_warning "Arquivo apps/web/.env.local criado. EDITE-O com suas chaves!"
else
    print_info "apps/web/.env.local já existe"
fi

# DB
if [ ! -f "packages/db/.env" ]; then
    cat > packages/db/.env << EOL
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_key_here
EOL
    print_warning "Arquivo packages/db/.env criado. EDITE-O com suas chaves!"
else
    print_info "packages/db/.env já existe"
fi

print_success "Arquivos de ambiente criados"

# Perguntar se quer iniciar Supabase
echo ""
read -p "Deseja iniciar o Supabase local agora? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd packages/db
    
    # Verificar se Supabase CLI está instalado
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI não encontrado. Instalando..."
        pnpm add -g supabase
        print_success "Supabase CLI instalado"
    fi
    
    # Iniciar Supabase
    print_info "Iniciando Supabase (pode demorar alguns minutos)..."
    pnpm db:start
    print_success "Supabase iniciado!"
    
    # Aplicar migrations
    print_info "Aplicando migrations..."
    pnpm db:reset
    print_success "Migrations aplicadas!"
    
    # Seed
    print_info "Inserindo dados de exemplo..."
    PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
    print_success "Dados de exemplo inseridos!"
    
    cd ../..
fi

# Resumo final
echo ""
echo "======================================"
echo -e "${GREEN}✓ Setup Concluído!${NC}"
echo "======================================"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Edite os arquivos .env com suas chaves:"
echo "   - apps/api/.env (OPENAI_API_KEY é obrigatória)"
echo "   - apps/web/.env.local"
echo "   - packages/db/.env"
echo ""
echo "2. Obtenha sua OpenAI API key em:"
echo "   https://platform.openai.com/api-keys"
echo ""
echo "3. Inicie o projeto:"
echo "   pnpm dev"
echo ""
echo "4. Acesse:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:3001"
echo "   - Supabase Studio: http://localhost:54323"
echo ""
echo "📚 Documentação:"
echo "   - README.md - Visão geral"
echo "   - SETUP.md - Guia detalhado"
echo "   - ARCHITECTURE.md - Arquitetura"
echo ""
echo "🆘 Problemas? Veja SETUP.md ou abra uma issue no GitHub"
echo ""
print_success "Bom desenvolvimento! 🚀"

