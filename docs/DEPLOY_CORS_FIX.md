# 🔧 Correção de CORS - Vercel + Railway

## 🐛 Problema Identificado

Ao fazer deploy do frontend na **Vercel** e do backend no **Railway**, ocorreu erro de CORS:

```
Access to fetch at 'https://hanami-analytics-prod-production.railway.app/upload' 
from origin 'https://hanami-analytics.vercel.app' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header has a value 'https://railway.com' 
that is not equal to the supplied origin.
```

### Causa Raiz

- O Railway pode injetar headers CORS padrão com valor `https://railway.com`
- O middleware CORS customizado não estava funcionando corretamente
- Headers sendo sobrescritos pela plataforma

## ✅ Solução Implementada

### 1. Atualização do Backend (api/main.py)

**Mudanças aplicadas:**

1. **Importado middleware oficial do FastAPI:**
   ```python
   from fastapi.middleware.cors import CORSMiddleware as FastAPICORSMiddleware
   ```

2. **Configurado CORS oficial com permissões amplas:**
   ```python
   app.add_middleware(
       FastAPICORSMiddleware,
       allow_origins=["*"],  # Aceitar todas as origens
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
       expose_headers=["*"],
   )
   ```

3. **Mantido middleware customizado como fallback:**
   - Middleware customizado agora reflete a origem da requisição
   - Garante compatibilidade mesmo se Railway modificar headers

### 2. Headers CORS Implementados

**Para requisições OPTIONS (preflight):**
- `Access-Control-Allow-Origin`: Origem da requisição ou `*`
- `Access-Control-Allow-Methods`: Todos os métodos HTTP
- `Access-Control-Allow-Headers`: Todos os headers
- `Access-Control-Allow-Credentials`: `true`
- `Access-Control-Max-Age`: 24 horas

**Para requisições normais:**
- Mesmos headers aplicados a todas as respostas

## 📋 Checklist de Deploy

### Backend (Railway)

- [x] Atualizar código do `api/main.py`
- [ ] Fazer commit e push para o repositório
- [ ] Railway fará redeploy automático
- [ ] Verificar logs do Railway após deploy
- [ ] Testar endpoint `/docs` da API

### Frontend (Vercel)

- [ ] Não requer mudanças
- [ ] Vercel mantém o deploy atual
- [ ] Testar após backend atualizar

### Variáveis de Ambiente (Railway)

Certifique-se de que estas variáveis estão configuradas:

```env
PORT=8000
PYTHON_VERSION=3.11
```

**Opcional (se precisar restringir origens específicas):**
```env
ALLOWED_ORIGINS=https://hanami-analytics.vercel.app,http://localhost:5173
```

## 🧪 Como Testar

### 1. Testar Localmente

```bash
# Backend
cd api
uvicorn main:app --reload --port 8000

# Em outro terminal - testar CORS
curl -X OPTIONS http://localhost:8000/upload \
  -H "Origin: https://hanami-analytics.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Você deve ver headers `Access-Control-Allow-*` na resposta.

### 2. Testar em Produção

1. Abra o console do navegador em `https://hanami-analytics.vercel.app`
2. Tente fazer upload de um arquivo CSV
3. Verifique a aba **Network** nas DevTools
4. O request deve ter status 200 (não 400 ou CORS error)

### 3. Verificar Headers da API

```bash
curl -I https://hanami-analytics-prod-production.railway.app/docs \
  -H "Origin: https://hanami-analytics.vercel.app"
```

Deve retornar:
```
Access-Control-Allow-Origin: https://hanami-analytics.vercel.app
```

## 🚀 Deploy Rápido

```bash
# 1. Commit das mudanças
git add api/main.py docs/DEPLOY_CORS_FIX.md
git commit -m "fix: corrigir CORS para deploy Vercel + Railway"
git push origin main

# 2. Railway faz redeploy automático (2-3 minutos)

# 3. Aguarde e teste
# Abra: https://hanami-analytics.vercel.app
# Teste upload de arquivo
```

## 🔍 Debugging

### Se ainda houver erro de CORS:

1. **Verificar logs do Railway:**
   ```bash
   # No dashboard do Railway, veja os logs em tempo real
   ```

2. **Testar endpoint diretamente:**
   ```bash
   curl -X POST https://hanami-analytics-prod-production.railway.app/upload \
     -H "Origin: https://hanami-analytics.vercel.app" \
     -F "file=@vendas_ficticias_10000_linhas.csv" \
     -v
   ```

3. **Verificar se Railway está usando Dockerfile correto:**
   - Confirme que `railway.json` aponta para o `Dockerfile` correto
   - Verifique se o build está usando Python 3.11+

### Se erro 400 (Bad Request):

- Verifique o formato do arquivo CSV
- Confirme que o arquivo tem as colunas esperadas
- Veja logs do Railway para detalhes do erro

## 📚 Referências

- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)
- [Railway Networking](https://docs.railway.app/reference/networking)
- [Vercel CORS](https://vercel.com/guides/how-to-enable-cors)

## 🔒 Segurança em Produção

### Opção 1: CORS Aberto (atual)
```python
allow_origins=["*"]  # Qualquer origem pode acessar
```

✅ **Vantagens:**
- Funciona com qualquer domínio
- Útil para desenvolvimento
- Simples de manter

⚠️ **Desvantagens:**
- Menos seguro
- Qualquer site pode fazer requisições

### Opção 2: CORS Restrito (recomendado para produção)

```python
allow_origins=[
    "https://hanami-analytics.vercel.app",
    "http://localhost:5173",  # Apenas para dev
]
```

✅ **Vantagens:**
- Mais seguro
- Apenas domínios autorizados

⚠️ **Desvantagens:**
- Precisa atualizar ao adicionar novos domínios

## 💡 Próximos Passos

1. ✅ Implementar CORS com suporte universal
2. ⬜ Testar upload em produção
3. ⬜ Monitorar logs por 24h
4. ⬜ (Opcional) Restringir origens para produção
5. ⬜ Implementar rate limiting
6. ⬜ Adicionar autenticação JWT

---

**Status:** ✅ Correção implementada - Aguardando deploy
**Data:** 2026-01-22
**Autor:** GitHub Copilot
