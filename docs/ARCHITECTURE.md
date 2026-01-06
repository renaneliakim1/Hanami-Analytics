# 🏗️ Arquitetura do Projeto

## 📐 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                      │
│                   React 18 + TypeScript                     │
└────────────┬────────────────────────────────────────────────┘
             │ HTTP/REST + CORS
             ↓
┌─────────────────────────────────────────────────────────────┐
│                   FastAPI (uvicorn)                         │
│                    Port 8000                                │
├─────────────────────────────────────────────────────────────┤
│  • Parser CSV/XLSX                                          │
│  • Validação de Dados                                       │
│  • 14 Endpoints de Análise                                  │
│  • Filtro por Data                                          │
│  • Logging Estruturado                                      │
└────────┬────────────────────────────────────┬───────────────┘
         │                                    │
         ↓                                    ↓
    ┌─────────────┐               ┌────────────────────┐
    │ Dados em    │               │ Logs Estruturados  │
    │ Memória     │               │ logs/app.log       │
    │ (DataFrame) │               │ (10MB, 5 backups)  │
    └─────────────┘               └────────────────────┘
```

---

## 🔄 Fluxo de Dados

### **1. Upload de Arquivo**

```
User seleciona arquivo (CSV/XLSX)
    ↓
Frontend envia POST /upload
    ↓
Backend recebe (BytesIO)
    ↓
Parse CSV/XLSX (múltiplos encodings)
    ↓
Validação Básica (vazio, tamanho)
    ↓
VALIDADOR: validate_data()
    ├─ Tipos de dados
    ├─ Datas (5 formatos)
    ├─ Strings (trim, capitalize)
    ├─ Ranges numéricos
    ├─ Valores categóricos
    ├─ Duplicatas
    └─ Nulos
    ↓
Relatório de Qualidade (0-100%)
    ↓
Se qualidade >= 50%:
    └─ Armazenar em memória
    └─ Retornar sucesso + validation_report
Senão:
    └─ Retornar erro 422
```

### **2. Requisição de Análise**

```
User solicita KPI (ex: /kpis?start_date=2025-12-05&end_date=2026-01-05)
    ↓
Backend recebe requisição
    ↓
Log: INFO "📊 Solicitação de KPIs"
    ↓
Buscar dados (uploaded ou default)
    ↓
Filtrar por date range
    ↓
Calcular KPIs (pandas operations)
    ↓
Log: INFO "✅ KPIs calculados: 300 registros"
    ↓
Retornar JSON com resultados
    ↓
Frontend renderiza gráficos (Recharts)
```

---

## 📊 Estrutura de Dados

### **DataFrame Schema**

```python
# Tipos esperados após validação
{
    'id_transacao': int64,
    'cliente_id': int64,
    'data_venda': datetime64[ns],      # Convertido de string
    'nome_produto': object,            # String normalizada
    'categoria': object,
    'quantidade': int64,               # Validado: 1-1000
    'valor_unitario': float64,
    'valor_final': float64,            # Validado: 0-1M
    'custo_produto': float64,
    'margem_lucro': float64,           # Validado: 0-1
    'lucro': float64,                  # Calculado
    'genero_cliente': object,          # M/F (normalizado)
    'idade_cliente': int64,            # Validado: 0-150
    'estado_cliente': object,          # Normalizado
    'forma_pagamento': object,         # Validado contra lista
    'parcelas': int64,                 # Validado: 1-36
    'status_entrega': object,          # Validado contra lista
    'avaliacao_produto': float64,      # Validado: 0-5
    'tempo_entrega_dias': int64,       # Validado: 0-365
}
```

---

## 🗂️ Componentes Backend

### **main.py (646 linhas)**

**Responsabilidades:**
- Inicialização FastAPI
- Configuração CORS
- Setup de Logging
- Parser CSV/XLSX
- 14 Endpoints
- Filtros de data
- Tratamento de erros

**Seções:**
1. Imports e Configuração (0-60)
2. Setup Logging (61-90)
3. Inicialização App (91-120)
4. Funções auxiliares (121-220)
5. Endpoints Upload (221-300)
6. Endpoints KPI (301-400)
7. Endpoints Análise (401-550)
8. Endpoints Relatório (551-600)

### **data_validator.py (400+ linhas)**

**Responsabilidades:**
- Validação de tipos
- Padronização de datas
- Normalização de strings
- Validação de ranges
- Validação categórica
- Relatório de qualidade

**Classes:**
- `ValidationReport` - Relatório estruturado
- Funções de validação especializadas

---

## 🗂️ Componentes Frontend

### **Estrutura de Componentes**

```
components/
├── Dashboard.tsx              # Painel principal (roteamento de abas)
├── FileUpload.tsx             # Upload + detecção de datas
├── KPICard.tsx                # Card com métrica
├── NavLink.tsx                # Link de navegação
├── ThemeToggle.tsx            # Dark mode toggle
│
├── charts/
│   ├── AreaChartComponent.tsx # Gráfico de área
│   ├── BarChartComponent.tsx  # Gráfico de barras (horizontal/vertical)
│   └── PieChartComponent.tsx  # Gráfico de pizza
│
└── dashboard/
    ├── OverviewTab.tsx        # Visão Geral
    ├── SalesTab.tsx           # Vendas
    ├── ProductsTab.tsx        # Produtos
    ├── PaymentsTab.tsx        # Pagamentos
    ├── CustomersTab.tsx       # Clientes
    └── LogisticsTab.tsx       # Logística
