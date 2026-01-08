# 📚 Documentação da API

## 🔗 Base URL

```
http://localhost:8000
```

## 📖 Documentação Interativa (Swagger)

### **Swagger UI** (Interface interativa para testar)
```
http://localhost:8000/docs
```

✅ Teste endpoints diretamente  
✅ Veja estruturas de request/response  
✅ Modelos interativos  
✅ Exemplos de código (Python, cURL, JavaScript)  
✅ Autocompletar parâmetros  

**→ Leia [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) para guia completo**

### **ReDoc** (Documentação estática)
```
http://localhost:8000/redoc
```

✅ Layout mais limpo  
✅ Melhor para ler offline  
✅ Responsivo em mobile  

### **OpenAPI Schema** (Para integração)
```
http://localhost:8000/openapi.json
```

✅ Import em Postman/Insomnia  
✅ Geração de código automática  
✅ Integração em plataformas terceiras  

---

## 📤 Upload

### `POST /upload`

Upload de arquivo CSV ou XLSX com validação automática.

**Request:**
```bash
curl -X POST "http://localhost:8000/upload" \
  -H "accept: application/json" \
  -F "file=@vendas.csv"
```

**Parameters:**
- `file` (FormData, required) - Arquivo CSV ou XLSX

**Response 200 (Success):**
```json
{
  "status": "success",
  "message": "Arquivo 'vendas.csv' carregado e validado com sucesso",
  "rows": 9850,
  "columns": ["id_transacao", "cliente_id", ...],
  "quality_score": 95.3,
  "validation_report": {
    "total_rows": 10000,
    "rows_after_cleaning": 9850,
    "duplicates_removed": 45,
    "nulls_by_column": {
      "nome_produto": 23,
      "valor_final": 12
    },
    "invalid_values": {...},
    "out_of_range_values": {...},
    "date_conversion_errors": 0,
    "warnings": ["45 duplicatas removidas"],
    "quality_score": 95.3
  }
}
```

**Response 400 (Bad Request):**
```json
{
  "detail": "Tipo de arquivo não suportado. Use CSV ou XLSX"
}
```

**Response 413 (Payload Too Large):**
```json
{
  "detail": "Arquivo muito grande (máximo 100.000 linhas)"
}
```

---

## 📊 KPIs

### `GET /kpis`

Retorna principais indicadores de performance.

**Request:**
```bash
curl "http://localhost:8000/kpis?start_date=2025-12-05&end_date=2026-01-05"
```

**Query Parameters:**
- `start_date` (optional) - Data inicial (YYYY-MM-DD)
- `end_date` (optional) - Data final (YYYY-MM-DD)

**Response 200:**
```json
{
  "total_vendas": 300,
  "faturamento_total": 75000.50,
  "ticket_medio": 250.00,
  "lucro_total": 15000.25,
  "margem_lucro_media": 20.5,
  "clientes_unicos": 145,
  "avaliacao_media": 4.2
}
```

---

## 📈 Análises

### `GET /sales-by-month`

Vendas agrupadas por mês.

**Request:**
```bash
curl "http://localhost:8000/sales-by-month?start_date=2025-12-01&end_date=2026-01-31"
```

**Response 200:**
```json
[
  {
    "mes": "2025-12",
    "faturamento": 45000.00,
    "vendas": 180,
    "lucro": 9000.00
  },
  {
    "mes": "2026-01",
    "faturamento": 30000.50,
    "vendas": 120,
    "lucro": 6000.10
  }
]
```

---

### `GET /sales-by-category`

Vendas por categoria de produto.

**Request:**
```bash
curl "http://localhost:8000/sales-by-category?start_date=2025-12-05"
```

**Response 200:**
```json
[
  {
    "name": "Eletrônicos",
    "value": 35000.00
  },
  {
    "name": "Vestuário",
    "value": 28000.00
  },
  {
    "name": "Livros",
    "value": 12000.50
  }
]
```

---

### `GET /top-products`

Produtos mais vendidos (top 10 por padrão).

**Request:**
```bash
curl "http://localhost:8000/top-products?limit=5&start_date=2025-12-05"
```

**Query Parameters:**
- `limit` (optional, default: 10) - Número de produtos
- `start_date` (optional) - Data inicial
- `end_date` (optional) - Data final

**Response 200:**
```json
[
  {
    "name": "Notebook Dell",
    "quantidade": 25,
    "valor_total": 50000.00,
    "transacoes": 25,
    "lucro": 10000.00
  },
  {
    "name": "Mouse Logitech",
    "quantidade": 150,
    "valor_total": 3000.00,
    "transacoes": 150,
    "lucro": 600.00
  }
]
```

