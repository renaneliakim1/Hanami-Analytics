from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List, Dict
import os

app = FastAPI(
    title="Hanami Analytics API",
    description="API para análise de dados de vendas",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Carregar dados
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "vendas_ficticias_10000_linhas.csv")
df = None

def load_data():
    global df
    if df is None:
        df = pd.read_csv(CSV_PATH)
        # Calcular lucro se não existir
        if 'lucro' not in df.columns:
            df['lucro'] = df['valor_final'] * df['margem_lucro']
    return df

@app.on_event("startup")
async def startup_event():
    load_data()
    print("✅ Dados carregados com sucesso!")

@app.get("/")
async def root():
    return {
        "message": "Hanami Analytics API",
        "version": "1.0.0",
        "endpoints": ["/sales", "/kpis", "/sales-by-month", "/sales-by-category"]
    }

@app.get("/sales")
async def get_sales(limit: int = 100, offset: int = 0):
    """Retorna lista de vendas com paginação"""
    data = load_data()
    total = len(data)
    sales = data.iloc[offset:offset+limit].to_dict('records')
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": sales
    }

@app.get("/kpis")
async def get_kpis():
    """Retorna KPIs principais"""
    data = load_data()
    
    return {
        "faturamentoTotal": float(data['valor_final'].sum()),
        "lucroTotal": float(data['lucro'].sum()),
        "quantidadeVendas": int(len(data)),
        "clientesUnicos": int(data['cliente_id'].nunique()),
        "ticketMedio": float(data['valor_final'].mean()),
        "avaliacaoMedia": float(data['avaliacao_produto'].mean())
    }

@app.get("/sales-by-month")
async def get_sales_by_month():
    """Retorna vendas agrupadas por mês"""
    data = load_data()
    data['data_venda'] = pd.to_datetime(data['data_venda'])
    data['mes'] = data['data_venda'].dt.to_period('M').astype(str)
    
    monthly = data.groupby('mes').agg({
        'valor_final': 'sum',
        'lucro': 'sum',
        'id_transacao': 'count'
    }).reset_index()
    
    monthly.columns = ['mes', 'faturamento', 'lucro', 'vendas']
    
    return monthly.to_dict('records')

@app.get("/sales-by-category")
async def get_sales_by_category():
    """Retorna vendas por categoria"""
    data = load_data()
    
    category = data.groupby('categoria').agg({
        'valor_final': 'sum'
    }).reset_index()
    
    category.columns = ['name', 'value']
    category = category.sort_values('value', ascending=False)
    
    return category.to_dict('records')

@app.get("/top-products")
async def get_top_products(limit: int = 10):
    """Retorna produtos mais vendidos"""
    data = load_data()
    
    products = data.groupby(['produto_id', 'nome_produto']).agg({
        'quantidade': 'sum',
        'lucro': 'sum'
    }).reset_index()
    
    products = products.sort_values('quantidade', ascending=False).head(limit)
    products.columns = ['id', 'name', 'quantidade', 'lucro']
    
    return products.to_dict('records')

@app.get("/customers-by-gender")
async def get_customers_by_gender():
    """Retorna distribuição de clientes por gênero"""
    data = load_data()
    
    gender = data.groupby('genero_cliente').size().reset_index()
    gender.columns = ['name', 'value']
    
    return gender.to_dict('records')

@app.get("/sales-by-state")
async def get_sales_by_state(limit: int = 10):
    """Retorna vendas por estado"""
    data = load_data()
    
    states = data.groupby('estado_cliente').agg({
        'valor_final': 'sum'
    }).reset_index()
    
    states.columns = ['name', 'value']
    states = states.sort_values('value', ascending=False).head(limit)
    
    return states.to_dict('records')

@app.get("/payment-methods")
async def get_payment_methods():
    """Retorna formas de pagamento"""
    data = load_data()
    
    payment = data.groupby('forma_pagamento').agg({
        'id_transacao': 'count',
        'valor_final': 'sum'
    }).reset_index()
    
    payment.columns = ['name', 'quantidade', 'valorMedio']
    payment['valorMedio'] = payment['valorMedio'] / payment['quantidade']
    
    return payment.to_dict('records')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
