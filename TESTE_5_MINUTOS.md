# 🎯 TESTE RÁPIDO (5 MINUTOS)

Abra uma aba do navegador e siga isto:

---

## PASSO 1 - Cliente faz compra com WhatsApp

**1. Abra em uma aba:**
```
http://127.0.0.1:5500/cliente.html
```

**2. Clique em "Fazer Login ou Cadastro"**

**3. Escolha uma opção:**
- Opção A: Clique em "Google" (recomendado - já configurado)
- Opção B: Clique em "Cadastro Rápido" (sem OAuth)

**4. Preencha perfil + Compre um produto**

**5. NO CARRINHO, preencha assim:**
```
Nome completo:    João Silva
Email:            joao@teste.com
CPF:              12345678901
Telefone:         (11) 98765-4321
WhatsApp 📱:      (11) 98765-4321    ⭐ IMPORTANTE!
Endereço:         Rua Teste, 123
Cidade:           São Paulo
Estado:           SP
```

✅ **Clique em "Confirmar Pedido"**

Você receberá um número de pedido como: `A1B2C3D4`

---

## PASSO 2 - Admin adiciona rastreio

**1. Abra UMA NOVA ABA do navegador:**
```
http://127.0.0.1:5500/admin.html
```

**2. Selecione "Pedidos"**

**3. Clique no seu pedido (o recém criado)**

**4. Na modal que abrir, vá até "Rastreio"**

**5. Digite um código de rastreio válido:**
```
AA123456789BR
```

**6. Clique em "✓ Adicionar Rastreio"**

---

## PASSO 3 - Verificar notificação

**1. Volte à aba do CLIENTE**

**2. Veja se apareceu um número 🔴 vermelho no ícone de pessoa (canto superior)**

**3. Clique no ícone de pessoa**

**4. Clique em "Notificações" ou veja a badge**

✅ **Você deve ver:**
- Título: "📦 SEU PEDIDO FOI DESPACHADO!"
- Código: AA123456789BR
- Link para Correios
- Data da notificação

---

## PASSO 4 - Testar WhatsApp (opcional)

**Quando você clica em "Adicionar Rastreio", o sistema:**

1. ✅ Valida o código (AA123456789BR é válido)
2. ✅ Pega seu WhatsApp que foi salvo (order.customer.whatsapp)
3. ✅ Abre WhatsApp Web com mensagem automática
4. ✅ Cria notificação no seu browser
5. ✅ Atualiza status para "enviado"

Se você tiver WhatsApp Web aberto, aparecerá:
```
*📦 SEU PEDIDO FOI DESPACHADO!*

Olá João,

Seu pedido *A1B2C3D4* acaba de sair para entrega!

*🎯 Código de Rastreio:*
AA123456789BR

*📍 Link para acompanhar:*
https://rastreamento.correios.com.br/app/index.php?codigo=AA123456789BR
```

---

## ✅ CHECKLIST - Tudo funcionando?

- [ ] Backend respondendo (porta 8000)
- [ ] Frontend carregando (porta 5500)
- [ ] Campo WhatsApp 📱 aparecendo no checkout
- [ ] Pedido criado com WhatsApp salvo
- [ ] Admin consegue adicionar rastreio
- [ ] Notificação aparece no cliente
- [ ] WhatsApp abre com mensagem correta

---

## 🐛 Se algo der erro:

### Erro: "Não consigo fazer login com Google"
→ Verifique se backend.env tem GOOGLE_CLIENT_ID e SECRET preenchidos
→ Reinicie os servidores

### Erro: "Campo WhatsApp não aparece"
→ Pressione F5 para recarregar página
→ Limpe cache: Ctrl+Shift+Delete

### Erro: "WhatsApp não envia"
→ Verifique se o número está preenchido
→ Teste com um número com formato: (11) 98765-4321

### Erro: "Notificação não aparece"
→ Veja a aba do cliente com F12 → Console
→ Procure erros em vermelho

---

## 🎓 O que aconteceu por trás dos panos?

```javascript
// 1. Cliente preenche WhatsApp no checkout
checkoutWhatsapp.value = "(11) 98765-4321"

// 2. Pedido criado com este dado
order.customer.whatsapp = "(11) 98765-4321"

// 3. Salvo em localStorage
localStorage.setItem('loja_minimal_orders', JSON.stringify(orders))

// 4. Admin adiciona rastreio
aplicarRastreio(order, "AA123456789BR")

// 5. Sistema chama função WhatsApp
enviarWhatsAppRastreio(order, "AA123456789BR")

// 6. Abre WhatsApp Web
window.open('https://wa.me/5511987654321?text=...', '_blank')

// 7. Cria notificação
enviarNotificacaoRastreioCliente(order, code)

// 8. Badge aparece
atualizarBadgeNotificacoes()
```

---

**Pronto! Seu teste está completo! 🚀**

Se tiver dúvidas, é só chamar.
