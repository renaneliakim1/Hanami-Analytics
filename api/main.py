from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from typing import List, Dict, Optional
import os
from io import BytesIO
import tempfile
from datetime import datetime

app = FastAPI(
    title="Hanami Analytics API",
    description="API robusta para análise de dados de vendas com upload de arquivos",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "http://localhost:8080", "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Armazenamento em memória para dados enviados
uploaded_data: Dict[str, pd.DataFrame] = {}
CSV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "vendas_ficticias_10000_linhas.csv"))
df_default = None

def load_default_data():
    global df_default
    if df_default is None:
        try:
            df_default = pd.read_csv(CSV_PATH)
            # Calcular lucro se não existir
            if 'lucro' not in df_default.columns:
                df_default['lucro'] = df_default['valor_final'] * df_default['margem_lucro']
            print(f"✅ Dados padrão carregados de: {CSV_PATH}")
        except FileNotFoundError:
            print(f"⚠️ Arquivo padrão não encontrado: {CSV_PATH}")
            print("   Usando modo sem dados padrão - faça upload de um arquivo CSV/XLSX")
            df_default = pd.DataFrame()  # DataFrame vazio
    return df_default

def get_current_data() -> pd.DataFrame:
    """Retorna dados carregados ou dados padrão"""
    if uploaded_data and 'current' in uploaded_data:
        return uploaded_data['current']
    return load_default_data()

def filter_data_by_date(data: pd.DataFrame, start_date: Optional[str] = None, end_date: Optional[str] = None) -> pd.DataFrame:
    """Filtra dados por intervalo de datas"""
    if data.empty or 'data_venda' not in data.columns:
        return data
    
    try:
        df = data.copy()
        df['data_venda'] = pd.to_datetime(df['data_venda'])
        
        if start_date:
            start = pd.to_datetime(start_date)
            df = df[df['data_venda'] >= start]
        
        if end_date:
            end = pd.to_datetime(end_date)
            # Incluir o dia inteiro (até 23:59:59)
            end = end + pd.Timedelta(days=1)
            df = df[df['data_venda'] < end]
        
        return df
    except Exception as e:
        print(f"Erro ao filtrar por data: {e}")
        return data

def parse_csv_file(file_content: bytes) -> pd.DataFrame:
    """Parser robusto para CSV"""
    try:
        return pd.read_csv(BytesIO(file_content), encoding='utf-8')
    except:
        try:
            return pd.read_csv(BytesIO(file_content), encoding='latin-1')
        except:
            return pd.read_csv(BytesIO(file_content), encoding='iso-8859-1')

def parse_xlsx_file(file_content: bytes) -> pd.DataFrame:
    """Parser para XLSX"""
    return pd.read_excel(BytesIO(file_content))

@app.on_event("startup")
async def startup_event():
    load_default_data()
    if not df_default.empty:
        print("✅ Dados padrão carregados com sucesso!")
    else:
        print("⚠️ API iniciada sem dados padrão. Faça upload de um arquivo para começar.")

@app.get("/")
async def root():
    return {
        "message": "Hanami Analytics API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "POST /upload",
            "data": "GET /sales",
            "analysis": "GET /analysis",
            "reports": "GET /reports/{report_type}"
        }
    }

