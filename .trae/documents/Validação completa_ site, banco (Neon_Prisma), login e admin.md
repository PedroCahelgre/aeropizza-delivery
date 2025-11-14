## Visão Geral
- Verificar que o app Next.js inicia, APIs respondem e o banco Neon/Prisma está sincronizado.
- Validar login/admin e principais funcionalidades de catálogo, pedidos e configurações.
- Avaliar prontidão de produção (autorização server-side, segredos, logs, SSL).

## Preparação
1. Confirmar variáveis em `.env`:
   - `DATABASE_URL` (Neon) — c:\Users\Familia\Videos\aeropizza-delivery\.env:1
   - `NODE_ENV=development` — c:\Users\Familia\Videos\aeropizza-delivery\.env:4
2. Instalar dependências: `npm install`
3. Gerar Prisma: `npm run db:generate`
4. Sincronizar esquema: `npm run db:push`
5. Popular dados: `npm run db:seed` (admins e produtos via bcrypt) — c:\Users\Familia\Videos\aeropizza-delivery\scripts\clean-and-seed.ts

## Banco de Dados
- Testar conexão: `GET /api/test-db` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\test-db\route.ts:4-16 (esperado: `status: 'Database connected'`).
- Health: `GET /api/health` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\health\route.ts:3-4.
- Conferir leitura de produtos/categorias:
  - `GET /api/products` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\products\route.ts
  - `GET /api/categories` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\categories\route.ts

## Inicialização do App
- Iniciar servidor: `npm run dev` (custom server com Socket.IO) — c:\Users\Familia\Videos\aeropizza-delivery\package.json:6; c:\Users\Familia\Videos\aeropizza-delivery\server.ts.
- Acessar `http://127.0.0.1:3000` e navegar:
  - Home — c:\Users\Familia\Videos\aeropizza-delivery\src\app\page.tsx
  - `cardapio`, `checkout`, `order-confirmation` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\**/page.tsx

## Login e Autenticação
- Fluxo atual é custom (sem NextAuth/JWT):
  - Endpoint: `POST /api/auth/login` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\auth\login\route.ts:5-35
  - Fallback permite senha em texto se bcrypt falhar — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\auth\login\route.ts:21-24
  - Persistência em `localStorage` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\login-admin\page.tsx:26-33
- Testar login com credenciais seed:
  - `comerciochalegre@gmail.com / 87168087` — c:\Users\Familia\Videos\aeropizza-delivery\scripts\clean-and-seed.ts:22-48
  - `aeropizza@admin.com / 12345678` — c:\Users\Familia\Videos\aeropizza-delivery\scripts\clean-and-seed.ts:50-72
- Após sucesso, deve redirecionar para `/admin` e guardar admin no storage.

## Área Admin
- Painel: `/admin` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\admin\page.tsx
- Validar abas principais com dados reais:
  - Produtos: `GET /api/admin/products` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\admin\products\route.ts
  - Pedidos: `GET /api/admin/orders` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\admin\orders\route.ts
  - Administradores: `GET/POST /api/admin/admins` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\admin\admins\route.ts
  - PIX: `GET/PUT /api/admin/pix` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\admin\pix\route.ts
- Confirmar guarda de rota client-side — c:\Users\Familia\Videos\aeropizza-delivery\src\components\admin\AdminProtectedRoute.tsx:20-34

## Fluxos do Usuário
- Criar/testar usuário por telefone: `POST /api/users` — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\users\route.ts
- Fluxo de carrinho/checkout com páginas de teste:
  - `src/app/test-checkout`, `src/app/simple-test`, `scripts/test-complete-flow.js`

## Segurança e Prontidão
- Avaliar e, se aprovado, planejar endurecimento:
  - Proteger APIs admin server-side (middleware/verificação de sessão/cookie).
  - Remover fallback de senha em texto — c:\Users\Familia\Videos\aeropizza-delivery\src\app\api\auth\login\route.ts:21-24.
  - Hash para seeds legados (se usar `prisma/seed.ts`) — c:\Users\Familia\Videos\aeropizza-delivery\prisma\seed.ts:149-154.
  - Rotacionar senha Neon e retirar segredos do repositório — c:\Users\Familia\Videos\aeropizza-delivery\.env:1.
  - Limitar CORS e desativar `log: ['query']` em produção — c:\Users\Familia\Videos\aeropizza-delivery\src\lib\db.ts:9-11.

## Critérios de "Pronto para Uso"
- Servidor sobe sem erros, páginas públicas carregam.
- `/api/health` e `/api/test-db` OK; produtos/categorias retornam dados.
- Login admin funciona com credenciais seed e painel exibe módulos.
- Operações admin básicas executam (listar/criar admin, listar produtos, listar pedidos).
- Sem endpoints abertos críticos em produção; segredos fora do código.

Confirma este plano? Após confirmação, executo os testes manuais e relato o status detalhado, corrigindo o que for necessário para atingir os critérios.