#!/bin/bash
# Script para validar estrutura dos filtros e componentes

echo "🔍 Verificação de Filtros - Analyze Joy Hub"
echo "=========================================="
echo ""

# Verificar se os arquivos principais existem
echo "📁 Verificando estrutura de arquivos..."
FILES=(
  "frontend/src/components/Dashboard.tsx"
  "frontend/src/components/DateRangePicker.tsx"
  "frontend/src/hooks/useFilteredSalesData.ts"
  "frontend/src/hooks/useApiReport.ts"
  "frontend/src/types/sales.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (NÃO ENCONTRADO)"
  fi
done

echo ""
echo "📊 Verificando implementação dos filtros..."
echo ""

# Procurar por "shouldUseFiltered" no Dashboard
echo "1️⃣  Verificando shouldUseFiltered em Dashboard.tsx:"
grep -n "shouldUseFiltered = " frontend/src/components/Dashboard.tsx || echo "   ⚠️  Não encontrado"

echo ""
echo "2️⃣  Verificando região sendo passada para useFilteredSalesData:"
grep -n "useFilteredSalesData.*region" frontend/src/components/Dashboard.tsx || echo "   ⚠️  Não encontrado"

echo ""
echo "3️⃣  Verificando DateRangePicker com seletor de região:"
grep -n "selectedRegion\|REGIOES" frontend/src/components/DateRangePicker.tsx | head -5 || echo "   ⚠️  Não encontrado"

echo ""
echo "4️⃣  Verificando hook useFilteredSalesData:"
if grep -q "useFilteredSalesData" frontend/src/hooks/useFilteredSalesData.ts; then
  echo "   ✅ Hook exportado"
  grep -n "export const useFilteredSalesData" frontend/src/hooks/useFilteredSalesData.ts
else
  echo "   ❌ Hook não encontrado"
fi

echo ""
echo "5️⃣  Verificando filtro por região no hook:"
grep -n "record.regiao" frontend/src/hooks/useFilteredSalesData.ts || echo "   ⚠️  Filtro por regiao não encontrado"

echo ""
echo "📋 Resumo de Implementação:"
echo "============================"
echo ""

# Contar graficos
GRAFICOS=$(grep -o "vendasPorMes\|vendasPorCategoria\|produtosMaisVendidos\|clientesPorGenero\|vendasPorEstado\|formaPagamento\|clientesPorIdade\|parcelamentoMedio\|statusEntrega\|avaliacaoPorProduto" frontend/src/components/Dashboard.tsx | sort -u | wc -l)
echo "Gráficos implementados: $GRAFICOS"

# Contar KPIs
KPIS=$(grep -o "faturamentoTotal\|lucroTotal\|quantidadeVendas\|clientesUnicos\|ticketMedio\|avaliacaoMedia" frontend/src/components/Dashboard.tsx | sort -u | wc -l)
echo "KPIs implementados: $KPIS"

# Verificar regions
echo ""
echo "Regiões disponíveis:"
grep -A 10 "const REGIOES" frontend/src/components/DateRangePicker.tsx | grep "value:" | awk '{print "  - " $2}' | tr -d '","'

echo ""
echo "✅ Verificação concluída!"
echo ""
echo "🎯 Próximos passos:"
echo "   1. Iniciar o frontend (bun dev)"
echo "   2. Testar filtro de região (Sudeste)"
echo "   3. Verificar console para logs de rastreamento"
echo "   4. Validar que todos os 11 gráficos atualizam"
echo ""
