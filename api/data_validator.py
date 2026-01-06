"""
Módulo de validação e padronização de dados
- Valida tipos de dados
- Remove nulos e duplicatas
- Padroniza formatos
- Gera relatório de qualidade
"""

import pandas as pd
import logging
from typing import Dict, List, Tuple
from datetime import datetime
import re

logger = logging.getLogger("analytics_api")

# ============================================================================
# DEFINIÇÕES DE SCHEMA ESPERADO
# ============================================================================

EXPECTED_SCHEMA = {
    # Identificadores
    'id_transacao': 'int64',
    'cliente_id': 'int64',
    
    # Datas
    'data_venda': 'object',  # String que será convertida para datetime
    
    # Produto
    'nome_produto': 'object',
    'categoria': 'object',
    'avaliacao_produto': 'float64',
    
    # Valores
    'quantidade': 'int64',
    'valor_unitario': 'float64',
    'valor_final': 'float64',
    'custo_produto': 'float64',
    'margem_lucro': 'float64',
    'lucro': 'float64',
    
    # Cliente
    'genero_cliente': 'object',
    'idade_cliente': 'int64',
    'estado_cliente': 'object',
    
    # Pagamento e Entrega
    'forma_pagamento': 'object',
    'parcelas': 'int64',
    'status_entrega': 'object',
    'tempo_entrega_dias': 'int64',
}

# Valores válidos para campos categóricos
VALID_VALUES = {
    'genero_cliente': ['M', 'F', 'Masculino', 'Feminino'],
    'status_entrega': ['Entregue', 'Pendente', 'Enviado', 'Cancelado', 'Em Trânsito'],
    'forma_pagamento': ['Cartão Crédito', 'Cartão Débito', 'Boleto', 'PIX', 'Dinheiro', 'Transfer'],
}

# Ranges válidos para campos numéricos
VALID_RANGES = {
    'quantidade': (1, 1000),
    'valor_unitario': (0, 1000000),
    'valor_final': (0, 1000000),
    'custo_produto': (0, 1000000),
    'margem_lucro': (0, 1),  # 0 a 1 (0% a 100%)
    'avaliacao_produto': (0, 5),
    'idade_cliente': (0, 150),
    'parcelas': (1, 36),
    'tempo_entrega_dias': (0, 365),
}

# ============================================================================
# FUNÇÕES DE VALIDAÇÃO
# ============================================================================

class ValidationReport:
    """Relatório detalhado de validação"""
    
    def __init__(self):
        self.total_rows = 0
        self.rows_after_cleaning = 0
        self.duplicates_removed = 0
        self.nulls_by_column = {}
        self.invalid_values = {}
        self.out_of_range_values = {}
        self.date_conversion_errors = 0
        self.warnings = []
        self.errors = []
    
    def to_dict(self) -> Dict:
        return {
            'total_rows': self.total_rows,
            'rows_after_cleaning': self.rows_after_cleaning,
            'duplicates_removed': self.duplicates_removed,
            'nulls_by_column': self.nulls_by_column,
            'invalid_values': self.invalid_values,
            'out_of_range_values': self.out_of_range_values,
            'date_conversion_errors': self.date_conversion_errors,
            'warnings': self.warnings,
            'errors': self.errors,
            'quality_score': self.get_quality_score()
        }
    
    def get_quality_score(self) -> float:
        """Retorna score de qualidade de 0 a 100"""
        if self.total_rows == 0:
            return 0
        
        issues = (
            len(self.nulls_by_column) +
            len(self.invalid_values) +
            len(self.out_of_range_values) +
            self.date_conversion_errors
        )
        
        quality = 100 - (issues / self.total_rows * 100)
        return max(0, min(100, quality))

