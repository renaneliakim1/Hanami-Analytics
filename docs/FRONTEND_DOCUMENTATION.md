# 🎨 Documentação Frontend

## 📁 Estrutura de Componentes

```
frontend/src/
├── components/
│   ├── Dashboard.tsx              # Container principal com responsividade mobile
│   ├── FileUpload.tsx             # Upload com detecção de datas
│   ├── DateRangePicker.tsx        # Filtros responsivos (data/região)
│   ├── ActionMenu.tsx             # Menu hamburger para mobile
│   ├── KPICard.tsx                # Card com métrica
│   ├── NavLink.tsx                # Link de navegação
│   ├── ThemeToggle.tsx            # Dark mode toggle
│   │
│   ├── charts/
│   │   ├── AreaChartComponent.tsx # Gráfico de área (responsivo)
│   │   ├── BarChartComponent.tsx  # Barras (horizontal/vertical, responsivo)
│   │   └── PieChartComponent.tsx  # Pizza
│   │
│   ├── dashboard/
│   │   ├── OverviewTab.tsx        # Visão Geral
│   │   ├── SalesTab.tsx           # Vendas
│   │   ├── ProductsTab.tsx        # Produtos
│   │   ├── PaymentsTab.tsx        # Pagamentos
│   │   ├── CustomersTab.tsx       # Clientes
│   │   └── LogisticsTab.tsx       # Logística
│   │
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       ├── select.tsx
│       ├── calendar.tsx           # Calendário responsivo
│       ├── popover.tsx            # Popover com ajuste mobile
│       ├── sheet.tsx              # Sheet para menu mobile
│       ├── dropdown-menu.tsx      # Menu dropdown
│       └── ... (shadcn/ui components)
│
├── hooks/
│   ├── useSalesData.ts            # Gerencia dados locais
│   ├── useFilteredSalesData.ts    # Dados filtrados por data/região
│   ├── useApiReport.ts            # Dados da API
│   ├── useExportReport.ts         # Exportação CSV/Excel
│   ├── use-toast.ts               # Notificações
│   └── use-mobile.tsx             # Detecção de mobile
│
├── pages/
│   ├── Index.tsx                  # Página principal
│   └── NotFound.tsx               # 404
│
├── types/
│   └── sales.ts                   # Tipos TypeScript
│
├── utils/
│   ├── csvParser.ts               # Parsing de CSV
│   └── utils.ts                   # Utilitários gerais
│
└── App.tsx                        # Root component
```

---

## 🎯 Componentes Principais

### **Dashboard.tsx**

Gerencia abas e filtro de data.

**Props:**
```typescript
{
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}
```

**Responsabilidades:**
- Renderizar 6 abas
- Passar dados corretos para cada tab
- Gerenciar filtro de data

**Exemplo:**
```tsx
<Dashboard 
  startDate="2025-12-05"
  endDate="2026-01-05"
  onDateChange={handleDateChange}
/>
```

---

### **FileUpload.tsx**

Upload com drag-and-drop e detecção automática de datas.

**Props:**
```typescript
{
  onDataLoaded?: (
    records: any[],
    startDate: string,
    endDate: string
  ) => void;
}
```

**Responsabilidades:**
- Aceitar arquivo drag-and-drop
- Fazer upload para API
- Detectar range de datas
- Mostrar progress
- Exibir relatório de validação

**Features:**
- Suporta CSV/XLSX
- Detecção automática de datas (DD/MM/YYYY, YYYY-MM-DD)
- Calcula min/max de data_venda
- Mostra quality score
- Botão "Usar Dados Padrão"

---

### **KPICard.tsx**

Card com métrica principal.

**Props:**
```typescript
{
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  backgroundColor?: string;
  trend?: number;  // % de mudança
}
```

**Exemplo:**
```tsx
<KPICard 
  title="Total de Vendas"
  value={300}
  icon={<ShoppingCart />}
  backgroundColor="bg-blue-50"
/>
```

---

### **AreaChartComponent.tsx**

