# 📚 Documentação da API Backend - Índice

## 🎯 Começar por Aqui

A documentação da API backend está organizada em 3 arquivos principais:

### 1️⃣ [API_SETUP.md](./API_SETUP.md) - **Comece Aqui!** ⭐
**Tempo de leitura: 15 minutos**

Guia prático de instalação e configuração:
- ✅ Instalação do ambiente Python
- ✅ Criação do ambiente virtual (venv)
- ✅ Instalação de dependências
- ✅ Como rodar a API
- ✅ Documentação interativa (Swagger)
- ✅ Troubleshooting comum

**→ Leia este primeiro se está começando!**

---

### 2️⃣ [API_BACKEND_DOCUMENTATION.md](./API_BACKEND_DOCUMENTATION.md) - **Documentação Técnica**
**Tempo de leitura: 30 minutos**

Documentação completa de todos os 19 endpoints:

#### Endpoints Documentados:
- **Upload**: POST `/upload`
- **Dados**: GET `/sales`, GET `/analysis`
- **KPIs**: GET `/kpis`
- **Análises Temporais**: GET `/sales-by-month`
- **Segmentação**: 
  - GET `/sales-by-category`
  - GET `/customers-by-gender`
  - GET `/customers-by-age`
- **Ranking**: GET `/top-products`
- **Geográfica**: GET `/sales-by-state`
- **Pagamentos**: 
  - GET `/payment-methods`
  - GET `/installments`
- **Logística**: 
  - GET `/delivery-status`
  - GET `/average-delivery-time`
- **Qualidade**: GET `/product-ratings`
- **Exportação**: 
  - GET `/export/csv`
  - GET `/export/excel`
- **Relatórios**: 
  - GET `/reports/summary`
  - GET `/reports/detailed`
- **Gerenciamento**: DELETE `/reset`

Cada endpoint inclui:
- Descrição do algoritmo
- Parâmetros de query
- Exemplos de resposta JSON
- Algoritmo implementado

---

### 3️⃣ [ARCHITECTURE_BACKEND.md](./ARCHITECTURE_BACKEND.md) - **Entender a Arquitetura**
**Tempo de leitura: 30 minutos**

Compreensão profunda do sistema:

#### Conteúdo:
- 📐 **Diagrama Arquitetural** completo
- 📊 **Algoritmos de Análise**:
  - KPIs (faturamento, lucro, ticket médio)
  - Análise Temporal (vendas por mês)
  - Segmentação (categorias)
  - Ranking de Produtos (top N)
  - Análise Geográfica
  - Análise de Pagamentos
- 🔄 **Fluxo de Dados** (Upload)
- 📥 **Estrutura de Resposta** (Upload Response)
- 🛡️ **Validações Implementadas**
- 📈 **Comparação**: Antes vs Depois
- 🚀 **Próximos Passos Recomendados**

---

## 📊 Mapa de Funcionalidades

```
┌─────────────────────────────────────────────────┐
│          Backend (FastAPI + Pandas)             │
├─────────────────────────────────────────────────┤
│ • Parser Robusto (CSV/XLSX)                     │
│ • 19 Endpoints REST                             │
│ • Análise de Dados com Pandas                   │
│ • Validação e Padronização                      │
│ • Exportação (CSV/Excel)                        │
│ • Logs Estruturados                             │
│ • CORS Configurado                              │
└─────────────────────────────────────────────────┘
```

## 🔌 Endpoints por Categoria

### 📤 Upload (1)
- `POST /upload` - Upload de arquivo CSV/XLSX

### 📊 Dados (2)
- `GET /sales` - Lista de vendas com paginação
- `GET /analysis` - Análise estatística completa

### 📈 KPIs (1)
- `GET /kpis` - KPIs principais (faturamento, lucro, etc)

### 📅 Temporal (1)
- `GET /sales-by-month` - Vendas agrupadas por mês

### 🏷️ Segmentação (5)
- `GET /sales-by-category` - Vendas por categoria
- `GET /customers-by-gender` - Clientes por gênero
- `GET /customers-by-age` - Clientes por faixa etária
- `GET /sales-by-state` - Vendas por estado
- `GET /installments` - Análise de parcelamento

