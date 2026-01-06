# 📚 Swagger - Documentação Integrada

## 🎉 Swagger Está Ativo!

A API **Hanami Analytics** possui documentação interativa via **Swagger UI** integrada nativamente com FastAPI.

---

## 🚀 Acessar Swagger

Depois de iniciar a API (`python api/main.py`), acesse:

### **Interface Principal (Recomendado)**
```
🔗 http://localhost:8000/docs
```

✅ Interface moderna e responsiva  
✅ Teste endpoints diretamente  
✅ Autocompletar de parâmetros  
✅ Exemplos de código automáticos  
✅ Modelos interativos  

### **Alternativas**
```
ReDoc (Estático):    http://localhost:8000/redoc
OpenAPI JSON:        http://localhost:8000/openapi.json
```

---

## 📖 Documentação Swagger

**3 novos arquivos criados:**

1. **[docs/SWAGGER_GUIDE.md](./docs/SWAGGER_GUIDE.md)** (350+ linhas)
   - Como usar Swagger
   - Teste passo a passo
   - Integração com Postman/Insomnia
   - Exemplos práticos

2. **[docs/INDEX.md](./docs/INDEX.md)** (400+ linhas)
   - Mapa de navegação de toda documentação
   - Busca rápida por tópico
   - Fluxo recomendado de leitura

3. **Atualizado: [docs/README.md](./docs/README.md)**
   - Adicionada seção sobre Swagger
   - Links para SWAGGER_GUIDE.md

---

## 🎯 Primeiros Passos

### **1. Inicie a API**
```bash
cd api
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

### **2. Abra Swagger**
```
Navegador: http://localhost:8000/docs
```

### **3. Teste um Endpoint**
```
1. Clique em "POST /upload"
2. Clique "Try it out"
3. Selecione um arquivo CSV
4. Clique "Execute"
5. Veja a resposta
```

---

## 💡 Recursos do Swagger

### **Explorar Endpoints**
- Veja todos os 14 endpoints
- Leia descrição e parâmetros
- Verifique status codes

### **Testar Interativamente**
- Preencha parâmetros
- Execute requisição
- Veja response em tempo real

### **Modelos de Dados**
- Clique em modelos para expandir
- Veja estrutura de cada objeto
- Entenda tipos de dados

### **Copiar Exemplos**
- Python
- JavaScript
- cURL
- Pronto para usar

---

## 📚 Recursos da Documentação

```
docs/
├── INDEX.md                    ← 🎯 Comece aqui! (Mapa de navegação)
├── README.md                   (Visão geral do projeto)
├── SWAGGER_GUIDE.md            ← ⭐ Novo! (Guia Swagger detalhado)
├── INSTALLATION.md             (Como instalar)
├── ARCHITECTURE.md             (Design técnico)
├── API_DOCUMENTATION.md        (Referência de endpoints)
├── FRONTEND_DOCUMENTATION.md   (Componentes React)
├── DATA_VALIDATION.md          (Validação de dados)
└── TROUBLESHOOTING.md          (Solução de problemas)
```

---

## 🔧 Configuração do Swagger em main.py

Swagger está configurado com metadados:

```python
app = FastAPI(
    title="Hanami Analytics API",
    description="API robusta para análise de dados de vendas...",
    version="1.0.0",
    docs_url="/docs",                # URL da UI
    redoc_url="/redoc",              # URL do ReDoc
    openapi_url="/openapi.json",     # URL do Schema
    contact={
        "name": "Analytics Support",
        "email": "support@analytics.local"
    },
    license_info={
        "name": "MIT",
    },
    servers=[
        {"url": "http://localhost:8000", "description": "Development"},
        {"url": "http://api.example.com", "description": "Production"}
    ]
)
```

**Localização:** `api/main.py` linhas 60-85

---

## 🎨 O que Você Pode Fazer no Swagger

### **Upload e Teste**
- POST /upload - Carregar arquivo CSV
- Veja validação de dados
- Obtenha quality score

### **Análise de Dados**
- GET /api/sales - Vendas por período
- GET /api/kpis - Indicadores principais
- GET /api/top-produtos - Ranking de produtos
- GET /api/analise-categorias - Por categoria
- E mais 10 endpoints

### **Geração de Relatórios**
- GET /reports/summary - Resumo executivo
- GET /reports/detailed - Relatório completo

### **Integração**
- Importe JSON em Postman
- Use em Insomnia
- Exporte para código

---

## 📊 Exemplos de Teste

### **1. Upload Arquivo**
```
Método: POST /upload
Arquivo: vendas.csv
Resultado: {quality_score, validation_report, rows_processed}
```

### **2. Análise por Data**
```
Método: GET /api/sales
Parâmetros:
  - data_inicio: 2025-12-01
  - data_fim: 2025-12-31
  - limit: 100
Resultado: Lista de vendas no período
```

### **3. KPIs Agregados**
```
Método: GET /api/kpis
Parâmetros: data_inicio, data_fim (opcionais)
Resultado: {total_vendas, receita_total, ticket_medio, etc}
```

---

## 🔐 Integração com Ferramentas Externas

### **Postman**
1. Import → From URL
2. Cole: `http://localhost:8000/openapi.json`
3. Coleção automática

### **Insomnia**
1. Import → From URL
2. Cole: `http://localhost:8000/openapi.json`
3. Pronto para usar

### **VSCode REST Client**
```
### Teste GET KPIs
GET http://localhost:8000/api/kpis
```

---

## ✨ Benefícios do Swagger

✅ **Documentação viva** - Sempre sincronizada com código  
✅ **Teste interativo** - Sem precisar de curl/Postman  
✅ **Descoberta automática** - Explore endpoints visualmente  
✅ **Exemplos automáticos** - Copie código pronto  
✅ **Múltiplos formatos** - Python, JavaScript, cURL  
✅ **Modelos interativos** - Veja estrutura de dados  
✅ **Validação visual** - Veja erros em tempo real  

---

## 🎓 Próximos Passos

1. **Leia [docs/SWAGGER_GUIDE.md](./docs/SWAGGER_GUIDE.md)**
   - Guia completo e prático

2. **Acesse http://localhost:8000/docs**
   - Explore todos os 14 endpoints

3. **Teste um upload**
   - Veja validação funcionando

4. **Consulte [docs/INDEX.md](./docs/INDEX.md)**
   - Mapa de toda documentação

---

## 📞 Referência Rápida

| Recurso | URL |
|---------|-----|
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| OpenAPI JSON | http://localhost:8000/openapi.json |
| Dashboard | http://localhost:5173 |
| Logs | api/logs/app.log |

---

## 🐛 Swagger Não Aparece?

**Se não conseguir acessar o Swagger:**

1. Verifique se API está rodando:
   ```bash
   curl http://localhost:8000/docs
   ```

2. Procure por erros no console:
   ```
   Deveria ter: "Uvicorn running on http://0.0.0.0:8000"
   ```

3. Cheque porta 8000:
   ```
   # Windows
   netstat -ano | findstr :8000
   
   # Linux/Mac
   lsof -i :8000
   ```

4. Veja [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) para mais ajuda

---

**Pronto? Abra http://localhost:8000/docs e comece a explorar! 🚀**

---

Última atualização: 6 de janeiro de 2026
