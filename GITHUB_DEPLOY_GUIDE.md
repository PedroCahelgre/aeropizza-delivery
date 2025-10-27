# 🚀 Deploy do AeroPizza para GitHub

## Passos para enviar o projeto para o GitHub:

### 1. Criar Repositório no GitHub
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome do repositório: `aeropizza-delivery`
4. Descrição: `🍕 Sistema completo de delivery de pizza com Next.js e PWA`
5. Deixe como público ou privado conforme preferir
6. **Não** inicialize com README, .gitignore ou license
7. Clique em "Create repository"

### 2. Configurar Repositório Remoto
No terminal, execute:

```bash
# Se já tiver um remote configurado, remova primeiro:
git remote remove origin

# Adicione seu repositório (substitua SEU_USERNAME):
git remote add origin https://github.com/SEU_USERNAME/aeropizza-delivery.git
```

### 3. Fazer Push para o GitHub

#### Método A: Com Personal Access Token
1. Vá para Settings > Developer settings > Personal access tokens no GitHub
2. Generate new token com scopes `repo` e `workflow`
3. Copie o token
4. Execute:
```bash
git remote set-url origin https://SEU_TOKEN@github.com/SEU_USERNAME/aeropizza-delivery.git
git push -u origin master
```

#### Método B: Com SSH Key
1. Gere uma chave SSH:
```bash
ssh-keygen -t rsa -b 4096 -C "seu@email.com"
```
2. Adicione a chave pública ao GitHub
3. Use a URL SSH:
```bash
git remote set-url origin git@github.com:SEU_USERNAME/aeropizza-delivery.git
git push -u origin master
```

#### Método C: Com Credenciais Padrão
```bash
git push -u origin master
# Será solicitado usuário e senha do GitHub
# Para senha, use Personal Access Token
```

### 4. Verificar Deploy
Após o push, você deverá ver no GitHub:
- ✅ Todos os arquivos do projeto
- ✅ Histórico de commits completo
- ✅ README.md com documentação

## 📦 Estrutura do Projeto

O projeto inclui:
- **Frontend**: Next.js 15 com App Router
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: APIs com Prisma ORM
- **Database**: SQLite com produtos
- **PWA**: Service Worker + Manifest
- **Admin**: Painel administrativo completo

## 🌐 Deploy para Produção

Após enviar para GitHub, você pode fazer deploy para:

### Vercel (Recomendado)
1. Conecte sua conta GitHub ao Vercel
2. Importe o repositório `aeropizza-delivery`
3. Configure as variáveis de ambiente
4. Deploy automático

### Netlify
1. Conecte GitHub ao Netlify
2. Configure build command: `npm run build`
3. Configure publish directory: `out`
4. Deploy automático

### Outros Serviços
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Variáveis de Ambiente Necessárias

Crie um arquivo `.env.production` com:
```
NEXTAUTH_SECRET=seu-secret-aqui
NEXTAUTH_URL=https://seu-dominio.com
DATABASE_URL=file:./db/production.db
```

## 📋 Checklist Antes do Deploy

- [ ] Todos os commits estão no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Build funciona localmente: `npm run build`
- [ ] Testes passam: `npm run lint`
- [ ] Imagens estão otimizadas
- [ ] PWA está funcional

## 🎉 Após o Deploy

Seu site estará disponível com:
- 🍕 Cardápio digital completo
- 🛒 Sistema de e-commerce funcional
- 📱 PWA instalável
- 🔐 Painel administrativo
- 📊 Relatórios e analytics

---

**Parabéns!** Seu sistema de delivery de pizza está no ar! 🚀