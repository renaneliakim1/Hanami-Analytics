# Script de teste CORS - Render + Vercel
Write-Host "🧪 Testando CORS do Backend (Render)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$BACKEND_URL = "https://hanami-analytics-api.onrender.com"
$FRONTEND_URL = "https://hanami-analytics.vercel.app"

Write-Host "🎯 Testando endpoints..." -ForegroundColor Yellow
Write-Host ""

# Teste 1: Health Check
Write-Host "1️⃣ Health Check" -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/" -Method GET -UseBasicParsing
    Write-Host "✅ Backend respondendo: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erro ao conectar no backend" -ForegroundColor Red
    Write-Host "   Verifique se o Render está 'Live' (pode estar hibernando)" -ForegroundColor Yellow
    Write-Host "   Primeiro request pode levar 30-60 segundos no free tier" -ForegroundColor Yellow
}

Write-Host ""

# Teste 2: CORS Headers
Write-Host "2️⃣ Headers CORS" -ForegroundColor White
try {
    $headers = @{
        "Origin" = $FRONTEND_URL
    }
    
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/sales" -Method GET -Headers $headers -UseBasicParsing
    
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    
    if ($corsHeader -eq $FRONTEND_URL -or $corsHeader -eq "*") {
        Write-Host "✅ CORS configurado corretamente: $corsHeader" -ForegroundColor Green
    } else {
        Write-Host "⚠️ CORS pode estar incorreto: $corsHeader" -ForegroundColor Yellow
    }
    
    Write-Host "   Headers CORS recebidos:" -ForegroundColor Gray
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "Access-Control-*" } | ForEach-Object {
        Write-Host "   - $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erro ao testar CORS: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 3: Preflight Request
Write-Host "3️⃣ Preflight (OPTIONS)" -ForegroundColor White
try {
    $headers = @{
        "Origin" = $FRONTEND_URL
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/upload" -Method OPTIONS -Headers $headers -UseBasicParsing
    Write-Host "✅ Preflight OK: $($response.StatusCode)" -ForegroundColor Green
    
    Write-Host "   Headers permitidos:" -ForegroundColor Gray
    $response.Headers.GetEnumerator() | Where-Object { $_.Key -like "Access-Control-*" } | ForEach-Object {
        Write-Host "   - $($_.Key): $($_.Value)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Erro no preflight: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 4: Swagger Docs
Write-Host "4️⃣ Swagger Docs" -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "$BACKEND_URL/docs" -Method GET -UseBasicParsing
    Write-Host "✅ Swagger disponível: $BACKEND_URL/docs" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao acessar Swagger: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "🔗 URLs de Produção:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: $FRONTEND_URL" -ForegroundColor Blue
Write-Host "Backend:  $BACKEND_URL" -ForegroundColor Blue
Write-Host "Swagger:  $BACKEND_URL/docs" -ForegroundColor Blue
Write-Host ""
Write-Host "💡 Dica: Abra o frontend e teste upload de CSV" -ForegroundColor Yellow
Write-Host "💡 Nota: Se houver erro 503, aguarde ~60s (Render hibernando)" -ForegroundColor Yellow
