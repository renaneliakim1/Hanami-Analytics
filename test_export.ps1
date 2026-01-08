# Script de teste PowerShell para endpoints de exportação
# Uso: .\test_export.ps1

Write-Host "🧪 Testando Endpoints de Exportação do Hanami Analytics" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:8000"

# Verificar se a API está rodando
Write-Host "1. Verificando se a API está disponível..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $API_URL -Method GET -UseBasicParsing
    Write-Host "✅ API está respondendo em $API_URL" -ForegroundColor Green
} catch {
    Write-Host "❌ API não está respondendo. Inicie o backend primeiro:" -ForegroundColor Red
    Write-Host "   cd api; python main.py" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Testando exportação CSV sem filtros..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$API_URL/export/csv" -OutFile "test_export_no_filter.csv"
    if (Test-Path "test_export_no_filter.csv") {
        $lines = (Get-Content "test_export_no_filter.csv" | Measure-Object -Line).Lines
        Write-Host "✅ CSV exportado: test_export_no_filter.csv ($lines linhas)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Falha ao exportar CSV: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testando exportação Excel sem filtros..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$API_URL/export/excel" -OutFile "test_export_no_filter.xlsx"
    if (Test-Path "test_export_no_filter.xlsx") {
        $size = (Get-Item "test_export_no_filter.xlsx").Length / 1KB
        Write-Host "✅ Excel exportado: test_export_no_filter.xlsx ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Falha ao exportar Excel: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testando exportação CSV com filtro de data..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$API_URL/export/csv?start_date=2024-01-01&end_date=2024-06-30" -OutFile "test_export_date_filter.csv"
    if (Test-Path "test_export_date_filter.csv") {
        $lines = (Get-Content "test_export_date_filter.csv" | Measure-Object -Line).Lines
        Write-Host "✅ CSV com filtro de data: test_export_date_filter.csv ($lines linhas)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Falha ao exportar CSV com filtro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Testando exportação Excel com filtro de região..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$API_URL/export/excel?region=Sudeste" -OutFile "test_export_region_filter.xlsx"
    if (Test-Path "test_export_region_filter.xlsx") {
        $size = (Get-Item "test_export_region_filter.xlsx").Length / 1KB
        Write-Host "✅ Excel com filtro de região: test_export_region_filter.xlsx ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Falha ao exportar Excel com filtro: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "6. Testando exportação com todos os filtros..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$API_URL/export/excel?start_date=2024-01-01&end_date=2024-12-31&region=Sul" -OutFile "test_export_all_filters.xlsx"
    if (Test-Path "test_export_all_filters.xlsx") {
        $size = (Get-Item "test_export_all_filters.xlsx").Length / 1KB
        Write-Host "✅ Excel com todos os filtros: test_export_all_filters.xlsx ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Falha ao exportar Excel com filtros: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "✅ Testes concluídos!" -ForegroundColor Green
Write-Host ""
Write-Host "Arquivos gerados:" -ForegroundColor Yellow
Get-ChildItem -Path . -Filter "test_export_*" | Select-Object Name, @{Name="Tamanho (KB)";Expression={[math]::Round($_.Length / 1KB, 2)}} | Format-Table
Write-Host ""
Write-Host "Para limpar arquivos de teste:" -ForegroundColor Yellow
Write-Host "Remove-Item test_export_*.csv, test_export_*.xlsx" -ForegroundColor Cyan
