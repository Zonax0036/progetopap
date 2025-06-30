
# 📦 progetonextjs1

Projeto fullstack utilizando **Next.js**, com autenticação, integração com banco de dados ( MySQL), estilização com **Tailwind CSS** e ambiente containerizado com **Docker Compose**.

---

## 🚀 Tech Stack

**Frontend & Backend:**
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)

**Estilização:**
- Tailwind CSS

**Autenticação e Segurança:**
- next-auth
- bcrypt / bcryptjs

**Banco de Dados:**
- MySQL (via `mysql2`)

**Ferramentas de Desenvolvimento:**
- ESLint
- Prettier
- React Icons

**Ambiente:**
- Docker Compose
- Arquivo `.env` para configuração de variáveis

---

## 📂 Estrutura Principal

```
progetopap/
├── context/             # Context API (ex: Carrinho)
├── pages/               # Rotas da aplicação (Next.js)
├── public/              # Arquivos estáticos
├── styles/              # Estilos globais
├── docker-compose.yml   # Definição dos serviços
├── .env                 # Variáveis de ambiente
├── package.json         # Dependências do projeto
├── next.config.ts       # Configuração personalizada do Next.js
```

---

## 🐳 Docker Compose
```bash
# Iniciar a aplicação (Next.js + MongoDB + MySQL)
docker-compose up --build
```

---

## 🔐 Variáveis de Ambiente (.env)

Exemplo de variáveis disponíveis no arquivo `.env`:

```env
NEXTAUTH_SECRET=your_secret_here
MYSQL_HOST=mysql
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=projeto
```

> ⚠️ Importante: Certifique-se de definir corretamente as credenciais no ambiente de produção.

---

## 🛠️ Como Rodar Localmente

### Pré-requisitos

- Docker e Docker Compose
- Node.js 18+
- pnpm (ou npm/yarn)

### Passo a passo

```bash
# Clonar o repositório
git clone <url-do-repo>
cd progetopap

# Criar o .env baseado no modelo acima
cp .env.example .env

# Instalar dependências
pnpm install

# Rodar localmente (modo dev)
pnpm dev
```

---

## 📜 Scripts Disponíveis

```bash
pnpm dev       # Iniciar o servidor de desenvolvimento
pnpm build     # Gerar build de produção
pnpm start     # Iniciar servidor de produção
pnpm lint      # Verificar padrões de código com ESLint
```

---

## 💡 Melhorias Futuras (Roadmap)

- [ ] 🛒 Ecrã de checkout com integração a gateway de pagamento
- [ ] 📱 Responsividade completa para mobile e tablet
- [ ] 🧪 Testes automatizados (unitários e e2e com Playwright)
- [ ] 🌐 Suporte a múltiplos idiomas (i18n)
- [ ] ⚙️ Painel administrativo para gerenciamento de produtos/usuários
- [ ] 📤 Upload de imagens com armazenamento em nuvem (ex: Cloudinary ou Supabase Storage)
- [ ] 🧾 Geração de faturas PDF
- [ ] 🔐 Políticas de segurança com controle de roles (admin, user, etc.)
