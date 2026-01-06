# 📖 Guia Swagger - Documentação Interativa da API

## 🎯 O que é Swagger?

**Swagger** (OpenAPI) é um padrão para documentar APIs REST de forma interativa. Permite:
- ✅ Visualizar todos os endpoints disponíveis
- ✅ Testar endpoints diretamente no navegador
- ✅ Ver estrutura de request/response
- ✅ Copiar exemplos de código

---

## 🚀 Acessar Swagger

### **Interface Principal**
```
http://localhost:8000/docs
```

**Características:**
- Interface Swagger UI (mais moderna)
- Teste interativo de endpoints
- Autosaved exemplos
- Syntax highlighting

### **Interface Alternativa (ReDoc)**
```
http://localhost:8000/redoc
```

**Características:**
- Layout mais limpo (sem testes)
- Melhor para documentação estática
- Melhor para mobile

### **JSON Raw (OpenAPI Schema)**
```
http://localhost:8000/openapi.json
```

**Uso:**
- Import em ferramentas (Postman, Insomnia)
- Geração de código
- Integração com outras plataformas

---

## 🔑 Recursos Principais do Swagger

### **1. Exploração de Endpoints**

Cada endpoint mostra:
```
GET /api/sales
├─ Summary: "Retorna todas as vendas"
├─ Description: "Descrição completa..."
├─ Parameters: [data_inicio, data_fim, limit]
├─ Responses: 
│  ├─ 200: Array de vendas
│  └─ 400: Erro de validação
└─ Try it out: Botão para testar
```

### **2. Modelo de Dados**

Clique em qualquer modelo para ver estrutura:
```json
{
  "id_transacao": 1,
  "cliente_id": 101,
  "data_venda": "2025-12-05",
  "nome_produto": "Notebook",
  "quantidade": 1,
  "valor_unitario": 3500.00,
  "valor_final": 3500.00
}
```

### **3. Teste Interativo**

Passos:
1. Abra endpoint
2. Clique "Try it out"
3. Preencha parâmetros
4. Clique "Execute"
5. Veja response em tempo real

---

## 📊 Endpoints Documentados

### **Gerenciamento de Dados**

#### **Upload de Arquivo**
```
POST /upload
├─ Descrição: Faz upload de arquivo CSV ou XLSX
├─ Parâmetros: 
│  └─ file: Arquivo (multipart/form-data)
├─ Response 200:
│  {
│    "message": "Arquivo processado com sucesso",
│    "quality_score": 85.5,
│    "validation_report": {...},
│    "rows_processed": 10000
│  }
└─ Validação: Score mínimo 50%
```

#### **Dados Padrão**
```
GET /api/sales
├─ Descrição: Retorna todas as vendas (padrão ou upload)
├─ Parâmetros Query:
│  ├─ data_inicio: YYYY-MM-DD
│  ├─ data_fim: YYYY-MM-DD
│  └─ limit: 1-10000
├─ Response 200:
│  {
│    "total_registros": 10000,
│    "registros": [...]
│  }
└─ Performance: ~200ms para 10k registros
```

---

### **Análise de KPIs**

#### **KPIs Gerais**
```
GET /api/kpis
├─ Descrição: Retorna KPIs agregados
├─ Parâmetros: data_inicio, data_fim (optional)
├─ Response 200:
│  {
│    "total_vendas": 10000,
│    "receita_total": 1500000.00,
│    "ticket_medio": 150.00,
│    "margem_lucro_media": 25.5
│  }
└─ Cache: Recalcula sempre (sem cache)
```

#### **Top Produtos**
```
GET /api/top-produtos
├─ Descrição: Top 20 produtos mais vendidos
├─ Parâmetros: limit (1-100)
├─ Response 200:
│  [
│    {
│      "nome_produto": "Notebook",
│      "quantidade_vendas": 150,
│      "receita_total": 525000
│    },
│    ...
│  ]
└─ Ordenado por: Receita total (DESC)
```

