# 🔧 Troubleshooting e FAQ

## 🚀 Problemas de Instalação

### **❌ Erro: "python: command not found"**

**Causa:** Python não está instalado ou não está no PATH

**Solução:**
```bash
# Verifique se Python está instalado
python --version
# ou
python3 --version

# Se não estiver, baixe em: https://python.org
```

---

### **❌ Erro: "ModuleNotFoundError: No module named 'fastapi'"**

**Causa:** Dependências não instaladas

**Solução:**
```bash
# Ativar ambiente virtual
cd api
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt
```

---

### **❌ Erro: "Port 8000 already in use"**

**Causa:** Outra aplicação usando a porta 8000

**Solução Windows:**
```bash
# Encontrar processo
netstat -ano | findstr :8000

# Resultado: TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING    12345

# Matar processo
taskkill /PID 12345 /F
```

**Solução Linux/Mac:**
```bash
lsof -i :8000
kill -9 <PID>
```

---

### **❌ Erro: "npm ERR! code ERESOLVE"**

**Causa:** Conflito de dependências npm

**Solução:**
```bash
cd frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### **❌ Erro: "Vite dev server not starting"**

**Causa:** Node não instalado ou versão incompatível

**Solução:**
```bash
# Verificar Node
node --version
npm --version

# Deve ser: Node 16+ e npm 7+

# Se precisar atualizar
npm install -g npm@latest
```

---

## 🌐 Problemas de Conectividade

### **❌ Frontend não encontra API**

**Sintomas:** 
- Erro "Failed to fetch"
- CORS error no console

**Causa:** API não está rodando ou CORS não configurado

**Solução:**

1. **Verificar se API está rodando:**
```bash
curl http://localhost:8000/docs
# Deve retornar HTML (Swagger)
```

2. **Se não funcionar, reinicie API:**
```bash
cd api
python main.py
```

3. **Verificar CORS em `main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", ...],  # Frontend URL aqui
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### **❌ Dashboard mostra "Erro ao carregar dados"**

**Causa:** Erro na API ao processar requisição

**Solução:**

1. **Verificar logs da API:**
```bash
tail -f api/logs/app.log
```

2. **Procurar por "ERROR" nos logs**

3. **Exemplo de erro:**
```
[ERROR] Erro ao calcular KPIs: 'data_venda' column not found
```

4. **Significa:** Coluna esperada não existe no seu arquivo CSV

---

## 📤 Problemas de Upload

### **❌ Erro: "Arquivo vazio"**

**Causa:** Arquivo CSV tem 0 linhas

**Solução:**
- Verifique se o arquivo tem dados
- Não carregue só cabeçalho

---

### **❌ Erro: "Arquivo muito grande (máximo 100.000 linhas)"**

**Causa:** Arquivo tem > 100k linhas

**Solução:**
- Divida o arquivo em partes menores
- Ou processe offline com Pandas

---

### **❌ Erro: "Tipo de arquivo não suportado"**

**Causa:** Arquivo não é CSV ou XLSX

**Solução:**
- Converta para CSV ou XLSX
- Verifique extensão do arquivo

---

### **❌ Upload bem-sucedido mas score < 50%**

**Causa:** Dados têm muitos problemas

**Solução:**
1. **Ver relatório de validação:**
   - Quantas duplicatas?
   - Quantos nulos?
   - Quais valores inválidos?

2. **Corrigir problemas:**
   - Remover duplicatas
   - Preencher valores faltantes
   - Corrigir valores categóricos

3. **Fazer upload novamente**

---

## 📊 Problemas de Dados

### **❌ Gráfico mostra "Nenhum dado disponível"**

**Causa:** Filtro de data não encontrou registros

**Solução:**
1. **Verificar intervalo de datas do seu arquivo:**
```
Clique em "Usar Dados Padrão" para ver datas de exemplo
```

2. **Expandir filtro de data:**
   - Mude para data mais antiga
   - Ou remova o filtro completamente

3. **Verificar coluna `data_venda`:**
   - Seu CSV tem essa coluna?
   - Nome exato é `data_venda`?

---

### **❌ KPIs mostram valores errados ou 0**

**Causa:** Coluna esperada não existe

**Solução:**

Seu arquivo precisa ter estas colunas:
```
Obrigatórias:
- id_transacao
- data_venda
- valor_final

Recomendadas:
- nome_produto
- quantidade
- cliente_id
- categoria
- forma_pagamento
- status_entrega
- e mais...
```

**Exemplo de CSV válido:**
```
id_transacao,cliente_id,data_venda,nome_produto,categoria,quantidade,valor_unitario,valor_final
1,101,2025-12-05,Notebook,Eletrônicos,1,3500.00,3500.00
2,102,2025-12-06,Mouse,Acessórios,2,50.00,100.00
```

---

### **❌ Erro ao parsear datas**

**Causa:** Formato de data não reconhecido

**Solução:**

