# Hanami Analytics API

API FastAPI robusta para upload, processamento e análise de arquivos CSV/XLSX com geração de relatórios analíticos.

## Instalação

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Ativar ambiente virtual (Linux/Mac)
source venv/bin/activate

# Instalar dependências (OBRIGATÓRIO)
pip install -r requirements.txt
```

## ⚠️ Importante
Sempre execute `pip install -r requirements.txt` após ativar o ambiente virtual antes de rodar a API.

## Executar

```bash
# Opção 1: Desenvolvimento com hot-reload (RECOMENDADO)
uvicorn main:app --reload --port 8000

# Opção 2: Usando python diretamente
python main.py

# Opção 3: Especificando host e porta
uvicorn main:app --host 0.0.0.0 --port 8000
```

A API estará disponível em: **http://localhost:8000**

## 📚 Documentação

Acesse a documentação automática (Swagger UI):
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Aqui você pode testar todos os endpoints interativamente!

## 🔌 Endpoints Principais

### Upload
- `POST /upload` - Upload de arquivo CSV/XLSX

### Dados
- `GET /sales` - Lista de vendas (com paginação)
- `GET /analysis` - Análise estatística completa

### KPIs e Análises
- `GET /kpis` - KPIs principais
- `GET /sales-by-month` - Vendas agrupadas por mês
- `GET /sales-by-category` - Vendas por categoria
- `GET /top-products` - Produtos mais vendidos (ranking)
- `GET /customers-by-gender` - Clientes por gênero
- `GET /sales-by-state` - Vendas por estado/região
- `GET /payment-methods` - Análise de formas de pagamento

### Relatórios
- `GET /reports/summary` - Relatório resumido
- `GET /reports/detailed` - Relatório detalhado completo

### Gerenciamento
- `DELETE /reset` - Resetar dados enviados

Para documentação completa, veja [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🏗️ Arquitetura

Para entender a arquitetura e algoritmos implementados, veja [ARCHITECTURE.md](./ARCHITECTURE.md)

## 📦 Dependências

- **FastAPI** 0.115.5 - Framework web
- **Uvicorn** 0.32.1 - Servidor ASGI
- **Pandas** 2.2.3 - Análise de dados
- **Openpyxl** 3.11.0 - Suporte a XLSX
- **Python-multipart** 0.0.18 - Upload de arquivos
- **Pydantic** 2.10.3 - Validação de dados

## 🚀 Deploy em Produção

Para produção, use múltiplos workers:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Ou com Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

## 🐛 Troubleshooting

**Erro: `ModuleNotFoundError: No module named 'fastapi'`**
- Execute: `pip install -r requirements.txt`
- Verifique se o ambiente virtual está ativado: `(venv)` deve aparecer no prompt

**Porta 8000 já em uso?**
- Use outra porta: `uvicorn main:app --reload --port 8001`

**Erro ao fazer upload?**
- Verifique se o arquivo é CSV ou XLSX válido
- Máximo 100.000 linhas
- Verifique os logs do servidor
