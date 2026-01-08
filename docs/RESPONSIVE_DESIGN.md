# 📱 Design Responsivo - Hanami Analytics

## 🎯 Visão Geral

O Hanami Analytics implementa design **Mobile First** com breakpoint principal em **670px**, garantindo experiência otimizada em todos os dispositivos.

---

## 📐 Breakpoints

```css
/* Mobile */
max-width: 670px
  - Menu hamburger
  - Tabs no rodapé
  - Calendários empilhados
  - Gráficos adaptados

/* Desktop */
min-width: 670px
  - Tabs no topo
  - Botões inline
  - Calendários lado a lado
  - Gráficos expandidos

/* Tablet */
min-width: 640px (sm)
  - Grid ajustado
  - Espaçamento otimizado

/* Desktop Large */
min-width: 1024px (lg)
  - Grid 2 colunas para gráficos
  - Maior densidade de informação

/* Ultrawide */
min-width: 1536px (2xl)
  - Grid 3 colunas
  - Aproveitamento máximo
```

---

## 🔧 Componentes Responsivos

### **Dashboard.tsx**

#### Mobile (< 670px)
```tsx
// Menu Hamburger (topo direito)
<div className="max-[670px]:flex max-[670px]:absolute max-[670px]:top-4 max-[670px]:right-4">
  <ActionMenu {...props} />
</div>

// Tabs no rodapé (fixas)
<div className="max-[670px]:flex max-[670px]:fixed max-[670px]:bottom-0 max-[670px]:left-0 max-[670px]:right-0 max-[670px]:z-50">
  <TabsList>
    <TabsTrigger className="flex flex-col items-center gap-1">
      <Icon className="w-5 h-5" />
      <span className="text-[10px]">Label</span>
    </TabsTrigger>
  </TabsList>
</div>

// Padding inferior para evitar sobreposição
<Tabs className="max-[670px]:pb-24">
```

#### Desktop (≥ 670px)
```tsx
// Tabs no topo (sticky)
<div className="hidden min-[670px]:flex sticky top-0 z-40">
  <TabsList>
    <TabsTrigger className="flex items-center gap-2">
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">Label</span>
    </TabsTrigger>
  </TabsList>
</div>

// Botões inline
<div className="hidden min-[670px]:flex gap-2">
  <Button>Novo Upload</Button>
  <Button>Imprimir</Button>
  <DropdownMenu>Exportar</DropdownMenu>
</div>
```

---

### **DateRangePicker.tsx**

#### Mobile
```tsx
// Popover usa 95% da largura
<PopoverContent className="w-[95vw] sm:w-auto p-3 sm:p-4">

// Presets em coluna única
<div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
  {presets.map(preset => <Button key={preset.label}>...</Button>)}
</div>

// Calendários empilhados verticalmente
<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
  <div>
    <Calendar className="scale-90 sm:scale-100 origin-top" />
  </div>
  <div>
    <Calendar className="scale-90 sm:scale-100 origin-top" />
  </div>
</div>
```

#### Desktop
```tsx
// Popover automático
<PopoverContent className="w-auto p-4">

// Presets em grid 2 colunas
<div className="grid grid-cols-2 gap-1">

// Calendários lado a lado
<div className="grid grid-cols-2 gap-2">
```

---

### **AreaChartComponent.tsx & BarChartComponent.tsx**

#### Ajustes Responsivos
```tsx
// Width fixo para eixos Y (evita corte de valores)
<YAxis 
  width={100}
  tickFormatter={formatCurrency}
/>

// Margins adaptativas
<AreaChart 
  data={data}
  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
>

// Barras horizontais com margin dinâmica
<BarChart
  layout="vertical"
  margin={{ 
    left: horizontal ? Math.max(80, Math.min(200, maxLabelWidth)) : 20
  }}
>
```

---

## 🎨 Classes Tailwind Utilitárias

