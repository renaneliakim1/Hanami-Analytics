# 🔍 Validação e Padronização de Dados

## 📋 Visão Geral

O módulo `data_validator.py` garante que **todos os dados sejam validados e padronizados** antes de qualquer cálculo.

**Score de Qualidade:** 0-100% (mínimo: 50% para aceitar)

---

## 🔄 Pipeline de Validação

```
Input (CSV/XLSX)
    ↓
1. Clonagem
   └─ Cria cópia para não alterar original
    ↓
2. Remoção de Duplicatas
   └─ Identifica e remove linhas idênticas
    ↓
3. Padronização de Tipos
   ├─ int64 ← string/float
   ├─ float64 ← string/int
   └─ datetime ← string (5 formatos)
    ↓
4. Parsing de Datas
   ├─ YYYY-MM-DD
   ├─ DD/MM/YYYY
   ├─ MM/DD/YYYY
   ├─ DD-MM-YYYY
   └─ YYYY/MM/DD
    ↓
5. Normalização de Strings
   ├─ .strip() - Remove espaços
   └─ .title() - Capitaliza
    ↓
6. Validação de Ranges
   ├─ quantidade: 1-1000
   ├─ valor_final: 0-1M
   ├─ idade: 0-150
   └─ ... (mais 8 campos)
    ↓
7. Validação Categórica
   ├─ genero_cliente: [M, F]
   ├─ forma_pagamento: [Cartão, PIX, Boleto, ...]
   └─ status_entrega: [Entregue, Pendente, ...]
    ↓
8. Remoção de Nulos
   └─ Remove linhas com valores faltantes
    ↓
Output (Validated DataFrame + ValidationReport)
```

---

## ✅ Validações Implementadas

### **1. Tipos de Dados**

| Campo | Tipo Esperado | Conversão |
|-------|---|---|
| id_transacao | int64 | string/float → int64 |
| cliente_id | int64 | string/float → int64 |
| quantidade | int64 | string/float → int64 |
| valor_final | float64 | string/int → float64 |
| custo_produto | float64 | string/int → float64 |
| idade_cliente | int64 | string/float → int64 |
| avaliacao_produto | float64 | string/int → float64 |

**Erro de conversão?** → Log WARNING + uso de valor padrão

---

### **2. Datas**

**Formatos suportados:**
```
YYYY-MM-DD    →  2025-12-05
DD/MM/YYYY    →  05/12/2025
MM/DD/YYYY    →  12/05/2025
DD-MM-YYYY    →  05-12-2025
YYYY/MM/DD    →  2025/12/05
```

**Conversão:**
1. Tenta cada formato sequencialmente
2. Se nenhum funcionar → marca como NULL
3. Remove linhas com datas inválidas
4. Padroniza para `datetime64[ns]`

**Exemplo:**
```
Entrada: "05/12/2025"
Detecta: DD/MM/YYYY
Resultado: 2025-12-05T00:00:00
```

---

### **3. Normalização de Strings**

**Operações:**
- `.strip()` - Remove espaços em branco
- `.title()` - Capitaliza primeira letra
- Remova duplicação de espaços

**Exemplo:**
```
Entrada: "  notebook DELL  "
Saída:   "Notebook Dell"
```

**Campos normalizados:**
- nome_produto
- categoria
- genero_cliente
- estado_cliente
- forma_pagamento
- status_entrega

---

### **4. Validação de Ranges Numéricos**

| Campo | Min | Max | Validação |
|-------|-----|-----|-----------|
| quantidade | 1 | 1.000 | ≥1 (não vende 0 itens) |
| valor_unitario | 0 | 1.000.000 | Produto não pode ser negativo |
| valor_final | 0 | 1.000.000 | Total não pode ser negativo |
| custo_produto | 0 | 1.000.000 | Custo não pode ser negativo |
| margem_lucro | 0 | 1 | Percentual (0-100%) |
| avaliacao_produto | 0 | 5 | Escala 1-5 estrelas |
| idade_cliente | 0 | 150 | Idade razoável |
| parcelas | 1 | 36 | Até 3 anos |
| tempo_entrega_dias | 0 | 365 | Até 1 ano |

**O que acontece com valores fora do range?**
- ✅ Registrados no relatório
- ⚠️ Mantidos nos dados (não removidos)
- 📝 Incluído em warnings

---

### **5. Validação de Valores Categóricos**

