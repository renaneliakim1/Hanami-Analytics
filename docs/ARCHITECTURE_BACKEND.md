# 🏗️ Arquitetura da API - Hanami Analytics

## Mudanças Implementadas

### Antes (Incorreto ❌)
- Frontend processava dados localmente com JavaScript
- Parser CSV executado no navegador
- Sem endpoints para upload de arquivos
- Sem algoritmos de análise no backend
- Processamento inconsistente entre carregamento padrão e upload

### Depois (Correto ✅)
- Backend processa todos os dados com Python/Pandas
- Parser robusto com suporte a CSV e XLSX
- Endpoint de upload com validação
- Algoritmos de análise implementados no backend
- Frontend apenas exibe dados do servidor

---

## 📐 Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  - Upload de arquivo (CSV/XLSX)                              │
│  - Exibição de dados                                         │
│  - Dashboards com gráficos                                   │
│  - Integração com API via REST                               │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (FastAPI)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Parser Robusto                             │   │
│  │  ├─ CSV (UTF-8, Latin-1, ISO-8859-1)               │   │
│  │  └─ XLSX (Openpyxl)                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        Algoritmos de Análise (Pandas)               │   │
│  │  ├─ KPIs (faturamento, lucro, ticket médio)        │   │
│  │  ├─ Análise Temporal (vendas por mês)              │   │
│  │  ├─ Segmentação (categoria, gênero, estado)        │   │
│  │  ├─ Análise Demográfica (faixa etária, gênero)    │   │
│  │  ├─ Ranking (top produtos)                          │   │
│  │  ├─ Análise de Pagamentos (parcelamento)            │   │
│  │  ├─ Análise Logística (entrega, tempo)             │   │
│  │  ├─ Análise de Qualidade (ratings de produtos)     │   │
│  │  └─ Exportação (CSV, Excel)                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Endpoints REST                             │   │
│  │  ├─ POST /upload                                     │   │
│  │  ├─ GET /sales, /kpis, /analysis                    │   │
│  │  ├─ GET /sales-by-month, /sales-by-category        │   │
│  │  ├─ GET /top-products, /customers-by-gender        │   │
│  │  ├─ GET /sales-by-state, /payment-methods          │   │
│  │  ├─ GET /customers-by-age, /installments           │   │
│  │  ├─ GET /delivery-status, /product-ratings         │   │
│  │  ├─ GET /average-delivery-time                      │   │
│  │  ├─ GET /export/csv, /export/excel                 │   │
│  │  ├─ GET /reports/summary, /reports/detailed        │   │
│  │  └─ DELETE /reset                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Algoritmos Implementados

### 1. **Análise de KPIs**
```
INPUT: DataFrame com dados de vendas
├─ Detectar colunas: valor, lucro, cliente, avaliação
├─ Calcular:
│  ├─ Total de Vendas = COUNT(*)
│  ├─ Faturamento = SUM(valor)
│  ├─ Ticket Médio = AVG(valor)
│  ├─ Lucro Total = SUM(lucro)
│  ├─ Margem Média = AVG(lucro/valor) * 100
│  ├─ Clientes Únicos = COUNT(DISTINCT cliente_id)
│  └─ Avaliação Média = AVG(avaliação)
OUTPUT: JSON com KPIs
```

### 2. **Análise Temporal (Vendas por Mês)**
```
INPUT: DataFrame com coluna de data
├─ Converter para datetime
├─ Agrupar por período (ano-mês)
├─ Agregações:
│  ├─ Faturamento = SUM(valor)
│  ├─ Lucro = SUM(lucro)
│  └─ Quantidade = COUNT(*)
├─ Ordenar cronologicamente
OUTPUT: Array de meses com métricas
```

### 3. **Segmentação por Categoria**
```
INPUT: DataFrame com coluna de categoria
├─ GROUP BY categoria
├─ Agregação: SUM(valor)
├─ Ordenar por valor DESC
OUTPUT: Array de categorias com totais
```

### 4. **Ranking de Produtos (Top N)**
```
INPUT: DataFrame com produtos
├─ GROUP BY produto
├─ Agregações:
│  ├─ Quantidade = SUM(quantidade)
│  └─ Lucro = SUM(lucro)
├─ Ordenar por quantidade DESC
├─ Limitar top N
OUTPUT: Array de top produtos
```

### 5. **Análise Geográfica**
```
INPUT: DataFrame com coluna de estado
├─ GROUP BY estado
├─ Agregação: SUM(valor) ou COUNT(*)
├─ Ordenar por valor DESC
├─ Limitar top N
OUTPUT: Array de estados com totais
```

