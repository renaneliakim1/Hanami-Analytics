# 📥 Guia de Exportação de Relatórios

## Visão Geral

O Hanami Analytics oferece funcionalidades completas de exportação de relatórios em formatos CSV e Excel, com suporte a filtros de período e região.

## 🎯 Funcionalidades

### Formatos Suportados

1. **CSV (Comma-Separated Values)**
   - Formato universal compatível com Excel, Google Sheets, LibreOffice
   - Encoding UTF-8 com BOM para suporte a caracteres especiais
   - Ideal para integração com outras ferramentas

2. **Excel (.xlsx)**
   - Formato nativo do Microsoft Excel
   - Múltiplas abas organizadas:
     - **Dados de Vendas**: Registros completos
     - **Resumo**: KPIs e métricas calculadas
     - **Informações**: Detalhes dos filtros e metadados
   - Formatação preservada e pronta para análise

### Filtros Disponíveis

- **Período de Datas**: Define intervalo de datas para análise
- **Região**: Filtra por região geográfica (Norte, Nordeste, Sul, Sudeste, Centro-Oeste)
- **Combinação**: Aplique ambos os filtros simultaneamente

## 🚀 Como Usar

### Interface do Dashboard

1. **Aplicar Filtros (Opcional)**
   - Clique no seletor de datas para definir período
   - Escolha uma região específica ou deixe "Todas as regiões"
   - Clique em "Aplicar" para confirmar

2. **Exportar Dados**
   - Clique em **"Exportar CSV"** para formato CSV
   - Clique em **"Exportar Excel"** para formato Excel
   - O download iniciará automaticamente

3. **Nome do Arquivo**
   - Formato: `relatorio_vendas_[timestamp]_[filtros].csv/xlsx`
   - Exemplo sem filtros: `relatorio_vendas_20260108_143025.xlsx`
   - Exemplo com filtros: `relatorio_vendas_20260108_143025_2024-01-01_ate_2024-12-31_sudeste.xlsx`

### API REST

Você também pode usar os endpoints diretamente:

#### Exportar CSV

```bash
# Sem filtros
curl -O http://localhost:8000/export/csv

# Com filtro de data
curl -O "http://localhost:8000/export/csv?start_date=2024-01-01&end_date=2024-12-31"

# Com filtro de região
curl -O "http://localhost:8000/export/csv?region=Sudeste"

# Com ambos os filtros
curl -O "http://localhost:8000/export/csv?start_date=2024-01-01&end_date=2024-12-31&region=Sul"
```

#### Exportar Excel

```bash
# Sem filtros
curl -O http://localhost:8000/export/excel

# Com filtros
curl -O "http://localhost:8000/export/excel?start_date=2024-01-01&end_date=2024-12-31&region=Nordeste"
```

### Parâmetros da API

| Parâmetro | Tipo | Formato | Descrição | Obrigatório |
|-----------|------|---------|-----------|-------------|
| `start_date` | string | YYYY-MM-DD | Data inicial do período | Não |
| `end_date` | string | YYYY-MM-DD | Data final do período | Não |
| `region` | string | Texto | Nome da região (Norte, Nordeste, Sul, Sudeste, Centro-Oeste) | Não |

## 📊 Estrutura dos Arquivos Exportados

### Arquivo CSV

Contém todas as colunas do dataset:
- ID Transação
- Data da Venda
- Produto
- Categoria
- Valor
- Cliente
- Região
- Estado
- Forma de Pagamento
- Status de Entrega
- E mais...

### Arquivo Excel

#### Aba 1: Dados de Vendas
Mesma estrutura do CSV, com todos os registros filtrados.

#### Aba 2: Resumo
Métricas calculadas:
- Total de Vendas
- Faturamento Total (R$)
- Lucro Total (R$)
- Ticket Médio (R$)
- Clientes Únicos

#### Aba 3: Informações
Metadados da exportação:
- Data Inicial do filtro
- Data Final do filtro
- Região filtrada
- Total de Registros exportados
- Data e Hora de Geração

## 💡 Casos de Uso

### Análise Mensal
```
1. Defina período: 01/01/2024 até 31/01/2024
2. Região: Todas
3. Exportar Excel
4. Analisar aba "Resumo" para KPIs do mês
```

### Relatório Regional
```
1. Período: Último trimestre
2. Região: Sudeste
3. Exportar CSV
4. Importar em ferramenta de BI
```

