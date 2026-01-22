# 🚀 DEPLOY NO RENDER (Alternativa ao Railway)

**Render é MUITO melhor que Railway para FastAPI!**

## ✅ Passo 1: Desconectar do Railway

1. Acesse https://railway.app
2. Clique em seu projeto `Hanami-Analytics`
3. **Settings** → **Repository** → **Disconnect**

---

## 🚀 Passo 2: Deploy no Render

### **2.1 Acesse o Render**
```
https://render.com
```

### **2.2 Sign In com GitHub**
- Clique "Sign Up" → "Continue with GitHub"
- Autorize Render
- Selecione seu repositório `Hanami-Analytics`

### **2.3 Create New Web Service**
1. Dashboard → **New +** → **Web Service**
2. Selecione `renaneliakim1/Hanami-Analytics`
3. Configure:
   - **Name**: `hanami-analytics-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r api/requirements.txt`
   - **Start Command**: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free
4. Clique **Create Web Service**

### **2.4 Aguarde Deploy**
- Você verá build progress
- Quando ficar ✅ verde (~5-10 min), está pronto!
- Copie a URL gerada (ex: `https://hanami-analytics-api.onrender.com`)

---

## 🔗 Passo 3: Conectar Vercel ↔ Render

1. Vercel → Projeto `Hanami-Analytics`
2. **Settings** → **Environment Variables**
3. Edite `VITE_API_URL`:
   - **Value**: `https://seu-render-url.onrender.com`
   - Exemplo: `https://hanami-analytics-api.onrender.com`
4. **Save** e **Redeploy**

---

## ✅ Teste

1. Abra em **aba incógnita**:
   ```
   https://hanami-analytics.vercel.app
   ```

2. **F12 → Console** (deve estar limpo!)

3. **Tenta fazer upload** de um arquivo CSV/XLSX

4. **Deve funcionar 100%!** ✅

---

## 🎯 URLs Finais

- **Frontend**: https://hanami-analytics.vercel.app
- **Backend**: https://hanami-analytics-api.onrender.com
- **Swagger**: https://hanami-analytics-api.onrender.com/docs

---

## 💡 Por que Render é Melhor?

| Aspecto | Railway | Render |
|--------|---------|--------|
| CORS | ❌ Problemático | ✅ Perfeito |
| FastAPI | 🟡 Requer docker | ✅ Nativo |
| Deploy | 🔄 Lento/Falho | ⚡ Rápido |
| Docs | ❓ Confuso | 📚 Claro |
| Preço | $5-20/mês | $7/mês (paga só o que usar) |

---

**Pronto? Começa o deploy no Render!** 🚀
