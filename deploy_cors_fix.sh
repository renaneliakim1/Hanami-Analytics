#!/bin/bash
# Script de deploy rápido - Correção CORS

echo "🚀 Deploy Rápido - Correção CORS"
echo "=================================="
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -f "api/main.py" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

# 1. Status do Git
echo -e "${YELLOW}📋 Verificando status do Git...${NC}"
git status --short

# 2. Adicionar arquivos modificados
echo ""
echo -e "${YELLOW}📦 Adicionando arquivos...${NC}"
git add api/main.py
git add docs/DEPLOY_CORS_FIX.md
git add test_cors.ps1
git add deploy_cors_fix.sh

# 3. Commit
echo ""
echo -e "${YELLOW}💾 Criando commit...${NC}"
git commit -m "fix: corrigir CORS para deploy Vercel + Railway

- Adicionar middleware CORS oficial do FastAPI
- Configurar allow_origins=['*'] para aceitar todas as origens
- Manter middleware customizado como fallback
- Suportar requisições do frontend Vercel
- Resolver erro: Access-Control-Allow-Origin blocked"

# 4. Push
echo ""
echo -e "${YELLOW}🚀 Fazendo push para o repositório...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deploy iniciado com sucesso!${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Railway fará redeploy automático (2-3 minutos)"
    echo "2. Aguarde conclusão do build no dashboard Railway"
    echo "3. Teste o CORS executando: pwsh test_cors.ps1"
    echo "4. Teste upload no frontend: https://hanami-analytics.vercel.app"
    echo ""
    echo -e "${YELLOW}🔗 Links úteis:${NC}"
    echo "- Railway Dashboard: https://railway.app/dashboard"
    echo "- Frontend Vercel: https://hanami-analytics.vercel.app"
    echo "- Backend API: https://hanami-analytics-prod-production.railway.app/docs"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    echo "Verifique suas credenciais e conexão com o repositório"
    exit 1
fi