### 6. **Análise de Pagamentos**
```
INPUT: DataFrame com forma de pagamento
├─ GROUP BY forma_pagamento
├─ Agregações:
│  ├─ Quantidade = COUNT(*)
│  ├─ Valor Total = SUM(valor)
│  └─ Valor Médio = AVG(valor)
├─ Ordenar por quantidade DESC
OUTPUT: Array de métodos com estatísticas
```

---

## 🔄 Fluxo de Dados - Upload

```
User Upload File
      ↓
Frontend (FileUpload.tsx)
      ├─ Validar extensão (.csv, .xlsx)
      ├─ Criar FormData
      └─ POST /upload
           ↓
Backend (main.py - POST /upload)
      ├─ Receber multipart file
      ├─ Detectar tipo (CSV/XLSX)
      ├─ Detectar encoding (se CSV)
      ├─ Parsear com Pandas
      ├─ Validar dados (não vazio, < 100k linhas)
      ├─ Calcular colunas derivadas (lucro)
      ├─ Armazenar em memória: uploaded_data['current']
      └─ Retornar: { status, message, rows, columns }
           ↓
Frontend
      ├─ Receber confirmação
      ├─ Fetch GET /sales?limit=10000
      └─ Renderizar Dashboard
```

---

## 📥 Estrutura de Dados - Upload Response

```json
{
  "status": "success",
  "message": "Arquivo 'vendas.xlsx' carregado com sucesso",
  "rows": 10000,
  "columns": [
    "id",
    "data_venda",
    "cliente_id",
    "valor_final",
    "categoria",
    "produto_id",
    "nome_produto",
    "quantidade",
    "margem_lucro",
    "lucro",
    "forma_pagamento",
    "estado_cliente",
    "genero_cliente",
    "avaliacao_produto"
  ]
}
```

---

## 🛡️ Validações Implementadas

### Parser
- ✅ Validação de tipo de arquivo (CSV/XLSX apenas)
- ✅ Detecção automática de encoding (UTF-8, Latin-1, ISO-8859-1)
- ✅ Limite de tamanho (100.000 linhas máximo)
- ✅ Detecção de arquivo vazio

### Detecção de Colunas
- ✅ Busca inteligente por padrões de nomes
- ✅ Compatibilidade com múltiplos formatos
- ✅ Fallback para cálculos padrão

### Segurança
- ✅ CORS configurado para ambientes dev
- ✅ Validação de método HTTP
- ✅ Tratamento de exceções robusto

---

## 📈 Benefícios da Nova Arquitetura

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Processamento** | Frontend (JS) | Backend (Python) |
| **Parser** | Limitado | Robusto (CSV + XLSX) |
| **Escalabilidade** | Limitada (memória do navegador) | Potencial (servidor) |
| **Precisão** | Limitada | Pandas (industria-standard) |
| **Reutilização** | Apenas via REST | Múltiplos clientes |
| **Manutenção** | Espalhado | Centralizado |
| **Performance** | Lenta (browser) | Rápida (servidor) |

---

## 🚀 Próximos Passos Recomendados

1. **Persistência de Dados**
   - Implementar banco de dados (PostgreSQL/SQLite)
   - Salvar uploads em disco

2. **Autenticação**
   - JWT para proteger endpoints
   - Separação de dados por usuário

3. **Cache**
   - Redis para cache de análises frequentes
   - Reduzir processamento repetido

4. **Agendamento**
   - Celery para processamento em background
   - Relatórios automáticos por email

5. **Exportação**
   - Gerar PDF, Excel com relatórios
   - Gráficos otimizados para impressão

6. **Monitoramento**
   - Logs estruturados
   - Métricas de performance
   - Alerts de erros

---

## 📝 Notas de Implementação

### Detecção Dinâmica de Colunas
Todos os endpoints implementam detecção inteligente de colunas:
```python
# Exemplo: encontrar coluna de valor
valor_col = next(
    (col for col in data.columns if 'valor' in col.lower() or 'total' in col.lower()),
    None
)
```

Isso permite:
- Usar CSVs com nomes diferentes de colunas
- Compatibilidade com múltiplos formatos
- Menos erros por nome de coluna inesperado

### Armazenamento em Memória
Dados são armazenados em dicionário global:
```python
uploaded_data: Dict[str, pd.DataFrame] = {}
uploaded_data['current'] = df_uploaded
```

Alternativas para produção:
- Banco de dados SQL
- Redis
- Compartilhamento de arquivos em disco
