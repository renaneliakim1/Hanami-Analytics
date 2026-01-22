# 🚀 Deploy em Produção - Vercel + Render

**Status**: ✅ Em produção desde 22/01/2026

## 🌐 URLs de Produção

- **Frontend**: https://hanami-analytics.vercel.app
- **Backend API**: https://hanami-analytics-api.onrender.com
- **Swagger Docs**: https://hanami-analytics-api.onrender.com/docs

---

## ✨ Visão Geral

O projeto está deployado em duas plataformas gratuitas:

| Camada | Plataforma | Status | URL |
|--------|-----------|--------|-----|
| Frontend | Vercel | ✅ Live | https://hanami-analytics.vercel.app |
| Backend | Render | ✅ Live | https://hanami-analytics-api.onrender.com |

---

## 🔧 Configuração Atual

### Frontend (Vercel)

**Variáveis de Ambiente:**
```
VITE_API_URL=https://hanami-analytics-api.onrender.com
VITE_API_TIMEOUT=30000
```

**Build Settings:**
```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

### Backend (Render)

**Build Settings:**
```
Environment: Python 3
Build Command: pip install -r api/requirements.txt
Start Command: cd api && uvicorn main:app --host 0.0.0.0 --port $PORT
Branch: main
Region: Frankfurt (europe-west1)
```

**Variáveis de Ambiente:**
```
CORS_ALLOWED_ORIGINS=https://hanami-analytics.vercel.app
PYTHON_VERSION=3.11
```

**Configuração via render.yaml:**
```yaml
services:
  - type: web
    name: hanami-analytics-api
    env: python
    buildCommand: "pip install -r api/requirements.txt"
    startCommand: "cd api && uvicorn main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11
      - key: CORS_ALLOWED_ORIGINS
        value: https://hanami-analytics.vercel.app
```

---

## 🔄 Workflow de Deploy

### Deploy Automático

Ambas as plataformas fazem deploy automático ao detectar mudanças no repositório GitHub:

1. **Push para main:**
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

2. **Vercel**: Deploy automático do frontend (~1-2 minutos)
3. **Render**: Deploy automático do backend (~3-5 minutos)

### Deploy Manual

**Vercel:**
1. Dashboard → Deployments → ... → Redeploy

**Render:**
1. Dashboard → Manual Deploy → Clear build cache & deploy

---

## 🧪 Testes de Produção

### 1. Health Check

```bash
# Backend
curl https://hanami-analytics-api.onrender.com/

# Deve retornar:
# {"message":"Hanami Analytics API v1.0.0","status":"ok"}
```

### 2. CORS Test

```bash
# Testar CORS do frontend
curl -I https://hanami-analytics-api.onrender.com/sales \
  -H "Origin: https://hanami-analytics.vercel.app"

# Deve incluir:
# access-control-allow-origin: https://hanami-analytics.vercel.app
```

### 3. Teste Funcional

1. Abra: https://hanami-analytics.vercel.app
2. Abra DevTools (F12) → Console
3. Deve estar limpo (sem erros de CORS)
4. Faça upload de um CSV
5. Deve funcionar perfeitamente ✅

---

## 🐛 Troubleshooting

### Problema: CORS Error

**Sintoma:**
```
Access-Control-Allow-Origin header blocked
```

**Solução:**
1. Verifique se `CORS_ALLOWED_ORIGINS` está configurada no Render
2. Confirme que a URL do Vercel está correta
3. Faça redeploy no Render

### Problema: API não responde

**Sintoma:**
```
ERR_CONNECTION_REFUSED ou timeout
```

**Solução:**
1. Verifique se o Render está "Live" (não hibernando)
2. Primeiro request pode levar 30-60s no free tier
3. Verifique logs no dashboard do Render

### Problema: 404 em rotas do Frontend

**Sintoma:**
```
404 ao recarregar página
```

**Solução:**
1. Vercel deve ter `vercel.json` configurado:
   ```json
   {
     "rewrites": [{"source": "/(.*)", "destination": "/"}]
   }
   ```

### Problema: Build falha no Render

**Sintoma:**
```
ERROR: Could not open requirements file
```

**Solução:**
1. Confirme que o caminho está correto: `api/requirements.txt`
2. Verifique se o arquivo existe no repositório
3. Faça "Clear build cache & deploy"

---

## 💡 Notas Importantes

### Free Tier Render

- **Hibernação**: Após 15 minutos de inatividade, o Render hiberna o serviço
- **Wake-up**: Primeiro request após hibernação leva ~30-60 segundos
- **Solução**: 
  - Aceitar o delay (é grátis!)
  - OU: Upgrade para plano pago (a partir de $7/mês)
  - OU: Usar um serviço de ping (exemplo: UptimeRobot)

### CORS no Render

✅ **O Render funciona perfeitamente com CORS!**

Diferente do Railway, o Render:
- Não injeta headers CORS próprios
- Respeita os headers configurados na aplicação
- Não requer configurações especiais de proxy

### Commits e Redeploy

Mudanças que trigam redeploy:
- ✅ Código fonte (`.py`, `.tsx`, `.ts`)
- ✅ Dependências (`requirements.txt`, `package.json`)
- ✅ Configuração (`render.yaml`, `vercel.json`)
- ❌ Documentação (`.md`) - não causa redeploy

---

## 📊 Monitoramento

### Métricas no Render

Dashboard mostra:
- CPU usage
- Memory usage
- Response time
- Request count
- Error rate

### Métricas no Vercel

Dashboard mostra:
- Page views
- Bandwidth
- Build time
- Deploy status

---

## 🔐 Segurança

### Variáveis de Ambiente

✅ **Nunca commite:**
- API keys
- Senhas
- Tokens de acesso
- Credenciais de banco de dados

Use sempre as configurações de Environment Variables no dashboard.

### HTTPS

✅ Ambas as plataformas fornecem HTTPS automático:
- Vercel: SSL/TLS automático
- Render: Certificado Let's Encrypt automático

---

## 📚 Referências

- [Guia Rápido de Deploy](DEPLOY_RÁPIDO.md)
- [Documentação Render](https://render.com/docs)
- [Documentação Vercel](https://vercel.com/docs)
- [render.yaml](render.yaml)
- [vercel.json](vercel.json)

---

**Última atualização**: 22/01/2026
**Status**: ✅ Produção estável