Gráfico de área para séries temporais.

**Props:**
```typescript
{
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  title: string;
  dataKey: string;
  isCurrency?: boolean;
  colors?: string[];
}
```

**Features:**
- Responsivo
- Tooltip com formatação BRL
- Legenda interativa
- Animação ao carregar

---

### **BarChartComponent.tsx**

Gráfico de barras (horizontal ou vertical).

**Props:**
```typescript
{
  data: Array<{
    name: string;
    [dataKey]: number;
  }>;
  title: string;
  dataKey: string;
  horizontal?: boolean;
  isCurrency?: boolean;
  colors?: string[];
}
```

**Features:**
- Layout adaptativo (mobile/desktop)
- Barras horizontais (produtos) e verticais (mês)
- Altura dinâmica baseada em dados
- Margem esquerda responsiva
- Radius nos cantos

**Exemplo:**
```tsx
<BarChartComponent
  data={produtosMaisVendidos}
  title="Top 10 Produtos"
  dataKey="quantidade"
  horizontal={true}
  colors={["hsl(142, 71%, 45%)"]}
/>
```

---

### **PieChartComponent.tsx**

Gráfico de pizza.

**Props:**
```typescript
{
  data: Array<{
    name: string;
    value: number;
  }>;
  title: string;
  isCurrency?: boolean;
  colors?: string[];
}
```

**Features:**
- Legenda em 3 colunas
- Tooltip com valores
- Altura dinâmica para legenda
- Formatação BRL se `isCurrency`

---

## 📊 Tabs do Dashboard

### **OverviewTab.tsx**

Visão geral com KPIs e gráficos resumidos.

**Dados exibidos:**
- 7 KPI cards (Total Vendas, Faturamento, Ticket Médio, Lucro, Margem, Clientes, Avaliação)
- Gráfico de vendas por mês (4 últimos meses)
- Distribuição por gênero
- Top 5 produtos
- Top 5 estados

---

### **SalesTab.tsx**

Análise de vendas.

**Gráficos:**
- Vendas por mês (área chart)
- Vendas por categoria (pizza)
- Forma de pagamento (pizza)
- Parcelamento (bar chart)

---

### **ProductsTab.tsx**

Análise de produtos.

**Gráficos:**
- Vendas por categoria (pizza)
- Top 10 produtos (bar chart horizontal)
- Lucro por produto (bar chart horizontal)
- Produtos com menor avaliação (bar chart horizontal)

---

### **PaymentsTab.tsx**

Análise de pagamentos.

**Gráficos:**
- Formas de pagamento (pizza)
- Valor total por forma (bar chart)
- Parcelamento (pizza)

---

### **CustomersTab.tsx**

Análise de clientes.

**Gráficos:**
- Gênero (pizza)
- Faixa etária (bar chart)
- Estados (top 10 - bar chart)

---

### **LogisticsTab.tsx**

Análise de logística.

**Dados:**
- 3 KPI cards (Status, Tempo médio, Produtos baixa avaliação)

**Gráficos:**
- Status de entrega (pizza)
- Produtos com menor avaliação (bar chart horizontal)

---

## 🪝 Custom Hooks

### **useSalesData.ts**

Gerencia estado de dados e chamadas à API.

**Estado:**
```typescript
{
  salesData: any[];
  kpis: KPIsData;
  salesByMonth: any[];
  salesByCategory: any[];
  topProducts: any[];
  // ... outros dados
  loading: boolean;
  error: string | null;
}
```

**Funções:**
```typescript
fetchData(startDate?: string, endDate?: string): Promise<void>
uploadFile(file: File): Promise<any>
resetData(): Promise<void>
setDateRange(start: string, end: string): void
```

**Exemplo:**
```typescript
const { kpis, loading } = useSalesData();

useEffect(() => {
  if (selectedDates.start && selectedDates.end) {
    fetchData(selectedDates.start, selectedDates.end);
  }
}, [selectedDates]);
```

---

### **use-toast.ts**

Sistema de notificações (shadcn/ui).

