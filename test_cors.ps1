# Script de teste CORS - Railway API
# Testa se o backend aceita requisições do frontend Vercel

Write-Host "🧪 Testando CORS - Backend Railway" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

$backendUrl = "https://hanami-analytics-prod-production.railway.app"
$frontendOrigin = "https://hanami-analytics.vercel.app"

# Teste 1: Health Check
Write-Host "📡 Teste 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -Method GET -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Headers CORS:" -ForegroundColor Gray
    $response.Headers.'Access-Control-Allow-Origin' | ForEach-Object { 
        Write-Host "   - Access-Control-Allow-Origin: $_" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 2: Preflight Request (OPTIONS)
Write-Host "📡 Teste 2: Preflight (OPTIONS /upload)" -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = $frontendOrigin
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    
    $response = Invoke-WebRequest -Uri "$backendUrl/upload" -Method OPTIONS -Headers $headers -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Headers CORS:" -ForegroundColor Gray
    
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "Access-Control-*" } | ForEach-Object {
        Write-Host "   - $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 3: Docs com Origin header
Write-Host "📡 Teste 3: GET /docs com Origin" -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = $frontendOrigin
    }
    
    $response = Invoke-WebRequest -Uri "$backendUrl/docs" -Method GET -Headers $headers -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    
    $corsHeader = $response.Headers.'Access-Control-Allow-Origin'
    if ($corsHeader) {
        Write-Host "   - Access-Control-Allow-Origin: $corsHeader" -ForegroundColor Gray
        
        if ($corsHeader -eq "*" -or $corsHeader -eq $frontendOrigin) {
            Write-Host "   ✅ CORS configurado corretamente!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  CORS pode ter problemas - valor: $corsHeader" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  Header Access-Control-Allow-Origin não encontrado" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Teste 4: Verificar se API está respondendo
Write-Host "📡 Teste 4: GET /api/filters/regions" -ForegroundColor Yellow
try {
    $headers = @{
        "Origin" = $frontendOrigin
    }
    
    $response = Invoke-WebRequest -Uri "$backendUrl/api/filters/regions" -Method GET -Headers $headers -UseBasicParsing
    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Resposta: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Resumo
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "📋 Resumo dos Testes" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Backend URL: $backendUrl" -ForegroundColor White
Write-Host "Frontend Origin: $frontendOrigin" -ForegroundColor White
Write-Host ""
Write-Host "Se todos os testes passaram ✅, o CORS está funcionando!" -ForegroundColor Green
Write-Host "Se houver erros ❌, verifique os logs do Railway." -ForegroundColor Yellow
Write-Host ""
Write-Host "💡 Próximo passo: Testar upload de arquivo no frontend" -ForegroundColor Cyan
Write-Host "   Abra: $frontendOrigin" -ForegroundColor White
