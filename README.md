# 📦 Loja Desportiva - Projeto Fullstack

Bem-vindo ao repositório da Loja Desportiva, um projeto fullstack de e-commerce construído com as mais modernas tecnologias web. Esta aplicação simula uma loja online completa, desde a navegação e seleção de produtos até ao checkout seguro e gestão de contas de utilizador.

O projeto foi desenvolvido como uma Prova de Aptidão Profissional (PAP), demonstrando a aplicação de conceitos avançados de desenvolvimento web num cenário real.

---

## 🚀 Stack Tecnológica

A arquitetura do projeto assenta numa stack robusta e escalável, garantindo uma experiência de desenvolvimento e utilização de alta qualidade.

### **Frontend & Backend**
- **[Next.js](https://nextjs.org/)**: Framework React para produção, utilizado para renderização do lado do servidor (SSR), geração de sites estáticos (SSG) e criação de APIs.
- **[React](https://reactjs.org/)**: Biblioteca JavaScript para a construção de interfaces de utilizador interativas.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS "utility-first" para a criação rápida de designs personalizados sem sair do HTML.
- **[NextAuth.js](https://next-auth.js.org/)**: Solução completa de autenticação para aplicações Next.js, simplificando o login com credenciais e fornecedores OAuth.

### **Base de Dados**
- **[MySQL](https://www.mysql.com/)**: Sistema de gestão de base de dados relacional, utilizado para armazenar todos os dados da aplicação (utilizadores, produtos, pedidos, etc.).
- **[`mysql2`](https://www.npmjs.com/package/mysql2)**: Cliente MySQL para Node.js, otimizado para performance e com suporte a prepared statements para prevenir SQL injection.

### **Pagamentos**
- **[Stripe](https://stripe.com/)**: Plataforma de pagamentos online que permite processar transações de forma segura e eficiente. A integração é feita via webhooks para garantir a confirmação dos pagamentos.

### **Envio de Emails**
- **[Resend](https://resend.com/)**: Serviço de API para envio de emails transacionais, utilizado para notificações como boas-vindas, confirmação de pedido e redefinição de senha.
- **[React Email](https://react.email/)**: Framework para criar templates de email com React, permitindo a construção de emails bonitos e responsivos de forma componentizada.

### **Ambiente de Desenvolvimento**
- **[Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)**: Ferramentas para criar, implementar e executar aplicações em contentores, garantindo um ambiente de desenvolvimento consistente e isolado.
- **[ESLint](https://eslint.org/)**: Ferramenta de linting para identificar e corrigir problemas no código JavaScript, garantindo a qualidade e a consistência do código.

---

## 📂 Estrutura do Projeto

A organização dos ficheiros segue as melhores práticas do ecossistema Next.js, promovendo a modularidade e a manutenibilidade.

```
progetopap/
├── components/          # Componentes React reutilizáveis (ex: Header, Footer, ProductCard)
│   ├── admin/           # Componentes específicos do painel de administração
│   └── ui/              # Componentes de UI genéricos (ex: botões, diálogos)
├── context/             # Context API do React para gestão de estado global (ex: Carrinho, Favoritos)
├── db/                  # Scripts SQL para a base de dados
│   ├── schema.sql       # Definição da estrutura de todas as tabelas
│   └── seed.sql         # Script para popular a base de dados com dados de teste
├── emails/              # Templates de email criados com React Email
├── lib/                 # Funções utilitárias, hooks personalizados e configurações
│   ├── auth.js          # Configuração do NextAuth.js
│   ├── conectarDB.js    # Função para conectar à base de dados MySQL
│   └── utils/           # Funções auxiliares genéricas
├── pages/               # Sistema de rotas baseado em ficheiros do Next.js
│   ├── api/             # Endpoints da API (backend)
│   ├── admin/           # Páginas do painel de administração
│   └── ...              # Páginas públicas da aplicação (home, produtos, perfil, etc.)
├── public/              # Ficheiros estáticos (imagens, fontes, etc.)
├── styles/              # Ficheiros de estilo (CSS global, módulos CSS)
├── .env.example         # Ficheiro de exemplo para as variáveis de ambiente
├── docker-compose.yml   # Ficheiro de configuração do Docker Compose
├── next.config.mjs      # Configurações avançadas do Next.js
└── package.json         # Dependências e scripts do projeto
```

---

## 🛠️ Bootstrap da Aplicação (Como Começar)

Siga estes passos para configurar e executar o projeto localmente.

### **Pré-requisitos**
- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/installation) (ou `npm`/`yarn`)

### **Passo a Passo**

1.  **Clonar o Repositório**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd progetopap
    ```

2.  **Configurar Variáveis de Ambiente**
    Copie o ficheiro de exemplo e preencha com as suas credenciais.
    ```bash
    cp .env.example .env
    ```
    Edite o ficheiro `.env` com as chaves das APIs do Stripe e Resend, e defina uma `NEXTAUTH_SECRET`.

3.  **Instalar Dependências**
    ```bash
    pnpm install
    ```

4.  **Iniciar os Contentores Docker**
    Este comando irá construir as imagens e iniciar os serviços da aplicação (Next.js) e da base de dados (MySQL) em segundo plano.
    ```bash
    docker-compose up --build -d
    ```

5.  **Popular a Base de Dados**
    O Docker Compose está configurado para executar automaticamente os scripts `db/schema.sql` e `db/seed.sql` ao iniciar o contentor do MySQL pela primeira vez. Isto cria a estrutura da base de dados e insere os dados de teste.

    Se precisar de repopular a base de dados manualmente, pode executar o seguinte comando:
    ```bash
    docker-compose exec mysql mysql -u root -proot loja_desportiva < db/seed.sql
    ```

6.  **Aceder à Aplicação**
    A loja estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 👨‍💻 Utilizadores de Teste

Para facilitar os testes, a base de dados é populada com os seguintes utilizadores. **A senha para todos é `1234`**.

-   **Administrador**:
    -   **Email**: `admin@example.com`
    -   **NIF**: `500100200`
    -   Este utilizador tem acesso ao painel de administração para gerir produtos, utilizadores e visualizar relatórios.

-   **Utilizadores Comuns**:
    -   **Ana Silva**: `ana.silva@example.com` (NIF: `250100201`)
    -   **Bruno Costa**: `bruno.costa@example.com` (NIF: `250100202`)
    -   **Carla Dias**: `carla.dias@example.com` (NIF: `250100203`, inativa)
    -   **David Martins**: `david.martins@example.com` (NIF: `250100204`)

---

## 📜 Scripts Disponíveis

Pode utilizar os seguintes scripts `pnpm` para gerir a aplicação:

-   `pnpm dev`: Inicia o servidor de desenvolvimento com hot-reloading.
-   `pnpm build`: Compila a aplicação para produção.
-   `pnpm start`: Inicia um servidor de produção (requer `pnpm build` primeiro).
-   `pnpm lint`: Executa o ESLint para verificar a qualidade do código.

---

## 💡 Roadmap e Melhorias Futuras

-   [x] 🛒 Checkout com integração Stripe
-   [x] 📧 Envio de emails transacionais (Boas-vindas, Fatura, Redefinição de Senha)
-   [x] ⚙️ Painel administrativo básico
-   [ ] 📱 Responsividade completa para mobile e tablets
-   [ ] 🧪 Testes automatizados (unitários e E2E com Playwright/Cypress)
-   [ ] 🌐 Suporte a múltiplos idiomas (i18n)
-   [ ] 📤 Upload de imagens para um serviço de armazenamento (ex: Cloudinary)
-   [ ] 🧾 Geração de faturas em formato PDF
-   [ ] 🔐 Políticas de segurança e permissões mais granulares
