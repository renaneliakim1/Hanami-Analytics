# 🚀 DEPLOY GRATUITO - Vercel + Railway

**Tempo estimado**: 20 minutos  
**Custo**: $0/mês  
**Resultado**: App online com domínio grátis

---

## 📋 PRÉ-REQUISITOS

- ✅ Conta GitHub (grátis)
- ✅ Repositório atualizado no GitHub
- ✅ Vercel account (link: https://vercel.com)
- ✅ Railway account (link: https://railway.app)

---

## ✅ PARTE 1: FRONTEND NO VERCEL

### **Passo 1: Fazer Push no GitHub**

```bash
# No diretório do projeto
git add .
git commit -m "Preparar para deploy: adicionar configurações Vercel e Railway"
git push origin main
```

### **Passo 2: Conectar ao Vercel**

1. **Acesse** https://vercel.com
2. **Clique** em "Sign in" → "Continue with GitHub"
3. **Autorize** o Vercel
4. **Clique** em "Add New..." → "Project"
5. **Selecione** seu repositório `Hanami-Analytics`
6. **Configure**:
   - Framework: `Vite`
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Root Directory: `.`

7. **Clique** "Deploy"

✅ **Seu frontend está online!** Vercel gera URL: `https://hanami-analytics.vercel.app`

---

## ✅ PARTE 2: BACKEND NO RAILWAY

### **Passo 1: Conectar ao Railway**

1. **Acesse** https://railway.app
2. **Clique** em "Start New Project"
3. **Selecione** "Deploy from GitHub repo"
4. **Autorize** Railway no GitHub
5. **Selecione** repositório `Hanami-Analytics`

### **Passo 2: Configurar Variables

Railway deve detectar:
- **Dockerfile**: ✅ (criado automaticamente)
- **Porta**: 8000 → 8000 → $PORT

1. **Na aba "Variables"**, adicione se necessário:
   ```
   PYTHONUNBUFFERED=1
   ```

2. **Espere o deploy** (~5 minutos)

✅ **Backend online!** Railway gera URL: `https://hanami-analytics.railway.app`

---

## 🔗 PARTE 3: CONECTAR FRONTEND ↔ BACKEND

### **Passo 1: Atualizar URL da API no Vercel**

1. **Acesse** Vercel → seu projeto `Hanami-Analytics`
2. **Vá para** "Settings" → "Environment Variables"
3. **Clique** "+ Add"
   - **Name**: `VITE_API_URL`
   - **Value**: `https://seu-backend-railway.railway.app`
   - **Environments**: Production

4. **Clique** "Save"

5. **Volte** para deployments e **redeploy**:
   - Clique no último deploy
   - Clique "Redeploy"

### **Passo 2: Atualizar API para Aceitar CORS**

A API **já vem configurada** para aceitar requisições do Vercel, mas confirme:

**Arquivo**: `api/main.py` (linha ~85)

```python
origins = [
    "http://localhost:8081",
    "http://localhost:3000",
    "https://hanami-analytics.vercel.app",  # ← Deve ter seu domínio
]
```

Se precisar adicionar seu domínio:

```bash
git add api/main.py
git commit -m "Adicionar CORS para produção"
git push origin main
```

Railway redeploy automático!

---

## ✅ PARTE 4: TESTAR

### **Teste 1: Frontend carregando**
```
https://hanami-analytics.vercel.app
```
✅ Deve aparecer o dashboard

### **Teste 2: API respondendo**
```
https://seu-backend-railway.app/docs
```
✅ Deve aparecer Swagger UI

### **Teste 3: Frontend usando a API**
- Abra **DevTools** (F12)
- **Aba Network**
- Interaja com dashboard
- Veja requisições em: `https://seu-backend-railway.app/api/*`

---

## 🔧 PRÓXIMOS PASSOS

| Ação | Tempo | Benefício |
|------|-------|-----------|
| Adicionar domínio customizado | 10 min | `https://analytics.seu-site.com` |
| Configurar CI/CD automático | 15 min | Deploy automático ao fazer push |
| Adicionar Analytics | 5 min | Monitorar uso |
| Escalar (DB PostgreSQL) | 1 hora | Dados persistidos |

---

## 📞 TROUBLESHOOTING

### ❌ "API não responde" / CORS error
```bash
# Solução
git push origin main  # Railway redeploy automático
# Aguarde 5 minutos
```

### ❌ "Página em branco"
1. Abra DevTools (F12)
2. Console → copie erro
3. Verifique Environment Variables no Vercel
4. Redeploy

### ❌ "Build falha no Vercel"
```bash
# Testar localmente
cd frontend
npm install
npm run build
```

---

## 💰 REFERÊNCIA DE CUSTOS

| Serviço | Free Tier | Depois |
|---------|-----------|--------|
| **Vercel** | ∞ deploymts, 100 GB/mês | $20/mês (projetos > 100GB) |
| **Railway** | $5/mês crédito grátis | $0.50/GB após crédito |
| **TOTAL** | **$0/mês** | **$5-20/mês** (depois de 10-12 meses) |

---

## 📚 COMANDOS RÁPIDOS

```bash
# Após qualquer mudança no código:
git add .
git commit -m "Descrição da mudança"
git push origin main

# Espere:
# - Vercel: 2-5 minutos
# - Railway: 5-10 minutos
```

---

**🎉 Pronto! Seu projeto está online e grátis!**
