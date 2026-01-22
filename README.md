# 📊 Hanami Analytics

Dashboard inteligente para análise e visualização de dados de vendas com backend FastAPI.

**Status**: ✅ Produção | **Última atualização**: Janeiro 2026

## 🚀 Funcionalidades Principais

- **6 Dashboards Completos**: Visão Geral, Vendas, Produtos, Clientes, Pagamentos, Logística
- **15+ Gráficos Interativos**: Área, Barras, Pizza, com tooltips e responsivos
- **Filtros Avançados**: Data (com calendários responsivos), Região (6 opções), Atalhos rápidos
- **Tema Escuro/Claro**: Alternância automática com persistência
- **Impressão em PDF**: Geração de relatórios formatados em modo paisagem
- **API REST**: Endpoints para integração externa com suporte a filtros
- **Totalmente Responsivo**: 
  - 📱 **Mobile First**: Menu hamburger, tabs fixas no rodapé, calendários empilhados
  - 🖥️ **Desktop**: Tabs no topo, menu inline, calendários lado a lado
  - 📺 **Ultrawide**: Suporte completo para monitores 29" e maiores
- **Dados em Português**: Formatação de moeda (R$), datas (dd/MM/yyyy) e localização pt-BR
- **Exportação Inteligente**: CSV e Excel com filtros aplicados e múltiplas abas

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
Hanami-Analytics/
├── api/                          # Backend FastAPI
│   ├── main.py                  # Endpoints da API
│   ├── data_validator.py        # Validação de dados
│   ├── requirements.txt         # Dependências Python
│   └── README.md               # Documentação da API
│
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx            # Componente principal com responsividade
│   │   │   ├── DateRangePicker.tsx      # Filtros responsivos (data/região)
│   │   │   ├── ActionMenu.tsx           # Menu hamburger para mobile
│   │   │   ├── ThemeToggle.tsx          # Alternador de tema
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
   - Calendários interativos responsivos (data inicial e final)
   - Seletores de mês/ano para navegação rápida
   - Atalhos: "Últimos 7 dias", "Últimos 30 dias", "Últimos 90 dias", "Este mês", "Este ano"
   - Formatação em padrão brasileiro (dd/MM/yyyy)
   - **Mobile**: Calendários empilhados verticalmente com escala otimizada
   - **Desktop**: Calendários lado a lado para comparação rápida

2. **Região** 🗺️
   - Todas as Regiões, Sudeste, Nordeste, Sul, Centro-Oeste, Norte
   - Filtro combinável com data
   - Atualização em tempo real de todos os gráficos e KPIs

### Características Especiais

- 📱 **Mobile Friendly**: 
  - Popover com 95% da largura da tela
  - Calendários empilhados verticalmente
  - Presets em coluna única
  - Escala reduzida para melhor visualização
  - Touch-friendly com áreas de toque otimizadas
  
- 🖥️ **Desktop/Ultrawide**: 
  - Calendários lado a lado
  - Presets em grid 2 colunas
  - Scroll vertical para conteúdo extenso
  - Botões "Aplicar" e "Resetar" sempre acessíveis
  
- 🚀 **Performance**: useMemo para otimização de cálculos
- 🎨 **Totalmente Responsivo**: Breakpoint em 670px para mobile/desktop
- 🌙 **Dark Mode**: Suporte completo com cores otimizadas

## 🔌 API REST

### 🌐 CORS e Produção

A API está configurada para funcionar com:
- ✅ Desenvolvimento local (localhost:5173)
- ✅ Produção Vercel (hanami-analytics.vercel.app)
- ✅ Qualquer subdomínio .vercel.app
- ✅ Configurável via variável `CORS_ALLOWED_ORIGINS`

**Nota**: O Render não possui problemas de CORS como outras plataformas (Railway). A configuração atual funciona perfeitamente em produção.

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

## � Responsividade Mobile

O dashboard foi otimizado para dispositivos móveis com recursos específicos:

### Layout Mobile (< 670px)

- **Menu Hamburger**: Botões de ação (exportar, imprimir, tema, upload) acessíveis via menu superior direito
- **Tabs no Rodapé**: Navegação fixa na parte inferior com ícones e labels
- **Calendários Empilhados**: Seleção de datas com calendários verticais otimizados
- **Gráficos Adaptáveis**: Eixos e labels ajustados automaticamente
- **Impressão Otimizada**: Modo paisagem automático, tema claro forçado

### Layout Desktop (≥ 670px)

- **Tabs no Topo**: Navegação sticky no topo da página
- **Botões Inline**: Ações visíveis diretamente na barra superior
- **Calendários Lado a Lado**: Comparação rápida de datas inicial e final
- **Gráficos Expandidos**: Aproveitamento total da largura disponível

