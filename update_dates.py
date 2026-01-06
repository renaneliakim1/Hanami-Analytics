import pandas as pd
from datetime import datetime, timedelta
import random

# Carregar arquivo original
df = pd.read_csv('vendas_ficticias_10000_linhas.csv')

# Gerar datas entre 05/12/2025 e 05/01/2026
start_date = datetime(2025, 12, 5)
end_date = datetime(2026, 1, 5)

# Substituir as datas do arquivo por datas no intervalo desejado
num_rows = len(df)
new_dates = [start_date + timedelta(days=random.randint(0, (end_date - start_date).days)) for _ in range(num_rows)]

df['data_venda'] = pd.to_datetime(new_dates).strftime('%Y-%m-%d')

# Salvar o arquivo atualizado
df.to_csv('vendas_ficticias_10000_linhas.csv', index=False)
print(f"Arquivo atualizado com datas entre {start_date.date()} e {end_date.date()}")
print(f"Primeiras datas: {df['data_venda'].head().tolist()}")
print(f"Últimas datas: {df['data_venda'].tail().tolist()}")
