# 🚀 Guia de Deploy - AeroPizza

Este guia completo explica como fazer o deploy do seu site AeroPizza em diversas plataformas de hospedagem.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Build Estático](#build-estático)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [GitHub Pages](#github-pages)
- [Surge.sh](#surgesh)
- [Firebase Hosting](#firebase-hosting)
- [Outras Plataformas](#outras-plataformas)
- [Configurações Pós-Deploy](#configurações-pós-deploy)
- [Solução de Problemas](#solução-de-problemas)

## 🔧 Pré-requisitos

Antes de fazer o deploy, verifique:

1. **Node.js 18+** instalado
2. **Git** configurado
3. **Conta** na plataforma de hospedagem escolhida
4. **Variáveis de ambiente** configuradas

### Variáveis de Ambiente

Copie `.env.production.example` para `.env.production` e configure:

```bash
# URL base do seu site
NEXT_PUBLIC_BASE_URL="https://seu-dominio.netlify.app"

# Número do WhatsApp (opcional)
NEXT_PUBLIC_WHATSAPP_NUMBER="5512992515171"

# Ambiente
NODE_ENV="production"
```

## 🏗️ Build Estático

O projeto está configurado para geração de site estático:

```bash
# Instalar dependências
npm install

# Build para produção
npm run build:static

# Testar localmente
npm run start:static
```

O build será gerado na pasta `out/` com todos os arquivos estáticos.

## 🌐 Netlify

### Método 1: Arrastar e Soltar

1. Execute o build:
   ```bash
   npm run build:static
   ```

2. Compacte a pasta `out/`:
   ```bash
   cd out
   zip -r ../aeropizza.zip .
   ```

3. Acesse [netlify.com](https://netlify.com)
4. Arraste o arquivo `aeropizza.zip` para a área de deploy

### Método 2: Git Integration

1. Faça push do seu código para GitHub/GitLab/Bitbucket
2. Conecte seu repositório no Netlify
3. Configure as variáveis de ambiente
4. O Netlify fará o deploy automaticamente

### Configurações Netlify

O arquivo `netlify.toml` já está configurado com:

- ✅ Build command: `npm run build:static`
- ✅ Publish directory: `out`
- ✅ Headers de segurança
- ✅ Cache otimizado
- ✅ Redirects para SPA routing

## ⚡ Vercel

### Método 1: Vercel CLI

1. Instale o Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Faça o deploy:
   ```bash
   vercel --prod
   ```

### Método 2: Dashboard Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Importe seu projeto do GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

### Configurações Vercel

O arquivo `vercel.json` está configurado com:

- ✅ Redirects para SPA routing
- ✅ Tratamento de rotas
- ✅ Páginas de erro

## 📦 GitHub Pages

### Configuração

1. Crie um arquivo `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
       - uses: actions/setup-node@v3
         with:
           node-version: '18'
       - run: npm ci
       - run: npm run build:static
       - uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./out
   ```

2. No seu repositório GitHub:
   - Settings → Pages
   - Source: GitHub Actions

## 🚀 Surge.sh

Deploy rápido e gratuito:

```bash
# Instalar Surge
npm install -g surge

# Fazer build
npm run build:static

# Deploy
cd out
surge --domain aeropizza.surge.sh
```

## 🔥 Firebase Hosting

1. Instale Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Inicialize o projeto:
   ```bash
   firebase init hosting
   ```

3. Configure `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

## 🌟 Outras Plataformas

### AWS S3 + CloudFront

1. Configure um bucket S3 para hosting estático
2. Habilite hosting de site estático
3. Configure CloudFront para CDN
4. Faça upload da pasta `out/`

### DigitalOcean App Platform

1. Conecte seu repositório GitHub
2. Configure como "Static Site"
3. Build command: `npm run build:static`
4. Output directory: `out`

### Render.com

1. Conecte seu repositório
2. Configure como "Static Site"
3. Build command: `npm run build:static`
4. Publish directory: `out`

## ⚙️ Configurações Pós-Deploy

### 1. Atualizar URLs

Após o deploy, atualize:

- `NEXT_PUBLIC_BASE_URL` no painel da hospedagem
- URLs no sitemap.xml
- URLs no robots.txt

### 2. Configurar Domínio Personalizado

1. Configure DNS apontando para a plataforma
2. Atualize `NEXT_PUBLIC_BASE_URL`
3. Configure SSL (geralmente automático)

### 3. Analytics

Adicione Google Analytics ou similar:

```html
<!-- Adicione em src/app/layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

## 🔍 Solução de Problemas

### Build Falha

```bash
# Limpar cache
npm run clean

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Verificar tipos
npm run type-check

# Verificar lint
npm run lint:fix
```

### Rotas Não Funcionam

Verifique se os redirects estão configurados corretamente:
- Netlify: `netlify.toml`
- Vercel: `vercel.json`
- Outros: `_redirects`

### Imagens Não Carregam

Em modo estático, as imagens precisam estar em `public/` e usar `unoptimized: true` no next.config.ts.

### API Não Funciona

Em modo estático, as APIs não funcionam. O projeto usa dados mock para fallback.

## 📊 Performance

### Otimizações Aplicadas

- ✅ Imagens otimizadas
- ✅ Cache configurado
- ✅ Minificação automática
- ✅ Gzip compression
- ✅ CDN ready

### Testar Performance

Use estas ferramentas:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest

## 🔄 CI/CD

### GitHub Actions (Exemplo)

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:static
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1
        with:
          publish-dir: './out'
          netlify-auth-token: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          netlify-site-id: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📱 Teste em Produção

Sempre teste:

1. **Funcionalidades principais**
   - Navegação entre páginas
   - Carrinho de compras
   - Checkout
   - Exibição de produtos

2. **Performance**
   - Tempo de carregamento
   - LCP (Largest Contentful Paint)
   - CLS (Cumulative Layout Shift)

3. **SEO**
   - Meta tags
   - Sitemap.xml
   - Robots.txt

## 🎉 Sucesso!

Seu site AeroPizza está pronto para produção! 🍕✨

### Próximos Passos

1. Monitore o desempenho
2. Configure backups
3. Monitore SEO
4. Colet feedback dos usuários

### Suporte

- 📧 Email: suporte@aeropizza.com
- 💬 WhatsApp: (12) 99251-5171
- 🌐 Site: aeropizza.com.br

---

**Parabéns!** Seu site está otimizado e pronto para receber clientes! 🚀