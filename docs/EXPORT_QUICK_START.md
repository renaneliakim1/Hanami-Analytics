# 📥 Módulo de Exportação - Quick Start

## 🚀 Início Rápido

### 1. Backend já está configurado
Os endpoints de exportação já estão implementados em `api/main.py`:
- `GET /export/csv` - Exportar em CSV
- `GET /export/excel` - Exportar em Excel

### 2. Frontend já está configurado
Os botões de exportação estão no Dashboard:
- Botão verde "Exportar CSV"
- Botão azul "Exportar Excel"

### 3. Como usar

#### Via Interface (Recomendado)
1. Inicie o backend: `cd api && python main.py`
2. Inicie o frontend: `cd frontend && npm run dev`
3. Abra http://localhost:8081
4. (Opcional) Aplique filtros de data/região
5. Clique em "Exportar CSV" ou "Exportar Excel"
6. O arquivo será baixado automaticamente

#### Via API
```bash
# CSV sem filtros
curl -O http://localhost:8000/export/csv

# Excel com filtros
curl -O "http://localhost:8000/export/excel?start_date=2024-01-01&end_date=2024-12-31&region=Sudeste"
```

## 📊 O que você recebe

### CSV
- Arquivo .csv com todos os dados filtrados
- Encoding UTF-8 (compatível com Excel)
- Nome: `relatorio_vendas_[timestamp]_[filtros].csv`

### Excel
- Arquivo .xlsx com 3 abas:
  1. **Dados de Vendas**: Todos os registros
  2. **Resumo**: KPIs calculados
  3. **Informações**: Filtros aplicados e metadados
- Nome: `relatorio_vendas_[timestamp]_[filtros].xlsx`

## 🎯 Filtros Disponíveis

| Filtro | Parâmetro | Formato | Exemplo |
|--------|-----------|---------|---------|
| Data Inicial | `start_date` | YYYY-MM-DD | 2024-01-01 |
| Data Final | `end_date` | YYYY-MM-DD | 2024-12-31 |
| Região | `region` | Texto | Sudeste, Sul, Norte, Nordeste, Centro-Oeste |

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [EXPORT_GUIDE.md](./docs/EXPORT_GUIDE.md) - Guia completo (22 seções)
- [EXPORT_MODULE_SUMMARY.md](./docs/EXPORT_MODULE_SUMMARY.md) - Resumo técnico
- [API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) - Documentação da API

## 🧪 Testar os Endpoints

### Windows (PowerShell)
```powershell
.\test_export.ps1
```

### Linux/Mac
```bash
chmod +x test_export.sh
./test_export.sh
```

Isso criará arquivos de teste para validar a funcionalidade.

## ⚡ Características

- ✅ Exportação instantânea
- ✅ Filtros por período e região
- ✅ Excel com múltiplas abas
- ✅ CSV compatível com Excel
- ✅ Nome de arquivo descritivo
- ✅ Download automático
- ✅ Tratamento de erros
- ✅ Feedback visual

## 🐛 Problemas Comuns

**"Erro ao exportar"**
- Verifique se a API está rodando: http://localhost:8000

**"Nenhum dado encontrado"**
- Os filtros estão muito restritivos
- Tente ampliar o período ou remover filtro de região

**Caracteres estranhos no CSV**
- Abra o CSV usando "Dados > De Texto" no Excel
- Selecione encoding UTF-8

---

**Pronto para usar!** 🎉
