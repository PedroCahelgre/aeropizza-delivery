#!/bin/bash

echo "🧪 Iniciando testes automatizados do sistema..."

# Teste 1: Verificar se o servidor está respondendo
echo "📡 Testando conexão com o servidor..."
curl -s http://localhost:3000/api/health > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Servidor online"
else
    echo "❌ Servidor offline"
    exit 1
fi

# Teste 2: Verificar API de produtos
echo "📦 Testando API de produtos..."
PRODUCTS_RESPONSE=$(curl -s http://localhost:3000/api/products)
if [ $? -eq 0 ]; then
    PRODUCT_COUNT=$(echo "$PRODUCTS_RESPONSE" | jq '. | length' 2>/dev/null || echo "unknown")
    echo "✅ API de produtos funcionando ($PRODUCT_COUNT produtos)"
else
    echo "❌ API de produtos falhou"
fi

# Teste 3: Verificar API de usuários
echo "👤 Testando API de usuários..."
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Teste Automatizado",
        "phone": "12992515171",
        "email": "teste_'$(date +%s)'@auto.com",
        "address": "Rua Teste, 123"
    }')

if [ $? -eq 0 ]; then
    USER_ID=$(echo "$USER_RESPONSE" | jq -r '.id' 2>/dev/null || echo "unknown")
    echo "✅ API de usuários funcionando (ID: $USER_ID)"
else
    echo "❌ API de usuários falhou"
fi

# Teste 4: Verificar página principal
echo "🌐 Testando página principal..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Página principal funcionando"
else
    echo "❌ Página principal falhou (HTTP $HTTP_CODE)"
fi

# Teste 5: Verificar página /agendar
echo "🛒 Testando página /agendar..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/agendar)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Página /agendar funcionando"
else
    echo "❌ Página /agendar falhou (HTTP $HTTP_CODE)"
fi

# Teste 6: Verificar página /checkout
echo "📋 Testando página /checkout..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/checkout)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Página /checkout funcionando"
else
    echo "❌ Página /checkout falhou (HTTP $HTTP_CODE)"
fi

echo "🏁 Testes automatizados concluídos!"
echo ""
echo "📊 Resumo:"
echo "1. Abra http://localhost:3000/diagnostic no navegador"
echo "2. Execute os testes interativos"
echo "3. Verifique os resultados no console (F12)"
echo ""
echo "🔍 Para testar manualmente:"
echo "1. Vá para http://localhost:3000/agendar"
echo "2. Adicione itens ao carrinho"
echo "3. Clique em 'Finalizar Pedido'"
echo "4. Abra o console (F12) para ver os logs"