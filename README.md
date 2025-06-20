# 🛍️ Nuvora – E-commerce Moderno

Nuvora é uma aplicação de e-commerce completa, com frontend em React + Vite e backend em NestJS, desenvolvida com foco em performance, organização de código e boas práticas.

---

## 📦 Tecnologias Utilizadas

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- Zustand (gerenciamento de estado)
- React Toastify

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- CORS e cookies para controle de sessão

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/nuvora.git
cd nuvora
````

---

## 🛠️ Configuração

### 2. Instale as dependências

Execute o comando nas pastas `frontend/` e `backend/`:

```bash
npm install
```

---

## 🔐 Variáveis de Ambiente

### 🧠 Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nuvora
JWT_SECRET=sua_chave_jwt_segura
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 🌐 Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:3000
```

---

## 🌱 Populando o Banco de Dados

Após configurar o `.env` do backend, rode:

```bash
npm run generate:seed
```

Esse comando irá gerar as tabelas e popular o banco com dados iniciais (produtos, categorias, etc).

---

## 💻 Rodando a Aplicação

### Backend

```bash
cd backend
npm run start:dev
```

### Frontend

```bash
cd frontend
npm run dev
```

---

## 🧪 Funcionalidades

* Cadastro e login de usuários com persistência via cookies
* Listagem de produtos com suporte a desconto
* Carrinho com persistência no localStorage
* Finalização de pedido e histórico de compras
* Painel do usuário para visualizar pedidos
* Proteção de rotas com autenticação
* Feedback visual com toasts

---

## 🧹 Organização

```
nuvora/
├── backend/
│   ├── src/
│   ├── prisma/
│   └── .env
├── frontend/
│   ├── src/
│   └── .env
```

---

## 📌 Notas Finais

* Certifique-se de que o PostgreSQL está rodando localmente ou configure um banco remoto.
* O frontend depende que o backend esteja em execução.
* As requisições de autenticação usam cookies com `credentials: include`.

---

## 📄 Licença

MIT © 2025 - [LuigiMDev](https://github.com/LuigiMDev)
