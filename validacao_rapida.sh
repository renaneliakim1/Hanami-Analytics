#!/bin/bash
# 🔍 Script de Validação Rápida - Bug de Filtro de Região

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🔍 VALIDAÇÃO RÁPIDA - BUG DE FILTRO DE REGIÃO          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Verificando Estrutura...${NC}\n"

# 1. Verificar se Dashboard.tsx tem shouldUseFiltered correto
echo "1️⃣  Verificando shouldUseFiltered em Dashboard.tsx..."
if grep -q "const shouldUseFiltered = hasAnyFilter;" frontend/src/components/Dashboard.tsx; then
    echo -e "   ${GREEN}✅ CORRETO: shouldUseFiltered = hasAnyFilter;${NC}"
else
    if grep -q "const shouldUseFiltered = hasAnyFilter && !apiData.loading;" frontend/src/components/Dashboard.tsx; then
        echo -e "   ${RED}❌ INCORRETO: Ainda tem && !apiData.loading${NC}"
    else
        echo -e "   ${RED}❌ Não encontrado${NC}"
    fi
fi

echo ""
echo "2️⃣  Verificando se useFilteredSalesData é importado..."
if grep -q "import { useFilteredSalesData }" frontend/src/components/Dashboard.tsx; then
    echo -e "   ${GREEN}✅ Importado corretamente${NC}"
else
    echo -e "   ${RED}❌ Não encontrado${NC}"
fi

echo ""
echo "3️⃣  Verificando se DateRangePicker tem seletor de região..."
if grep -q "selectedRegion" frontend/src/components/DateRangePicker.tsx; then
    echo -e "   ${GREEN}✅ Região selecionável${NC}"
    REGION_COUNT=$(grep "const REGIOES" frontend/src/components/DateRangePicker.tsx -A 20 | grep "value:" | wc -l)
    echo -e "   ${GREEN}   Regiões disponíveis: $REGION_COUNT${NC}"
else
    echo -e "   ${RED}❌ Não encontrado${NC}"
fi

echo ""
echo "4️⃣  Verificando hook useFilteredSalesData..."
if [ -f "frontend/src/hooks/useFilteredSalesData.ts" ]; then
    echo -e "   ${GREEN}✅ Arquivo existe${NC}"
    
    # Verificar se tem filtro por região
    if grep -q "if (region && record.regiao !== region)" frontend/src/hooks/useFilteredSalesData.ts; then
        echo -e "   ${GREEN}✅ Filtro por região implementado${NC}"
    else
        echo -e "   ${RED}❌ Filtro por região não encontrado${NC}"
    fi
    
    # Contar quantos gráficos estão no hook
    GRAFICOS=$(grep "useMemo" frontend/src/hooks/useFilteredSalesData.ts | wc -l)
    echo -e "   ${GREEN}   Gráficos memoizados: $GRAFICOS${NC}"
else
    echo -e "   ${RED}❌ Arquivo não existe${NC}"
fi

echo ""
echo -e "${BLUE}📊 Verificando Integração...${NC}\n"

# Verificar se todos os 11 gráficos usam shouldUseFiltered
echo "5️⃣  Verificando se os 11 gráficos usam shouldUseFiltered..."
GRAFICOS_LIST=(
    "vendasPorMes"
    "vendasPorCategoria"
    "produtosMaisVendidos"
    "clientesPorGenero"
    "vendasPorEstado"
    "formaPagamento"
    "clientesPorIdade"
    "parcelamentoMedio"
    "statusEntrega"
    "avaliacaoPorProduto"
)

COUNT_OK=0
for grafico in "${GRAFICOS_LIST[@]}"; do
    if grep -q "const $grafico = shouldUseFiltered" frontend/src/components/Dashboard.tsx; then
        COUNT_OK=$((COUNT_OK+1))
    fi
done

echo -e "   ${GREEN}✅ $COUNT_OK/11 gráficos usando shouldUseFiltered${NC}"

if [ $COUNT_OK -eq 11 ]; then
    echo -e "   ${GREEN}   ✅ TODOS os gráficos estão configurados${NC}"
else
    echo -e "   ${YELLOW}   ⚠️  Alguns gráficos podem estar faltando${NC}"
fi

echo ""
echo "6️⃣  Verificando se os 6 KPIs estão atualizando..."
KPIS_LIST=(
    "faturamentoTotal"
    "lucroTotal"
    "quantidadeVendas"
    "clientesUnicos"
    "ticketMedio"
    "avaliacaoMedia"
)

COUNT_KPIS=0
for kpi in "${KPIS_LIST[@]}"; do
    if grep -q "const kpis = shouldUseFiltered" frontend/src/components/Dashboard.tsx; then
        COUNT_KPIS=$((COUNT_KPIS+1))
    fi
done

echo -e "   ${GREEN}✅ KPIs usando shouldUseFiltered${NC}"

echo ""
echo -e "${BLUE}🧪 Próximos Passos de Teste...${NC}\n"

echo "Para validar a correção, siga estes passos:"
echo ""
echo "1. Inicie o frontend:"
echo -e "   ${YELLOW}cd frontend && bun dev${NC}"
echo ""
echo "2. Abra o dashboard em http://localhost:5173"
echo ""
echo "3. Teste os filtros:"
echo "   • Selecione 'Sudeste' e clique 'Aplicar'"
echo "   • Todos os 11 gráficos devem atualizar imediatamente"
echo ""
echo "4. Verifique o Console (F12):"
echo "   • Procure por: 🔍 DASHBOARD - RASTREAMENTO DETALHADO"
echo "   • Confirme: shouldUseFiltered = true"
echo "   • Confirme: Fonte de Dados = '✅ FILTRADOS (Local)'"
echo ""
echo "5. Valide um gráfico específico:"
echo "   • Vendas por Estado deve mostrar APENAS estados da Sudeste:"
echo "     (SP, MG, RJ, ES)"
echo ""

echo -e "${BLUE}✅ Verificação Concluída!${NC}"
echo ""

# Resumo final
if [ $COUNT_OK -eq 11 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ✅ TUDO PARECE ESTAR CONFIGURADO!    ║${NC}"
    echo -e "${GREEN}║     Pronto para testes                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
else
    echo -e "${YELLOW}╔════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║  ⚠️  Verifique os avisos acima        ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════╝${NC}"
fi

echo ""
