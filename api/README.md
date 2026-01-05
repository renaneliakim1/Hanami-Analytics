# Hanami Analytics API

API FastAPI para servir dados de análise de vendas.

## Instalação

```bash
# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Ativar ambiente virtual (Linux/Mac)
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

## Executar

```bash
# Desenvolvimento
python main.py

# Ou com hot-reload
uvicorn main:app --reload --port 8000
```

A API estará disponível em: http://localhost:8000

## Documentação

Acesse a documentação automática em:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

- `GET /` - Informações da API
- `GET /sales` - Lista de vendas (com paginação)
- `GET /kpis` - KPIs principais
- `GET /sales-by-month` - Vendas por mês
- `GET /sales-by-category` - Vendas por categoria
- `GET /top-products` - Produtos mais vendidos
- `GET /customers-by-gender` - Clientes por gênero
- `GET /sales-by-state` - Vendas por estado
- `GET /payment-methods` - Formas de pagamento

## Deploy

Para produção, use:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```