### Visibilidade Condicional
```tsx
// Apenas mobile
<div className="block sm:hidden">Mobile Only</div>
<div className="max-[670px]:flex">Below 670px</div>

// Apenas desktop
<div className="hidden sm:block">Desktop Only</div>
<div className="min-[670px]:flex">Above 670px</div>

// Adaptativo
<div className="text-sm sm:text-base lg:text-lg">Responsive Text</div>
```

### Grid Responsivo
```tsx
// 1 coluna em mobile, 2 em tablet, 3 em desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// 1 coluna em mobile, 2 em desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
```

### Spacing Adaptativo
```tsx
// Padding responsivo
<div className="p-3 sm:p-4 lg:p-6">

// Gap responsivo
<div className="flex gap-2 sm:gap-4 lg:gap-6">

// Margin responsivo
<div className="mb-4 sm:mb-6 lg:mb-8">
```

---

## 🖨️ Print Styles (Impressão)

```css
@media print {
  /* Forçar tema claro */
  * {
    background: white !important;
    color: #000 !important;
  }
  
  /* Ocultar elementos de UI */
  .no-print,
  .fixed,
  .sticky,
  button {
    display: none !important;
  }
  
  /* Modo paisagem */
  @page {
    size: A4 landscape;
    margin: 1cm;
  }
  
  /* Evitar quebras */
  .chart-container,
  .card {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

---

## 🧪 Testes de Responsividade

### Dispositivos Testados
- ✅ iPhone SE (375px)
- ✅ iPhone 12/13 (390px)
- ✅ iPhone 14 Pro Max (428px)
- ✅ Samsung Galaxy S21 (360px)
- ✅ iPad Mini (768px)
- ✅ iPad Pro (1024px)
- ✅ Desktop HD (1920px)
- ✅ Ultrawide 29" (2560px)

### Chrome DevTools
```
F12 > Toggle Device Toolbar (Ctrl+Shift+M)
Testar breakpoints: 375, 670, 768, 1024, 1440, 1920
```

---

## 📊 Performance Mobile

### Otimizações Implementadas
1. **Lazy Loading**: Componentes pesados carregados sob demanda
2. **useMemo**: Cálculos de dados memoizados
3. **CSS Grid**: Layout eficiente sem JavaScript
4. **Touch Events**: Áreas de toque otimizadas (min 44x44px)
5. **Scale CSS**: Redimensionamento sem re-render

### Métricas Alvo
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

---

## 🔍 Debugging

### Verificar Breakpoint Atual
```tsx
import { useState, useEffect } from 'react';

export function useBreakpoint() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 670);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile };
}
```

### Logs de Desenvolvimento
```tsx
// Adicionar em componentes problemáticos
useEffect(() => {
  console.log('Window width:', window.innerWidth);
  console.log('Is mobile:', window.innerWidth < 670);
}, []);
```

---

## ✅ Checklist de Responsividade

- [x] Menu hamburger funcional em mobile
- [x] Tabs fixas no rodapé (< 670px)
- [x] Tabs sticky no topo (≥ 670px)
- [x] Calendários empilhados em mobile
- [x] Calendários lado a lado em desktop
- [x] Popover com largura adaptativa
- [x] Gráficos com eixos visíveis
- [x] Touch events para mobile
- [x] Print styles (paisagem, tema claro)
- [x] Overflow horizontal prevenido
- [x] Textos legíveis em todos os tamanhos
- [x] Botões com área mínima de toque
- [x] Sem elementos cortados
- [x] Performance aceitável em 3G
- [x] Testado em dispositivos reais

---

## 🚀 Próximas Melhorias

- [ ] PWA (Progressive Web App) com offline support
- [ ] Service Worker para cache
- [ ] Otimização de imagens com WebP
- [ ] Skeleton loaders para carregamento
- [ ] Infinite scroll para listas longas
- [ ] Gesture support (swipe entre tabs)
- [ ] Dark mode automático baseado em horário
- [ ] Acessibilidade completa (WCAG 2.1 AA)

---

**Última atualização**: Janeiro 2026