---

### **Análises Detalhadas**

#### **Por Categoria**
```
GET /api/analise-categorias
├─ Descrição: Vendas por categoria
├─ Response 200:
│  {
│    "categorias": [
│      {
│        "categoria": "Eletrônicos",
│        "quantidade": 3500,
│        "receita": 875000
│      },
│      ...
│    ]
│  }
└─ Modo: Agregação com GROUP BY
```

#### **Por Cliente**
```
GET /api/clientes-top
├─ Descrição: Clientes com maior gasto
├─ Parâmetros: limit (default: 10)
├─ Response 200:
│  [
│    {
│      "cliente_id": 101,
│      "total_gasto": 15000.00,
│      "numero_pedidos": 25
│    },
│    ...
│  ]
└─ Útil para: Segmentação de clientes
```

---

## 🎨 Estrutura da Interface Swagger

```
┌─────────────────────────────────────────────────────────┐
│  Hanami Analytics API v1.0.0                   🔐 🌙  │
│  API robusta para análise de dados de vendas...         │
├─────────────────────────────────────────────────────────┤
│  📁 Explore                        Search...            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📤 upload                                               │
│  ├─ POST /upload  [Try it out] [curl] [JavaScript]     │
│  │  Request: file (multipart/form-data)                 │
│  │  Response: {quality_score, validation_report, ...}   │
│  │                                                       │
│  │  📋 Request Body Example:                             │
│  │  multipart/form-data (file)                           │
│  │  [Arquivo...___________]  [Execute]  [Clear]         │
│  │                                                       │
│  │  📊 Responses:                                        │
│  │  ✅ 200 OK - Arquivo processado                       │
│  │  ❌ 400 Bad Request - Arquivo inválido               │
│  │                                                       │
│  └─ Response Headers & Body                             │
│                                                          │
│  📊 /api/sales                                           │
│  ├─ GET /api/sales [Try it out]                        │
│  │  Parameters:                                         │
│  │  • data_inicio (query, string, YYYY-MM-DD)         │
│  │  • data_fim (query, string, YYYY-MM-DD)            │
│  │  • limit (query, integer, max: 10000)              │
│  │                                                      │
│  │  [Execute]                                           │
│                                                          │
│  └─ Response:                                           │
│     {                                                   │
│       "total_registros": 10000,                        │
│       "registros": [...]                               │
│     }                                                   │
│                                                          │
│  ... (mais endpoints) ...                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Como Testar um Endpoint

### **Exemplo: POST /upload**

1. **Abra Swagger:**
   ```
   http://localhost:8000/docs
   ```

2. **Encontre endpoint "upload"**

3. **Clique "Try it out"**

4. **Selecione arquivo CSV:**
   ```
   [Escolher arquivo] vendas.csv
   ```

5. **Clique "Execute"**

6. **Veja resultado:**
   ```
   ✅ Code 200
   {
     "message": "Arquivo processado com sucesso",
     "quality_score": 92.5,
     "rows_processed": 5000
   }
   ```

7. **Copie Response:**
   ```
   Clique em ícone de copy (lado direito)
   ```

---

## 🔄 Testar em Sequência

Fluxo típico de testes:

```
1. POST /upload
   └─ Faz upload de dados
      └─ Retorna quality_score

2. GET /api/sales
   └─ Testa se dados foram carregados
      └─ Retorna todas as vendas

3. GET /api/kpis
   └─ Calcula KPIs
      └─ Mostra totalizadores

4. GET /api/top-produtos?limit=10
   └─ Análise de produtos
      └─ Retorna ranking

5. GET /api/analise-categorias
   └─ Agrega por categoria
      └─ Mostra distribuição
