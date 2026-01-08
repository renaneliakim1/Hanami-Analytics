# 📊 Hanami Analytics

Dashboard inteligente para análise e visualização de dados de vendas com backend FastAPI.

**Status**: ✅ Produção | **Última atualização**: Janeiro 2026

## 🚀 Funcionalidades Principais

- **6 Dashboards Completos**: Visão Geral, Vendas, Produtos, Clientes, Pagamentos, Logística
- **15+ Gráficos Interativos**: Área, Barras, Pizza, com tooltips e responsivos
- **Filtros Avançados**: Data (com calendários), Região (6 opções), Atalhos rápidos
- **Tema Escuro/Claro**: Alternância automática com persistência
- **Impressão em PDF**: Geração de relatórios formatados
- **API REST**: Endpoints para integração externa
- **Otimizado para Ultrawide**: Suporte completo para monitores 29" e maiores
- **Dados em Português**: Formatação de moeda (R$), datas (dd/MM/yyyy) e localização pt-BR

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + TypeScript + Vite
- **Recharts** - Gráficos responsivos e interativos
- **shadcn-ui** - Componentes acessíveis
- **Tailwind CSS** - Estilização moderna
- **date-fns** - Manipulação de datas em português
- **Next Themes** - Gerenciamento de tema escuro/claro

### Backend
- **FastAPI** - Framework web de alta performance
- **Pandas** - Processamento de dados
- **Uvicorn** - Servidor ASGI

## 📦 Instalação Rápida

### Pré-requisitos
- Node.js 16+ e npm
- Python 3.8+

### Backend (FastAPI)