---

### `GET /customers-by-gender`

Distribuição de clientes por gênero.

**Request:**
```bash
curl "http://localhost:8000/customers-by-gender"
```

**Response 200:**
```json
[
  {
    "name": "Masculino",
    "value": 525
  },
  {
    "name": "Feminino",
    "value": 475
  }
]
```

---

### `GET /customers-by-age`

Distribuição de clientes por faixa etária.

**Request:**
```bash
curl "http://localhost:8000/customers-by-age"
```

**Response 200:**
```json
[
  {
    "name": "< 18",
    "value": 45
  },
  {
    "name": "18-25",
    "value": 120
  },
  {
    "name": "25-35",
    "value": 250
  },
  {
    "name": "35-45",
    "value": 200
  },
  {
    "name": "45-55",
    "value": 150
  },
  {
    "name": "55-65",
    "value": 100
  },
  {
    "name": "> 65",
    "value": 35
  }
]
```

---

### `GET /sales-by-state`

Vendas por estado/região.

**Request:**
```bash
curl "http://localhost:8000/sales-by-state?limit=10"
```

**Response 200:**
```json
[
  {
    "name": "São Paulo",
    "value": 35000.00
  },
  {
    "name": "Rio de Janeiro",
    "value": 18000.00
  },
  {
    "name": "Minas Gerais",
    "value": 12000.00
  }
]
```

---

### `GET /payment-methods`

Análise de formas de pagamento.

**Request:**
```bash
curl "http://localhost:8000/payment-methods"
```

**Response 200:**
```json
[
  {
    "name": "Cartão Crédito",
    "quantidade": 450,
    "valor_total": 45000.00,
    "valor_medio": 100.00
  },
  {
    "name": "PIX",
    "quantidade": 300,
    "valor_total": 30000.00,
    "valor_medio": 100.00
  },
  {
    "name": "Boleto",
    "quantidade": 100,
    "valor_total": 10000.00,
    "valor_medio": 100.00
  }
]
```

---

### `GET /installments`

Distribuição de parcelamento.

**Request:**
```bash
curl "http://localhost:8000/installments"
```

**Response 200:**
```json
[
  {
    "name": "À vista",
    "quantidade": 350,
    "value": 35000.00
  },
  {
    "name": "2x",
    "quantidade": 200,
    "value": 20000.00
  },
  {
    "name": "3x",
    "quantidade": 150,
    "value": 15000.00
  }
]
```

---

### `GET /delivery-status`

Status de entregas.

**Request:**
```bash
curl "http://localhost:8000/delivery-status"
```

**Response 200:**
```json
[
  {
    "name": "Entregue",
    "value": 650
  },
  {
    "name": "Em Trânsito",
    "value": 100
  },
  {
    "name": "Pendente",
    "value": 50
  },
  {
    "name": "Cancelado",
    "value": 20
  }
]
```

---

### `GET /product-ratings`

Produtos com menor avaliação.

**Request:**
```bash
curl "http://localhost:8000/product-ratings?limit=10"
```

**Response 200:**
```json
[
  {
    "name": "Produto X",
    "avaliacao": 1.5
  },
  {
    "name": "Produto Y",
    "avaliacao": 2.0
  },
  {
    "name": "Produto Z",
    "avaliacao": 2.3
  }
]
```

---

### `GET /average-delivery-time`

Tempo médio de entrega em dias.

**Request:**
```bash
curl "http://localhost:8000/average-delivery-time"
```

**Response 200:**
```json
{
  "tempo_medio": 5.3
}
```

---

## 📑 Relatórios

### `GET /reports/summary`

Relatório resumido com principais insights.

**Request:**
```bash
curl "http://localhost:8000/reports/summary?start_date=2025-12-05&end_date=2026-01-05"
```

**Response 200:**
```json
{
  "timestamp": "2026-01-06T14:32:22.123456",
  "kpis": {
    "total_vendas": 300,
    "faturamento_total": 75000.50,
    "ticket_medio": 250.00,
    "lucro_total": 15000.25,
    "margem_lucro_media": 20.5,
    "clientes_unicos": 145,
    "avaliacao_media": 4.2
  },
  "top_categories": [
    { "name": "Eletrônicos", "value": 35000.00 },
    { "name": "Vestuário", "value": 28000.00 }
  ],
  "top_products": [
    { "name": "Notebook Dell", "quantidade": 25, "valor_total": 50000.00, "lucro": 10000.00 }
  ],
  "data_source": "uploaded"
}
```

