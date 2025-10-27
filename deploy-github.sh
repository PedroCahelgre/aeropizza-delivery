#!/bin/bash

# Script para deploy do AeroPizza no GitHub
# Execute este script após criar o repositório no GitHub

echo "🚀 AeroPizza Deployment Script"
echo "=============================="

# Verificar se o repositório remoto está configurado
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Nenhum repositório remoto configurado"
    echo "Por favor, crie um repositório no GitHub e execute:"
    echo "git remote add origin https://github.com/SEU_USERNAME/aeropizza-delivery.git"
    exit 1
fi

echo "✅ Repositório remoto configurado: $(git remote get-url origin)"

# Verificar se há commits para fazer push
if [ -z "$(git log origin/master..master 2>/dev/null)" ]; then
    echo "ℹ️  Não há novos commits para fazer push"
else
    echo "📦 Enviando commits para o GitHub..."
    git push -u origin master
    if [ $? -eq 0 ]; then
        echo "✅ Push realizado com sucesso!"
    else
        echo "❌ Falha no push. Verifique suas credenciais do Git"
        echo "Configure suas credenciais com:"
        echo "git config --global user.name 'Seu Nome'"
        echo "git config --global user.email 'seu@email.com'"
        echo ""
        echo "Ou use um Personal Access Token:"
        echo "git remote set-url origin https://TOKEN@github.com/USERNAME/aeropizza-delivery.git"
        exit 1
    fi
fi

echo ""
echo "🎉 Projeto AeroPizza está pronto para deploy!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse seu repositório no GitHub"
echo "2. Configure as variáveis de ambiente no seu serviço de hosting"
echo "3. Faça o deploy para Vercel, Netlify ou outro serviço"
echo ""
echo "📚 Documentação disponível em:"
echo "- DEPLOY.md - Guia completo de deploy"
echo "- DEPLOY-READY.md - Checklist de preparação"
echo "- PWA_IMPLEMENTATION_SUMMARY.md - Detalhes da PWA"