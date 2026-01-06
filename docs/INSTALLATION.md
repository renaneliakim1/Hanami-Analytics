# 📦 Guia de Instalação

## ✅ Pré-requisitos

- Python 3.9+ instalado
- Node.js 16+ e npm instalados
- Git (opcional)

---

## 🔧 Instalação Backend (FastAPI)

### **Passo 1: Criar Ambiente Virtual**

```bash
cd api
python -m venv venv
```

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### **Passo 2: Instalar Dependências**

```bash
pip install -r requirements.txt
```

**Dependências instaladas:**
- fastapi==0.115.5
- uvicorn==0.30.0
- pandas==2.2.3
- openpyxl==3.1.5
- python-multipart==0.0.6

### **Passo 3: Iniciar API**

```bash
python main.py
```

**Esperado:**
```
[2026-01-06 14:32:15] INFO     ================================================================================
[2026-01-06 14:32:15] INFO     🚀 INICIANDO HANAMI ANALYTICS API
[2026-01-06 14:32:15] INFO     ================================================================================
[2026-01-06 14:32:15] INFO     ✅ Dados padrão carregados com sucesso! (10000 registros)

INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ API rodando em **http://localhost:8000**

---

## 💻 Instalação Frontend (React)

### **Passo 1: Instalar Dependências**

```bash
cd frontend
npm install
```

### **Passo 2: Iniciar Dev Server**

```bash
npm run dev
```

**Esperado:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

✅ Frontend rodando em **http://localhost:5173**

---

## 🌐 Acessar Aplicação

### **URLs Principais**

| URL | Descrição |
|-----|-----------|
| http://localhost:5173 | Dashboard (Interface) |
| http://localhost:8000/docs | Swagger UI (API) |
| http://localhost:8000/redoc | ReDoc (Documentação) |

### **Teste Rápido**

```bash
# Terminal 1 - API
cd api
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Teste a API
curl http://localhost:8000/docs
```

---

## 📋 Estrutura de Diretórios Esperada

```
analyze-joy-hub/
├── api/
│   ├── main.py
│   ├── data_validator.py
│   ├── requirements.txt
│   ├── venv/                    # Criado automaticamente
│   ├── logs/                    # Criado automaticamente
│   └── vendas_ficticias_10000_linhas.csv
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/            # Criado automaticamente
└── docs/
    └── README.md
```

---

## 🔍 Verificar Instalação

### **Backend**

```bash
# Verificar que logs/app.log foi criado
ls api/logs/

# Resultado esperado:
# app.log
```

### **Frontend**

```bash
# Verificar dependências
npm list --depth=0

# Resultado esperado mostra:
# react@18.x.x
# vite@5.x.x
# recharts@2.x.x
# etc
```

---

## 🐛 Troubleshooting de Instalação

### **Erro: ModuleNotFoundError: No module named 'fastapi'**

```bash
# Solução: Ativar ambiente virtual e reinstalar
pip install -r requirements.txt
```

### **Erro: Port 8000 already in use**

```bash
# Windows - Encontrar processo na porta 8000
netstat -ano | findstr :8000
# Matar processo
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### **Erro: npm ERR! code ERESOLVE**

```bash
# Solução: Limpar cache npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### **Frontend não encontra API**

```
- Verifique se API está rodando em http://localhost:8000
- Verifique CORS em api/main.py
- Verifique os logs em api/logs/app.log
```

---

## 📂 Dados Padrão

O projeto vem com arquivo de exemplo:
- **Arquivo**: `frontend/public/vendas_ficticias_10000_linhas.csv`
- **Registros**: 10.000 vendas fictícias
- **Data**: 12/05/2025 a 05/01/2026

Dados carregam automaticamente ao iniciar a API.

---

## 🚀 Próximos Passos

1. ✅ Abra http://localhost:5173
2. ✅ Clique "Usar Dados Padrão"
3. ✅ Explore o dashboard
4. ✅ Carregue seu próprio CSV/XLSX
5. ✅ Veja relatório de validação de dados

---

## 📚 Documentação

- [README.md](./README.md) - Visão geral
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Endpoints
- [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Frontend
- [DATA_VALIDATION.md](./DATA_VALIDATION.md) - Validação
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Problemas

---

**Sucesso! 🎉 Sua instalação está completa.**