---

### `GET /reports/detailed`

Relatório completo com todas as análises.

**Request:**
```bash
curl "http://localhost:8000/reports/detailed?start_date=2025-12-05"
```

**Response 200:**
```json
{
  "timestamp": "2026-01-06T14:32:22.123456",
  "analysis": {
    "shape": { "rows": 300, "columns": 18 },
    "columns": ["id_transacao", ...],
    "statistics": {
      "valor_final": {
        "mean": 250.00,
        "median": 200.00,
        "min": 50.00,
        "max": 2000.00,
        "std": 150.00,
        "sum": 75000.00
      }
    }
  },
  "kpis": { ... },
  "monthly_sales": [ ... ],
  "sales_by_category": [ ... ],
  "top_products": [ ... ],
  "customers_by_gender": [ ... ],
  "sales_by_state": [ ... ],
  "payment_methods": [ ... ]
}
```

---

## 🔄 Utilitários

### `GET /analysis`

Análise estatística geral dos dados.

**Request:**
```bash
curl "http://localhost:8000/analysis"
```

**Response 200:**
```json
{
  "shape": {
    "rows": 10000,
    "columns": 18
  },
  "columns": ["id_transacao", "cliente_id", "data_venda", ...],
  "statistics": {
    "valor_final": {
      "mean": 250.00,
      "median": 200.00,
      "min": 10.00,
      "max": 5000.00,
      "std": 180.00,
      "sum": 2500000.00
    },
    "quantidade": {
      "mean": 2.5,
      "median": 2.0,
      "min": 1,
      "max": 10,
      "std": 1.5,
      "sum": 25000
    }
  }
}
```

---

### `GET /sales`

Lista de vendas com paginação.

**Request:**
```bash
curl "http://localhost:8000/sales?limit=100&offset=0"
```

**Query Parameters:**
- `limit` (optional, default: 100) - Número de registros
- `offset` (optional, default: 0) - Paginação

**Response 200:**
```json
{
  "total": 10000,
  "limit": 100,
  "offset": 0,
  "data": [
    {
      "id_transacao": 1,
      "cliente_id": 101,
      "data_venda": "2025-12-05",
      "nome_produto": "Notebook Dell",
      "quantidade": 1,
      "valor_final": 3500.00,
      "lucro": 700.00,
      ...
    }
  ]
}
```

---

### `DELETE /reset`

Reseta os dados enviados e volta aos dados padrão.

**Request:**
```bash
curl -X DELETE "http://localhost:8000/reset"
```

**Response 200:**
```json
{
  "status": "success",
  "message": "Dados resetados para padrão"
}
```

---

## 🔍 Filtro por Data

### Formatos Suportados

```
YYYY-MM-DD    (2025-12-05)
DD/MM/YYYY    (05/12/2025)
MM/DD/YYYY    (12/05/2025)
DD-MM-YYYY    (05-12-2025)
YYYY/MM/DD    (2025/12/05)
```

### Exemplo com Filtro

```bash
# Período específico
curl "http://localhost:8000/kpis?start_date=2025-12-05&end_date=2026-01-05"

# Apenas data inicial
curl "http://localhost:8000/top-products?start_date=2025-12-01"

# Apenas data final
curl "http://localhost:8000/sales-by-category?end_date=2026-01-05"

# Sem datas (dados completos)
curl "http://localhost:8000/kpis"
```

---

## ⚠️ Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 400 | Bad Request - Arquivo inválido ou parâmetro errado |
| 413 | Payload Too Large - Arquivo muito grande (>100k linhas) |
| 422 | Unprocessable Entity - Qualidade de dados insuficiente (<50%) |
| 500 | Internal Server Error - Erro no processamento |

---

## 📋 Estrutura de Validação de Resposta

Todas as respostas de error incluem:

```json
{
  "detail": "Descrição do erro"
}
```

Para uploads, também inclui `validation_report`:

```json
{
  "status": "success",
  "message": "...",
  "quality_score": 95.3,
  "validation_report": {
    "total_rows": 10000,
    "rows_after_cleaning": 9850,
    "duplicates_removed": 45,
    "nulls_by_column": {...},
    "warnings": [...],
    "quality_score": 95.3
  }
}
```

---

## � Exportação

### `GET /export/csv`

Exporta dados de vendas em formato CSV com filtros opcionais.