**genero_cliente:**
```
Válidos: ['M', 'F', 'Masculino', 'Feminino']
Normalizado para: 'M' ou 'F' (após .title())
```

**forma_pagamento:**
```
Válidos: ['Cartão Crédito', 'Cartão Débito', 'Boleto', 'PIX', 'Dinheiro', 'Transfer']
```

**status_entrega:**
```
Válidos: ['Entregue', 'Pendente', 'Enviado', 'Cancelado', 'Em Trânsito']
```

**O que acontece com valores inválidos?**
- ✅ Registrados no relatório
- ⚠️ Mantidos nos dados
- 📝 Incluído em warnings

---

### **6. Duplicatas**

**Detecta:** Linhas completamente idênticas em todas as colunas

**Ação:** Remove duplicatas (mantém primeira ocorrência)

**Exemplo:**
```
Entrada:
  id  produto  valor
  1   Notebook 3500
  2   Mouse    100
  1   Notebook 3500  ← Duplicada

Saída:
  id  produto  valor
  1   Notebook 3500
  2   Mouse    100
```

---

### **7. Valores Faltantes (Nulos)**

**Detecta:** Células vazias, NULL, NaN, None

**Ação:** 
1. Identifica linhas com qualquer nulo
2. Remove essas linhas completamente
3. Registra contagem por coluna

**Exemplo:**
```
Entrada:
  id  produto  valor
  1   Notebook 3500
  2   NULL     100    ← Tem nulo
  3   Mouse    NULL   ← Tem nulo

Saída:
  id  produto  valor
  1   Notebook 3500

Relatório: nulls_by_column = {'produto': 1, 'valor': 1}
```

---

## 📊 Relatório de Validação

### **Exemplo Completo**

```json
{
  "total_rows": 10000,
  "rows_after_cleaning": 9850,
  "duplicates_removed": 45,
  "nulls_by_column": {
    "nome_produto": 23,
    "valor_final": 12
  },
  "invalid_values": {
    "forma_pagamento": {
      "count": 5,
      "invalid_values": ["Cheque", "Cartão"],
      "valid_values": ["Cartão Crédito", "PIX", ...]
    }
  },
  "out_of_range_values": {
    "quantidade": {
      "count": 8,
      "range": "1 a 1000"
    }
  },
  "date_conversion_errors": 0,
  "warnings": [
    "45 duplicatas removidas",
    "80 linhas removidas por valores faltantes",
    "5 valores inválidos em 'forma_pagamento'",
    "8 valores fora do range em 'quantidade'"
  ],
  "quality_score": 95.3
}
```

### **Formatação Textual**

```
================================================================================
📊 RELATÓRIO DE VALIDAÇÃO DE DADOS
================================================================================

📈 RESUMO GERAL:
  • Registros iniciais: 10000
  • Registros após limpeza: 9850
  • Taxa de rejeição: 1.5%
  • Score de qualidade: 95.3%

🔄 DUPLICATAS:
  • Removidas: 45

❌ VALORES FALTANTES:
  • nome_produto: 23 valores
  • valor_final: 12 valores

⚠️  VALORES INVÁLIDOS:
  • forma_pagamento: 5 ocorrências
    Valores encontrados: ['Cheque', 'Cartão']

📊 VALORES FORA DO RANGE:
  • quantidade: 8 valores (esperado: 1 a 1000)

⚠️  AVISOS (4):
  • 45 duplicatas removidas
  • 80 linhas removidas por valores faltantes
  • 5 valores inválidos em 'forma_pagamento'
  • 8 valores fora do range em 'quantidade'

================================================================================
```

---

## 📈 Score de Qualidade

**Fórmula:**
```
quality_score = 100 - (total_issues / total_rows * 100)
```

**Interpretação:**

| Score | Interpretação | Ação |
|-------|---|---|
| 90-100% | Excelente | ✅ Aceitar |
| 70-90% | Bom | ✅ Aceitar |
| 50-70% | Aceitável | ⚠️ Aceitar com cuidado |
| <50% | Insuficiente | ❌ Rejeitar |

**Mínimo obrigatório: 50%**

---

## 🔍 Detecção de Problemas

### **Exemplo 1: Duplicatas**

```
Entrada: 10.000 linhas
  └─ 45 duplicatas encontradas
  
Resultado:
  └─ 9.955 linhas
  └─ Warning: "45 duplicatas removidas"
```

### **Exemplo 2: Datas Inválidas**