### 🏆 Ranking (1)
- `GET /top-products` - Top N produtos mais vendidos

### 💳 Pagamentos (1)
- `GET /payment-methods` - Análise de formas de pagamento

### 🚚 Logística (2)
- `GET /delivery-status` - Status de entrega
- `GET /average-delivery-time` - Tempo médio de entrega

### ⭐ Qualidade (1)
- `GET /product-ratings` - Produtos com menor avaliação

### 💾 Exportação (2)
- `GET /export/csv` - Exportar em CSV
- `GET /export/excel` - Exportar em Excel

### 📋 Relatórios (2)
- `GET /reports/summary` - Relatório resumido
- `GET /reports/detailed` - Relatório detalhado

### 🔄 Gerenciamento (1)
- `DELETE /reset` - Resetar dados

**Total: 19 Endpoints** ✅

## 🛠️ Stack Técnico

### Backend
- **Framework**: FastAPI 0.115.5
- **Servidor**: Uvicorn 0.32.1
- **Análise de Dados**: Pandas 2.2.3
- **Excel**: Openpyxl 3.1.5
- **Upload**: Python-multipart 0.0.18
- **Validação**: Pydantic 2.10.3

### Recursos
- ✅ Parsing de CSV com detecção automática de encoding
- ✅ Suporte a XLSX
- ✅ Validação de dados com quality scoring
- ✅ Logging estruturado com rotação
- ✅ CORS configurado
- ✅ Tratamento de exceções robusto

## 📖 Fluxo de Aprendizado Recomendado

```
1. API_SETUP.md (15 min)
   ↓
2. Rodar o servidor localmente
   ↓
3. Acessar http://localhost:8000/docs
   ↓
4. Testar endpoints no Swagger
   ↓
5. Ler API_BACKEND_DOCUMENTATION.md (30 min)
   ↓
6. Entender implementações específicas
   ↓
7. Ler ARCHITECTURE_BACKEND.md (30 min)
   ↓
8. Pronto para contribuir! 🎉
```

## 🔗 Links Úteis

- **Documentação Interativa**: http://localhost:8000/docs (quando servidor rodando)
- **ReDoc**: http://localhost:8000/redoc
- **Schema OpenAPI**: http://localhost:8000/openapi.json

## ❓ Dúvidas Frequentes

**P: Como rodar a API?**
→ Ver [API_SETUP.md](./API_SETUP.md)

**P: Como usar um endpoint específico?**
→ Ver [API_BACKEND_DOCUMENTATION.md](./API_BACKEND_DOCUMENTATION.md)

**P: Como os dados são processados?**
→ Ver [ARCHITECTURE_BACKEND.md](./ARCHITECTURE_BACKEND.md)

**P: Qual é a estrutura de resposta?**
→ Ver exemplos em [API_BACKEND_DOCUMENTATION.md](./API_BACKEND_DOCUMENTATION.md)

**P: Como fazer deploy?**
→ Ver [API_SETUP.md](./API_SETUP.md#-deploy-em-produção)

## 📝 Estrutura de Arquivos da API

```
api/
├── main.py                      # Aplicação FastAPI principal
├── data_validator.py            # Validação e padronização de dados
├── requirements.txt             # Dependências Python
├── __pycache__/                 # Cache Python
└── docs/                        # Documentação
    ├── API_SETUP.md            # Instalação e setup
    ├── API_BACKEND_DOCUMENTATION.md    # Endpoints
    ├── ARCHITECTURE_BACKEND.md  # Arquitetura
    └── README.md               # Este arquivo
```

## ✅ Verificação de Instalação

Para confirmar que tudo está funcionando:

```bash
# 1. Ativar venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# 2. Rodar servidor
uvicorn main:app --reload --port 8000

# 3. Acessar em outro terminal
curl http://localhost:8000/

# 4. Deve retornar algo como:
# {"message":"Hanami Analytics API","version":"1.0.0",...}
```

---

**Última atualização**: janeiro 2026
**Versão**: 1.0.0