# ============================================================================
# ENDPOINTS DE UPLOAD
# ============================================================================

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Endpoint robusto para upload de CSV ou XLSX
    
    - Suporta CSV e XLSX
    - Detecta automaticamente o tipo de arquivo
    - Realiza parsing e validação básica
    - Armazena em memória para análise
    """
    try:
        file_content = await file.read()
        file_name = file.filename.lower()
        
        # Detectar tipo de arquivo
        if file_name.endswith('.csv'):
            df_uploaded = parse_csv_file(file_content)
        elif file_name.endswith(('.xlsx', '.xls')):
            df_uploaded = parse_xlsx_file(file_content)
        else:
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado. Use CSV ou XLSX")
        
        # Validação básica
        if df_uploaded.empty:
            raise HTTPException(status_code=400, detail="Arquivo vazio")
        
        if len(df_uploaded) > 100000:
            raise HTTPException(status_code=413, detail="Arquivo muito grande (máximo 100.000 linhas)")
        
        # Calcular lucro se necessário (usando colunas padrão)
        if 'lucro' not in df_uploaded.columns and 'valor_final' in df_uploaded.columns and 'margem_lucro' in df_uploaded.columns:
            df_uploaded['lucro'] = df_uploaded['valor_final'] * df_uploaded['margem_lucro']
        
        # Armazenar dados
        uploaded_data['current'] = df_uploaded
        
        return {
            "status": "success",
            "message": f"Arquivo '{file.filename}' carregado com sucesso",
            "rows": len(df_uploaded),
            "columns": list(df_uploaded.columns)
        }
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar arquivo: {str(e)}")

@app.delete("/reset")
async def reset_data():
    """Reseta os dados enviados e volta aos dados padrão"""
    uploaded_data.clear()
    return {"status": "success", "message": "Dados resetados para padrão"}


@app.get("/sales")
async def get_sales(limit: int = 100, offset: int = 0):
    """Retorna lista de vendas com paginação"""
    data = get_current_data()
    total = len(data)
    sales = data.iloc[offset:offset+limit].to_dict('records')
    
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "data": sales
    }

# ============================================================================
# ENDPOINTS DE ANÁLISE
# ============================================================================

@app.get("/analysis")
async def get_analysis():
    """Retorna análise completa dos dados"""
    data = get_current_data()
    
    # Análise básica
    numeric_cols = data.select_dtypes(include=['number']).columns
    
    analysis = {
        "shape": {
            "rows": len(data),
            "columns": len(data.columns)
        },
        "columns": list(data.columns),
        "statistics": {}
    }
    
    # Estatísticas por coluna numérica
    for col in numeric_cols:
        analysis["statistics"][col] = {
            "mean": float(data[col].mean()),
            "median": float(data[col].median()),
            "min": float(data[col].min()),
            "max": float(data[col].max()),
            "std": float(data[col].std()),
            "sum": float(data[col].sum())
        }
    
    return analysis

@app.get("/kpis")
async def get_kpis(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna KPIs principais - Algoritmo de análise"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty:
        return {
            "total_vendas": 0,
            "faturamento_total": 0,
            "ticket_medio": 0,
            "lucro_total": 0,
            "margem_lucro_media": 0,
            "clientes_unicos": 0,
            "avaliacao_media": 0
        }
    
    kpis = {
        "total_vendas": int(len(data)),
    }
    
    # Usar colunas específicas do dataset
    if 'valor_final' in data.columns:
        kpis["faturamento_total"] = float(data['valor_final'].sum())
        kpis["ticket_medio"] = float(data['valor_final'].mean())
    
    if 'valor_final' in data.columns and 'custo_produto' in data.columns and 'quantidade' in data.columns:
        # Calcular lucro: (valor_final - custo_total) por linha
        lucro = (data['valor_final'] - (data['custo_produto'] * data['quantidade'])).sum()
        kpis["lucro_total"] = float(lucro)
        kpis["margem_lucro_media"] = float((lucro / data['valor_final'].sum() * 100)) if data['valor_final'].sum() > 0 else 0
    elif 'margem_lucro' in data.columns:
        kpis["lucro_total"] = float((data['valor_final'] * data['margem_lucro']).sum()) if 'valor_final' in data.columns else 0
        kpis["margem_lucro_media"] = float(data['margem_lucro'].mean() * 100)
    
    if 'cliente_id' in data.columns:
        kpis["clientes_unicos"] = int(data['cliente_id'].nunique())
    
    if 'avaliacao_produto' in data.columns:
        kpis["avaliacao_media"] = float(data['avaliacao_produto'].mean())
    
    return kpis

@app.get("/sales-by-month")
async def get_sales_by_month(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna vendas agrupadas por mês - Algoritmo de análise temporal"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty:
        return []
    
    try:
        df_copy = data.copy()
        df_copy['data_venda'] = pd.to_datetime(df_copy['data_venda'])
        df_copy['mes'] = df_copy['data_venda'].dt.to_period('M').astype(str)
        
        monthly = df_copy.groupby('mes').agg({
            'valor_final': 'sum',
            'id_transacao': 'count'
        }).reset_index()
        
        monthly.columns = ['mes', 'faturamento', 'vendas']
        
        # Adicionar lucro se possível
        if 'custo_produto' in data.columns and 'quantidade' in data.columns:
            df_copy['lucro'] = df_copy['valor_final'] - (df_copy['custo_produto'] * df_copy['quantidade'])
            lucro_monthly = df_copy.groupby('mes')['lucro'].sum().reset_index()
            monthly = monthly.merge(lucro_monthly, on='mes')
        
        return monthly.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por mês: {e}")
        return []

@app.get("/sales-by-category")
async def get_sales_by_category(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna vendas por categoria - Algoritmo de segmentação"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'categoria' not in data.columns:
        return []
    
    try:
        category = data.groupby('categoria')['valor_final'].sum().reset_index()
        category.columns = ['name', 'value']
        category = category.sort_values('value', ascending=False)
        
        return category.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por categoria: {e}")
        return []

@app.get("/top-products")
async def get_top_products(limit: int = 10, start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna produtos mais vendidos - Algoritmo de ranking"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'nome_produto' not in data.columns:
        return []
    
    try:
        products = data.groupby('nome_produto').agg({
            'quantidade': 'sum',
            'valor_final': 'sum',
            'id_transacao': 'count'
        }).reset_index()
        
        # Calcular lucro por produto
        if 'custo_produto' in data.columns:
            lucro_by_product = data.groupby('nome_produto').apply(
                lambda x: (x['valor_final'] - (x['custo_produto'] * x['quantidade'])).sum()
            ).reset_index(name='lucro')
            products = products.merge(lucro_by_product, on='nome_produto')
        else:
            products['lucro'] = products['valor_final'] * 0.3  # Margem padrão de 30%
        
        products.columns = ['name', 'quantidade', 'valor_total', 'transacoes', 'lucro']
        products = products.sort_values('quantidade', ascending=False).head(limit)
        
        return products.to_dict('records')
    except Exception as e:
        print(f"Erro ao listar produtos: {e}")
        return []

@app.get("/customers-by-gender")
async def get_customers_by_gender(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna distribuição de clientes por gênero - Algoritmo de segmentação"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'genero_cliente' not in data.columns:
        return []
    
    try:
        gender = data.groupby('genero_cliente').size().reset_index(name='value')
        gender.columns = ['name', 'value']
        
        return gender.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por gênero: {e}")
        return []

@app.get("/sales-by-state")
async def get_sales_by_state(limit: int = 10, start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna vendas por estado/região - Algoritmo de análise geográfica"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'estado_cliente' not in data.columns:
        return []
    
    try:
        states = data.groupby('estado_cliente')['valor_final'].sum().reset_index()
        states.columns = ['name', 'value']
        states = states.sort_values('value', ascending=False).head(limit)
        
        return states.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por estado: {e}")
        return []

@app.get("/payment-methods")
async def get_payment_methods(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna formas de pagamento - Algoritmo de análise de pagamentos"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'forma_pagamento' not in data.columns:
        return []
    
    try:
        payment = data.groupby('forma_pagamento').agg({
            'id_transacao': 'count',
            'valor_final': ['sum', 'mean']
        }).reset_index()
        
        payment.columns = ['name', 'quantidade', 'valor_total', 'valor_medio']
        payment = payment.sort_values('quantidade', ascending=False)
        
        return payment.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por forma de pagamento: {e}")
        return []

@app.get("/customers-by-age")
async def get_customers_by_age(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna distribuição de clientes por faixa etária - Algoritmo de segmentação"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'idade_cliente' not in data.columns:
        return []
    
    try:
        # Criar faixas etárias
        bins = [0, 18, 25, 35, 45, 55, 65, 150]
        labels = ['< 18', '18-25', '25-35', '35-45', '45-55', '55-65', '> 65']
        data['faixa_etaria'] = pd.cut(data['idade_cliente'], bins=bins, labels=labels, right=False)
        
        age_dist = data.groupby('faixa_etaria', observed=True).agg({
            'cliente_id': 'nunique'
        }).reset_index()
        
        age_dist.columns = ['name', 'value']
        return age_dist.to_dict('records')
    except Exception as e:
        print(f"Erro ao distribuir por faixa etária: {e}")
        return []

@app.get("/installments")
async def get_installments(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna distribuição de parcelamento - Algoritmo de análise de pagamentos"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'parcelas' not in data.columns:
        return []
    
    try:
        installments = data.groupby('parcelas').agg({
            'id_transacao': 'count',
            'valor_final': 'sum'
        }).reset_index()
        
        installments.columns = ['name', 'quantidade', 'value']
        installments = installments.sort_values('quantidade', ascending=False)
        return installments.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por parcelamento: {e}")
        return []

@app.get("/delivery-status")
async def get_delivery_status(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna status de entrega - Algoritmo de análise logística"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'status_entrega' not in data.columns:
        return []
    
    try:
        status = data.groupby('status_entrega').agg({
            'id_transacao': 'count'
        }).reset_index()
        
        status.columns = ['name', 'value']
        status = status.sort_values('value', ascending=False)
        return status.to_dict('records')
    except Exception as e:
        print(f"Erro ao agrupar por status de entrega: {e}")
        return []

@app.get("/product-ratings")
async def get_product_ratings(limit: int = 10, start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna produtos com menor avaliação - Algoritmo de análise de qualidade"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'nome_produto' not in data.columns or 'avaliacao_produto' not in data.columns:
        return []
    
    try:
        ratings = data.groupby('nome_produto').agg({
            'avaliacao_produto': 'mean',
            'id_transacao': 'count'
        }).reset_index()
        
        ratings.columns = ['name', 'avaliacao', 'quantidade']
        ratings = ratings[ratings['quantidade'] >= 2]  # Apenas produtos com 2+ avaliações
        ratings = ratings.sort_values('avaliacao', ascending=True).head(limit)
        return ratings[['name', 'avaliacao']].to_dict('records')
    except Exception as e:
        print(f"Erro ao listar produtos com menor avaliação: {e}")
        return []

@app.get("/average-delivery-time")
async def get_average_delivery_time(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna tempo médio de entrega - Algoritmo de análise logística"""
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'tempo_entrega_dias' not in data.columns:
        return {"tempo_medio": 0}
    
    try:
        tempo_medio = float(data['tempo_entrega_dias'].mean())
        return {"tempo_medio": round(tempo_medio, 1)}
    except Exception as e:
        print(f"Erro ao calcular tempo médio de entrega: {e}")
        return {"tempo_medio": 0}

