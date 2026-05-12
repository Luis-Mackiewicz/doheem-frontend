# 🏠 Doheem — Frontend

> Interface web moderna para gestão de repúblicas estudantis: despesas, tarefas e convivência em um só lugar.

---

## 📌 Sobre o Projeto

O **Doheem Frontend** é a interface do usuário da plataforma Doheem, desenvolvida em **Angular**. O design foi criado com base em prototipagem de alta fidelidade no **Figma**, pensado para o público jovem universitário — com foco em usabilidade intuitiva, clareza visual e experiência fluida no dia a dia da república.

---

## 🎨 UI/UX & Design

O projeto nasceu de uma pesquisa voltada ao contexto de TCC, com entrevistas e testes com moradores de repúblicas reais. A interface foi prototipada no **Figma** antes de qualquer linha de código, seguindo os princípios de:

- **Hierarquia visual clara** — o morador encontra o que precisa em até 2 cliques
- **Design responsivo** — compatível com desktop e dispositivos móveis
- **Feedback imediato** — carregamentos, confirmações e erros sempre comunicados visualmente
- **Identidade jovem e acolhedora** — tipografia moderna, paleta de cores amigável e microtransições suaves

---

## 🛠️ Tecnologias

| Tecnologia | Função |
|---|---|
| **Angular 17+** | Framework principal (standalone components) |
| **RxJS** | Gerenciamento de estado reativo e streams de dados |
| **Sass (SCSS)** | Estilização modular com variáveis e mixins |
| **Chart.js** | Gráficos de despesas e visualizações financeiras |
| **HTTP Client** | Integração com a API REST do backend Doheem |
| **Angular Router** | Navegação SPA com guards de autenticação |

---

## 📁 Estrutura de Módulos

```
src/
└── app/
    ├── core/                        # Serviços globais, guards, interceptors
    │   ├── auth.guard.ts
    │   ├── auth.interceptor.ts
    │   └── services/
    │
    ├── shared/                      # Componentes reutilizáveis (botões, modais, cards)
    │
    ├── modules/
    │   ├── AuthModule/              # Login, cadastro e recuperação de acesso
    │   │   ├── login/
    │   │   └── register/
    │   │
    │   ├── FinanceModule/           # Dashboard financeiro e gestão de despesas
    │   │   ├── dashboard/
    │   │   ├── expense-list/
    │   │   ├── expense-form/
    │   │   └── expense-chart/
    │   │
    │   └── TaskModule/              # Quadro Kanban e gerenciamento de tarefas
    │       ├── kanban-board/
    │       ├── task-card/
    │       └── task-form/
    │
    └── app.routes.ts                # Roteamento principal da aplicação
```

---

## ✅ Pré-requisitos

- [Node.js 18+](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli) instalado globalmente

```bash
npm install -g @angular/cli
```

---

## 🚀 Como Rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/doheem-frontend.git
cd doheem-frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

```bash
# src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### 4. Inicie o servidor de desenvolvimento

```bash
ng serve
```

A aplicação estará disponível em `http://localhost:4200`.

---

## ✨ Funcionalidades

### 💰 Dashboard Financeiro
Visão geral das despesas da república com saldo devedor por morador, histórico de pagamentos e alertas de vencimento. Tudo em uma tela, sem precisar calcular na mão.

### 📊 Gráficos de Despesas
Visualizações interativas com **Chart.js** mostrando evolução de gastos por categoria (aluguel, mercado, contas), comparativo mensal e distribuição entre os moradores.

### 🗂️ Quadro Kanban de Tarefas
Interface de arrastar e soltar para gerenciar tarefas domésticas. Colunas configuráveis (A Fazer → Em Andamento → Concluído), atribuição por morador e histórico de conclusões.

### 🔐 Autenticação Segura
Fluxo completo de login e cadastro com JWT armazenado via interceptor HTTP. Guards protegem rotas privadas e redirecionam automaticamente para o login quando a sessão expira.

---

## 🧪 Testes

```bash
# Testes unitários
ng test

# Testes end-to-end
ng e2e
```

---

## 🏗️ Build para Produção

```bash
ng build --configuration production
```

Os arquivos serão gerados na pasta `dist/doheem/`.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

> Desenvolvido como parte de Trabalho de Conclusão de Curso — feito com 💙 para quem mora em república.
