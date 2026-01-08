# API Robusta - Hanami Analytics

## Visão Geral

API FastAPI robusta para processamento de arquivos CSV/XLSX e geração de relatórios analíticos.

### Requisitos Implementados ✅

- **Parser de dados**: Suporte robusto para CSV e XLSX com detecção automática de encoding
- **Endpoint de upload**: Multipart form data com validação e processamento
- **Algoritmos de análise**: Análise estatística, segmentação, agregação e ranking
- **Endpoints de relatórios**: Relatórios resumidos e detalhados

---

## 📋 Endpoints

### Upload de Arquivos

#### `POST /upload`
Realiza upload e processamento de arquivo CSV/XLSX

**Parâmetros:**
- `file: UploadFile` - Arquivo CSV ou XLSX (máx 100.000 linhas)

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Arquivo 'vendas.csv' carregado com sucesso",
  "rows": 10000,
  "columns": ["id", "data_venda", "valor_final", ...]
}
```

**Erros:**
- `400` - Tipo de arquivo não suportado ou arquivo vazio
- `413` - Arquivo muito grande (> 100.000 linhas)

---

### Dados e Análise

#### `GET /sales`
Retorna dados de vendas com paginação

**Query Parameters:**
- `limit: int` (default: 100) - Quantidade de registros
- `offset: int` (default: 0) - Offset para paginação

**Resposta:**
```json
{
  "total": 10000,
  "limit": 100,
  "offset": 0,
  "data": [
    {
      "id": 1,
      "data_venda": "2024-01-15",
      "valor_final": 250.50,
      ...
    }
  ]
}
```

#### `GET /analysis`
Análise estatística completa dos dados

**Resposta:**
```json
{
  "shape": {
    "rows": 10000,
    "columns": 15
  },
  "columns": ["id", "data_venda", "valor_final", ...],
  "statistics": {
    "valor_final": {
      "mean": 125.45,
      "median": 110.00,
      "min": 10.00,
      "max": 999.99,
      "std": 45.32,
      "sum": 1254567.89
    }
  }
}
```

#### `GET /kpis`
**KPIs principais com detecção dinâmica de colunas**

**Algoritmos implementados:**
- Faturamento total (soma de valores)
- Ticket médio (valor médio por transação)
- Lucro total (soma de lucros)
- Margem de lucro média (%)
- Clientes únicos (contagem distinta)
- Avaliação média (rating médio)

**Resposta:**
```json
{
  "total_vendas": 10000,
  "faturamento_total": 1254567.89,
  "ticket_medio": 125.45,
  "lucro_total": 456789.23,
  "margem_lucro_media": 38.5,
  "clientes_unicos": 8234,
  "avaliacao_media": 4.3
}
```

---

### Análises Segmentadas

#### `GET /sales-by-month`
**Algoritmo de Análise Temporal**

Agrupa vendas por mês com faturamento, lucro e quantidade

**Resposta:**
```json
[
  {
    "mes": "2024-01",
    "faturamento": 95000.00,
    "lucro": 35000.00,
    "vendas": 750
  },
  {
    "mes": "2024-02",
    "faturamento": 105000.00,
    "lucro": 38000.00,
    "vendas": 820
  }
]
```

#### `GET /sales-by-category`
**Algoritmo de Segmentação por Categoria**

Agrupa vendas por categoria com total em valor

**Resposta:**
```json
[
  {
    "name": "Eletrônicos",
    "value": 456000.00
  },
  {
    "name": "Roupas",
    "value": 328000.00
  }
]
```

#### `GET /top-products`
**Algoritmo de Ranking de Produtos**

Query Parameters:
- `limit: int` (default: 10) - Top N produtos

**Resposta:**
```json
[
  {
    "nome_produto": "Notebook Dell XPS",
    "quantidade": 450,
    "lucro": 125000.00
  }
]
```

#### `GET /customers-by-gender`
**Algoritmo de Segmentação Demográfica**

Distribui clientes por gênero

**Resposta:**
```json
[
  {
    "name": "Masculino",
    "value": 4500
  },
  {
    "name": "Feminino",
    "value": 4200
  }
]
```

#### `GET /sales-by-state`
**Algoritmo de Análise Geográfica**

Query Parameters:
- `limit: int` (default: 10) - Top N estados

**Resposta:**
```json
[
  {
    "name": "SP",
    "value": 450000.00
  },
  {
    "name": "RJ",
    "value": 320000.00
  }
]
```

#### `GET /payment-methods`
**Algoritmo de Análise de Pagamentos**

Analisa distribuição e valor médio por forma de pagamento

**Resposta:**
```json
[
  {
    "name": "Cartão de Crédito",
    "quantidade": 6800,
    "valor_total": 876000.00,
    "valor_medio": 128.82
  }
]
```

#### `GET /customers-by-age`
**Algoritmo de Segmentação por Faixa Etária**

Distribui clientes por faixa etária (< 18, 18-25, 25-35, 35-45, 45-55, 55-65, > 65)

**Resposta:**
```json
[
  {
    "name": "25-35",
    "value": 2500
  },
  {
    "name": "35-45",
    "value": 2200
  }
]
```

#### `GET /installments`
**Algoritmo de Análise de Parcelamento**

Agrupa vendas por número de parcelas

**Resposta:**
```json
[
  {
    "name": 1,
    "quantidade": 4500,
    "value": 450000.00
  },
  {
    "name": 12,
    "quantidade": 3200,
    "value": 320000.00
  }
]
```

#### `GET /delivery-status`
**Algoritmo de Análise Logística**

Analisa distribuição de status de entrega

**Resposta:**
```json
[
  {
    "name": "Entregue",
    "value": 8500
  },
  {
    "name": "Pendente",
    "value": 1200
  },
  {
    "name": "Enviado",
    "value": 300
  }
]
```

#### `GET /product-ratings`
**Algoritmo de Análise de Qualidade**

Retorna produtos com menor avaliação (apenas produtos com 2+ avaliações)

Query Parameters:
- `limit: int` (default: 10) - Top N produtos com menor avaliação

**Resposta:**
```json
[
  {
    "name": "Produto X",
    "avaliacao": 2.5
  },
  {
    "name": "Produto Y",
    "avaliacao": 3.1
  }
]
```

#### `GET /average-delivery-time`
**Algoritmo de Análise Logística**

Retorna tempo médio de entrega em dias

**Resposta:**
```json
{
  "tempo_medio": 5.7
}
```

---

### Exportação de Dados

#### `GET /export/csv`
**Exportação de Dados em CSV**

Exporta os dados atuais em formato CSV. Suporta filtros de data.

Query Parameters:
- `start_date: string` (optional) - Data inicial (YYYY-MM-DD)
- `end_date: string` (optional) - Data final (YYYY-MM-DD)
- `region: string` (optional) - Filtro por região

**Resposta:**
- Download de arquivo CSV com todos os dados

#### `GET /export/excel`
**Exportação de Dados em Excel**

Exporta os dados atuais em formato Excel com múltiplas abas. Suporta filtros de data.

Query Parameters:
- `start_date: string` (optional) - Data inicial (YYYY-MM-DD)
- `end_date: string` (optional) - Data final (YYYY-MM-DD)
- `region: string` (optional) - Filtro por região

**Resposta:**
- Download de arquivo Excel com planilhas:
  - Dados Brutos
  - KPIs
  - Vendas por Mês
  - Vendas por Categoria
  - Produtos Top
  - Clientes por Gênero
  - Vendas por Estado
  - Formas de Pagamento

---

### Relatórios

#### `GET /reports/summary`
**Relatório Resumido**

Combinação de KPIs, top 3 categorias e top 5 produtos

**Resposta:**
```json
{
  "timestamp": "2024-01-15T10:30:45.123456",
  "kpis": {...},
  "top_categories": [...],
  "top_products": [...],
  "data_source": "uploaded"
}
```

#### `GET /reports/detailed`
**Relatório Detalhado Completo**

Inclui todas as análises: análise estatística, KPIs, vendas mensais, categorias, produtos, gênero, estado, pagamentos

**Resposta:**
```json
{
  "timestamp": "2024-01-15T10:30:45.123456",
  "analysis": {...},
  "kpis": {...},
  "monthly_sales": [...],
  "sales_by_category": [...],
  "top_products": [...],
  "customers_by_gender": [...],
  "sales_by_state": [...],
  "payment_methods": [...]
}
```

---

### Gerenciamento de Dados

#### `DELETE /reset`
Reseta dados enviados e volta aos dados padrão

**Resposta:**
```json
{
  "status": "success",
  "message": "Dados resetados para padrão"
}
```

---

## 🔄 Fluxo de Uso

1. **Upload do arquivo:**
   ```bash
   curl -X POST http://localhost:8000/upload \
     -F "file=@vendas.csv"
   ```

2. **Verificar dados:**
   ```bash
   curl http://localhost:8000/sales?limit=10
   ```

3. **Obter análise:**
   ```bash
   curl http://localhost:8000/kpis
   curl http://localhost:8000/sales-by-month
   curl http://localhost:8000/reports/summary
   ```

4. **Relatório completo:**
   ```bash
   curl http://localhost:8000/reports/detailed
   ```

5. **Reset:**
   ```bash
   curl -X DELETE http://localhost:8000/reset
   ```

---

## 🔧 Recursos Técnicos

### Parser Robusto
- **Detecção automática de encoding**: UTF-8, Latin-1, ISO-8859-1
- **Suporte a múltiplos formatos**: CSV e XLSX
- **Validação de dados**: Verificação de linhas vazias e limites

### Algoritmos de Análise
- **Análise Estatística**: Média, mediana, min, max, desvio padrão
- **Análise Temporal**: Agrupamento por período (mês)
- **Segmentação**: Categorias, gênero, localização
- **Ranking**: Top N produtos por volume/lucro
- **Análise de Pagamentos**: Distribuição e valor médio

### Detecção Dinâmica de Colunas
Todos os endpoints detectam automaticamente as colunas disponíveis, permitindo usar com diferentes formatos de CSV/XLSX

---

## 📦 Dependências

- FastAPI 0.115.5
- Pandas 2.2.3
- Openpyxl 3.1.5
- Python-multipart 0.0.18

---

## 🚀 Inicialização

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API estará disponível em: `http://localhost:8000`
Documentação interativa (Swagger): `http://localhost:8000/docs`