**Parameters:**
- `start_date` (query, optional) - Data inicial (formato: YYYY-MM-DD)
- `end_date` (query, optional) - Data final (formato: YYYY-MM-DD)
- `region` (query, optional) - Região (Norte, Nordeste, Sul, Sudeste, Centro-Oeste)

**Request:**
```bash
# Sem filtros
curl -O "http://localhost:8000/export/csv"

# Com filtro de data
curl -O "http://localhost:8000/export/csv?start_date=2024-01-01&end_date=2024-12-31"

# Com filtro de região
curl -O "http://localhost:8000/export/csv?region=Sudeste"

# Com ambos os filtros
curl -O "http://localhost:8000/export/csv?start_date=2024-01-01&end_date=2024-12-31&region=Sul"
```

**Response 200 (Success):**
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename=relatorio_vendas_[timestamp]_[filtros].csv`
- Arquivo CSV com encoding UTF-8 BOM

**Response 404:**
```json
{
  "detail": "Nenhum dado encontrado com os filtros aplicados"
}
```

---

### `GET /export/excel`

Exporta dados de vendas em formato Excel (.xlsx) com múltiplas abas.

**Parameters:**
- `start_date` (query, optional) - Data inicial (formato: YYYY-MM-DD)
- `end_date` (query, optional) - Data final (formato: YYYY-MM-DD)
- `region` (query, optional) - Região (Norte, Nordeste, Sul, Sudeste, Centro-Oeste)

**Request:**
```bash
# Sem filtros
curl -O "http://localhost:8000/export/excel"

# Com filtros
curl -O "http://localhost:8000/export/excel?start_date=2024-01-01&end_date=2024-12-31&region=Nordeste"
```

**Response 200 (Success):**
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename=relatorio_vendas_[timestamp]_[filtros].xlsx`
- Arquivo Excel com 3 abas:
  - **Dados de Vendas**: Registros completos filtrados
  - **Resumo**: KPIs calculados (total vendas, faturamento, lucro, ticket médio, clientes únicos)
  - **Informações**: Metadados (filtros aplicados, total registros, data/hora geração)

**Response 404:**
```json
{
  "detail": "Nenhum dado encontrado com os filtros aplicados"
}
```

**Estrutura das Abas do Excel:**

Aba "Resumo":
| Métrica | Valor |
|---------|-------|
| Total de Vendas | 9850 |
| Faturamento Total | R$ 2.450.378,00 |
| Lucro Total | R$ 856.789,50 |
| Ticket Médio | R$ 248,76 |
| Clientes Únicos | 3247 |

Aba "Informações":
| Filtro | Valor |
|--------|-------|
| Data Inicial | 2024-01-01 |
| Data Final | 2024-12-31 |
| Região | Sudeste |
| Total de Registros | 9850 |
| Data de Geração | 08/01/2026 14:30:25 |

---

## 🚀 Exemplos de Uso

### Python

```python
import requests

# Upload
files = {'file': open('vendas.csv', 'rb')}
response = requests.post('http://localhost:8000/upload', files=files)
print(response.json())

# KPIs com filtro
params = {
    'start_date': '2025-12-05',
    'end_date': '2026-01-05'
}
response = requests.get('http://localhost:8000/kpis', params=params)
kpis = response.json()

# Exportar CSV
params = {
    'start_date': '2024-01-01',
    'end_date': '2024-12-31',
    'region': 'Sudeste'
}
response = requests.get('http://localhost:8000/export/csv', params=params)
with open('relatorio.csv', 'wb') as f:
    f.write(response.content)

# Exportar Excel
response = requests.get('http://localhost:8000/export/excel', params=params)
with open('relatorio.xlsx', 'wb') as f:
    f.write(response.content)
```

### JavaScript

```javascript
// Upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);
const response = await fetch('http://localhost:8000/upload', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data.quality_score);

// KPIs
const params = new URLSearchParams({
  start_date: '2025-12-05',
  end_date: '2026-01-05'
});
const response = await fetch(`http://localhost:8000/kpis?${params}`);
const kpis = await response.json();

// Exportar CSV
const exportParams = new URLSearchParams({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  region: 'Sudeste'
});
const csvResponse = await fetch(`http://localhost:8000/export/csv?${exportParams}`);
const csvBlob = await csvResponse.blob();
const url = window.URL.createObjectURL(csvBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'relatorio.csv';
a.click();
```

---

**Para mais detalhes sobre exportação, consulte**: [EXPORT_GUIDE.md](./EXPORT_GUIDE.md)

**Última atualização**: 8 de janeiro de 2026