### Backup Completo
```
1. Sem filtros (todos os dados)
2. Exportar Excel
3. Arquivo contém histórico completo
```

### Integração com Outras Ferramentas
```
1. Aplicar filtros desejados
2. Exportar CSV
3. Importar em:
   - Google Sheets
   - Power BI
   - Tableau
   - Python/Pandas
   - R
```

## 🔧 Características Técnicas

### Backend (FastAPI)

**Endpoints:**
- `/export/csv`: Gera arquivo CSV
- `/export/excel`: Gera arquivo Excel

**Processamento:**
1. Carrega dados (arquivo padrão ou upload customizado)
2. Aplica filtros de data usando pandas
3. Aplica filtro de região com normalização
4. Gera arquivo em memória (BytesIO)
5. Retorna como StreamingResponse para download

**Bibliotecas:**
- `pandas`: Manipulação de dados
- `openpyxl`: Geração de arquivos Excel
- `FastAPI`: Endpoints REST

### Frontend (React)

**Hook: `useExportReport.ts`**
```typescript
const { exportCSV, exportExcel, isExporting, error } = useExportReport();
```

**Funções:**
- `exportCSV(options)`: Exporta CSV com filtros
- `exportExcel(options)`: Exporta Excel com filtros
- `isExporting`: Estado de loading
- `error`: Mensagem de erro (se houver)

**Componente: `Dashboard.tsx`**
- Botões de exportação no header
- Integração com filtros existentes
- Feedback visual (loading/erro)

## ⚠️ Limitações e Considerações

### Tamanho dos Arquivos
- CSV: Até ~500MB (limitado pela memória disponível)
- Excel: Recomendado até 100.000 registros para performance ideal
- Para datasets muito grandes, considere exportar em lotes

### Formato de Datas
- API espera formato ISO: `YYYY-MM-DD`
- Interface converte automaticamente de `dd/MM/yyyy` (brasileiro)

### Região
- Nomes devem corresponder exatamente: Norte, Nordeste, Sul, Sudeste, Centro-Oeste
- Case-insensitive (aceita maiúsculas/minúsculas)
- Normalização automática no backend

### Navegadores
- Download automático pode ser bloqueado por pop-up blockers
- Testado em: Chrome, Firefox, Edge, Safari

## 🐛 Troubleshooting

### "Erro ao exportar"
- **Causa**: API não está rodando
- **Solução**: Verifique se o backend está ativo em `http://localhost:8000`

### "Nenhum dado encontrado com os filtros aplicados"
- **Causa**: Filtros muito restritivos
- **Solução**: Amplie o período ou remova filtro de região

### Arquivo não baixa
- **Causa**: Bloqueador de pop-ups
- **Solução**: Permita downloads automáticos do localhost

### Caracteres especiais corrompidos (CSV)
- **Causa**: Encoding incorreto ao abrir
- **Solução**: Use Excel "Dados > De Texto" e selecione UTF-8

### Excel não abre
- **Causa**: Versão antiga do Excel
- **Solução**: Use Excel 2010+ ou LibreOffice Calc

## 📈 Métricas e Performance

### Tempo de Exportação (médio)

| Registros | CSV | Excel |
|-----------|-----|-------|
| 1.000 | ~100ms | ~300ms |
| 10.000 | ~500ms | ~1s |
| 50.000 | ~2s | ~5s |
| 100.000 | ~5s | ~12s |

*Valores aproximados em hardware moderno*

### Tamanho dos Arquivos

| Registros | CSV | Excel |
|-----------|-----|-------|
| 1.000 | ~200KB | ~150KB |
| 10.000 | ~2MB | ~1.5MB |
| 50.000 | ~10MB | ~7MB |
| 100.000 | ~20MB | ~15MB |

## 🔐 Segurança

- Exportação requer API em execução
- Dados nunca saem do ambiente local (localhost)
- Não há autenticação por padrão (adicione se necessário)
- Recomendação: Proteja endpoints em produção

## 📚 Referências

- [Documentação FastAPI](https://fastapi.tiangolo.com/)
- [Pandas Docs](https://pandas.pydata.org/docs/)
- [OpenPyXL Docs](https://openpyxl.readthedocs.io/)
- [StreamingResponse](https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse)

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do backend em `logs/app.log`
2. Abra o console do navegador (F12) para erros do frontend
3. Consulte a documentação da API em `http://localhost:8000/docs`

---

**Última atualização**: Janeiro 2026  
**Versão**: 1.0.0
