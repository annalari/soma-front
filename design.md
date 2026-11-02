# soma — Design

soma é uma aplicação de finanças pessoais em conjunto para quem quer acompanhar as contas da casa, da família e dos projetos da vida real. Plataformas: web/desktop (browser, responsivo) e app móvel (Expo). Língua: português europeu (pt-PT).

Direção visual: inspirada numa página de produto editorial e calma — fundo claro quente, títulos grandes em serifa, painéis escuros arredondados, formas orgânicas em tons creme com ilustrações de linha, mockups de telemóvel, espaçamento generoso. Cores e marca vêm do logótipo da soma. O conteúdo é próprio da soma; nenhum texto da referência é reutilizado.

## Brand & Colors

| Token | Hex | Uso |
|-------|-----|-----|
| teal-900 | #03444A | Logótipo, painéis escuros, texto de marca |
| teal-700 | #0B5A5F | Botões primários, ícones ativos |
| teal-500 | #1B6F73 | Hover, gráficos secundários |
| mint | #94C0A4 | Acento de valor positivo, objetivos, progresso |
| cream | #F1ECDF | Formas de fundo, cartões destacados sobre branco |
| paper | #FBF9F4 | Fundo da página (claro) |
| ink | #13282A | Texto principal |
| muted | #5E6E70 | Texto secundário |
| line | #E3DED1 | Linhas e separadores |
| clay | #C8694A | Despesas / alertas (uso raro) |

Web: variáveis CSS em `packages/web/src/web/styles.css`.
Mobile: `Colors.light` / `Colors.dark` em `packages/mobile/constants/theme.ts`. Modo escuro: fundo #03444A, cartões #0B5A5F, texto #F1ECDF.

## Typography

- **Display**: Fraunces (variável, serifa) — títulos grandes, peso 300–400, linha 1.05.
- **Corpo e UI**: Manrope (variável) — texto, botões, números. Pesos 400, 500, 700.
- Web: `@fontsource-variable/fraunces` e `@fontsource-variable/manrope` importados em `main.tsx`.
- Mobile: `@expo-google-fonts/fraunces` e `@expo-google-fonts/manrope` carregados com `useFonts`; referenciados em `Fonts` de `constants/theme.ts`.
- Números de dinheiro: Manrope com `font-variant-numeric: tabular-nums`.

## Layout & Spacing

- Escala: 4, 8, 12, 16, 24, 32, 48, 72, 120 px. Secções da landing com 120 px verticais.
- Largura máxima de conteúdo: 1120 px; texto de corpo com 360–420 px.
- Títulos de secção grandes à esquerda, ilustração em forma orgânica à direita, alternando.
- Painéis escuros: raio 32 px, padding 72 px.
- Cartões da app: raio 20 px, sem sombra pesada, borda `line`.

## Shapes & Illustration

- Formas orgânicas (blobs) em creme atrás de ilustrações de linha simples.
- Ícones de linha, traço de 1.5 px, na paleta teal: casa (Casa), pessoas (Família), coração (Projetos), folha (Vida real) — alinhados com a marca.

## Pages & Screens

Web
- **Landing** (`packages/web/src/web/pages/index.tsx`) — hero com título em Fraunces e mockup de telemóvel; painel escuro com os três passos (Registe, Partilhe, Planeie); secção "Porque é diferente" com blobs; secção das quatro áreas da vida; CTA "Começar" e rodapé.
- **App — Painel** (`packages/web/src/web/pages/app.tsx`, rota `/app`) — saldo do mês, entradas, saídas, transações recentes, progresso dos objetivos. Layout de duas colunas em desktop.
- **App — Transações** (mesma página, secção) — formulário de nova transação e lista filtrável por categoria.
- **App — Objetivos** (mesma página, secção) — cartões de objetivo com barra de progresso e botão para adicionar valor.

Mobile (`packages/mobile/app/`)
- **Início** (`(tabs)/index.tsx`) — saldo do mês e transações recentes.
- **Transações** (`(tabs)/explore.tsx`, rótulo "Transações") — lista e botão de nova transação.
- **Objetivos** (`(tabs)/goals.tsx`) — cartões de objetivo.

## Key User Flows

1. Abrir a landing → "Começar" → painel da app.
2. Adicionar transação (valor, descrição, categoria, tipo) → o saldo e a lista atualizam-se.
3. Criar objetivo (nome, meta) → adicionar valor poupado → a barra de progresso avança.
4. Filtrar transações por área (Casa, Família, Projetos, Vida real).

## Categories

Casa · Família · Projetos · Vida real. Cada transação pertence a uma destas áreas.

## Architecture

- **API**: oRPC procedures em `packages/web/src/api/routes/` (`transactions.ts`, `goals.ts`), tipados no cliente web e móvel.
- **Base de dados**: Drizzle + Turso. Tabelas `transactions` e `goals`. Valores guardados em cêntimos (inteiros).
- **Estado**: TanStack Query; hooks em `packages/web/src/web/queries/` e em `packages/mobile/queries/`.
- **Autenticação**: não incluída nesta versão. Os dados são de um agregado familiar partilhado. Próximo passo: Google + email/senha.
