# 🍕 AeroPizza - Sistema de Delivery Moderno

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/PedroCahelgre/aero-pub)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PedroCahelgre/aero-pub)

Um sistema completo de delivery de pizzas desenvolvido com Next.js 15, TypeScript e tecnologias modernas. Otimizado para deploy em plataformas estáticas como Netlify, Vercel e outras.

## ✨ Features

### 🛒 Cliente
- **Cardápio Digital** com categorias e filtros
- **Carrinho de Compras** interativo com animações
- **Agendamento de Pedidos** com data e hora
- **Checkout Simples** com múltiplas formas de pagamento
- **Acompanhamento de Pedidos** em tempo real
- **Design Responsivo** para todos os dispositivos

### 👨‍💼 Administrativo
- **Painel Admin** completo com autenticação
- **Gestão de Produtos** (CRUD completo)
- **Gestão de Pedidos** com status em tempo real
- **Relatórios Financeiros** e analytics
- **Sistema de Notificações**
- **Upload de Imagens**
- **Backup Automático**

## 🚀 Deploy Rápido

### Netlify (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/PedroCahelgre/aero-pub.git
   cd aero-pub
   ```

2. **Build para produção:**
   ```bash
   npm install
   npm run build:static
   ```

3. **Deploy no Netlify:**
   - Arraste a pasta `out/` para [netlify.com](https://netlify.com)
   - Ou conecte seu repositório GitHub

### Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

### Outras Plataformas

O projeto está configurado para funcionar em:
- ✅ Netlify
- ✅ Vercel  
- ✅ GitHub Pages
- ✅ Surge.sh
- ✅ Firebase Hosting
- ✅ AWS S3 + CloudFront
- ✅ DigitalOcean App Platform
- ✅ Render.com

> 📖 **Guia completo:** Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** com App Router
- **TypeScript 5** para type safety
- **Tailwind CSS 4** para estilização
- **shadcn/ui** componentes premium
- **Framer Motion** para animações
- **Zustand** para state management
- **TanStack Query** para server state

### Backend (Modo Desenvolvimento)
- **Node.js** com TypeScript
- **Prisma ORM** com SQLite
- **Socket.IO** para real-time
- **NextAuth.js** para autenticação

### Deploy Estático
- **Next.js Static Export**
- **Dados Mock** para APIs
- **Imagens Otimizadas**
- **SEO Ready**

## 📦 Scripts Úteis

```bash
# Desenvolvimento
npm run dev                 # Servidor de desenvolvimento
npm run build              # Build de produção
npm run build:static       # Build estático para deploy
npm run start:static       # Testar build estático localmente

# Banco de dados (desenvolvimento)
npm run db:seed           # Popular banco com dados
npm run db:reset          # Resetar banco
npm run db:generate       # Gerar Prisma Client

# Qualidade
npm run lint              # Verificar código
npm run lint:fix          # Corrigir automaticamente
npm run type-check        # Verificar tipos TypeScript
npm run clean             # Limpar caches
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
# Desenvolvimento
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="5512992515171"

# Produção (configurar na plataforma de deploy)
NEXT_PUBLIC_BASE_URL="https://seu-dominio.netlify.app"
NODE_ENV="production"
```

### Admin Access

- **Email:** `comerciochalegre@gmail.com`
- **Senha:** `87168087`

- **Email:** `aeropizza@admin.com`  
- **Senha:** `12345678`

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/                 # Páginas Next.js
│   │   ├── admin/          # Painel administrativo
│   │   ├── cardapio/       # Cardápio
│   │   ├── agendar/        # Agendamento
│   │   └── api/            # APIs (modo dev)
│   ├── components/         # Componentes React
│   │   ├── ui/            # shadcn/ui components
│   │   └── admin/         # Admin components
│   ├── hooks/             # Custom hooks
│   └── lib/               # Utilitários
├── public/                # Assets estáticos
│   ├── pizzas/           # Imagens das pizzas
│   └── bebidas/          # Imagens das bebidas
├── scripts/              # Scripts de automação
└── prisma/               # Schema do banco
```

## 🌐 Funcionalidades Estáticas

Em modo de produção estático, o projeto utiliza:

- **Dados Mock** para produtos e categorias
- **LocalStorage** para carrinho e pedidos
- **Formulários Simulados** para checkout
- **Interface Completa** do painel admin (demonstração)

## 📱 Features Técnicas

### Performance
- ⚡ **Static Site Generation** para carregamento instantâneo
- 🖼️ **Imagens Otimizadas** com WebP e lazy loading
- 🗜️ **Minificação** automática de CSS/JS
- 📦 **Code Splitting** inteligente
- 🚀 **CDN Ready** para distribuição global

### SEO
- 🔍 **Meta Tags** otimizadas
- 📊 **Sitemap.xml** automático
- 🤖 **Robots.txt** configurado
- 📱 **Mobile-First** design
- ♿ **Acessibilidade** WCAG 2.1

### Segurança
- 🔒 **Headers** de segurança configurados
- 🛡️ **XSS Protection**
- 🔐 **CSRF Protection**
- 🚫 **Content Security Policy**

## 🎨 Customização

### Cores e Tema

As cores principais estão definidas no Tailwind:

```css
/* Amarelo principal */
--primary: #fbbf24;
--primary-foreground: #000000;

/* Fundo escuro */
--background: #000000;
--foreground: #ffffff;
```

### Logo e Imagens

Substitua os arquivos em `public/`:
- `logo.svg` - Logo principal
- `pizzas/` - Imagens das pizzas
- `bebidas/` - Imagens das bebidas

### Textos e Conteúdo

Edite os textos nos componentes:
- `src/app/page.tsx` - Página inicial
- `src/components/Navbar.tsx` - Navegação
- `src/lib/mock-data.ts` - Dados estáticos

## 🔄 Modo Desenvolvimento vs Produção

### Desenvolvimento (Local)
- ✅ Banco de dados SQLite real
- ✅ APIs funcionais
- ✅ Socket.IO real-time
- ✅ Admin completo

### Produção Estática
- ✅ Dados mock para produtos
- ✅ LocalStorage para persistência
- ✅ Interface admin (demo)
- ✅ Performance máxima

## 🐛 Solução de Problemas

### Build Falha
```bash
# Limpar tudo e reinstalar
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build:static
```

### Imagens Não Aparecem
- Verifique se estão em `public/`
- Use caminhos relativos: `/pizzas/nome.jpg`
- Confirme `unoptimized: true` no next.config.ts

### Rotas Não Funcionam
- Verifique arquivos de redirect
- Confirme configuração da plataforma
- Teste com `npm run start:static`

## 📊 Analytics e Monitoramento

### Google Analytics
Adicione ao `layout.tsx`:
```tsx
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

### Performance
Use ferramentas como:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 📞 Contato

- 📧 **Email:** comerciochalegre@gmail.com
- 📱 **WhatsApp:** (12) 99251-5171
- 🌐 **Site:** aeropizza.com.br

---

## 🎉 Deploy em Produção

**Pronto para colocar no ar?** Siga o [guia de deploy](./DEPLOY.md) detalhado!

### Resumo Rápido

1. **Build:** `npm run build:static`
2. **Deploy:** Arraste pasta `out/` para Netlify
3. **Configure:** Variáveis de ambiente
4. **Teste:** Funcionalidades principais

**Seu site estará no ar em minutos!** 🚀🍕