```

### **Hook Customizado**

- `useSalesData.ts` - Gerencia estado de vendas + API calls
- `DateRangePicker.tsx` - Seletor de data com integração

---

## 🔐 Logging Estruturado

### **Arquitetura de Logging**

```
setup_logging()
    ↓
├─ File Handler
│  ├─ Arquivo: logs/app.log
│  ├─ Rotação: 10MB
│  ├─ Backups: 5 arquivos
│  └─ Nível: DEBUG
│
└─ Console Handler
   ├─ Saída: stdout
   └─ Nível: INFO
```

### **Formato de Logs**

```
[2026-01-06 14:32:15] INFO     [analytics_api:upload_file:155] 📤 Iniciando upload
├─ Timestamp: YYYY-MM-DD HH:MM:SS
├─ Nível: INFO/WARNING/ERROR/DEBUG
├─ Módulo:função:linha
└─ Mensagem com emoji para fácil identificação
```

### **Níveis de Log**

| Nível | Uso |
|-------|-----|
| DEBUG | Informações detalhadas (conversão de tipo, parsing) |
| INFO | Eventos normais (upload, cálculos) |
| WARNING | Avisos (dados faltantes, duplicatas) |
| ERROR | Erros com stack trace completo |

---

## 🌐 API REST

### **Estrutura de Endpoint**

```
GET /endpoint
├─ Query Params: start_date, end_date, limit
├─ Response:
│  ├─ 200 OK: JSON com dados
│  ├─ 400 Bad Request: Arquivo inválido
│  ├─ 413 Payload Too Large: >100k linhas
│  └─ 500 Internal Server Error: Erro no cálculo
└─ Logging automático do tempo de execução
```

### **Grupos de Endpoints (14 total)**

1. **Upload** (1)
   - POST /upload

2. **Análise Geral** (2)
   - GET /analysis
   - GET /sales

3. **KPIs** (1)
   - GET /kpis

4. **Análise Temporal** (1)
   - GET /sales-by-month

5. **Análise por Categoria** (1)
   - GET /sales-by-category

6. **Análise de Produtos** (2)
   - GET /top-products
   - GET /product-ratings

7. **Análise de Clientes** (2)
   - GET /customers-by-gender
   - GET /customers-by-age

8. **Análise Geográfica** (1)
   - GET /sales-by-state

9. **Análise de Pagamentos** (2)
   - GET /payment-methods
   - GET /installments

10. **Análise de Logística** (2)
    - GET /delivery-status
    - GET /average-delivery-time

11. **Relatórios** (2)
    - GET /reports/summary
    - GET /reports/detailed

12. **Utilitário** (1)
    - DELETE /reset

---

## 🎨 Validação de Dados

### **Pipeline de Validação**

```
Input (CSV/XLSX)
    ↓
┌─ Clonagem
├─ Remoção de duplicatas
├─ Padronização de tipos (int64, float64, datetime)
├─ Parsing de datas (5 formatos suportados)
├─ Normalização de strings
├─ Validação de ranges numéricos
├─ Validação de valores categóricos
├─ Remoção de nulos
└─ Geração de relatório
    ↓
Output (Validated DataFrame + ValidationReport)
```

### **Relatório de Qualidade**

```
ValidationReport
├─ total_rows: int
├─ rows_after_cleaning: int
├─ duplicates_removed: int
├─ nulls_by_column: Dict
├─ invalid_values: Dict
├─ out_of_range_values: Dict
├─ date_conversion_errors: int
├─ warnings: List
├─ errors: List
└─ get_quality_score(): 0-100%
```

---

## 🔄 Ciclo de Vida da Request

```
1. Frontend envia HTTP request
   ├─ POST /upload (multipart/form-data)
   └─ GET /kpis?start_date=X&end_date=Y

2. Backend recebe (FastAPI)
   ├─ Logger.info("📤 Iniciando...")
   └─ Valida query params

3. Processamento
   ├─ Busca dados (uploaded ou default)
   ├─ Filtra por data
   ├─ Calcula resultados (pandas)
   └─ Logger.info("✅ Concluído")

4. Response
   ├─ 200 OK + JSON
   ├─ Logger.debug("Response enviada")
   └─ Frontend renderiza

5. Logging
   ├─ Salvo em logs/app.log
   ├─ Exibido em console
   └─ Rastreável em problemas
```

---

## 📈 Performance

### **Otimizações**

- ✅ Dados em memória (RAM)
- ✅ Pandas vectorization (operações rápidas)
- ✅ Logging assíncrono
- ✅ Compressão de gráficos (Recharts)
- ✅ Cache automático de dados

### **Limites**

- Max de arquivo: 100.000 linhas
- Max tamanho: ~500MB (depende da RAM)
- Timeout: Nenhum (processamento rápido)

---

## 🔒 Segurança

- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Type hints (mypy compatible)
- ✅ Error handling estruturado
- ✅ Logging de eventos críticos

**Melhorias futuras:**
- API Key
- Rate limiting
- Auth JWT

---

## 📚 Documentação de Código

Veja documentação específica:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Endpoints
- [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Components
- [DATA_VALIDATION.md](./DATA_VALIDATION.md) - Validador