**Exemplo:**
```typescript
const { toast } = useToast();

toast({
  title: "Sucesso",
  description: "Arquivo carregado com sucesso",
  duration: 3000
});
```

---

### **use-mobile.tsx**

Detecta se está em mobile.

**Exemplo:**
```typescript
const isMobile = useMobile();

return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

---

## 🎨 Theming

### **Dark Mode (next-themes)**

Integrado automaticamente com `ThemeToggle.tsx`.

**Cores Dark:**
```css
background: rgb(25, 28, 37)  /* Card background */
text: rgb(255, 255, 255)     /* Text color */
```

**Aplicado em:**
- KPI Cards
- Gráficos
- Input fields
- Sidebar

---

## 📱 Responsividade

### **Breakpoints (Tailwind)**

```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
```

### **Aplicação nos Componentes**

**Dashboard:**
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Em mobile: 1 coluna */}
  {/* Em desktop: 2 colunas */}
</div>
```

**BarChart:**
```tsx
<div className="w-full min-w-0">
  {/* Ocupa 100% em mobile */}
  {/* min-w-0 permite grid flex trabalhar corretamente */}
</div>
```

---

## 🔗 API Integration

### **Endpoints Usados**

```typescript
// Upload
POST /upload

// KPIs e Análises
GET /kpis?start_date=X&end_date=Y
GET /sales-by-month?start_date=X&end_date=Y
GET /sales-by-category?start_date=X&end_date=Y
GET /top-products?limit=10&start_date=X&end_date=Y
GET /customers-by-gender?start_date=X&end_date=Y
GET /customers-by-age?start_date=X&end_date=Y
GET /sales-by-state?limit=10&start_date=X&end_date=Y
GET /payment-methods?start_date=X&end_date=Y
GET /installments?start_date=X&end_date=Y
GET /delivery-status?start_date=X&end_date=Y
GET /product-ratings?limit=10&start_date=X&end_date=Y
GET /average-delivery-time?start_date=X&end_date=Y
```

---

## 🎯 Tipos TypeScript

### **sales.ts**

```typescript
export interface SalesData {
  id_transacao: number;
  cliente_id: number;
  data_venda: string;
  nome_produto: string;
  quantidade: number;
  valor_final: number;
  // ... outros campos
}

export interface KPIsData {
  total_vendas: number;
  faturamento_total: number;
  ticket_medio: number;
  lucro_total: number;
  margem_lucro_media: number;
  clientes_unicos: number;
  avaliacao_media: number;
}
```

---

## 🛠️ Utilitários

### **csvParser.ts**

```typescript
export function parseDate(dateStr: string): Date | null
export function getDateRange(records: any[]): {
  startDate: string;
  endDate: string;
}
export function formatCurrency(value: number): string
export function formatNumber(value: number): string
```

### **utils.ts**

```typescript
export function cn(...classes: string[]): string
export function formatDate(date: Date): string
export function groupBy<T>(arr: T[], key: string): Record<string, T[]>
```

---

## 📦 Dependências Principais

```json
{
  "react": "^18.2.0",
  "typescript": "^5.3.3",
  "vite": "^5.0.0",
  "recharts": "^2.10.0",
  "tailwindcss": "^3.3.6",
  "next-themes": "^0.2.1",
  "shadcn/ui": "latest"
}
```

---

## 🚀 Build e Deploy

### **Development**

```bash
npm run dev
# Vite dev server em http://localhost:5173
```

### **Build**

```bash
npm run build
# Cria dist/ para produção
```

### **Preview**

```bash
npm run preview
# Visualiza build localmente
```

---

## 📝 Convenções de Código

- ✅ Componentes em PascalCase
- ✅ Tipos em PascalCase
- ✅ Props interfaces com `I` ou `...Props`
- ✅ Hooks em camelCase com prefixo `use`
- ✅ Constantes em SCREAMING_SNAKE_CASE
- ✅ Comentários em português
- ✅ Type-safe com TypeScript strict

---

**Última atualização**: 6 de janeiro de 2026