```bash
cd api
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

**API disponível em**: http://localhost:8000  
**Documentação interativa**: http://localhost:8000/docs

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

**Frontend disponível em**: http://localhost:8081

## 📂 Estrutura do Projeto

```
analyze-joy-hub/
├── api/                          # Backend FastAPI
│   ├── main.py                  # Endpoints da API
│   ├── data_validator.py        # Validação de dados
│   ├── requirements.txt         # Dependências Python
│   └── README.md               # Documentação da API
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx            # Componente principal
│   │   │   ├── DateRangePicker.tsx      # Filtros (data/região)
│   │   │   ├── dashboard/
│   │   │   │   ├── OverviewTab.tsx      # Visão Geral
│   │   │   │   ├── SalesTab.tsx         # Vendas
│   │   │   │   ├── ProductsTab.tsx      # Produtos
│   │   │   │   ├── CustomersTab.tsx     # Clientes
│   │   │   │   ├── PaymentsTab.tsx      # Pagamentos
│   │   │   │   └── LogisticsTab.tsx     # Logística
│   │   │   └── charts/                  # Componentes de gráficos
│   │   ├── hooks/
│   │   │   ├── useSalesData.ts          # Hook de dados originais
│   │   │   ├── useFilteredSalesData.ts  # Hook de filtros
│   │   │   └── useApiReport.ts          # Hook de API
│   │   ├── types/
│   │   │   └── sales.ts                 # Tipos TypeScript
│   │   ├── utils/
│   │   │   └── csvParser.ts             # Formatação de valores
│   │   └── App.tsx
│   ├── public/
│   │   └── vendas_ficticias_10000_linhas.csv
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.ts
│
├── docs/                         # Documentação detalhada
│   ├── API_DOCUMENTATION.md
│   ├── ARCHITECTURE.md
│   ├── DATA_VALIDATION.md
│   ├── INSTALLATION.md
│   └── TROUBLESHOOTING.md
│
├── logs/                         # Logs da aplicação
├── README.md                     # Este arquivo
└── SWAGGER.md                    # Documentação OpenAPI
```

## 📊 Dashboards Disponíveis

### 1️⃣ **Visão Geral**
- KPIs principais (Faturamento, Lucro, Vendas, Clientes)
- Gráfico de vendas mensais
- Vendas por categoria
- Ticket médio

### 2️⃣ **Vendas**
- Evolução mensal de faturamento e lucro
- Análise de tendências
- Dados exportáveis

### 3️⃣ **Produtos**
- Top 10 produtos mais vendidos
- Receita por categoria
- Avaliações de produtos
- Análise de rentabilidade

### 4️⃣ **Clientes**
- Distribuição por gênero
- Faixa etária dos clientes
- Vendas por estado
- Segmentação geográfica

### 5️⃣ **Pagamentos**
- Formas de pagamento mais usadas
- Análise de parcelamentos
- Valor médio por método
- Distribuição de transações

### 6️⃣ **Logística**
- Status de entregas
- Tempo médio de entrega
- Avaliações de produtos
- Acompanhamento de entregas

## 🔍 Sistema de Filtros

### Filtros Disponíveis

1. **Data Range** 📅
   - Calendários interativos (data inicial e final)
   - Seletores de mês/ano para navegação rápida
   - Atalhos: "Últimos 7 dias", "Últimos 30 dias", etc
   - Formatação em padrão brasileiro (dd/MM/yyyy)

2. **Região** 🗺️
   - Sudeste, Nordeste, Sul, Centro-Oeste, Norte
   - Filtro combinável com data
   - Atualização em tempo real de todos os gráficos

### Características Especiais

- ✨ **Ultrawide Ready**: Otimizado para monitores 29" e maiores
  - Layout responsivo com calendários lado a lado
  - Scroll vertical para popover com conteúdo extenso
  - Botões "Aplicar" e "Resetar" sempre acessíveis
  
- 🚀 **Performance**: Usememo para otimização de cálculos
- 🎨 **Responsivo**: Adapta-se a qualquer tamanho de tela
- 🌙 **Dark Mode**: Suporte completo com cores otimizadas

## 🔌 API REST

### Endpoints Principais

```
GET  /                          # Info da API
GET  /sales                     # Vendas (paginado)
GET  /kpis                      # KPIs principais
GET  /sales-by-month           # Vendas mensais
GET  /sales-by-category        # Por categoria
GET  /top-products             # Top 10 produtos
GET  /customers-by-gender      # Por gênero
GET  /sales-by-state           # Por estado
GET  /payment-methods          # Formas de pagamento
GET  /customer-by-age          # Por faixa etária
GET  /delivery-status          # Status de entregas
GET  /product-ratings          # Avaliações
GET  /average-delivery-time    # Tempo médio entrega
GET  /export/csv               # Exportar relatório em CSV
GET  /export/excel             # Exportar relatório em Excel
```

### Exportação de Relatórios 📊

Os endpoints de exportação suportam filtros opcionais:

**CSV Export:**
```
GET /export/csv?start_date=2024-01-01&end_date=2024-12-31&region=Sudeste
```

**Excel Export:**
```
GET /export/excel?start_date=2024-01-01&end_date=2024-12-31&region=Sul
```

**Parâmetros disponíveis:**
- `start_date`: Data inicial (formato: YYYY-MM-DD)
- `end_date`: Data final (formato: YYYY-MM-DD)
- `region`: Região específica (Norte, Nordeste, Sul, Sudeste, Centro-Oeste)

**Características:**
- ✅ Filtros por período e região
- ✅ Nome de arquivo com timestamp e filtros aplicados
- ✅ Excel com múltiplas abas (Dados, Resumo, Informações)
- ✅ CSV com encoding UTF-8
- ✅ Download automático

Documentação completa em: http://localhost:8000/docs (Swagger UI)

## 💡 Guia de Uso Rápido

### Primeiro Acesso

1. Inicie o backend e frontend conforme instruções acima
2. Abra http://localhost:8081 no navegador
3. Explore os 6 dashboards na barra lateral
4. Use os filtros para análises específicas

### Filtros

- **Data**: Clique no calendário, selecione mês/ano ou use atalhos
- **Região**: Escolha uma região ou deixe "Todas as regiões"
- **Aplicar**: Confirma os filtros
- **Resetar**: Remove todos os filtros

### Exportação de Dados 📥

O dashboard oferece duas opções de exportação com filtros aplicados:

- **Exportar CSV**: Gera arquivo CSV com os dados filtrados
  - Formato universal compatível com Excel, Google Sheets, etc.
  - Encoding UTF-8 com BOM para caracteres especiais
  - Nome de arquivo inclui timestamp e filtros aplicados
  
- **Exportar Excel**: Gera arquivo .xlsx com múltiplas abas
  - **Aba "Dados de Vendas"**: Todos os registros filtrados
  - **Aba "Resumo"**: KPIs calculados (faturamento, lucro, ticket médio, etc.)
  - **Aba "Informações"**: Detalhes dos filtros aplicados e data de geração
  - Formatação preservada e pronta para análise

**Como usar:**
1. Aplique os filtros desejados (data e/ou região)
2. Clique em "Exportar CSV" ou "Exportar Excel"
3. O arquivo será baixado automaticamente com nome descritivo
4. Exemplo: `relatorio_vendas_20260108_143025_2024-01-01_ate_2024-12-31_sudeste.xlsx`

### Impressão

- Clique em "Imprimir" para gerar PDF do dashboard atual
- Navegue pelas abas e imprima cada uma conforme necessário

### Tema

- Use o botão de sol/lua no topo para alternar entre temas claro/escuro

## 🚀 Build para Produção

### Frontend

```bash
cd frontend
npm run build
```

Saída em: `frontend/dist/`

### Deploy

Pode ser feito em:
- **Vercel** (recomendado para React)
- **Netlify**
- **GitHub Pages**
- **Seu servidor próprio** (qualquer host de arquivos estáticos)

O backend FastAPI pode ser deployado em qualquer servidor Python.

## 📝 Como Editar o Código

### Usando IDE Local

```bash
git clone https://github.com/renaneliakim1/analyze-joy-hub.git
cd analyze-joy-hub
cd frontend
npm install
npm run dev
```

### Estrutura de Componentes

```
src/components/
├── Dashboard.tsx              # Orquestrador principal
├── DateRangePicker.tsx        # Filtros avançados
├── dashboard/
│   ├── OverviewTab.tsx        # KPIs e visão geral
│   ├── SalesTab.tsx           # Gráficos de vendas
│   ├── ProductsTab.tsx        # Análise de produtos
│   ├── CustomersTab.tsx       # Dados de clientes
│   ├── PaymentsTab.tsx        # Formas de pagamento
│   └── LogisticsTab.tsx       # Entregas e logística
└── charts/
    ├── AreaChartComponent.tsx
    ├── BarChartComponent.tsx
    └── PieChartComponent.tsx
```

## 🐛 Troubleshooting

### Gráficos não carregam
- Verifique se a API está rodando (http://localhost:8000)
- Abra DevTools (F12) e procure por erros no Console
- Verifique se os filtros estão corretos

### Filtros não funcionam
- Limpe o cache (Ctrl+Shift+Delete)
- Recarregue a página (F5)
- Verifique se as datas estão no formato correto

### Performance lenta
- Reduza o período de datas (menos registros)
- Feche outras abas do navegador
- Verifique se há muitos gráficos abertos

Para mais detalhes, consulte [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## 📚 Documentação Detalhada

- [API Documentation](docs/API_DOCUMENTATION.md) - Endpoints e schemas
- [Architecture](docs/ARCHITECTURE.md) - Estrutura técnica
- [Installation Guide](docs/INSTALLATION.md) - Guia completo de instalação
- [Data Validation](docs/DATA_VALIDATION.md) - Validação de dados
- [Frontend Documentation](docs/FRONTEND_DOCUMENTATION.md) - Componentes React

## 📄 Licença

Projeto de código aberto. Sinta-se livre para usar, modificar e distribuir.

## 👥 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através do repositório GitHub.

---

**Desenvolvido com ❤️ usando React, FastAPI e Tailwind CSS**
