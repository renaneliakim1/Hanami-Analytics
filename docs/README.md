# 📄 Índice da Documentação - Hanami Analytics

Bem-vindo à documentação completa do Hanami Analytics! Este documento serve como ponto de entrada para toda a documentação técnica do projeto.

---

## 🚀 Início Rápido

**Primeira vez aqui?** Comece por estes documentos:

1. 📘 [README.md](../README.md) - Visão geral e instalação básica (5 min)
2. ⚡ [QUICK_START.md](./QUICK_START.md) - Guia rápido de uso (5 min)
3. 📱 [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) - Design mobile/desktop (25 min)

---

## 📚 Documentação por Categoria

### 🎨 Frontend

| Documento | Descrição | Atualização |
|-----------|-----------|-------------|
| [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) | Componentes React, hooks, estrutura | ✅ Jan 2026 |
| [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) | Design responsivo, breakpoints, mobile first | 🆕 Jan 2026 |
| [BUG_FIXES.md](./BUG_FIXES.md) | Correções de bugs e melhorias implementadas | 🆕 Jan 2026 |

**Destaques**:
- ✅ Menu hamburger para mobile (< 670px)
- ✅ Tabs fixas no rodapé em mobile
- ✅ Calendários responsivos (empilhados/lado a lado)
- ✅ Gráficos com eixos otimizados (valores visíveis)
- ✅ Impressão em modo paisagem com tema claro

### 🔧 Backend & API

| Documento | Descrição | Atualização |
|-----------|-----------|-------------|
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Endpoints, parâmetros, exemplos | ✅ Completo |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura técnica, fluxo de dados | ✅ Jan 2026 |
| [DATA_VALIDATION.md](./DATA_VALIDATION.md) | Validação de dados, quality scoring | ✅ Completo |
| [ARQUITETURA_FILTROS.md](./ARQUITETURA_FILTROS.md) | Sistema de filtros (data + região) | ✅ Completo |

**Destaques**:
- ✅ Filtros por data range e região
- ✅ Exportação CSV/Excel com filtros aplicados
- ✅ Validação de dados em 7 etapas
- ✅ Quality score (0-100%)

### 📊 Exportação de Dados

| Documento | Descrição | Atualização |
|-----------|-----------|-------------|
| [EXPORT_GUIDE.md](./EXPORT_GUIDE.md) | Guia completo de exportação | ✅ Completo |
| [EXPORT_MODULE_SUMMARY.md](./EXPORT_MODULE_SUMMARY.md) | Resumo do módulo de exportação | ✅ Completo |
| [EXPORT_QUICK_START.md](./EXPORT_QUICK_START.md) | Início rápido com exportações | ✅ Completo |

**Características**:
- ✅ CSV com encoding UTF-8
- ✅ Excel com múltiplas abas (Dados, Resumo, Informações)
- ✅ Nome de arquivo com timestamp e filtros
- ✅ Download automático

### 🔍 API Testing

| Documento | Descrição | Atualização |
|-----------|-----------|-------------|
| [SWAGGER.md](./SWAGGER.md) | Documentação OpenAPI | ✅ Completo |
| [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) | Tutorial Swagger UI | ✅ Completo |

### ⚙️ Setup & Instalação

| Documento | Descrição | Atualização |
|-----------|-----------|-------------|
| [INSTALLATION.md](./INSTALLATION.md) | Guia de instalação completo | ✅ Completo |
| [QUICK_START.md](./QUICK_START.md) | Início rápido (5 minutos) | ✅ Completo |

---

## 🆕 Novidades (Janeiro 2026)

### Documentação Nova
- 📱 **RESPONSIVE_DESIGN.md** - Guia completo de responsividade
- 🐛 **BUG_FIXES.md** - Histórico de correções e melhorias
- 📋 **DOCUMENTATION_MAP.md** - Mapa atualizado da documentação

