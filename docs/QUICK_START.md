# 🚀 Guia Rápido - 5 Minutos

Comece a usar o Hanami Analytics em 5 minutos!

---

## ⚡ Requisitos Mínimos

- Node.js 16+ ([Download](https://nodejs.org))
- Python 3.9+ ([Download](https://python.org))
- Um arquivo CSV com dados de vendas

---

## 🔧 Setup (2 minutos)

### **Terminal 1: Backend**

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

✅ Você verá:
```
INFO: Uvicorn running on http://0.0.0.0:8000
```

### **Terminal 2: Frontend**

```bash
cd frontend
npm install
npm run dev
```

✅ Você verá:
```
➜ Local: http://localhost:5173/
```

---

## 📊 Seu Primeiro Dashboard (2 minutos)

1. Abra http://localhost:5173
2. Clique em **"Novo Upload"**
3. Selecione um arquivo CSV com dados (ou use o arquivo de exemplo)
4. Clique em **"Upload"**
5. 🎉 Pronto! Dashboard carregado com dados

---

## 🎯 O que Você Pode Fazer Agora

### **6 Dashboards Disponíveis**

```
Visão Geral    → KPIs, Faturamento, Vendas
Vendas         → Evolução mensal, Tendências
Produtos       → Top 10, Categorias, Avaliações
Clientes       → Gênero, Idade, Estados
Pagamentos     → Formas de pagamento, Parcelamentos
Logística      → Entregas, Avaliações, Tempo médio
```

### **Teste os Filtros**

1. Clique no **calendário** (topo)
2. Selecione uma **data inicial** e **final**
3. Escolha uma **região** (Sudeste, Nordeste, etc)
4. Clique **Aplicar** → Todos os gráficos atualizam!

### **Explore os Gráficos**

- **Passe mouse** sobre barras/linhas → Vê detalhes
- **Clique legenda** → Mostra/esconde série
- **Tema** → Clique lua/sol (topo direito)
- **Imprimir** → Gera PDF do dashboard

---

## 🔌 Teste a API (1 minuto)

Abra: **http://localhost:8000/docs**

### **Teste Rápido**

1. Clique em qualquer **POST** ou **GET**
2. Clique em **"Try it out"**
3. Configure parâmetros (se houver)
4. Clique **"Execute"**
5. Veja a resposta em **Response**

### **Exemplo: Obter KPIs**

```bash
GET /kpis?start_date=2025-01-01&end_date=2026-01-31
```

Resposta esperada:
```json
{
  "faturamento_total": 1250000,
  "lucro_total": 450000,
  "vendas": 10000,
  "clientes": 5000,
  "ticket_medio": 125.00,
  "avaliacao_media": 4.5
}
```

---

## 📁 Arquivo CSV Esperado

Seu arquivo deve ter estas colunas (mínimo):

```csv
id_transacao,cliente_id,data_venda,nome_produto,quantidade,valor_unitario,valor_final,categoria,genero_cliente,forma_pagamento,status_entrega,avaliacao
1001,C001,2025-01-15,Notebook,1,3000,3000,Eletrônicos,M,Cartão,Entregue,5
1002,C002,2025-01-16,Mouse,5,50,250,Acessórios,F,PIX,Entregue,4
...
```

### **Formatos de Data Aceitos**

- ✅ 2025-01-15 (YYYY-MM-DD)
- ✅ 15/01/2025 (DD/MM/YYYY)
- ✅ 01/15/2025 (MM/DD/YYYY)
- ✅ 15-01-2025 (DD-MM-YYYY)

---

## ✅ Checklist Rápido

- [ ] Backend rodando (http://localhost:8000)
- [ ] Frontend rodando (http://localhost:5173)
- [ ] Arquivo uploadado com sucesso
- [ ] Dashboards mostrando dados
- [ ] Filtro por data funcionando
- [ ] Filtro por região funcionando
- [ ] Swagger UI acessível (http://localhost:8000/docs)

---

## 🎓 Próximos Passos

### **Quer Entender Mais?**
- [INSTALLATION.md](./INSTALLATION.md) - Setup completo
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Como funciona
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Todos os endpoints

### **Quer Contribuir?**
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Como contribuir
- [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) - Componentes

### **Encontrou Problema?**
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Soluções
- Check logs: `api/logs/app.log`

---

## 🆘 Problemas Rápidos

### **❌ "Api not responding"**
```bash
# Terminal 1: Verifique backend
cd api
python main.py
```

### **❌ "npm: command not found"**
```bash
# Instale Node.js em https://nodejs.org
```

### **❌ "Port 8000 already in use"**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

### **❌ "Score < 50%"**
Seu arquivo tem dados ruins. Verifique:
- Colunas necessárias presentes?
- Datas em formato correto?
- Valores numéricos válidos?

---

## 🚀 Você Está Pronto!

Você agora tem:

✅ Dashboard completo  
✅ 15+ gráficos interativos  
✅ Filtros por data e região  
✅ Tema claro/escuro  
✅ API REST funcional  
✅ Documentação Swagger  

**Explore, teste, aproveite! 🎉**

Para mais detalhes, consulte [INDEX.md](./INDEX.md)

---

**Dúvida? Acesse http://localhost:8000/docs e teste diretamente!**
