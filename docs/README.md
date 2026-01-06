# 📊 Hanami Analytics - Documentação Completa

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias](#tecnologias)
4. [Instalação](#instalação)
5. [Como Usar](#como-usar)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Documentação Detalhada](#documentação-detalhada)
8. [Suporte](#suporte)

---

## 🎯 Visão Geral

**Hanami Analytics** é uma plataforma completa de análise de dados de vendas com:

- 📤 **Upload robusto** de arquivos CSV/XLSX
- 🔍 **Validação automática** de dados com relatório detalhado
- 📊 **Dashboard interativo** com 6 abas de análise
- 📈 **14 endpoints de análise** com filtro por data
- 🔐 **Logging estruturado** com rastreamento de eventos
- 🎨 **Interface responsiva** para mobile/desktop
- 🌙 **Modo escuro** integrado

### **Status do Projeto**
✅ Parser de dados robusto  
✅ Endpoint de upload com validação  
✅ Algoritmos de análise completos  
✅ Endpoints de relatórios  
✅ Dashboard interativo  
✅ Logging estruturado  
✅ Validação e padronização de dados  

---

## 🏗️ Arquitetura

```
analyze-joy-hub/
├── api/                           # Backend FastAPI
│   ├── main.py                   # API principal
│   ├── data_validator.py         # Validação e padronização de dados
│   ├── requirements.txt          # Dependências Python
│   └── logs/                     # Logs estruturados
│
├── frontend/                     # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── Dashboard.tsx    # Painel principal
│   │   │   ├── FileUpload.tsx   # Upload de arquivos
│   │   │   ├── charts/          # Componentes de gráficos
│   │   │   ├── dashboard/       # Abas de análise
│   │   │   └── ui/              # Componentes shadcn/ui
│   │   ├── hooks/               # Custom hooks
│   │   └── pages/               # Páginas
│   └── package.json             # Dependências Node
│
└── docs/                        # Documentação (você está aqui)
    ├── README.md               # Este arquivo
    ├── INSTALLATION.md         # Guia de instalação
    ├── ARCHITECTURE.md         # Detalhes da arquitetura
    ├── API_DOCUMENTATION.md    # Endpoints da API
    ├── FRONTEND_DOCUMENTATION.md  # Frontend
    ├── DATA_VALIDATION.md      # Validação de dados
    └── TROUBLESHOOTING.md      # Resolução de problemas
```

---

## 🛠️ Tecnologias

### **Backend**
- **FastAPI** 0.115.5 - Framework web
- **Pandas** 2.2.3 - Processamento de dados
- **Openpyxl** 3.1.5 - Suporte para XLSX
- **Python** 3.9+

### **Frontend**
- **React** 18 - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Recharts** - Gráficos
- **TailwindCSS** - Styling
- **shadcn/ui** - Componentes UI
- **next-themes** - Tema escuro

### **DevOps**
- **Uvicorn** - ASGI server
- **CORS** - Cross-origin requests
- **Logging** - Estruturado com rotação

---

## ⚡ Instalação Rápida

### **Backend**

```bash
cd api
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python main.py
# API rodando em http://localhost:8000
```

### **Frontend**

```bash
cd frontend
npm install
npm run dev
# Frontend rodando em http://localhost:5173
```

### **Acesso**

- 🌐 **Dashboard:** http://localhost:5173
- 📚 **Swagger API:** http://localhost:8000/docs (Teste endpoints interativamente)
- 🔍 **ReDoc:** http://localhost:8000/redoc (Documentação estática)
- 📋 **OpenAPI Schema:** http://localhost:8000/openapi.json (Para integração)

---

## 📖 Como Usar

### **1. Upload de Dados**

```
1. Abra http://localhost:5173
2. Clique em "Selecionar Arquivo" ou arraste um CSV/XLSX
3. O sistema validará automaticamente
4. Veja o relatório de qualidade
5. Dashboard carrega com análises
```

### **2. Filtrar por Data**

```
1. Na aba "Visão Geral" ou qualquer aba
2. Use o seletor de datas
3. Dashboard atualiza em tempo real
4. Todos os 14 endpoints filtram pela data selecionada
```

### **3. Usar Dados Padrão**

```
1. Sem arquivo, clique "Usar Dados Padrão"
2. Carrega 10.000 registros de exemplo
3. Pronto para explorar análises
```

---

## 📁 Estrutura do Projeto

### **Arquivo Principal da API**
- `api/main.py` - 646 linhas
  - Configuração de logging
  - CORS middleware
  - 14 endpoints de análise
  - Upload com validação
  - Relatórios

### **Validador de Dados**
- `api/data_validator.py` - 400 linhas
  - Validação de tipos
  - Padronização de datas
  - Normalização de strings
  - Validação de ranges
  - Relatório de qualidade

### **Frontend**
- `frontend/src/components/Dashboard.tsx` - Painel principal
- `frontend/src/components/FileUpload.tsx` - Upload
- `frontend/src/components/charts/` - 3 componentes de gráficos
- `frontend/src/components/dashboard/` - 6 abas (Visão Geral, Vendas, Produtos, Pagamentos, Clientes, Logística)

---

## 📚 Documentação Detalhada

| Documento | Conteúdo |
|-----------|----------|
| **[INSTALLATION.md](./INSTALLATION.md)** | Guia passo a passo de instalação |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Detalhes técnicos da arquitetura |
| **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** | Referência completa dos 14 endpoints |
| **[SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)** | Guia de uso do Swagger interativo |
| **[FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)** | Componentes, hooks, pages |
| **[DATA_VALIDATION.md](./DATA_VALIDATION.md)** | Como validação funciona |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Soluções para problemas comuns |

---

## 🎯 Início Rápido com Swagger

A API possui documentação **interativa** via Swagger UI:

```
1. Inicie a API: python api/main.py
2. Abra: http://localhost:8000/docs
3. Teste qualquer endpoint direto no navegador
4. Veja respostas em tempo real
5. Copie exemplos de código (Python, JavaScript, cURL)
```

**Alternativas:**
- ReDoc (documentação estática): http://localhost:8000/redoc
- OpenAPI JSON (para integração): http://localhost:8000/openapi.json
- Leia: [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) para detalhes completos

---

## 📊 Endpoints Disponíveis

### **Upload e Análise**
- `POST /upload` - Upload de CSV/XLSX
- `GET /analysis` - Análise geral
- `DELETE /reset` - Reset para dados padrão

### **KPIs (12 análises)**
- `GET /kpis` - Principais indicadores
- `GET /sales-by-month` - Vendas por mês
- `GET /sales-by-category` - Vendas por categoria
- `GET /top-products` - Produtos top 10
- `GET /customers-by-gender` - Clientes por gênero
- `GET /sales-by-state` - Vendas por estado
- `GET /payment-methods` - Formas de pagamento
- `GET /customers-by-age` - Clientes por faixa etária
- `GET /installments` - Distribuição de parcelamento
- `GET /delivery-status` - Status de entrega
- `GET /product-ratings` - Produtos com menor avaliação
- `GET /average-delivery-time` - Tempo médio de entrega

### **Relatórios**
- `GET /reports/summary` - Relatório resumido
- `GET /reports/detailed` - Relatório detalhado com todas as análises

---

## 🎨 Abas do Dashboard

| Aba | Conteúdo |
|-----|----------|
| **Visão Geral** | KPIs principais, 4 gráficos resumidos |
| **Vendas** | Vendas por mês, categoria, payment methods |
| **Produtos** | Top 10 produtos, lucro, avaliações |
| **Pagamentos** | Métodos, parcelamentos, faturamento |
| **Clientes** | Gênero, idade, estado, localização |
| **Logística** | Status entrega, tempo médio, avaliações |

---

## 🔒 Validação de Dados

Todos os dados passam por validação automática:

✅ **Tipos de dados** - Conversão automática  
✅ **Datas** - 5 formatos suportados  
✅ **Strings** - Normalização (trim, capitalize)  
✅ **Ranges** - Valores dentro de limites  
✅ **Categóricas** - Validação de valores válidos  
✅ **Duplicatas** - Remoção automática  
✅ **Nulos** - Identificação e remoção  

Score de qualidade retornado: **0-100%**

---

## 📝 Logging

Todos os eventos são registrados em `api/logs/app.log`:

```
[2026-01-06 14:32:15] INFO     [analytics_api:startup_event] 🚀 INICIANDO HANAMI ANALYTICS API
[2026-01-06 14:32:20] INFO     [analytics_api:upload_file] 📤 Iniciando upload do arquivo
[2026-01-06 14:32:21] INFO     [analytics_api:upload_file] ✅ Arquivo carregado com sucesso
[2026-01-06 14:32:22] INFO     [analytics_api:get_kpis] 📊 Solicitação de KPIs
```

Níveis: DEBUG, INFO, WARNING, ERROR com stack trace completo.

---

## 🚀 Deploy

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções de produção.

---

## 💬 Suporte

### **Documentação**
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### **Problemas Comuns**
Veja [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### **Contato**
Para dúvidas, verifique a estrutura do projeto ou os logs em `api/logs/app.log`

---

**Versão**: 1.0.0  
**Data**: 6 de janeiro de 2026  
**Licença**: MIT