### Breakpoints Responsivos

```css
/* Mobile */
max-width: 670px - Menu hamburger, tabs no rodapé

/* Desktop */
min-width: 670px - Tabs no topo, menu inline

/* Tablet/Desktop */
min-width: 640px (sm) - Ajustes de grid e espaçamento

/* Desktop Large */
min-width: 1024px (lg) - Grid de 2 colunas para gráficos
```

## �💡 Guia de Uso Rápido

### Primeiro Acesso

1. Inicie o backend e frontend conforme instruções acima
2. Abra http://localhost:8081 no navegador
3. Explore os 6 dashboards na barra lateral
4. Use os filtros para análises específicas

### Filtros

- **Data**: Clique no calendário, selecione mês/ano ou use atalhos rápidos
- **Região**: Escolha uma região específica ou deixe "Todas as regiões"
- **Aplicar**: Confirma os filtros e atualiza todos os gráficos
- **Resetar**: Remove todos os filtros (volta para últimos 30 dias)

### Navegação Mobile

- **Menu**: Toque no ícone ☰ no canto superior direito para acessar ações
- **Tabs**: Use a barra fixa no rodapé para alternar entre dashboards
- **Calendário**: Em mobile, os calendários são empilhados verticalmente para melhor usabilidade
- **Gráficos**: Role verticalmente, os gráficos se ajustam automaticamente

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

## 🚀 Deploy em Produção

### 🌐 Aplicação Online

- **Frontend (Vercel)**: https://hanami-analytics.vercel.app
- **Backend API (Render)**: https://hanami-analytics-api.onrender.com
- **Swagger Docs**: https://hanami-analytics-api.onrender.com/docs

### 📦 Deploy Rápido (5 minutos)

O projeto está 100% configurado para deploy gratuito:

1. **Frontend (Vercel)**
   - Conecte seu repositório GitHub ao Vercel
   - Deploy automático
   - Configure variáveis de ambiente:
     ```
     VITE_API_URL=https://hanami-analytics-api.onrender.com
     VITE_API_TIMEOUT=30000
     ```

2. **Backend (Render)**
   - Conecte seu repositório ao Render
   - Render detecta automaticamente via `render.yaml`
   - Build Command: `pip install -r api/requirements.txt`
   - Start Command: `cd api && uvicorn main:app --host 0.0.0.0 --port $PORT`

📖 **Guia completo**: [DEPLOY_RÁPIDO.md](DEPLOY_RÁPIDO.md)  
📊 **Deploy em Produção**: [DEPLOY_PRODUCTION.md](DEPLOY_PRODUCTION.md)

### 🏗️ Build Local

```bash
cd frontend
npm run build
```

Saída em: `frontend/dist/`

## 📝 Como Editar o Código

### Usando IDE Local

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd Hanami-Analytics
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

### Problemas em dispositivos móveis
- **Calendário não aparece**: Aumente o zoom do navegador ou rotacione para paisagem
- **Menu não abre**: Toque no ícone ☰ no canto superior direito
- **Tabs não aparecem**: Role até o final da página, tabs ficam fixas no rodapé
- **Gráficos cortados**: Role horizontalmente ou reduza o zoom
- **Valores zerados nos gráficos**: Recarregue a página (F5) ou limpe o cache

### Impressão de relatórios
- **Modo paisagem automático**: Configurado para melhor visualização dos gráficos
- **Tema claro forçado**: Economiza tinta e melhora legibilidade
- **Elementos escondidos**: Menu e tabs não aparecem na impressão

Para mais detalhes, consulte [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

## 📚 Documentação Detalhada

### 📖 Deploy e Produção
- **[Deploy Rápido (5 min)](DEPLOY_RÁPIDO.md)** - Guia rápido de deploy
- **[Deploy em Produção](DEPLOY_PRODUCTION.md)** - Configurações completas Render + Vercel

### 🔧 API e Backend
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Endpoints e schemas
- **[Architecture](docs/ARCHITECTURE.md)** - Estrutura técnica
- **[Data Validation](docs/DATA_VALIDATION.md)** - Validação de dados

### 💻 Frontend
- **[Frontend Documentation](docs/FRONTEND_DOCUMENTATION.md)** - Componentes React
- **[Responsive Design](docs/RESPONSIVE_DESIGN.md)** - Design responsivo

### 🛠️ Instalação e Configuração
- **[Installation Guide](docs/INSTALLATION.md)** - Guia completo de instalação
- **[Quick Start](docs/QUICK_START.md)** - Início rápido

## 📄 Licença

Projeto de código aberto. Sinta-se livre para usar, modificar e distribuir.

## 👥 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através do repositório GitHub.

---

**Desenvolvido com ❤️ usando React, FastAPI e Tailwind CSS**
