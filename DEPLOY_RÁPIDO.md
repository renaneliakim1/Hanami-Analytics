# 🎯 DEPLOY RÁPIDO (5 MINUTOS)

Seu projeto está **100% pronto** para deploy gratuito!

## 🔧 CORREÇÃO APLICADA - CORS Fix

**Status:** ✅ Problema de CORS resolvido (2026-01-22)

O erro `Access-Control-Allow-Origin blocked` foi corrigido:
- ✅ Middleware CORS oficial do FastAPI implementado
- ✅ Suporte para `allow_origins=["*"]`
- ✅ Middleware customizado como fallback
- ✅ Headers CORS corretos para Vercel + Railway

**Para aplicar a correção:**
```bash
bash deploy_cors_fix.sh
# OU manualmente:
git add api/main.py docs/DEPLOY_CORS_FIX.md
git commit -m "fix: corrigir CORS para Vercel + Railway"
git push origin main
```

**Testar CORS após deploy:**
```bash
pwsh test_cors.ps1
```

📖 **Detalhes:** [docs/DEPLOY_CORS_FIX.md](docs/DEPLOY_CORS_FIX.md)

---

## ✨ 3 Passos Simples

### 1️⃣ **GitHub** (1 min)
```bash
git add .
git commit -m "Deploy configuration"
git push origin main
```

### 2️⃣ **Vercel** (2 min) - Frontend
- Acesse: https://vercel.com
- "Add New Project"
- Selecione: `Hanami-Analytics`
- Deploy (automático!)
- ✅ Seu app em: `https://hanami-analytics.vercel.app`

### 3️⃣ **Railway** (2 min) - Backend
- Acesse: https://railway.app
- "Start New Project"
- "Deploy from GitHub repo"
- Selecione: `Hanami-Analytics`
- Railway detecta Dockerfile automaticamente
- Espere deploy (~5 min)
- ✅ Sua API em: `https://seu-backend.railway.app`

## 🔗 Conectar Frontend ↔ Backend

1. Copie URL do Railway
2. Vai para Vercel → Settings → Environment Variables
3. Adicione:
   ```
   VITE_API_URL=https://seu-backend-railway.app
   ```
4. Redeploy no Vercel

**Pronto! ✅ Dashboard online!**

---

📚 **Guia completo**: [DEPLOY_GRATIS_VERCEL_RAILWAY.md](./DEPLOY_GRATIS_VERCEL_RAILWAY.md)
