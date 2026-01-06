# 📑 Índice de Documentação

## 🎯 Comece Aqui

Bem-vindo ao **Hanami Analytics**! Escolha seu ponto de partida:

### **🚀 Primeira Vez?**
1. Leia [README.md](./README.md) - Visão geral completa
2. Siga [INSTALLATION.md](./INSTALLATION.md) - Instalação passo a passo
3. Acesse Swagger em `http://localhost:8000/docs` - Teste interativo

### **📊 Quer Usar a API?**
1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Referência de endpoints
2. [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md) - Teste via Swagger UI
3. [DATA_VALIDATION.md](./DATA_VALIDATION.md) - Entender validação

### **🎨 Desenvolvendo o Frontend?**
1. [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Componentes
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - Estrutura técnica

### **🔧 Encontrou um Problema?**
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Soluções rápidas
2. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Verificar endpoint

---

## 📚 Documentos Disponíveis

### **1️⃣ [README.md](./README.md)** - Panorama Geral
- **Tamanho:** ~250 linhas
- **Para:** Quem quer saber o que é o projeto
- **Contém:**
  - Visão geral de features
  - Status do projeto (✅ 9/9 complete)
  - Arquitetura visual
  - Stack de tecnologias
  - Instalação rápida
  - Endereços de acesso

---

### **2️⃣ [INSTALLATION.md](./INSTALLATION.md)** - Instalação Passo a Passo
- **Tamanho:** ~200 linhas
- **Para:** Preparar ambiente de desenvolvimento
- **Contém:**
  - Requisitos de sistema
  - Instalação backend (venv, pip, requirements)
  - Instalação frontend (npm, Vite)
  - Verificação pós-instalação
  - Solução de problemas iniciais

---

### **3️⃣ [ARCHITECTURE.md](./ARCHITECTURE.md)** - Detalhes Técnicos
- **Tamanho:** ~300 linhas
- **Para:** Entender design e fluxos
- **Contém:**
  - Diagrama de arquitetura
  - Fluxo de dados completo
  - Componentes backend
  - Componentes frontend
  - Logging architecture
  - Performance considerations

---

### **4️⃣ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Referência Completa
- **Tamanho:** ~500 linhas
- **Para:** Trabalhar com endpoints
- **Contém:**
  - 14 endpoints documentados
  - Request/Response de cada um
  - Exemplos em Python/cURL/JavaScript
  - Formatos de data
  - Codes HTTP
  - Validações esperadas

**Endpoints cobertos:**
- `POST /upload`
- `GET /api/sales`
- `GET /api/kpis`
- `GET /api/top-produtos`
- `GET /api/analise-categorias`
- `GET /api/clientes-top`
- `GET /api/sales-by-month`
- `GET /api/analise-pagamentos`
- `GET /api/analise-genero`
- `GET /api/analise-estado`
- `GET /api/analise-idade`
- `GET /api/analise-parcelamento`
- `GET /reports/summary`
- `GET /reports/detailed`

---

### **5️⃣ [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)** - Documentação Interativa ⭐
- **Tamanho:** ~350 linhas
- **Para:** Testar e explorar API
- **Contém:**
  - Como acessar Swagger
  - Interface Swagger explicada
  - Teste passo a passo
  - Modelos de dados
  - Como testar em sequência
  - Integração com Postman/Insomnia
  - Exemplos práticos completos

**Acesso direto:**
```
http://localhost:8000/docs        ← UI interativa
http://localhost:8000/redoc       ← Documentação estática
http://localhost:8000/openapi.json ← Schema JSON
```

---

### **6️⃣ [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)** - React Components
- **Tamanho:** ~350 linhas
- **Para:** Trabalhar com componentes
- **Contém:**
  - Estrutura de componentes
  - Dashboard e seus componentes
  - Hooks customizados
  - Theming (dark mode)
  - Responsiveness
  - Integração com API

---

### **7️⃣ [DATA_VALIDATION.md](./DATA_VALIDATION.md)** - Validação de Dados
- **Tamanho:** ~350 linhas
- **Para:** Entender qualidade de dados
- **Contém:**
  - Pipeline de validação (7 etapas)
  - Tipos de validação
  - Ranges e categorias
  - ValidationReport (estrutura)
  - Quality scoring (0-100%)
  - Configuração customizada
  - Exemplos de detecção

**Validações:**
- ✅ Tipos de dados
- ✅ Datas (5 formatos)
- ✅ Strings (normalização)
- ✅ Ranges numéricos
- ✅ Categorias válidas
- ✅ Duplicatas
- ✅ Nulos

---

### **8️⃣ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Resolução de Problemas
- **Tamanho:** ~350 linhas
- **Para:** Resolver problemas comuns
- **Contém:**
  - Erros de instalação
  - Problemas de conectividade
  - Erros de upload
  - Problemas de dados
  - Gráficos não renderizam
  - CORS errors
  - Performance
  - Checklist de debug

**Problemas cobertos:**
- Python/Node não instalado
- Porta 8000 em uso
- npm ERESOLVE error
- API não conecta
- Arquivo muito grande
- Score < 50%
- Dark mode não funciona
- Gráficos pequenos
- CORS blocked

---

## 📍 Fluxo de Navegação

```
PRIMEIRO ACESSO
    ↓
   README.md (Visão geral)
    ↓
INSTALLATION.md (Preparar ambiente)
    ↓
   Abrir http://localhost:5173
    ↓
USAR SWAGGER PARA TESTAR
    ├→ SWAGGER_GUIDE.md (Como usar)
    ├→ API_DOCUMENTATION.md (Referência)
    └→ http://localhost:8000/docs
    ↓
EXPLORANDO PROJETO
    ├→ ARCHITECTURE.md (Como funciona)
    ├→ FRONTEND_DOCUMENTATION.md (Componentes)
    └→ DATA_VALIDATION.md (Validação)
    ↓
DESENVOLVIMENTO
    ├→ Editar componentes (Frontend)
    ├→ Adicionar endpoints (Backend)
    └→ Consultar logs (api/logs/app.log)
    ↓
PROBLEMA?
    └→ TROUBLESHOOTING.md
```

---

## 🔍 Busca Rápida por Tópico

### **Instalação & Setup**
- Como instalar? → [INSTALLATION.md](./INSTALLATION.md)
- Quais requisitos? → [INSTALLATION.md#requisitos](./INSTALLATION.md)
- Backend não inicia? → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### **API & Endpoints**
- Lista de endpoints? → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Testar endpoint? → [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)
- Formato de request? → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- CORS error? → [TROUBLESHOOTING.md#cors](./TROUBLESHOOTING.md)

### **Frontend & UI**
- Componentes? → [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)
- Hooks disponíveis? → [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)
- Dark mode? → [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)
- Gráfico pequeno? → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### **Dados & Validação**
- Como validação funciona? → [DATA_VALIDATION.md](./DATA_VALIDATION.md)
- Quality score < 50%? → [DATA_VALIDATION.md](./DATA_VALIDATION.md)
- Formato de arquivo? → [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### **Problemas**
- Não encontro solução? → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Erro específico? → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) (Buscar erro)
- Log de erros? → `api/logs/app.log`

---

## 📊 Mapa de Documentação Técnica

```
DOCUMENTAÇÃO TÉCNICA
│
├─ ARQUITETURA
│  ├─ ARCHITECTURE.md      (Sistema completo)
│  └─ SWAGGER_GUIDE.md     (API discovery)
│
├─ IMPLEMENTAÇÃO
│  ├─ FRONTEND_DOCUMENTATION.md  (React/Components)
│  ├─ API_DOCUMENTATION.md       (Endpoints)
│  └─ DATA_VALIDATION.md         (Validação)
│
├─ OPERAÇÃO
│  ├─ INSTALLATION.md      (Setup)
│  ├─ TROUBLESHOOTING.md   (Debug)
│  └─ README.md            (Visão geral)
│
└─ DESCOBERTA
   └─ SWAGGER_GUIDE.md     (http://localhost:8000/docs)
```

---

## ✅ Checklist de Integração

Integrando Hanami em seu projeto?

- [ ] Li [README.md](./README.md)
- [ ] Instalei com [INSTALLATION.md](./INSTALLATION.md)
- [ ] Acessei Swagger (http://localhost:8000/docs)
- [ ] Testei POST /upload
- [ ] Testei GET /api/kpis
- [ ] Verifiquei [DATA_VALIDATION.md](./DATA_VALIDATION.md)
- [ ] Entendi [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Explorei [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)
- [ ] Criei um teste em [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)
- [ ] Consultei [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) se necessário

---

## 🚀 Próximos Passos

**Já instalou?**
1. Abra http://localhost:5173 (Dashboard)
2. Abra http://localhost:8000/docs (Swagger)
3. Faça upload de um arquivo CSV/XLSX
4. Explore as análises

**Quer desenvolver?**
1. Leia [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Estude [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md)
3. Consulte [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

**Encontrou problema?**
1. Procure em [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Verifique `api/logs/app.log`
3. Teste via [SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)

---

## 📞 Informações Principais

| Item | Valor |
|------|-------|
| **Versão** | 1.0.0 |
| **Data** | 6 de janeiro de 2026 |
| **Licença** | MIT |
| **Dashboard** | http://localhost:5173 |
| **Swagger** | http://localhost:8000/docs |
| **ReDoc** | http://localhost:8000/redoc |
| **Logs** | api/logs/app.log |
| **Linguagem** | Python/TypeScript/React |

---

**Última atualização**: 6 de janeiro de 2026

---

## 💡 Dica Final

Não tem certeza por onde começar? Comece aqui:

1. **[README.md](./README.md)** → Entender o projeto
2. **[INSTALLATION.md](./INSTALLATION.md)** → Instalar
3. **http://localhost:8000/docs** → Swagger (teste!)
4. **[SWAGGER_GUIDE.md](./SWAGGER_GUIDE.md)** → Aprender Swagger
5. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** → Referência

Pronto para codificar! 🎉
