# 🤝 Guia de Contribuição

Obrigado por se interessar em contribuir com o Hanami Analytics! Este guia explicará como colaborar com o projeto.

---

## 🎯 Tipos de Contribuição

### **1. Correção de Bugs**
Encontrou um problema? Abra uma issue ou PR!

### **2. Novas Features**
Ideias de funcionalidades? Discuta em uma issue primeiro.

### **3. Documentação**
Melhorar docs é tão valioso quanto código!

### **4. Testes**
Aumentar cobertura de testes é bem-vindo.

### **5. Performance**
Otimizações e melhorias de performance são bem-vindas.

---

## 📋 Antes de Começar

### **Verificar Issues Existentes**

1. Vá a [GitHub Issues](https://github.com/renaneliakim1/analyze-joy-hub/issues)
2. Procure por palavras-chave do seu problema
3. Se não encontrar, crie uma nova issue

### **Discutir Mudanças Grandes**

Para features grandes ou mudanças arquiteturais:

1. Abra uma **Discussion** ou **Issue**
2. Explique a motivação e design
3. Aguarde feedback antes de implementar

---

## 🔧 Configuração de Desenvolvimento

### **1. Fork do Repositório**

```bash
# Clique "Fork" no GitHub
```

### **2. Clone Seu Fork**

```bash
git clone https://github.com/SEU-USUARIO/analyze-joy-hub.git
cd analyze-joy-hub
```

### **3. Adicione Upstream**

```bash
git remote add upstream https://github.com/renaneliakim1/analyze-joy-hub.git
```

### **4. Setup Local**

```bash
# Backend
cd api
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend  
cd frontend
npm install
```

### **5. Rode Testes**

```bash
# Backend (se houver testes)
cd api
pytest

# Frontend (se houver testes)
cd frontend
npm test
```

---

## 🌿 Branch Strategy

### **Criar Nova Branch**

```bash
# Atualize upstream
git fetch upstream
git rebase upstream/main

# Crie branch com nome descritivo
git checkout -b feature/nome-descritivo
# ou
git checkout -b bugfix/descricao-bug
```

### **Nomes de Branch**

```
feature/     → Nova feature
bugfix/      → Correção de bug
docs/        → Documentação
refactor/    → Refatoração
perf/        → Performance
test/        → Testes
```

### **Exemplos**

```bash
git checkout -b feature/dark-mode-toggle
git checkout -b bugfix/filtro-data-quebrado
git checkout -b docs/melhorar-readme
```

---

## 💾 Commitando Código

### **Estilo de Commit**

```
<tipo>: <assunto curto>

<descrição opcional>

Fixes #123  # Referência à issue
```

### **Tipos**

```
feat:      Nova feature
fix:       Correção de bug
docs:      Documentação
style:     Formatação (sem lógica)
refactor:  Refatoração
perf:      Melhoria de performance
test:      Testes
chore:     Manutenção
```

### **Exemplos**

```bash
git commit -m "feat: adicionar filtro por região"
git commit -m "fix: corrigir cálculo de KPI"
git commit -m "docs: melhorar INSTALLATION.md"
git commit -m "perf: otimizar query de vendas"
```

### **Boas Práticas**

- ✅ Commits pequenos e focados
- ✅ Mensagens claras em português
- ✅ Referenciar issues (#123)
- ✅ Um commit por feature
- ❌ Evitar commits muito grandes
- ❌ Não misturar features em um commit

---

## 🔄 Atualizando com Upstream

Antes de criar PR, sincronize com main:

```bash
# Fetch upstream
git fetch upstream

# Rebase sua branch
git rebase upstream/main

# Se houver conflitos, resolva e continue
git add .
git rebase --continue

# Force push (apenas em sua branch)
git push origin seu-branch --force
```

---

## 📤 Criando Pull Request

### **1. Push Sua Branch**

```bash
git push origin feature/seu-nome
```

### **2. Abra PR no GitHub**

Clique "Compare & pull request"

### **3. Preencha Template**

```markdown
## Descrição
Breve descrição do que foi feito

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Mudança em docs
- [ ] Refatoração
- [ ] Performance

## Relacionado a Issue
Fixes #123

## Como Testar
Passos para testar a mudança

## Checklist
- [ ] Código segue style guide
- [ ] Testes passam
- [ ] Docs atualizadas
- [ ] Sem console.log/print deixado
```

### **4. Aguarde Review**

- Mantenedor vai revisar
- Pode pedir mudanças
- Uma vez aprovado, será merged!

---

## ✅ Checklist Antes de Submeter PR

### **Código**

- [ ] Funciona localmente
- [ ] Sem bugs óbvios
- [ ] Sem console.log em produção
- [ ] Sem código comentado/morto
- [ ] Segue estilo do projeto

### **Testes**

- [ ] Testes existentes passam
- [ ] Novos testes adicionados (se aplicável)
- [ ] Cobertura não diminui

### **Documentação**

- [ ] README.md atualizado (se necessário)
- [ ] Docs em `/docs` atualizadas
- [ ] Comentários adicionados em código complexo
- [ ] JSDoc/docstrings adicionadas

### **Git**

- [ ] Branch atualizada com upstream/main
- [ ] Commits com mensagens claras
- [ ] Sem commits desnecessários (amend se necessário)

---

## 🚨 Problemas Comuns

### **Conflito de Merge**

```bash
# Seu branch ficou desatualizada
git fetch upstream
git rebase upstream/main

# Resolva conflitos manualmente
# Depois:
git add .
git rebase --continue
git push origin seu-branch --force
```

### **Preciso adicionar mais commits**

```bash
# Faça mais mudanças
git add .
git commit -m "adicionar mais testes"

# Push novamente
git push origin seu-branch
```

### **Commitei na branch errada**

```bash
# Crie nova branch a partir do commit certo
git checkout -b nova-branch
git checkout main
git reset --hard HEAD~1  # Desfaz commit em main
```

---

## 📊 Estrutura de Arquivos

Respeite a estrutura existente:

```
frontend/src/
├── components/          # Componentes React
│   ├── dashboard/      # Componentes de aba
│   ├── charts/         # Componentes de gráfico
│   └── ui/             # Componentes UI genéricos
├── hooks/              # Hooks customizados
├── types/              # Tipos TypeScript
├── utils/              # Utilitários
└── pages/              # Páginas

api/
├── main.py             # Endpoints
└── data_validator.py   # Validação
```

---

## 🎨 Estilo de Código

### **Frontend (TypeScript/React)**

```typescript
// ✅ Bom
const Dashboard = ({ data, onFilter }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Efeito bem nomeado
  }, [data]);
  
  return <div>{...}</div>;
};

// ❌ Ruim
function dashboard({d, f}) {
  let l = false;
  // Sem comentários
  return <div></div>;
}
```

### **Backend (Python)**

```python
# ✅ Bom
def validate_sales_data(df: pd.DataFrame) -> ValidationReport:
    """Valida estrutura de dados de vendas."""
    errors = []
    
    if df.empty:
        errors.append("DataFrame vazio")
    
    return ValidationReport(errors=errors)

# ❌ Ruim
def validate(d):
    # Pouco descritivo
    if len(d) == 0:
        return "erro"
```

### **Formatação**

- **Frontend**: ESLint já configurado, rode `npm run lint`
- **Backend**: Use `black` e `isort`

```bash
pip install black isort
black api/
isort api/
```

---

## 🧪 Testes

### **Frontend**

```bash
cd frontend
npm test
npm run test:coverage
```

### **Backend**

```bash
cd api
pytest
pytest --cov=. --cov-report=html
```

### **Escrevendo Testes**

```typescript
// Frontend test example
describe("Dashboard", () => {
  test("deve renderizar 6 abas", () => {
    render(<Dashboard data={mockData} />);
    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
  });
});
```

```python
# Backend test example
def test_validate_empty_dataframe():
    df = pd.DataFrame()
    report = validate_sales_data(df)
    assert not report.is_valid
    assert "vazio" in report.errors[0]
```

---

## 📚 Recursos Úteis

### **Documentação**

- [React Docs](https://react.dev)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Git/GitHub**

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🏆 Reconhecimento

Todos que contribuem são reconhecidos:

1. Listados em CONTRIBUTORS.md
2. Mencionados em releases
3. Recebem badge de contributor no GitHub

---

## ❓ Dúvidas?

- Abra uma **Discussion**
- Pergunte em uma **Issue**
- Comente em um **PR**

Não tenha medo de perguntar! 😊

---

## 📋 Código de Conduta

Por favor, leia nosso [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) - Todos merecem ser respeitados.

---

## 🚀 Contribuições Bem-Vindas

Especialmente:

- 🐛 Correção de bugs
- ✨ Novas features
- 📚 Melhorias em docs
- 🎨 Melhorias de UI/UX
- ⚡ Otimizações
- 🧪 Testes
- 🌍 Traduções (pt-BR, pt-PT, es, en, etc)
- 📱 Responsividade mobile

---

**Obrigado por contribuir! Você é incrível! 🌟**

---

Última atualização: Janeiro 2026
