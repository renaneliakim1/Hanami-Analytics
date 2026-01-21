from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd
from typing import List, Dict, Optional
import os
from io import BytesIO
import tempfile
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler
import sys
from data_validator import validate_data, generate_validation_report

import logging
from logging.handlers import RotatingFileHandler
import sys

# ============================================================================
# CONFIGURAÇÃO DE LOGGING
# ============================================================================

def setup_logging():
    """Configura logging estruturado com arquivo e console"""
    
    # Criar diretório de logs se não existir
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)
    
    log_file = os.path.join(log_dir, "app.log")
    
    # Criar logger
    logger = logging.getLogger("analytics_api")
    logger.setLevel(logging.DEBUG)
    
    # Formato detalhado
    log_format = logging.Formatter(
        '[%(asctime)s] %(levelname)-8s [%(name)s:%(funcName)s:%(lineno)d] %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Handler para arquivo com rotação (10MB, manter 5 backups)
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(log_format)
    logger.addHandler(file_handler)
    
    # Handler para console
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(log_format)
    logger.addHandler(console_handler)
    
    return logger

# Inicializar logger
logger = setup_logging()

app = FastAPI(
    title="Hanami Analytics API",
    description="API robusta para análise de dados de vendas com upload de arquivos, validação de dados e geração de relatórios",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    contact={
        "name": "Analytics Support",
        "url": "http://localhost:8000",
        "email": "support@analytics.local"
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT"
    },
    servers=[
        {
            "url": "http://localhost:8000",
            "description": "Local Development Server"
        },
        {
            "url": "http://api.example.com",
            "description": "Production Server (when deployed)"
        }
    ]
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:8080", 
        "http://localhost:3000", 
        "http://localhost:5173",
        "https://hanami-analytics.vercel.app",  # Production Vercel
        "https://*.vercel.app",  # Todos os deploys do Vercel
    ],
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
            logger.info(f"✅ Dados padrão carregados de: {CSV_PATH}")
        except FileNotFoundError:
            logger.error(f"❌ Arquivo padrão não encontrado: {CSV_PATH}")
            logger.info("   Usando modo sem dados padrão - faça upload de um arquivo CSV/XLSX")
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
            logger.debug(f"Filtro de data inicial aplicado: {start_date}")
        
        if end_date:
            end = pd.to_datetime(end_date)
            # Incluir o dia inteiro (até 23:59:59)
            end = end + pd.Timedelta(days=1)
            df = df[df['data_venda'] < end]
            logger.debug(f"Filtro de data final aplicado: {end_date}")
        
        return df
    except Exception as e:
        logger.error(f"Erro ao filtrar por data: {e}", exc_info=True)
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
    logger.info("=" * 80)
    logger.info("🚀 INICIANDO HANAMI ANALYTICS API")
    logger.info("=" * 80)
    load_default_data()
    if not df_default.empty:
        logger.info(f"✅ Dados padrão carregados com sucesso! ({len(df_default)} registros)")
    else:
        logger.warning("⚠️ API iniciada sem dados padrão. Faça upload de um arquivo para começar.")

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
    - Valida e padroniza dados
    - Armazena em memória para análise
    """
    logger.info(f"📤 Iniciando upload do arquivo: {file.filename}")
    try:
        file_content = await file.read()
        file_name = file.filename.lower()
        file_size_mb = len(file_content) / (1024 * 1024)
        logger.info(f"   Tamanho: {file_size_mb:.2f} MB")
        
        # Detectar tipo de arquivo
        if file_name.endswith('.csv'):
            logger.debug("Tipo detectado: CSV")
            df_uploaded = parse_csv_file(file_content)
        elif file_name.endswith(('.xlsx', '.xls')):
            logger.debug("Tipo detectado: XLSX/XLS")
            df_uploaded = parse_xlsx_file(file_content)
        else:
            logger.warning(f"❌ Tipo de arquivo não suportado: {file_name}")
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado. Use CSV ou XLSX")
        
        # Validação básica
        if df_uploaded.empty:
            logger.warning("❌ Arquivo vazio recebido")
            raise HTTPException(status_code=400, detail="Arquivo vazio")
        
        if len(df_uploaded) > 100000:
            logger.warning(f"❌ Arquivo muito grande: {len(df_uploaded)} linhas")
            raise HTTPException(status_code=413, detail="Arquivo muito grande (máximo 100.000 linhas)")
        
        logger.info(f"🔍 Iniciando validação dos dados...")
        
        # ✅ VALIDAR E PADRONIZAR DADOS
        df_uploaded, validation_report = validate_data(df_uploaded)
        
        # Log do relatório de validação
        report_text = generate_validation_report(validation_report)
        logger.info(report_text)
        
        # Verificar qualidade mínima (mínimo 50% de dados válidos)
        if validation_report.get_quality_score() < 50:
            logger.error(f"❌ Qualidade dos dados insuficiente: {validation_report.get_quality_score():.1f}%")
            raise HTTPException(
                status_code=422, 
                detail=f"Qualidade dos dados insuficiente. Score: {validation_report.get_quality_score():.1f}%"
            )
        
        # Calcular lucro se necessário (usando colunas padrão)
        if 'lucro' not in df_uploaded.columns and 'valor_final' in df_uploaded.columns and 'margem_lucro' in df_uploaded.columns:
            df_uploaded['lucro'] = df_uploaded['valor_final'] * df_uploaded['margem_lucro']
            logger.debug("Coluna 'lucro' calculada")
        
        # Armazenar dados
        uploaded_data['current'] = df_uploaded
        logger.info(f"✅ Arquivo '{file.filename}' carregado com sucesso!")
        logger.info(f"   Registros válidos: {len(df_uploaded)} | Colunas: {len(df_uploaded.columns)}")
        logger.info(f"   Score de qualidade: {validation_report.get_quality_score():.1f}%")
        
        return {
            "status": "success",
            "message": f"Arquivo '{file.filename}' carregado e validado com sucesso",
            "rows": len(df_uploaded),
            "columns": list(df_uploaded.columns),
            "quality_score": round(validation_report.get_quality_score(), 1),
            "validation_report": validation_report.to_dict()
        }
    
    except HTTPException as e:
        logger.error(f"Erro HTTP no upload: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"❌ Erro inesperado ao processar arquivo: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Erro ao processar arquivo: {str(e)}")

@app.delete("/reset")
async def reset_data():
    """Reseta os dados enviados e volta aos dados padrão"""
    logger.info("🔄 Reset de dados solicitado - retornando aos dados padrão")
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
    logger.info(f"📊 Solicitação de KPIs (start_date={start_date}, end_date={end_date})")
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty:
        logger.warning("⚠️ Nenhum dado disponível para período selecionado")
        return {
            "total_vendas": 0,
            "faturamento_total": 0,
            "ticket_medio": 0,
            "lucro_total": 0,
            "margem_lucro_media": 0,
            "clientes_unicos": 0,
            "avaliacao_media": 0
        }
    
    try:
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
        
        logger.info(f"✅ KPIs calculados: {len(data)} registros analisados")
        return kpis
    except Exception as e:
        logger.error(f"❌ Erro ao calcular KPIs: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao calcular KPIs: {str(e)}")

@app.get("/sales-by-month")
async def get_sales_by_month(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna vendas agrupadas por mês - Algoritmo de análise temporal"""
    logger.info(f"📅 Análise de vendas por mês (start_date={start_date}, end_date={end_date})")
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty:
        logger.warning("⚠️ Nenhum dado disponível para análise de vendas por mês")
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
        
        logger.info(f"✅ Análise temporal concluída: {len(monthly)} períodos encontrados")
        return monthly.to_dict('records')
    except Exception as e:
        logger.error(f"❌ Erro ao agrupar por mês: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao agrupar por mês: {str(e)}")

@app.get("/sales-by-category")
async def get_sales_by_category(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna vendas por categoria - Algoritmo de segmentação"""
    logger.info(f"🏷️  Análise por categoria (start_date={start_date}, end_date={end_date})")
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'categoria' not in data.columns:
        logger.warning("⚠️ Nenhum dado disponível para análise por categoria")
        return []
    
    try:
        category = data.groupby('categoria')['valor_final'].sum().reset_index()
        category.columns = ['name', 'value']
        category = category.sort_values('value', ascending=False)
        logger.info(f"✅ Análise por categoria: {len(category)} categorias encontradas")
        return category.to_dict('records')
    except Exception as e:
        logger.error(f"❌ Erro ao agrupar por categoria: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao agrupar por categoria: {str(e)}")

@app.get("/top-products")
async def get_top_products(limit: int = 10, start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna produtos mais vendidos - Algoritmo de ranking"""
    logger.info(f"🏆 Top produtos (limit={limit}, start_date={start_date}, end_date={end_date})")
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'nome_produto' not in data.columns:
        logger.warning("⚠️ Nenhum dado disponível para ranking de produtos")
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
        logger.info(f"✅ Ranking de produtos: {len(products)} produtos encontrados")
        return products.to_dict('records')
    except Exception as e:
        logger.error(f"❌ Erro ao listar produtos: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao listar produtos: {str(e)}")

@app.get("/customers-by-gender")
async def get_customers_by_gender(start_date: Optional[str] = Query(None), end_date: Optional[str] = Query(None)):
    """Retorna distribuição de clientes por gênero - Algoritmo de segmentação"""
    logger.info(f"👥 Análise por gênero (start_date={start_date}, end_date={end_date})")
    data = get_current_data()
    data = filter_data_by_date(data, start_date, end_date)
    
    if data.empty or 'genero_cliente' not in data.columns:
        logger.warning("⚠️ Nenhum dado disponível para análise por gênero")
        return []
    
    try:
        gender = data.groupby('genero_cliente').size().reset_index(name='value')
        gender.columns = ['name', 'value']
        logger.info(f"✅ Análise por gênero: {len(gender)} grupos encontrados")
        return gender.to_dict('records')
    except Exception as e:
        logger.error(f"❌ Erro ao agrupar por gênero: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao agrupar por gênero: {str(e)}")

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

# ============================================================================
# ENDPOINTS DE EXPORTAÇÃO
# ============================================================================

def filter_data_by_region(data: pd.DataFrame, region: Optional[str] = None) -> pd.DataFrame:
    """Filtra dados por região"""
    if not region or data.empty or 'regiao' not in data.columns:
        return data
    
    try:
        region_mapping = {
            'norte': 'Norte',
            'nordeste': 'Nordeste',
            'centro-oeste': 'Centro-Oeste',
            'sudeste': 'Sudeste',
            'sul': 'Sul'
        }
        
        region_normalized = region_mapping.get(region.lower(), region)
        df = data[data['regiao'].str.lower() == region_normalized.lower()]
        logger.debug(f"Filtro de região aplicado: {region_normalized} ({len(df)} registros)")
        return df
    except Exception as e:
        logger.error(f"Erro ao filtrar por região: {e}", exc_info=True)
        return data

@app.get("/export/csv")
async def export_csv(
    start_date: Optional[str] = Query(None, description="Data inicial no formato YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="Data final no formato YYYY-MM-DD"),
    region: Optional[str] = Query(None, description="Região para filtrar (Norte, Nordeste, Sul, Sudeste, Centro-Oeste)")
):
    """
    Exporta dados de vendas em formato CSV com filtros opcionais
    
    Parâmetros:
    - start_date: Data inicial (formato: YYYY-MM-DD)
    - end_date: Data final (formato: YYYY-MM-DD)
    - region: Região específica
    
    Retorna arquivo CSV para download
    """
    try:
        data = get_current_data()
        
        if data.empty:
            raise HTTPException(status_code=404, detail="Nenhum dado disponível para exportação")
        
        # Aplicar filtros
        filtered_data = filter_data_by_date(data, start_date, end_date)
        filtered_data = filter_data_by_region(filtered_data, region)
        
        if filtered_data.empty:
            raise HTTPException(status_code=404, detail="Nenhum dado encontrado com os filtros aplicados")
        
        # Gerar nome do arquivo com timestamp e filtros
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename_parts = ["relatorio_vendas", timestamp]
        
        if start_date or end_date:
            date_range = f"{start_date or 'inicio'}_ate_{end_date or 'fim'}"
            filename_parts.append(date_range)
        
        if region:
            filename_parts.append(region.lower().replace('-', '_'))
        
        filename = "_".join(filename_parts) + ".csv"
        
        # Converter para CSV
        output = BytesIO()
        filtered_data.to_csv(output, index=False, encoding='utf-8-sig')
        output.seek(0)
        
        logger.info(f"✅ Exportação CSV gerada: {filename} ({len(filtered_data)} registros)")
        
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Type": "text/csv; charset=utf-8"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao exportar CSV: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao gerar exportação CSV: {str(e)}")

@app.get("/export/excel")
async def export_excel(
    start_date: Optional[str] = Query(None, description="Data inicial no formato YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="Data final no formato YYYY-MM-DD"),
    region: Optional[str] = Query(None, description="Região para filtrar (Norte, Nordeste, Sul, Sudeste, Centro-Oeste)")
):
    """
    Exporta dados de vendas em formato Excel (.xlsx) com filtros opcionais
    
    Parâmetros:
    - start_date: Data inicial (formato: YYYY-MM-DD)
    - end_date: Data final (formato: YYYY-MM-DD)
    - region: Região específica
    
    Retorna arquivo Excel para download
    """
    try:
        data = get_current_data()
        
        if data.empty:
            raise HTTPException(status_code=404, detail="Nenhum dado disponível para exportação")
        
        # Aplicar filtros
        filtered_data = filter_data_by_date(data, start_date, end_date)
        filtered_data = filter_data_by_region(filtered_data, region)
        
        if filtered_data.empty:
            raise HTTPException(status_code=404, detail="Nenhum dado encontrado com os filtros aplicados")
        
        # Gerar nome do arquivo com timestamp e filtros
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename_parts = ["relatorio_vendas", timestamp]
        
        if start_date or end_date:
            date_range = f"{start_date or 'inicio'}_ate_{end_date or 'fim'}"
            filename_parts.append(date_range)
        
        if region:
            filename_parts.append(region.lower().replace('-', '_'))
        
        filename = "_".join(filename_parts) + ".xlsx"
        
        # Converter para Excel
        output = BytesIO()
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Aba principal com dados
            filtered_data.to_excel(writer, sheet_name='Dados de Vendas', index=False)
            
            # Aba com resumo (KPIs)
            if 'valor_final' in filtered_data.columns:
                summary_data = {
                    'Métrica': [
                        'Total de Vendas',
                        'Faturamento Total',
                        'Lucro Total',
                        'Ticket Médio',
                        'Clientes Únicos'
                    ],
                    'Valor': [
                        len(filtered_data),
                        f"R$ {filtered_data['valor_final'].sum():,.2f}" if 'valor_final' in filtered_data.columns else 'N/A',
                        f"R$ {filtered_data['lucro'].sum():,.2f}" if 'lucro' in filtered_data.columns else 'N/A',
                        f"R$ {filtered_data['valor_final'].mean():,.2f}" if 'valor_final' in filtered_data.columns else 'N/A',
                        filtered_data['id_cliente'].nunique() if 'id_cliente' in filtered_data.columns else 'N/A'
                    ]
                }
                
                summary_df = pd.DataFrame(summary_data)
                summary_df.to_excel(writer, sheet_name='Resumo', index=False)
            
            # Aba com informações de filtros
            filter_info = {
                'Filtro': ['Data Inicial', 'Data Final', 'Região', 'Total de Registros', 'Data de Geração'],
                'Valor': [
                    start_date or 'Não aplicado',
                    end_date or 'Não aplicado',
                    region or 'Todas as regiões',
                    len(filtered_data),
                    datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                ]
            }
            filter_df = pd.DataFrame(filter_info)
            filter_df.to_excel(writer, sheet_name='Informações', index=False)
        
        output.seek(0)
        
        logger.info(f"✅ Exportação Excel gerada: {filename} ({len(filtered_data)} registros)")
        
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao exportar Excel: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro ao gerar exportação Excel: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
