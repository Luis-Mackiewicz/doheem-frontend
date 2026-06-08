# Doheem

Plataforma de gestão financeira e tarefas para estudantes em repúblicas e alojamentos compartilhados.

## Stack

- Angular 21
- Tailwind CSS v4
- TypeScript 5.9
- Vitest
- Lucide Angular (ícones)
- QRCode (geração de QR code client-side)

## Funcionalidades

- Gerenciamento de grupos com convite via link e QR code
- Controle de despesas com modos de rateio (igual, alguns, personalizado)
- Fluxo de aprovação de pagamentos com upload de comprovante
- Gerenciamento de tarefas com drag-and-drop (estilo Kanban)
- Visão geral de saldos dos moradores
- Histórico financeiro com filtros
- Notificações de dívidas, tarefas e despesas
- Tema claro / escuro
- Layout responsivo (sidebar desktop + navegação inferior mobile)
- Suporte a instalação como PWA
- Máscaras automáticas em campos de CPF, CNPJ, telefone, CEP e data
- Validação de CPF e CNPJ com algoritmos de dígitos verificadores
- Campo unificado de documento (CPF ou CNPJ com detecção automática)

## Como executar

```bash
npm install
npm start
```

Acesse `http://localhost:4200`.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm start` | Iniciar servidor de desenvolvimento (porta 4200) |
| `npm run build` | Build de produção |
| `npm test` | Executar testes |

## Estrutura do projeto

```
src/app/
  components/         Componentes reutilizáveis
    button/
    card/
    header/
    modal-create-group/
    modal-invite-group/
    paginator/
    password-input/
    phone-input/
    search/
    sidebar/

  directives/         Diretivas de máscara
    cpf-mask.directive.ts
    cnpj-mask.directive.ts
    document-mask.directive.ts
    phone-mask.directive.ts
    cep-mask.directive.ts
    date-mask.directive.ts

  pages/              Componentes de cada rota
    balances/
    dashboard/
    financial/
    group/            Gerenciamento de membros
    group-layout/     Sidebar + router-outlet
    groups/           Listagem de grupos
    historical/
    home/
    join-group/       Entrar no grupo via link de convite
    login/
    notifications/
    profile/
    register/
    tasks/            Quadro Kanban de tarefas

  services/           Dados e utilitários
    mock-data.service.ts
    notification-service.ts
    pwa-install-service.ts
    theme-service.ts

  utils/              Utilitários
    validators.ts
```

## Rotas

| Caminho | Página |
|---------|--------|
| `/` | Início |
| `/login` | Login |
| `/register` | Cadastro |
| `/groups` | Lista de grupos |
| `/groups/join/:id` | Entrar no grupo via convite |
| `/groups/:id/dashboard` | Painel do grupo |
| `/groups/:id/financial` | Despesas |
| `/groups/:id/tasks` | Tarefas |
| `/groups/:id/group` | Membros |
| `/groups/:id/balances` | Saldos |
| `/groups/:id/historical` | Histórico de despesas |
| `/groups/:id/notifications` | Notificações |
| `/profile` | Perfil do usuário |

## Design System

- Glassmorphism nos cards (`bg-card backdrop-blur-xl border-theme rounded-3xl`)
- Paleta roxa (médio `#7c3aed`, escuro `#2e1065`)
- Hierarquia de texto: 100% / 70% / 50% / 40% de opacidade
- Fonte: Inter (Google Fonts)
- Temas claro e escuro via variáveis CSS

## Licença

MIT
