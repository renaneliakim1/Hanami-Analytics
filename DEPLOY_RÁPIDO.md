# 🎯 DEPLOY RÁPIDO (5 MINUTOS)

Seu projeto está **100% pronto** para deploy gratuito!

## � Deploy no Render (Melhor que Railway!)

**Por que Render?**
- ✅ CORS funciona perfeitamente
- ✅ Deploy nativo Python/FastAPI (sem Docker)
- ✅ Build rápido e confiável
- ✅ Free tier generoso

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

### 3️⃣ **Render** (3 min) - Backend

#### 📝 Criar Web Service
1. Acesse: https://render.com
2. Clique **"New +"** → **"Web Service"**
3. Conecte seu GitHub e selecione `Hanami-Analytics`
4. Configure:

**Configurações Básicas:**
```
Name: hanami-analytics-api
Environment: Python 3
Branch: main
Region: Frankfurt (ou mais próximo)
```

**Build & Deploy (IMPORTANTE - o requirements.txt está em api/):**
```
Build Command: pip install -r api/requirements.txt
Start Command: cd api && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Plano:**
```
Instance Type: Free
```

5. Clique **"Create Web Service"**
6. Aguarde build (~5 min)
7. ✅ Copie a URL: `https://hanami-analytics-api.onrender.com`

#### ⚙️ Variáveis de Ambiente (Opcional)
No Render dashboard, vá em **Environment**:
```
CORS_ALLOWED_ORIGINS=https://hanami-analytics.vercel.app
PYTHON_VERSION=3.11
```

## 🔗 Conectar Frontend ↔ Backend

1. URL do Render: `https://hanami-analytics-api.onrender.com`
2. Vai para Vercel → Settings → Environment Variables
3. Edite/Adicione:
   ```
   VITE_API_URL=https://hanami-analytics-api.onrender.com
   VITE_API_TIMEOUT=30000
   ```
4. **Redeploy** no Vercel (botão "Redeploy" no dashboard)

**Pronto! ✅ Dashboard online sem erros de CORS!**

---

## 🧪 Testar

1. Abra: https://hanami-analytics.vercel.app
2. **F12** → **Console** (deve estar limpo, sem erros!)
3. Faça upload de um CSV/XLSX
4. ✅ Deve funcionar perfeitamente!

---

## 📚 Links Úteis

- 📖 **Guia Completo Render**: [docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md)
- 📖 **Guia Vercel**: [docs/DEPLOY_GRATIS_VERCEL_RAILWAY.md](docs/DEPLOY_GRATIS_VERCEL_RAILWAY.md)
- 🔗 **Swagger API**: https://hanami-analytics-api.onrender.com/docs

---

## 💡 Dica: First Request

O Render free tier "hiberna" após inatividade. O primeiro request pode levar ~30-60 segundos. Depois fica rápido!