```
Entrada: 100 linhas de data_venda
  └─ 5 linhas com formato "99/99/9999"
  
Resultado:
  └─ 95 linhas com datas válidas
  └─ Aviso: "5 datas não puderam ser convertidas"
```

### **Exemplo 3: Valores Fora de Range**

```
Entrada: quantidade em [1, 2, 5, 2000, 0, 3]
  └─ 2000 é > 1000 (máximo)
  └─ 0 é < 1 (mínimo)
  
Resultado:
  └─ Mantém valores
  └─ Warning: "2 valores fora do range em 'quantidade'"
```

### **Exemplo 4: Nulos**

```
Entrada: 100 linhas
  ├─ Linha 1: OK
  ├─ Linha 2: nome_produto = NULL  ← Remove
  ├─ Linha 3: valor_final = NULL   ← Remove
  └─ Linha 4: OK
  
Resultado:
  └─ 2 linhas removidas
  └─ 98 linhas restantes
```

---

## 🚀 Como Usar

### **No Upload (Automático)**

```python
# Ao fazer upload de arquivo
POST /upload

# Backend executa automaticamente:
df_uploaded, report = validate_data(df_uploaded)

# Retorna quality_score na resposta:
{
  "quality_score": 95.3,
  "validation_report": {...}
}
```

### **Manualmente (Se Necessário)**

```python
from api.data_validator import validate_data, generate_validation_report
import pandas as pd

# Carregar dados
df = pd.read_csv('vendas.csv')

# Validar
df_cleaned, report = validate_data(df)

# Ver relatório
print(generate_validation_report(report))

# Usar dados validados
print(f"Registros válidos: {len(df_cleaned)}")
print(f"Score: {report.get_quality_score():.1f}%")
```

---

## 🔧 Configurar Validações

### **Editar Ranges (data_validator.py)**

```python
VALID_RANGES = {
    'quantidade': (1, 1000),  # Mínimo: 1, Máximo: 1000
    'valor_final': (0, 1000000),
    # ... adicione/modifique ranges
}
```

### **Editar Valores Categóricos**

```python
VALID_VALUES = {
    'genero_cliente': ['M', 'F', 'Masculino', 'Feminino'],
    'forma_pagamento': ['Cartão Crédito', 'PIX', 'Boleto', ...],
    # ... adicione/modifique listas
}
```

### **Editar Tipos Esperados**

```python
EXPECTED_SCHEMA = {
    'id_transacao': 'int64',
    'valor_final': 'float64',
    # ... adicione/modifique tipos
}
```

---

## 📝 Logging de Validação

Todos os eventos são registrados em `logs/app.log`:

```
[2026-01-06 14:32:20] INFO [data_validator] 🔍 Iniciando validação de 10000 registros
[2026-01-06 14:32:20] DEBUG [data_validator] Padronizando tipos de dados...
[2026-01-06 14:32:21] WARNING [data_validator] ⚠️  45 duplicatas removidas
[2026-01-06 14:32:21] WARNING [data_validator] ⚠️  5 datas inválidas encontradas
[2026-01-06 14:32:21] INFO [data_validator] ✅ Validação concluída
[2026-01-06 14:32:21] INFO [data_validator] Registros: 10000 → 9850
[2026-01-06 14:32:21] INFO [data_validator] Score de qualidade: 95.3%
```

---

## 🎯 Casos de Uso

### **Caso 1: Upload Perfeito**

```
Score: 100%
✅ Aceito automaticamente
```

### **Caso 2: Alguns Problemas**

```
Score: 92%
✅ Aceito com warning
📋 Relatório mostra detalhes
```

### **Caso 3: Muitos Problemas**

```
Score: 35%
❌ Rejeitado
📋 User recebe relatório e precisa corrigir dados
```

---

## 📊 Métrica de Qualidade

**O que afeta o score:**
- Duplicatas removidas: -1% por 10 linhas
- Linhas com nulos removidas: -1% por 5 linhas
- Valores inválidos encontrados: -0.5% por ocorrência
- Valores fora de range: -0.1% por ocorrência
- Erros de conversão de data: -1% por erro

**Exemplo de cálculo:**
```
10.000 linhas iniciais
- 45 duplicatas
- 80 linhas com nulos
- 5 valores inválidos
= 9.870 linhas válidas

Score = (9.870 / 10.000) * 100 = 98.7%
```

---

**Última atualização**: 6 de janeiro de 2026
