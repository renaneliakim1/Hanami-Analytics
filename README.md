# Hanami Analytics

## Project info

A comprehensive dashboard application for data analysis and visualization with FastAPI backend.

## Tecnologias

### Frontend
- Vite + React + TypeScript
- Recharts (gráficos)
- shadcn-ui + Tailwind CSS
- Next Themes (tema escuro/claro)

### Backend (API)
- FastAPI
- Pandas
- Uvicorn

## Como executar o projeto

### 1. Backend (API FastAPI)

```bash
# Navegar para pasta da API
cd api

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Executar API
python main.py
```

A API estará disponível em: http://localhost:8000

Documentação da API: http://localhost:8000/docs

### 2. Frontend (React + Vite)

```bash
# Em outro terminal, navegar para pasta do frontend
cd frontend

# Instalar dependências
npm install

# Executar frontend
npm run dev
```

O frontend estará disponível em: http://localhost:8081

## Estrutura do Projeto

```
analyze-joy-hub/
├── api/                  # Backend FastAPI
│   ├── main.py          # API principal
│   ├── requirements.txt # Dependências Python
│   └── README.md        # Docs da API
├── frontend/            # Frontend React
│   ├── public/         # Arquivos estáticos
│   │   └── vendas_ficticias_10000_linhas.csv
│   ├── src/            # Código React
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Funcionalidades

- 📊 **6 Dashboards**: Visão Geral, Vendas, Produtos, Clientes, Pagamentos, Logística
- 📈 **Gráficos Interativos**: Área, Barras, Pizza com tooltips
- 🌙 **Tema Escuro/Claro**: Alternância automática
- 🖨️ **Impressão**: Geração de relatórios em PDF
- 🚀 **API REST**: Endpoints para todos os dados
- 📝 **10.000 registros**: Dados fictícios de vendas

## API Endpoints

- `GET /` - Informações da API
- `GET /sales` - Vendas (paginado)
- `GET /kpis` - KPIs principais
- `GET /sales-by-month` - Vendas mensais
- `GET /sales-by-category` - Por categoria
- `GET /top-products` - Top produtos
- `GET /customers-by-gender` - Por gênero
- `GET /sales-by-state` - Por estado
- `GET /payment-methods` - Formas de pagamento

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

You can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install frontend dependencies.
cd frontend
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

You can deploy this project to any static hosting service like Vercel, Netlify, or GitHub Pages.

To build for production:

```sh
cd frontend
npm run build
```

The build output will be in the `frontend/dist` folder.