# ============================================================================
# ENDPOINTS DE RELATÓRIOS
# ============================================================================

@app.get("/reports/summary")
async def get_report_summary(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Relatório resumido com principais insights"""
    data = get_current_data()
    
    # KPIs
    kpis = await get_kpis(start_date=start_date, end_date=end_date)
    
    # Top 3 categorias
    categories = await get_sales_by_category(start_date=start_date, end_date=end_date)
    top_categories = categories[:3] if categories else []
    
    # Top 5 produtos
    top_products_data = await get_top_products(limit=5, start_date=start_date, end_date=end_date)
    
    return {
        "timestamp": pd.Timestamp.now().isoformat(),
        "kpis": kpis,
        "top_categories": top_categories,
        "top_products": top_products_data,
        "data_source": "uploaded" if 'current' in uploaded_data else "default"
    }

@app.get("/reports/detailed")
async def get_report_detailed(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Relatório detalhado com todas as análises"""
    
    report = {
        "timestamp": pd.Timestamp.now().isoformat(),
        "analysis": await get_analysis(),
        "kpis": await get_kpis(start_date=start_date, end_date=end_date),
        "monthly_sales": await get_sales_by_month(start_date=start_date, end_date=end_date),
        "sales_by_category": await get_sales_by_category(start_date=start_date, end_date=end_date),
        "top_products": await get_top_products(limit=10, start_date=start_date, end_date=end_date),
        "customers_by_gender": await get_customers_by_gender(start_date=start_date, end_date=end_date),
        "sales_by_state": await get_sales_by_state(limit=15, start_date=start_date, end_date=end_date),
        "payment_methods": await get_payment_methods(start_date=start_date, end_date=end_date),
    }
    
    return report


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
