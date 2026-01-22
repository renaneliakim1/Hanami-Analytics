#!/bin/bash
# Script de deploy rápido - Render + Vercel

echo "🚀 Deploy Rápido - Render + Vercel"
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
git add .

# 3. Commit
echo ""
echo -e "${YELLOW}💾 Criando commit...${NC}"
git commit -m "deploy: atualizar configurações para Render + Vercel

- Deploy em produção com Render (backend) e Vercel (frontend)
- CORS configurado corretamente
- Documentação atualizada"

# 4. Push
echo ""
echo -e "${YELLOW}🚀 Fazendo push para o repositório...${NC}"
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deploy iniciado com sucesso!${NC}"
    echo ""
    echo -e "${YELLOW}📄 PRÓXIMOS PASSOS:${NC}"
    echo "1. Render fará redeploy automático (~3-5 minutos)"
    echo "2. Vercel fará redeploy automático (~1-2 minutos)"
    echo "3. Aguarde conclusão dos builds"
    echo ""
    echo -e "${GREEN}🔗 LINKS ÚTEIS:${NC}"
    echo "- Render Dashboard: https://render.com/"
    echo "- Vercel Dashboard: https://vercel.com/"
    echo "- Frontend: https://hanami-analytics.vercel.app"
    echo "- Backend API: https://hanami-analytics-api.onrender.com/docs"
    echo ""
    echo -e "${GREEN}🧪 Teste após deploy:${NC}"
    echo "pwsh test_render.ps1"
else
    echo ""
    echo -e "${RED}❌ Erro ao fazer push${NC}"
    echo "Verifique sua conexão e permissões do Git"
    exit 1
fi