### Atualizações Importantes
- ✅ **README.md** - Funcionalidades mobile, responsividade, novos componentes
- ✅ **ARCHITECTURE.md** - Fluxo de dados com filtros de região, cálculo de lucro
- ✅ **FRONTEND_DOCUMENTATION.md** - Componentes novos (ActionMenu, DateRangePicker)
- ✅ **DOCUMENTATION_MAP.md** - Índice completo atualizado

---

## 🐛 Problemas Resolvidos

### Bugs Críticos Corrigidos
1. ✅ **Gráficos com valores zerados** - Eixos Y agora exibem valores corretamente
2. ✅ **Cálculo de lucro incorreto** - Lucro calculado como valor_final * margem_lucro
3. ✅ **Botões de exportação duplicados** - onSelect ao invés de onClick
4. ✅ **Menu aparecendo na impressão** - Print styles com display: none !important
5. ✅ **Calendário não responsivo** - Popover 95vw, calendários empilhados em mobile
6. ✅ **Scroll horizontal em mobile** - Menu hamburger com Sheet component

Detalhes completos em: [BUG_FIXES.md](./BUG_FIXES.md)

---

## 📱 Responsividade

### Breakpoint Principal: 670px

**Mobile (< 670px)**:
- Menu hamburger (topo direito)
- Tabs fixas no rodapé
- Calendários empilhados verticalmente
- Gráficos adaptados (eixos otimizados)

**Desktop (≥ 670px)**:
- Tabs sticky no topo
- Botões inline visíveis
- Calendários lado a lado
- Gráficos expandidos

Guia completo: [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md)

---

## 🔗 Links Úteis

### Repositório
- 📦 [README Principal](../README.md)
- 📂 [Código Frontend](../frontend/)
- 🐍 [Código Backend](../api/)

### Online
- 🌐 Frontend: http://localhost:8081
- 🔌 API: http://localhost:8000
- 📖 Swagger UI: http://localhost:8000/docs

---

## 📊 Estatísticas da Documentação

- **Total de documentos**: 15 arquivos
- **Linhas de documentação**: ~5000+ linhas
- **Cobertura**: 100% das funcionalidades
- **Última atualização**: Janeiro 2026
- **Status**: ✅ Produção

---

## 🎯 Como Usar Esta Documentação

### Sou Desenvolvedor Frontend
1. [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Componentes e hooks
2. [RESPONSIVE_DESIGN.md](./RESPONSIVE_DESIGN.md) - Design responsivo
3. [BUG_FIXES.md](./BUG_FIXES.md) - Lições aprendidas

### Sou Desenvolvedor Backend
1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Endpoints
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura
3. [DATA_VALIDATION.md](./DATA_VALIDATION.md) - Validações

### Sou Usuário Final
1. [QUICK_START.md](./QUICK_START.md) - Início rápido
2. [EXPORT_GUIDE.md](./EXPORT_GUIDE.md) - Como exportar dados
3. [../README.md](../README.md) - Visão geral

### Estou com Problema
1. [BUG_FIXES.md](./BUG_FIXES.md) - Bugs já corrigidos
2. Procure no documento específico da funcionalidade
3. Verifique logs no console (F12)

---

## 📞 Suporte

**Problemas técnicos**: Abra uma issue no repositório  
**Dúvidas sobre documentação**: Consulte [DOCUMENTATION_MAP.md](./DOCUMENTATION_MAP.md)  
**Contribuições**: Siga o padrão dos documentos existentes

---

## ✅ Checklist de Documentação

- [x] README principal atualizado
- [x] Documentação frontend completa
- [x] Documentação backend completa
- [x] Guia de responsividade criado
- [x] Histórico de bugs documentado
- [x] API endpoints documentados
- [x] Exportação documentada
- [x] Swagger configurado
- [x] Arquitetura mapeada
- [x] Validações explicadas
- [x] Filtros detalhados
- [x] Instalação documentada
- [x] Quick start criado
- [x] Índice de navegação criado
- [x] Mapa da documentação atualizado

---

**Desenvolvido com ❤️ | Documentação mantida em Janeiro 2026**
