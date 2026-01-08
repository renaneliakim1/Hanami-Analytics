#!/bin/bash

# Script de teste rápido dos endpoints de exportação
# Uso: ./test_export.sh

echo "🧪 Testando Endpoints de Exportação do Hanami Analytics"
echo "======================================================="
echo ""

API_URL="http://localhost:8000"

# Verificar se a API está rodando
echo "1. Verificando se a API está disponível..."
if curl -s "$API_URL" > /dev/null; then
    echo "✅ API está respondendo em $API_URL"
else
    echo "❌ API não está respondendo. Inicie o backend primeiro:"
    echo "   cd api && python main.py"
    exit 1
fi

echo ""
echo "2. Testando exportação CSV sem filtros..."
curl -s -o "test_export_no_filter.csv" "$API_URL/export/csv"
if [ -f "test_export_no_filter.csv" ]; then
    echo "✅ CSV exportado: test_export_no_filter.csv"
    wc -l test_export_no_filter.csv
else
    echo "❌ Falha ao exportar CSV"
fi

echo ""
echo "3. Testando exportação Excel sem filtros..."
curl -s -o "test_export_no_filter.xlsx" "$API_URL/export/excel"
if [ -f "test_export_no_filter.xlsx" ]; then
    echo "✅ Excel exportado: test_export_no_filter.xlsx"
    ls -lh test_export_no_filter.xlsx
else
    echo "❌ Falha ao exportar Excel"
fi

echo ""
echo "4. Testando exportação CSV com filtro de data..."
curl -s -o "test_export_date_filter.csv" "$API_URL/export/csv?start_date=2024-01-01&end_date=2024-06-30"
if [ -f "test_export_date_filter.csv" ]; then
    echo "✅ CSV com filtro de data: test_export_date_filter.csv"
    wc -l test_export_date_filter.csv
else
    echo "❌ Falha ao exportar CSV com filtro"
fi

echo ""
echo "5. Testando exportação Excel com filtro de região..."
curl -s -o "test_export_region_filter.xlsx" "$API_URL/export/excel?region=Sudeste"
if [ -f "test_export_region_filter.xlsx" ]; then
    echo "✅ Excel com filtro de região: test_export_region_filter.xlsx"
    ls -lh test_export_region_filter.xlsx
else
    echo "❌ Falha ao exportar Excel com filtro"
fi

echo ""
echo "6. Testando exportação com todos os filtros..."
curl -s -o "test_export_all_filters.xlsx" "$API_URL/export/excel?start_date=2024-01-01&end_date=2024-12-31&region=Sul"
if [ -f "test_export_all_filters.xlsx" ]; then
    echo "✅ Excel com todos os filtros: test_export_all_filters.xlsx"
    ls -lh test_export_all_filters.xlsx
else
    echo "❌ Falha ao exportar Excel com filtros"
fi

echo ""
echo "======================================================="
echo "✅ Testes concluídos!"
echo ""
echo "Arquivos gerados:"
ls -lh test_export_*.{csv,xlsx} 2>/dev/null
echo ""
echo "Para limpar arquivos de teste:"
echo "rm test_export_*.csv test_export_*.xlsx"
