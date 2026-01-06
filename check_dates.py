import pandas as pd

df = pd.read_csv('vendas_ficticias_10000_linhas.csv')
print('Colunas:', df.columns.tolist())
print('\nPrimeiras datas:')
print(df['data_venda'].head())
print('\nÚltimas datas:')
print(df['data_venda'].tail())
print(f'\nIntervalo de datas: {df["data_venda"].min()} a {df["data_venda"].max()}')