Use um destes formatos:
- `YYYY-MM-DD` (2025-12-05)
- `DD/MM/YYYY` (05/12/2025)
- `MM/DD/YYYY` (12/05/2025)
- `DD-MM-YYYY` (05-12-2025)
- `YYYY/MM/DD` (2025/12/05)

**Exemplo correto:**
```
data_venda
2025-12-05
2025-12-06
2025-12-07
```

---

## 🎨 Problemas de Interface

### **❌ Dark mode não funciona**

**Causa:** Tema não inicializou

**Solução:**
1. **Recarregar página:** F5
2. **Limpar cache do navegador:** Ctrl+Shift+Delete
3. **Checar console para erros**

---

### **❌ Gráficos aparecem minúsculos ou desalinhados**

**Causa:** Responsividade CSS quebrada

**Solução:**
1. **Recarregar página:**
```
F5
```

2. **Limpar cache:**
```
Ctrl+Shift+Delete (Clear Browser Cache)
```

3. **Verificar tamanho da tela:**
```
Em mobile: vire para horizontal/vertical
Em desktop: redimensione a janela
```

---

### **❌ Botões não respondendo**

**Causa:** JavaScript não carregou

**Solução:**
1. **Verificar console do navegador:**
   - F12 → Console
   - Procure por erros em vermelho

2. **Se houver erro, verifique se API está rodando:**
```bash
curl http://localhost:8000/docs
```

---

## 🔍 Problemas de Performance

### **❌ Dashboard lento ao carregar**

**Causa:** Arquivo grande ou API lenta

**Solução:**
1. **Reduzir intervalo de datas**
2. **Usar arquivo menor**
3. **Verificar logs da API para bottlenecks:**
```bash
tail -f api/logs/app.log | grep "DEBUG\|ERROR"
```

---

### **❌ Gráfico congela ao renderizar**

**Causa:** Muitos dados para Recharts

**Solução:**
1. **Filtrar por data mais específica**
2. **Usar "limit" menor** (ex: top 5 em vez de top 20)
3. **Verificar coluna de dados** - valores muito grandes?

---

## 🔐 Problemas de CORS

### **❌ Erro: "Access to XMLHttpRequest blocked by CORS"**

**Causa:** Origem não autorizada

**Solução:**

1. **Verifique URL do frontend:**
   - Está em `http://localhost:5173`?

2. **Verifique arquivo `api/main.py`:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:8080",
        "http://localhost:3000",
        "http://localhost:5173"  # Certifique-se que tem aqui
    ],
)
```

3. **Se mudar a porta, adicione:**
```python
allow_origins=["http://localhost:9999"]  # Nova porta
```

4. **Reinicie a API:**
```bash
python main.py
```

---

## 📝 Problemas de Logging

### **❌ Arquivo de log não criado**

**Causa:** Diretório `logs/` não existe

**Solução:**
```bash
# Criar manualmente
mkdir api/logs

# Ou deixar que a API crie automaticamente
# (ela faz isso na primeira execução)
```

---

### **❌ Logs não aparecem no console**

**Causa:** Nível de log configurado para ERROR

**Solução:**

Verifique `api/main.py`:
```python
console_handler.setLevel(logging.INFO)  # Mude de ERROR para INFO
```

---

## 🐛 Debug

### **Modo Debug Ativado**

Adicione ao `api/main.py`:
```python
logger.setLevel(logging.DEBUG)  # Mostra tudo
```

---

### **Verificar Stack Trace Completo**

```bash
# No log file
tail api/logs/app.log | grep -A 20 "ERROR"

# No console
python main.py 2>&1 | grep -i error
```

---

## 📋 Checklist de Troubleshooting

Antes de abrir issue, verifique:

- [ ] Python 3.9+ instalado?
- [ ] Node 16+ instalado?
- [ ] Ambiente virtual ativado?
- [ ] Dependências instaladas (`pip install -r requirements.txt`)?
- [ ] API rodando em `http://localhost:8000`?
- [ ] Frontend rodando em `http://localhost:5173`?
- [ ] Arquivo CSV/XLSX tem dados válidos?
- [ ] Arquivo tem coluna `data_venda`?
- [ ] Arquivo não tem > 100k linhas?
- [ ] Porta 8000 e 5173 livres?
- [ ] Nenhum erro no console do navegador (F12)?
- [ ] Nenhum erro em `api/logs/app.log`?

---

## 🆘 Pedindo Ajuda

Se problema persistir:

1. **Colete informações:**
```bash
# Version info
python --version
node --version
npm --version

# Error logs
cat api/logs/app.log | tail -50 > error.txt
```

2. **Teste básico:**
```bash
# Teste API
curl http://localhost:8000/docs

# Teste frontend
curl http://localhost:5173
```

3. **Compartilhe:**
   - `error.txt`
   - Print da tela
   - Passos para reproduzir

---

## 📞 Recursos

- **Swagger API:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Logs:** `api/logs/app.log`
- **Documentação:** Pasta `docs/`

---

**Última atualização**: 6 de janeiro de 2026
