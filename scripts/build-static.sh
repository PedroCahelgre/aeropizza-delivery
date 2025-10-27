#!/bin/bash

# Script de Build Otimizado para Deploy Estático
# Uso: ./scripts/build-static.sh

echo "🚀 Iniciando build estático otimizado..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    error "package.json não encontrado. Execute este script na raiz do projeto."
fi

# Limpar builds anteriores
log "🧹 Limpando builds anteriores..."
rm -rf .next out dist

# Verificar dependências
log "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    log "📥 Instalando dependências..."
    npm ci || error "Falha ao instalar dependências"
fi

# Verificar TypeScript
log "🔍 Verificando tipos TypeScript..."
npm run type-check || warning "Erros de TypeScript encontrados, mas continuando..."

# Lint
log "🔧 Executando lint..."
npm run lint:fix || warning "Erros de lint encontrados, mas continuando..."

# Build estático
log "🏗️  Iniciando build estático..."
NODE_ENV=production npm run build:static || error "Falha no build estático"

# Verificar se o build foi gerado
if [ ! -d "out" ]; then
    error "Pasta 'out' não encontrada. Build falhou."
fi

# Verificar tamanho do build
BUILD_SIZE=$(du -sh out | cut -f1)
log "📊 Tamanho do build: $BUILD_SIZE"

# Verificar arquivos críticos
CRITICAL_FILES=("index.html" "_next")
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -e "out/$file" ]; then
        warning "Arquivo crítico não encontrado: $file"
    fi
done

# Otimizar imagens se houver
if command -v imagemin &> /dev/null; then
    log "🖼️  Otimizando imagens..."
    find out -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | xargs imagemin --out-dir=out
fi

# Gerar relatório do build
log "📋 Gerando relatório do build..."
cat > build-report.txt << EOF
=== RELATÓRIO DE BUILD ESTÁTICO ===
Data: $(date)
Projeto: AeroPizza
Tamanho: $BUILD_SIZE
Arquivos: $(find out -type f | wc -l)

Estrutura de pastas:
$(tree out -L 2 2>/dev/null || find out -type d | head -10)

=== FIM DO RELATÓRIO ===
EOF

log "✅ Build estático concluído com sucesso!"
log "📁 Arquivos gerados em: ./out"
log "🚀 Para testar localmente: npm run start:static"
log "📋 Relatório gerado em: build-report.txt"

# Perguntar se quer iniciar servidor local
echo
read -p "Deseja iniciar o servidor local para testar? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "🌐 Iniciando servidor local..."
    npm run start:static
fi