```

---

## 📋 Modelos de Dados

### **Venda (SalesData)**
```json
{
  "id_transacao": 1,
  "cliente_id": 101,
  "data_venda": "2025-12-05",
  "nome_produto": "Notebook",
  "categoria": "Eletrônicos",
  "quantidade": 1,
  "valor_unitario": 3500.00,
  "valor_final": 3500.00,
  "margem_lucro": 0.25,
  "lucro": 875.00,
  "forma_pagamento": "Cartão Crédito",
  "status_entrega": "Entregue"
}
```

### **ValidationReport**
```json
{
  "total_linhas": 10000,
  "linhas_duplicadas": 50,
  "linhas_com_nulos": 120,
  "problemas_data": 10,
  "valores_fora_range": 5,
  "valores_categoricos_invalidos": 15,
  "linhas_removidas": 200,
  "linhas_processadas": 9800,
  "quality_score": 85.5,
  "status": "ACEITO",
  "timestamp": "2025-01-06T10:30:00Z"
}
```

---

## 🛠️ Integrar Swagger em Ferramentas Externas

### **Postman**

1. Vá em "File" → "Import"
2. URL: `http://localhost:8000/openapi.json`
3. Click "Import"
4. Todos os endpoints aparecem em coleção

### **Insomnia**

1. Clique em "Import" → "From URL"
2. Cole: `http://localhost:8000/openapi.json`
3. Pronto! Coleção importada

### **VSCode REST Client**

```
### Upload arquivo
POST http://localhost:8000/upload
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="vendas.csv"

< ./vendas.csv
------FormBoundary--

### Obter KPIs
GET http://localhost:8000/api/kpis?data_inicio=2025-01-01&data_fim=2025-12-31
```

---

## 🔐 Metadados Swagger

O projeto está configurado com:

```python
app = FastAPI(
    title="Hanami Analytics API",
    description="API robusta para análise de dados de vendas...",
    version="1.0.0",
    contact={
        "name": "Analytics Support",
        "email": "support@analytics.local"
    },
    license_info={
        "name": "MIT",
    },
    servers=[
        {"url": "http://localhost:8000", "description": "Development"},
        {"url": "http://api.example.com", "description": "Production"}
    ]
)
```

**Customizável em:** `api/main.py` (linhas 60-85)

---

## 📚 Referência de Status Codes

| Código | Significado | Exemplo |
|--------|-------------|---------|
| **200** | OK | Upload bem-sucedido |
| **400** | Bad Request | Arquivo inválido |
| **404** | Not Found | Endpoint não existe |
| **422** | Validation Error | Parâmetro faltando |
| **500** | Server Error | Erro interno |

---

## 🎓 Exemplo Prático Completo

### **Cenário: Analisar vendas de dezembro**

1. **Abra Swagger:**
   ```
   http://localhost:8000/docs
   ```

2. **Teste GET /api/sales:**
   ```
   Parâmetros:
   • data_inicio: 2025-12-01
   • data_fim: 2025-12-31
   • limit: 100
   
   [Execute]
   ```

3. **Obtenha resposta:**
   ```json
   {
     "total_registros": 5420,
     "registros": [
       {
         "id_transacao": 1,
         "data_venda": "2025-12-05",
         "valor_final": 3500.00,
         ...
       }
     ]
   }
   ```

4. **Teste GET /api/kpis com mesmas datas:**
   ```
   data_inicio: 2025-12-01
   data_fim: 2025-12-31
   
   [Execute]
   ```

5. **Veja KPIs:**
   ```json
   {
     "total_vendas": 5420,
     "receita_total": 812000.00,
     "ticket_medio": 149.85,
     "margem_lucro_media": 24.2
   }
   ```

---

## 🚀 Próximos Passos

- [ ] Explore todos os 14 endpoints
- [ ] Teste upload com seu próprio arquivo
- [ ] Verifique validação de dados
- [ ] Compare responses de diferentes datas
- [ ] Exporte schema para usar em outro projeto

---

**Mais informações:** Veja [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para referência completa.

---

**Última atualização**: 6 de janeiro de 2026
