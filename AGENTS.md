# Doheem Frontend — AGENTS.md

## Stack
- Angular 21 (`@angular/build`), Tailwind CSS v4, TypeScript 5.9, Vitest
- Fonte: Inter (Google Fonts)
- Backend: Go + PostgreSQL + Redis (`../doheem-backend`)

## Commands
- `npm start` — dev server (port 4200)
- `npm run build` — build produção
- `npm test` — rodar testes (Vitest)
- `npx tsc --noEmit` — type-check
- `../doheem-backend/run.sh` — backend dev

## Design System
- **Cores**: apenas `purple-medium` (#7c3aed), `purple-dark` (#2e1065) e branco (com opacidades)
- **Glassmorphism**: `bg-card border border-theme p-5 shadow-lg shadow-black/10 rounded-2xl`
- **Gradientes**: `bg-linear-to-br from-purple-dark to-purple-medium`
- **Hierarquia texto**: classes `text-primary` (100%), `text-secondary` (70%), `text-muted` (50%)
- Preferir `rem` e porcentagem ao invés de pixel
- Só Tailwind CSS (sem CSS customizado, exceto em `styles.css`)
- Botão reutilizável: `app-button` com `variant="solid|outline"`, `type="link|submit|button"`, `label`, `href`

## Regras de Negócio (Arquitetura Atual)

### Rateio (Split)
- Calculado exclusivamente no backend (`CalculateSplits` com penny distribution)
- `equal` e `some`: backend busca membros via `memberRepo`
- `some`: frontend envia `selected_user_ids`; backend divide igualmente entre eles
- `custom`: frontend envia `splits` com valores; backend só valida soma

### Paginação Financeira (server-side puro)
- Cada página = 1 chamada à API (nunca paginar client-side)
- Filtros como query params: `search`, `my_expenses`, `competence_date_from`, `competence_date_to`, `limit`, `offset`
- Backend retorna `total` via `COUNT(*) OVER()` (uma query, não duas)
- Default limit: 20 (foi alterado de 200 para 20)

### Tarefas (Tasks)
- `is_overdue` e `can_modify` calculados no backend (nunca no frontend)
- Frontend só usa os campos da response (`t.is_overdue`, `t.can_modify`)
- Validações de transição (todo→doing, doing→todo/done, done→doing) no backend

### Notificações
- Rate-limit no backend (`MaxReminders=5`, `MinIntervalDays=3`)
- `CanSendReminder` no backend (não no frontend)
- Busca server-side com `?search=`
- Bulk delete via `DELETE /api/notifications`

## Convenções de Código
- `ChangeDetectionStrategy.OnPush` em todos os componentes de página e cards
- Signals para estado reativo (`signal`, `computed`, `effect`)
- `inject()` em vez de constructor DI
- `takeUntilDestroyed` para unsubscribe
- `@if` / `@for` em vez de `*ngIf` / `*ngFor`
- `[hidden]` substituído por `@if` em modais
- Serviços com `providedIn: 'root'`
- Nomenclatura: `snake_case` nos query params da API, `camelCase` no frontend

## Cache
- Redis para `group_members:{groupID}` com TTL 30s (backend)

## Serviços Importantes
- `GroupStoreService` — store central: `refreshExpenses(limit, offset, search, dateFrom, dateTo, myExpenses)` com debounce 300ms; `fetchAll(id)` carrega group + members + tasks; `normalizedExpenses`, `balanceSummary`, `recentExpenses`, `pendingTasks` computados
- `ExpensesApiService` — chamadas diretas à API de despesas
- `NotificationService` — `setParams(limit, offset, search)`, `clearAll()`, `total` sinal
- `AuthService` — `currentUser()`

## Estrutura de Rotas
- `''` → HomePage
- `'register'` → RegisterPage
- `'login'` → LoginPage
- `'dashboard'` → DashboardPage (protegida)
- `'groups/:id/financeiro'` → FinancialPage

## ⚠️ Regras Importantes
1. Não commitar sem perguntar
2. Não gerar arquivos `.md` (exceto este AGENTS.md ou quando explicitamente solicitado)
3. Não adicionar comentários no código
4. Não usar emojis a menos que o usuário peça
5. Manter respostas concisas (≤4 linhas de texto, salvo quando detalhe é solicitado)
6. Toda regra de negócio pertence ao backend — nunca replicar lógica de rateio, validação de tarefas ou rate-limit no frontend