def validate_data(data: pd.DataFrame) -> Tuple[pd.DataFrame, ValidationReport]:
    """
    Valida e padroniza dados
    Retorna: (dataframe limpo, relatório de validação)
    """
    report = ValidationReport()
    report.total_rows = len(data)
    
    logger.info(f"🔍 Iniciando validação de {len(data)} registros")
    
    # 1. Clonar dataframe
    df = data.copy()
    
    # 2. Remover duplicatas
    initial_count = len(df)
    df = df.drop_duplicates()
    report.duplicates_removed = initial_count - len(df)
    if report.duplicates_removed > 0:
        logger.warning(f"⚠️  {report.duplicates_removed} duplicatas removidas")
        report.warnings.append(f"{report.duplicates_removed} duplicatas removidas")
    
    # 3. Validar e converter tipos
    df = _standardize_types(df, report)
    
    # 4. Validar datas
    df = _standardize_dates(df, report)
    
    # 5. Normalizar strings
    df = _normalize_strings(df, report)
    
    # 6. Validar ranges numéricos
    df = _validate_numeric_ranges(df, report)
    
    # 7. Validar valores categóricos
    df = _validate_categorical_values(df, report)
    
    # 8. Remover nulos (após validações)
    df, nulls = _handle_missing_values(df, report)
    
    report.rows_after_cleaning = len(df)
    
    # Log do resultado
    quality = report.get_quality_score()
    logger.info(f"✅ Validação concluída")
    logger.info(f"   Registros: {report.total_rows} → {report.rows_after_cleaning}")
    logger.info(f"   Score de qualidade: {quality:.1f}%")
    
    if report.errors:
        logger.error(f"   Erros encontrados: {len(report.errors)}")
    
    return df, report

def _standardize_types(df: pd.DataFrame, report: ValidationReport) -> pd.DataFrame:
    """Padroniza tipos de dados"""
    logger.debug("  Padronizando tipos de dados...")
    
    # Conversões seguras
    type_conversions = {
        'id_transacao': 'int64',
        'cliente_id': 'int64',
        'quantidade': 'int64',
        'parcelas': 'int64',
        'idade_cliente': 'int64',
        'tempo_entrega_dias': 'int64',
        'valor_unitario': 'float64',
        'valor_final': 'float64',
        'custo_produto': 'float64',
        'margem_lucro': 'float64',
        'lucro': 'float64',
        'avaliacao_produto': 'float64',
    }
    
    for col, dtype in type_conversions.items():
        if col in df.columns:
            try:
                if dtype == 'int64':
                    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(dtype)
                else:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
            except Exception as e:
                logger.warning(f"  ⚠️  Erro ao converter {col}: {e}")
                report.warnings.append(f"Erro ao converter coluna '{col}': {str(e)}")
    
    return df

def _standardize_dates(df: pd.DataFrame, report: ValidationReport) -> pd.DataFrame:
    """Padroniza datas para formato YYYY-MM-DD"""
    logger.debug("  Padronizando datas...")
    
    if 'data_venda' not in df.columns:
        return df
    
    def parse_date(date_str):
        """Tenta parsing em múltiplos formatos"""
        if pd.isna(date_str):
            return None
        
        date_str = str(date_str).strip()
        
        # Formatos a tentar
        formats = [
            '%Y-%m-%d',
            '%d/%m/%Y',
            '%m/%d/%Y',
            '%d-%m-%Y',
            '%Y/%m/%d',
        ]
        
        for fmt in formats:
            try:
                return pd.to_datetime(date_str, format=fmt)
            except:
                continue
        
        return None
    
    # Aplicar parsing
    df['data_venda'] = df['data_venda'].apply(parse_date)
    
    # Contar erros de conversão
    errors = df['data_venda'].isna().sum()
    if errors > 0:
        report.date_conversion_errors = errors
        logger.warning(f"  ⚠️  {errors} datas inválidas encontradas")
        report.warnings.append(f"{errors} datas não puderam ser convertidas")
        
        # Remover linhas com datas inválidas
        df = df[df['data_venda'].notna()]
    
    return df

def _normalize_strings(df: pd.DataFrame, report: ValidationReport) -> pd.DataFrame:
    """Normaliza strings: trim, capitalize, remove extras"""
    logger.debug("  Normalizando strings...")
    
    string_columns = [
        'nome_produto', 'categoria', 'genero_cliente',
        'estado_cliente', 'forma_pagamento', 'status_entrega'
    ]
    
    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: str(x).strip().title() if pd.notna(x) else x)
    
    return df

def _validate_numeric_ranges(df: pd.DataFrame, report: ValidationReport) -> pd.DataFrame:
    """Valida se valores numéricos estão dentro de ranges aceitáveis"""
    logger.debug("  Validando ranges numéricos...")
    
    out_of_range = {}
    
    for col, (min_val, max_val) in VALID_RANGES.items():
        if col not in df.columns:
            continue
        
        # Encontrar valores fora do range
        mask = (df[col] < min_val) | (df[col] > max_val)
        count = mask.sum()
        
        if count > 0:
            out_of_range[col] = {
                'count': int(count),
                'range': f"{min_val} a {max_val}"
            }
            logger.warning(f"  ⚠️  {count} valores fora do range em '{col}' (esperado: {min_val}-{max_val})")
            report.warnings.append(
                f"{count} valores fora do range em '{col}' (esperado: {min_val}-{max_val})"
            )
    
    report.out_of_range_values = out_of_range
    
    return df

