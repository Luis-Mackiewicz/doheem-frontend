# Doheem — Contexto do Projeto

## Visão Geral
Website de gestão financeira e tarefas para estudantes em repúblicas/alojamentos.

## Stack
- Angular 21 (`@angular/build`)
- Tailwind CSS v4
- TypeScript 5.9
- Vitest (testes)
- Fonte: Inter (Google Fonts)

## Cores (via `@theme` em `styles.css`)
- `purple-medium`: #7c3aed
- `purple-dark`: #2e1065
- Branco

## Design System
- Glassmorphism: `bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl`
- Gradientes: `bg-linear-to-br from-purple-dark to-purple-medium`
- Inputs glass: `bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl`
- Hierarquia de texto: branco com opacidade (100% → 70% → 50% → 40%)

## Regras (ai.md)
1. Apenas roxo médio, roxo escuro e branco
2. Só Tailwind CSS (sem CSS customizado)
3. Fonte Inter em tudo
4. Hierarquia de texto
5. Design glassmorphism
6. Consistência visual entre telas
7. Gradiente com `bg-linear-` (Tailwind v4)
8. Não commitar sem perguntar
9. Preferir porcentagem e rem ao invés de pixel

## Estrutura de Componentes

### `src/app/`
| Componente | Arquivo | Descrição |
|---|---|---|
| App | `app.ts` | Header + `<router-outlet />` |
| HomePage | `home/home.ts` | Hero com glass card (💰📋) + CTAs |
| HeaderComponent | `header/header.ts` | Header fixo glassmorphism com logo + "Doheem" |
| ButtonComponent | `button/button.ts` | Botão reutilizável: `variant="solid\|outline"`, `type="link\|submit\|button"`, `label`, `href` |
| CardComponent | `card/card.ts` | Container glassmorphism puro (sem título) |
| RegisterPage | `register/register.ts` | Formulário de registro: nome, email, senha, confirmar, Google |
| (LoginPage) | — | Ainda não criada |

### Rotas (`app.routes.ts`)
- `path: ''` → HomePage
- `path: 'register'` → RegisterPage

## Comandos
- `npm start` — dev server (port 4200)
- `npm run build` — build produção
- `npm test` — rodar testes

## Últimos Commits (branch feat/auth)
1. `5c83b99` — fix: ButtonComponent com @Input label (resolve ng-content)
2. `f83b9dc` — feat: register page, card, home extract
3. `5f70f95` — feat: landing page glassmorphism

## Pendências
- [ ] Tela de Login (rota `/login`)
- [ ] Lógica de formulários (submit real)
- [ ] Integração com backend/API
- [ ] Autenticação Google OAuth
