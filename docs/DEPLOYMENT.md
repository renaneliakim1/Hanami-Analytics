# 🚀 Deploy em Produção

Guia completo para fazer deploy do Hanami Analytics em produção.

---

## 🎯 Opções de Deploy

- **Vercel** ⭐ Recomendado para frontend React
- **Railway** ou **Render** - Para backend FastAPI
- **Seu servidor próprio** - VPS/Dedicado
- **Docker** - Containerização completa

---

## 1️⃣ Deploy Frontend (Vercel) ⭐ Recomendado

### **Pré-requisitos**
- Conta em [Vercel.com](https://vercel.com)
- Repositório GitHub
- Build pronto

### **Passo 1: Fazer Build**

```bash
cd frontend
npm run build
```

Gera pasta `frontend/dist/` pronta para deploy.

### **Passo 2: Deploy via Vercel CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Ou via GitHub:

1. Push código para GitHub
2. Vá a [Vercel](https://vercel.com)
3. Clique "New Project"
4. Selecione seu repositório
5. Vercel detecta automaticamente:
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
6. Clique "Deploy"

### **Variáveis de Ambiente**

Crie `.env.production`:

```env
VITE_API_URL=https://sua-api.com
```

---

## 2️⃣ Deploy Backend (Railway/Render)

### **Opção A: Railway.app** ⭐ Mais Fácil

#### Setup

1. Crie conta em [Railway.app](https://railway.app)
2. Clique "New Project"
3. Selecione "Deploy from GitHub"
4. Autorize e selecione seu repositório
5. Railway detecta `requirements.txt` automaticamente

#### Configuração

Na aba "Variables":

```
PYTHONUNBUFFERED=1
```

Na aba "Settings":

```
Start Command: cd api && python main.py
```

Port será ajustado automaticamente pelo Railway.

### **Opção B: Render.com**

1. Crie conta em [Render.com](https://render.com)
2. Clique "New +" → "Web Service"
3. Conecte GitHub
4. Preencha:
   - **Name**: `hanami-analytics-api`
   - **Environment**: `Python 3.11`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd api && python main.py`

---

## 3️⃣ Seu Próprio Servidor

### **Requisitos**
- Ubuntu 20.04+
- SSH access
- Domain name (opcional)

### **Setup Manual**

```bash
# 1. Atualizar sistema
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nodejs npm

# 2. Clone repo
git clone https://github.com/seu-usuario/analyze-joy-hub.git
cd analyze-joy-hub

# 3. Setup Backend
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 4. Criar arquivo de serviço
sudo nano /etc/systemd/system/hanami-api.service
```

**Conteúdo do arquivo:**

```ini
[Unit]
Description=Hanami Analytics API
After=network.target

[Service]
Type=notify
User=seu-usuario
WorkingDirectory=/home/seu-usuario/analyze-joy-hub/api
Environment="PATH=/home/seu-usuario/analyze-joy-hub/api/venv/bin"
ExecStart=/home/seu-usuario/analyze-joy-hub/api/venv/bin/gunicorn -w 4 -b 0.0.0.0:8000 main:app

[Install]
WantedBy=multi-user.target
```

```bash
# 5. Ativar serviço
sudo systemctl daemon-reload
sudo systemctl start hanami-api
sudo systemctl enable hanami-api

# 6. Verificar status
sudo systemctl status hanami-api
```

### **Setup Frontend com Nginx**

```bash
# 1. Build frontend
cd frontend
npm install
npm run build

# 2. Instalar Nginx
sudo apt install -y nginx

# 3. Copiar build para Nginx
sudo cp -r dist/* /var/www/html/

# 4. Configurar Nginx
sudo nano /etc/nginx/sites-available/default
```

**Configuração Nginx:**

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name seu-dominio.com;
    root /var/www/html;
    
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
    }
}
```

```bash
# 5. Reiniciar Nginx
sudo systemctl restart nginx
```

---

## 4️⃣ Docker (Completo)

### **Dockerfile - Frontend**

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### **Dockerfile - Backend**

```dockerfile
# api/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "main.py"]
```

### **docker-compose.yml**

```yaml
version: '3.9'

services:
  api:
    build: ./api
    ports:
      - "8000:8000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./api/logs:/app/logs

  frontend:
    build: ./frontend
    ports:
      - "80:3000"
    depends_on:
      - api
```

### **Deploy com Docker**

```bash
docker-compose up -d
```

---

## 5️⃣ SSL/HTTPS (Let's Encrypt)

Para servidor próprio:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
sudo systemctl restart nginx
```

Para Vercel/Railway: **Automático!** ✅

---

## 📊 Variáveis de Ambiente

### **Backend (.env)**

```env
PYTHONUNBUFFERED=1
LOG_LEVEL=INFO
CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

### **Frontend (.env.production)**

```env
VITE_API_URL=https://api.seu-dominio.com
VITE_APP_NAME=Hanami Analytics
```

---

## ✅ Checklist de Deploy

### **Antes de Deployar**

- [ ] Build frontend testado localmente (`npm run build`)
- [ ] Backend testado em produção
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] SSL/HTTPS ativado
- [ ] Database backup (se aplicável)
- [ ] Logs configurados
- [ ] Monitoring/Alertas configurados

### **Verificação Pós-Deploy**

- [ ] Frontend carrega em https://seu-dominio.com
- [ ] API responde em https://api.seu-dominio.com/docs
- [ ] Swagger UI funciona
- [ ] Upload de arquivo funciona
- [ ] Filtros funcionam
- [ ] Dashboard carrega todos os gráficos
- [ ] Dark mode funciona
- [ ] Responsivo em mobile

---

## 🔍 Monitoramento

### **Logs**

```bash
# Railway
railway logs --tail

# Render
curl https://api.seu-site.onrender.com/health

# Servidor próprio
tail -f /var/log/syslog | grep hanami-api
```

### **Health Check**

```bash
# Seu backend deve ter endpoint de health
curl https://api.seu-dominio.com/health
```

---

## 🔐 Segurança

### **Recomendações**

1. **CORS**: Restringir apenas seu domínio
2. **Rate Limiting**: Limite requisições por IP
3. **Authentication**: Adicionar se necessário
4. **Input Validation**: Já está implementada
5. **HTTPS**: Obrigatório em produção
6. **Backups**: Fazer backup regular dos dados

### **Exemplo CORS no FastAPI**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seu-dominio.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📈 Performance

### **Frontend**
- Build otimizado com `npm run build`
- Compressão gzip habilitada
- Cache de assets (Nginx/Vercel)
- Images otimizadas

### **Backend**
- Uvicorn com workers: `gunicorn -w 4`
- Caching de dados em memória
- Índices de DataFrame
- Connection pooling

---

## 🆘 Troubleshooting

### **CORS Error em Produção**

```python
# Verificar variável CORS_ORIGINS
import os
origins = os.getenv("CORS_ORIGINS", "").split(",")
# Deve incluir seu domínio frontend
```

### **Timeout do Upload**

Aumentar timeout no Nginx:

```nginx
client_max_body_size 50M;
proxy_read_timeout 300s;
```

### **Memória Insuficiente**

Usar Railway/Render com plano apropriado (512MB mínimo).

---

## 📱 Domínio Customizado

### **Vercel (Frontend)**

1. Vá a Project Settings
2. Domains → Add Domain
3. Configure DNS apontando para Vercel

### **Railway (Backend)**

1. Vá a Settings
2. Domains → Add
3. Configure DNS

---

## 💰 Custos Estimados

| Serviço | Custo | Notas |
|---------|-------|-------|
| Vercel Frontend | Grátis | Até 100GB/mês |
| Railway Backend | $5-25/mês | Pay-as-you-go |
| Domínio | $10-15/ano | Namecheap/GoDaddy |
| SSL | Grátis | Let's Encrypt |
| **Total** | **$5-40/mês** | Muito acessível! |

---

## 🚀 Deploy Automático (CI/CD)

### **GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Backend
        run: |
          # Configurar Railway/render deploy
```

---

## 📞 Suporte

- Dúvidas? Consulte [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Issues? Abra no GitHub
- Precisa de ajuda? Veja [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Última atualização**: Janeiro 2026  
**Próximos passos**: Monitorar, fazer backups, manter atualizado! 🚀