def _validate_categorical_values(df: pd.DataFrame, report: ValidationReport) -> pd.DataFrame:
    """Valida valores categóricos contra lista de valores válidos"""
    logger.debug("  Validando valores categóricos...")
    
    invalid_values = {}
    
    for col, valid_vals in VALID_VALUES.items():
        if col not in df.columns:
            continue
        
        # Encontrar valores inválidos
        mask = ~df[col].isin(valid_vals) & df[col].notna()
        count = mask.sum()
        
        if count > 0:
            unique_invalid = df[mask][col].unique().tolist()
            invalid_values[col] = {
                'count': int(count),
                'invalid_values': unique_invalid[:5],  # Top 5
                'valid_values': valid_vals
            }
            logger.warning(f"  ⚠️  {count} valores inválidos em '{col}'")
            report.warnings.append(
                f"{count} valores inválidos em '{col}': {unique_invalid[:3]}"
            )
    
    report.invalid_values = invalid_values
    
    return df

def _handle_missing_values(df: pd.DataFrame, report: ValidationReport) -> Tuple[pd.DataFrame, Dict]:
    """Identifica e remove linhas com valores faltantes"""
    logger.debug("  Processando valores faltantes...")
    
    nulls_by_column = {}
    
    # Contar nulos por coluna
    for col in df.columns:
        null_count = df[col].isna().sum()
        if null_count > 0:
            nulls_by_column[col] = int(null_count)
    
    if nulls_by_column:
        logger.warning(f"  ⚠️  Colunas com valores faltantes: {nulls_by_column}")
        report.nulls_by_column = nulls_by_column
        
        # Remover linhas com qualquer valor nulo
        initial_count = len(df)
        df = df.dropna()
        removed = initial_count - len(df)
        
        if removed > 0:
            logger.warning(f"  ⚠️  {removed} linhas removidas por valores faltantes")
            report.warnings.append(f"{removed} linhas removidas por valores faltantes")
    
    return df, nulls_by_column

def generate_validation_report(report: ValidationReport) -> str:
    """Gera relatório textual de validação"""
    
    lines = [
        "\n" + "=" * 80,
        "📊 RELATÓRIO DE VALIDAÇÃO DE DADOS",
        "=" * 80,
        f"\n📈 RESUMO GERAL:",
        f"  • Registros iniciais: {report.total_rows}",
        f"  • Registros após limpeza: {report.rows_after_cleaning}",
        f"  • Taxa de rejeição: {(report.total_rows - report.rows_after_cleaning) / report.total_rows * 100:.1f}%",
        f"  • Score de qualidade: {report.get_quality_score():.1f}%",
    ]
    
    if report.duplicates_removed > 0:
        lines.append(f"\n🔄 DUPLICATAS:")
        lines.append(f"  • Removidas: {report.duplicates_removed}")
    
    if report.nulls_by_column:
        lines.append(f"\n❌ VALORES FALTANTES:")
        for col, count in report.nulls_by_column.items():
            lines.append(f"  • {col}: {count} valores")
    
    if report.invalid_values:
        lines.append(f"\n⚠️  VALORES INVÁLIDOS:")
        for col, data in report.invalid_values.items():
            lines.append(f"  • {col}: {data['count']} ocorrências")
            lines.append(f"    Valores encontrados: {data['invalid_values']}")
    
    if report.out_of_range_values:
        lines.append(f"\n📊 VALORES FORA DO RANGE:")
        for col, data in report.out_of_range_values.items():
            lines.append(f"  • {col}: {data['count']} valores (esperado: {data['range']})")
    
    if report.date_conversion_errors > 0:
        lines.append(f"\n📅 ERROS DE DATA:")
        lines.append(f"  • Conversões falhadas: {report.date_conversion_errors}")
    
    if report.warnings:
        lines.append(f"\n⚠️  AVISOS ({len(report.warnings)}):")
        for warning in report.warnings[:5]:
            lines.append(f"  • {warning}")
        if len(report.warnings) > 5:
            lines.append(f"  • ... e {len(report.warnings) - 5} mais")
    
    if report.errors:
        lines.append(f"\n❌ ERROS ({len(report.errors)}):")
        for error in report.errors[:5]:
            lines.append(f"  • {error}")
    
    lines.append("\n" + "=" * 80 + "\n")
    
    return "\n".join(lines)
