# 🖥️ COMO FUNCIONA O BACKEND - EXPLICAÇÃO COMPLETA

Vou explicar **TUDO** sobre o backend de forma visual e fácil de entender.

---

## 🎯 O QUE É O BACKEND?

O backend é o "coração" do seu sistema. É um **servidor Python** que:
- Recebe requisições do cliente e admin
- Processa login/autenticação
- Gerencia dados
- Integra com serviços externos (Google, WhatsApp, Correios)
- Devolve respostas em JSON

```
┌────────────────┐                ┌──────────────────┐
│  cliente.html  │ ─── pedido ──►  │  backend.main.py │
│  (porta 5500)  │                │  (porta 8000)    │
└────────────────┘                └──────────────────┘
       ↑                                    ↑
       │ ◄─── resposta JSON ────            │
       │                                    │
└────────────────┐                ┌──────────────────┐
│  admin.html    │ ─── pedido ──►  │   Google OAuth   │
│  (porta 5500)  │                │   Mercado Pago   │
└────────────────┘                │   WhatsApp API   │
                                  └──────────────────┘
```

---

## 🏗️ ARQUITETURA: PORQUE 2 PORTAS?

### Por que 2 portas diferentes (5500 e 8000)?

```
PORTA 5500 (Frontend - HTTP simples)
├─ cliente.html
├─ cliente.js
├─ admin.html
├─ admin.js
├─ style.css
└─ Serve ARQUIVOS ESTÁTICOS (HTML, CSS, JS)

PORTA 8000 (Backend - API)
├─ backend/main.py
├─ FastAPI (framework Python)
├─ Recebe requisições HTTP
├─ Processa lógica (OAuth, pagamentos, etc)
└─ Retorna JSON
```

### Como se comunicam?

```
┌─ SEU PC ──────────────────────────────────────────┐
│                                                   │
│  PORTA 5500 (Frontend)                            │
│  ├─ http://127.0.0.1:5500/cliente.html            │
│  │  └─ Cliente vê loja                            │
│  │                                                │
│  └─ http://127.0.0.1:5500/admin.html              │
│     └─ Admin vê painel                            │
│                                                   │
│  Quando cliente clica em "Comprar":               │
│     cliente.js faz uma REQUISIÇÃO via HTTP:       │
│     POST http://127.0.0.1:8000/api/criar-pedido   │
│                                                   │
│  PORTA 8000 (Backend FastAPI)                     │
│  ├─ http://127.0.0.1:8000/api/criar-pedido        │
│  │  └─ Recebe pedido                              │
│  │  └─ Salva em localStorage do navegador         │
│  │  └─ Retorna: {"ok": true, "orderId": "ABC"}   │
│  │                                                │
│  └─ http://127.0.0.1:8000/api/auth/google         │
│     └─ Backend Google OAuth                       │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 🔄 FLUXO COMPLETO: Do Cliente ao Banco de Dados

### Cenário: Cliente compra um produto

```
ETAPA 1: Cliente faz compra
═════════════════════════════════════════════════════
1. Cliente clica em produto na loja
2. cliente.js adiciona ao carrinho
3. Carrinho é guardado em localStorage local
   └─ localStorage = banco de dados do navegador
   └─ Dados: ["product1", "product2"]

ETAPA 2: Cliente vai para checkout
═════════════════════════════════════════════════════
1. Cliente preenche formulário:
   - Nome: João Silva
   - Email: joao@teste.com
   - CPF: 12345678901
   - Telefone: (11) 98765-4321
   - WhatsApp: (11) 98765-4321  ✅
   - Endereço: Rua X, 123
   - Cidade: São Paulo
   - Estado: SP

2. cliente.js valida dados localmente (SEM enviar backend)
   └─ if (!cpf || !phone || !whatsapp || !address || ...)

3. Pedido é criado e salvo em localStorage:
   {
     "id": "A1B2C3D4",
     "uuid": "uuid-1234",
     "customer": {
       "name": "João Silva",
       "email": "joao@teste.com",
       "cpf": "12345678901",
       "phone": "(11) 98765-4321",
       "whatsapp": "(11) 98765-4321",  ✅ AQUI!
       "address": "Rua X, 123",
       "city": "São Paulo",
       "state": "SP"
     },
     "items": [...],
     "shipping": 15.00,
     "total": 114.90,
     "status": "confirmado",
     "timestamp": "2026-02-20T21:30:00",
     "tracking": null
   }

ETAPA 3: Dados no localStorage
═════════════════════════════════════════════════════
localStorage.setItem('loja_minimal_orders', JSON.stringify(orders))

Agora o navegador TEM:
└─ localStorage['loja_minimal_orders'] = [pedido1, pedido2, ...]

ETAPA 4: Admin abre painel
═════════════════════════════════════════════════════
1. Admin abre admin.html na mesma aba (ou outra aba)
2. admin.js lê dados do localStorage
   └─ const orders = JSON.parse(localStorage.getItem('loja_minimal_orders'))
3. Mostra pedidos em tabela

ETAPA 5: Admin clica em pedido
═════════════════════════════════════════════════════
1. admin.js mostra modal com dados do pedido
2. Admin vê o WhatsApp que cliente preencheu ✅

ETAPA 6: Admin adiciona rastreio
═════════════════════════════════════════════════════
1. Admin digita código: AA123456789BR
2. admin.js chama: aplicarRastreio(order, code)
3. Sistema valida código (if /^[A-Z]{2}\d{8}[A-Z]{2}$/)
4. Se válido:
   - Atualiza order.tracking = { code, status, addedAt }
   - Salva em localStorage novamente
   - Chama: enviarWhatsAppRastreio(order, code)
     └─ Usa: order.customer.whatsapp ✅
   - Chama: enviarNotificacaoRastreioCliente(order, code)

ETAPA 7: Notificação enviada
═════════════════════════════════════════════════════
1. Cria objeto notificação:
   {
     "id": "notif-123",
     "titulo": "📦 SEU PEDIDO FOI DESPACHADO!",
     "mensagem": "Seu pedido A1B2C3D4 saiu para entrega",
     "rastreio": "AA123456789BR",
     "timestamp": "2026-02-20T21:35:00",
     "lido": false
   }

2. Salva em localStorage:
   localStorage.setItem('loja_notificacoes_cliente', ...)

3. evento de storage dispara
   └─ Todos os abas/janelas são notificadas ✅
   └─ atualizarBadgeNotificacoes() é chamado
   └─ Badge 🔴 aparece com número de notificações

ETAPA 8: Cliente vê notificação
═════════════════════════════════════════════════════
1. Cliente vê badge 🔴 no profile (canto superior)
2. Clica no profile
3. cliente.js chama mostrarNotificacoesCliente()
4. Modal abre mostrando:
   - Título: "📦 SEU PEDIDO FOI DESPACHADO!"
   - Código: AA123456789BR
   - Link Correios clicável
5. Marca como lido
   └─ Badge desaparece

FLUXO COMPLETO DO DADO:
═════════════════════════════════════════════════════

Cliente                localStorage           Admin
   │                      │                    │
   ├─ Preenche form ─────►│                    │
   │                      │◄── lê dados ───── │
   │                      │                    │
   │                      │                    ├─ Adiciona rastreio
   │                      │◄── salva rastreio ┤
   │                      │                    │
   │◄── notificação ───── │                    │
   │                      │                    │
   └─ Cliente recebe      │                    │
      rastreio via        │                    │
      WhatsApp!           │                    │

```

---

## 💾 ARMAZENAMENTO: COMO TUDO É GUARDADO?

### 1. localStorage (Seu navegador)

**O que é:** Banco de dados local do navegador, no seu PC.

```
Localização: C:\Users\seuuser\AppData\Local\Chrome\User Data\...
Limite: ~5MB por site
Segurança: Só acessa quem está naquele navegador

Estrutura:
┌─ localStorage ──────────────────────────┐
│                                          │
│ loja_minimal_orders                      │
│ ├─ Pedido 1: {id, customer, items, ...}│
│ ├─ Pedido 2: {id, customer, items, ...}│
│ └─ Pedido 3: {id, customer, items, ...}│
│                                          │
│ loja_minimal_customers                   │
│ ├─ Cliente 1: {name, email, items, ...}│
│ ├─ Cliente 2: {name, email, items, ...}│
│ └─ Cliente 3: {name, email, items, ...}│
│                                          │
│ loja_minimal_cart                        │
│ └─ [{product_id, qty}, {...}]            │
│                                          │
│ loja_notificacoes_cliente                │
│ ├─ Notif 1: {titulo, rastreio, ...}    │
│ └─ Notif 2: {titulo, rastreio, ...}    │
│                                          │
│ loja_minimal_current_customer            │
│ └─ {id, name, email, logado: true}      │
│                                          │
└──────────────────────────────────────────┘
```

### Como acessar localStorage (Developer Tools):

```
1. Abra site: http://127.0.0.1:5500/cliente.html
2. Pressione F12 (Developer Tools)
3. Vá para "Application" (Chrome) ou "Storage" (Firefox)
4. Na esquerda, procure "localStorage"
5. Clique em "http://127.0.0.1:5500"
6. Você vê TODAS as chaves

Exemplo:
┌─ localStorage ─────────────────────────────────────┐
│ Key                    Value                        │
├────────────────────────────────────────────────────┤
│ loja_minimal_orders    [{...order...}, {...}]      │
│ loja_minimal_customers [{...customer...}, {...}]   │
│ loja_notificacoes...   [{...notif...}, {...}]      │
└────────────────────────────────────────────────────┘
```

### Por que localStorage e não banco de dados?

```
localStorage:
✅ Rápido (sem internet)
✅ Simples (JSON)
✅ Sem servidor necessário
✅ Perfeito para app local
❌ Limitado a ~5MB
❌ Só funciona em 1 navegador

Banco de dados real (PostgreSQL/MongoDB):
✅ Dados persistentes
✅ Muito espaço
✅ Acesso múltiplos usuários
✅ Mais seguro
❌ Precisa de servidor
❌ Mais complexo
❌ Custa dinheiro
```

**Para seu caso:** localStorage é PERFEITO porque você quer testar localmente!

---

## 🚀 BACKEND (FastAPI): O QUE FAZ?

### backend/main.py

É um servidor Python que:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/auth/providers/status")
def auth_status():
    """Retorna status de OAuth (está ativo?)"""
    return {
        "ok": True,
        "google": {"oauth_configured": True, "mode": "oauth"},
        "facebook": {"oauth_configured": False, "mode": "disabled"},
        "instagram": {"oauth_configured": False, "mode": "disabled"}
    }

@app.get("/api/auth/google")
def google_login():
    """Redireciona para Google para fazer login"""
    # Lógica OAuth
    return RedirectResponse(google_auth_url)

@app.get("/api/auth/google/callback")
def google_callback(code: str):
    """Google redireciona de volta com código"""
    # Lógica: trocar código por token
    # Lógica: buscar dados do usuário
    # Retorna: dados do usuário + token
    return {"user": {...}, "token": "xyz"}
```

### Endpoints (URLs) disponíveis:

```
GET  /api/auth/providers/status
     └─ retorna: quais provedores estão ativados?

GET  /api/auth/google
     └─ redireciona para login Google

GET  /api/auth/google/callback
     └─ Google retorna aqui com seu login

GET  /api/auth/facebook
     └─ redireciona para login Facebook

POST /api/payment/pix
     └─ criar código PIX

POST /api/payment/card
     └─ processar pagamento cartão

POST /api/payment/mercadopago
     └─ integração Mercado Pago

GET  /api/health
     └─ verifica se servidor está vivo
```

---

## 🔌 COMO CLIENTE E ADMIN SE COMUNICAM?

### Cenário: Cliente.js e Admin.js na MESMA aba

```
┌─────────────────────────────────────────┐
│ Navegador Chrome                        │
│ http://127.0.0.1:5500                   │
├─────────────────────────────────────────┤
│                                         │
│ Tab 1: cliente.html + cliente.js        │
│   └─ localStorage: pedidos, clientes    │
│                                         │
│ Tab 2: admin.html + admin.js            │
│   └─ Lê os MESMOS dados de localStorage │
│                                         │
│ Quando cliente.js salva um pedido:      │
│   localStorage.setItem('loja_minimal_orders', ...)
│                                         │
│ Evento "storage" dispara em admin.js:   │
│   window.addEventListener('storage', (e) => {
│     if (e.key === 'loja_minimal_orders') {
│       renderOrders(); // atualiza admin
│     }
│   })                                    │
│                                         │
└─────────────────────────────────────────┘

SÍNCRONO COM EVENTO:
═════════════════════════════════════════════
Tab Cliente          localStorage         Tab Admin
    │                   │                   │
    ├─ novo pedido ─────│                   │
    │                   │                   │
    │                   ├─ evento storage ──┤
    │                   │                   │
    │                   │                   ├─ renderOrders()
    │                   │                   │
    │                   │                   └─ atualiza painel
```

---

## 🌐 MODELO DE DADOS: O QUE CADA COISA ARMAZENA

### 1. CLIENTE (Cliente.js)

```javascript
// localStorage['loja_minimal_customers']
[
  {
    "id": "cust-123",
    "name": "João Silva",
    "email": "joao@teste.com",
    "phone": "(11) 98765-4321",
    "cpf": "12345678901",
    "address": "Rua X, 123",
    "city": "São Paulo",
    "state": "SP",
    "logado": true,
    "loginType": "google" // ou "quick"
  }
]

// localStorage['loja_minimal_current_customer']
{
  "id": "cust-123",
  "name": "João Silva",
  "email": "joao@teste.com",
  "logado": true
}
```

### 2. CARRINHO (Cliente.js)

```javascript
// localStorage['loja_minimal_cart']
[
  {
    "productId": "prod-1",
    "name": "Camiseta",
    "price": 49.90,
    "quantity": 2,
    "image": "camiseta.jpg"
  },
  {
    "productId": "prod-2",
    "name": "Calça",
    "price": 99.90,
    "quantity": 1,
    "image": "calca.jpg"
  }
]
```

### 3. PEDIDOS (Cliente.js + Admin.js)

```javascript
// localStorage['loja_minimal_orders']
[
  {
    "id": "A1B2C3D4",
    "uuid": "uuid-1234-5678-90ab",
    "customer": {
      "name": "João Silva",
      "email": "joao@teste.com",
      "cpf": "12345678901",
      "phone": "(11) 98765-4321",
      "whatsapp": "(11) 98765-4321",  ✅ SALVO AQUI!
      "address": "Rua X, 123",
      "city": "São Paulo",
      "state": "SP"
    },
    "items": [
      {
        "productId": "prod-1",
        "name": "Camiseta",
        "price": 49.90,
        "quantity": 2,
        "subtotal": 99.80
      }
    ],
    "shipping": 15.00,
    "total": 114.90,
    "status": "confirmado",
    "paymentMethod": null,
    "timestamp": "2026-02-20T21:30:00Z",
    "tracking": {
      "code": "AA123456789BR",
      "addedAt": "2026-02-20T21:35:00Z",
      "status": "enviado"
    }
  }
]
```

### 4. NOTIFICAÇÕES (Cliente.js + Admin.js)

```javascript
// localStorage['loja_notificacoes_cliente']
[
  {
    "id": "notif-123",
    "tipo": "rastreio",
    "orderId": "A1B2C3D4",
    "orderUuid": "uuid-1234-5678-90ab",
    "titulo": "📦 SEU PEDIDO FOI DESPACHADO!",
    "mensagem": "Seu pedido A1B2C3D4 acaba de sair para entrega!",
    "rastreio": "AA123456789BR",
    "lido": false,
    "timestamp": "2026-02-20T21:35:00Z"
  }
]
```

---

## 🔐 SEGURANÇA: ONDE COLOCAR SENHAS?

### Dados Sensíveis (NUNCA em frontend):

```
❌ NUNCA em cliente.html/cliente.js:
   - Senhas do banco de dados
   - API Keys privadas
   - Tokens de autenticação (guardar de forma segura)
   - Cupom de pagamento

✅ SEMPRE no backend (.env):
   - GOOGLE_CLIENT_SECRET
   - FACEBOOK_CLIENT_SECRET
   - MP_ACCESS_TOKEN (Mercado Pago)
   - API keys de serviços
```

### Frontend (.html + .js):

```javascript
// SEGURO - cliente não vê
const GOOGLE_CLIENT_ID = "999700917560-...publicável.apps.googleusercontent.com"
// Este é PUBLIC, ok expor

// INSEGURO - não fazer
const API_SECRET = "abc123xyz789"  // ❌ NUNCA!
```

### Backend (main.py):

```python
from dotenv import load_dotenv
import os

load_dotenv()  # Lê .env

GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")  # ✅ SEGURO
# Está em arquivo local, não foi para GitHub
# Só o backend vê
```

---

## 🔄 CICLO DE VIDA DE UM DADO

```
CLIENTE DIGITA
│
├─ JavaScript valida (client.js)
│  └─ if (!cpf || !email || !phone || ...)
│
├─ Se OK, cria objeto
│  └─ order = { customer: {...}, items: [...] }
│
├─ Salva em localStorage
│  └─ localStorage.setItem('loja_minimal_orders', JSON.stringify([...]))
│
├─ Evento 'storage' dispara
│  └─ Todas as abas são notificadas
│
├─ Admin.js recebe notificação
│  └─ const orders = JSON.parse(localStorage.getItem(...))
│
├─ Admin.js renderiza na tela
│  └─ renderOrders() cria HTML com pedidos
│
├─ Admin vê pedido e adiciona rastreio
│  └─ order.tracking = { code: "AA123456789BR", ... }
│
├─ Salva novamente em localStorage
│  └─ localStorage.setItem('loja_minimal_orders', JSON.stringify([...]))
│
├─ evento 'storage' dispara
│  └─ Cliente é notificado
│
├─ Cria notificação
│  └─ localStorage.setItem('loja_notificacoes_cliente', ...)
│
├─ Badge 🔴 aparece no cliente
│  └─ atualizarBadgeNotificacoes()
│
└─ Cliente clica e vê rastreio ✅
   └─ mostrarNotificacoesCliente()
```

---

## 🚀 QUANDO SUBIR NA INTERNET (PRODUCTION)

### LOCAL (AGORA):

```
┌─ Seu PC ────────────────┐
│                         │
│ Backend (localhost:8000)│
│ Frontend (localhost:5500)
│ localStorage (seu disco)│
│                         │
│ Só você acessa!        │
└─────────────────────────┘
```

### PRODUCTION (VERCEL + Banco de Dados):

```
┌─ Servidor na Nuvem (Vercel) ──────────────┐
│                                            │
│ Backend (api.seu-site.com)                │
│ Frontend (seu-site.com)                   │
│ + PostgreSQL/MongoDB (banco de dados)     │
│                                            │
│ Qualquer um acessa do mundo!              │
│                                            │
│ localStorage ➜ Firebase/PostgreSQL        │
│ (sincroniza com servidor)                 │
└────────────────────────────────────────────┘
```

---

## 📊 RESUMO VISUAL: DOIS SITES, UM BACKEND

```
             ┌─────── SUA REDE ──────────┐
             │                           │
        ┌────▼─────┐            ┌───────▼────┐
        │ Cliente  │            │   Admin    │
        │ 5500     │            │   5500     │
        └────┬─────┘            └────┬──────┘
             │                       │
             │   Ambos leem         │
             │  localStorage         │
             │                       │
             └────────┬─────────────┘
                      │
             ┌────────▼────────┐
             │  localStorage   │
             │                 │
             │ - orders        │
             │ - customers     │
             │ - cart          │
             │ - notifications │
             └─────────────────┘
                      │
             Se houver mudança:
             └─────► comunicam via
                   evento 'storage'
                   (automático!)

             ┌─────── Backend ────────┐
             │ (porta 8000)           │
             │                        │
             │ OAuth Google ✅        │
             │ Mercado Pago ✅        │
             │ WhatsApp ✅            │
             │ Correios ✅            │
             └────────────────────────┘
             (opcional, não é obrigatório
              para teste local)
```

---

## ✅ CHECKLIST: ENTENDIMENTO COMPLETO

- [x] Backend = servidor Python que processa requisições
- [x] Frontend = HTML+CSS+JS que você vê no navegador
- [x] 2 portas = 1 para arquivos (5500), 1 para API (8000)
- [x] localStorage = banco de dados do navegador (seu PC)
- [x] Cliente e Admin veem os MESMOS dados via localStorage
- [x] Quando um modifica, o outro é notificado (evento 'storage')
- [x] Senhas/API Keys vão no backend, NUNCA no frontend
- [x] No production, localStorage vira um banco de dados real
- [x] Dois sites rodando ao mesmo tempo = abas diferentes
- [x] Dados sincronizam automaticamente entre abas

---

## 🎓 ANALOGIA REAL

```
Seu e-commerce é como um:

LOCAL (AGORA):
===============
┌─────────────────┐
│  Loja Física    │
│                 │
│ Vendedor (admin)│  ◄─ Você gerenciando
│ lê notas de     │     manualmente
│ venda em        │
│ um caderno      │
│                 │
│ Cliente vê a    │
│ nota também     │
│ (localStorage)  │
│                 │
│ Dados no        │
│ caderno físico  │
│ (seu PC)        │
└─────────────────┘

PRODUCTION (DEPOIS):
====================
┌─────────────────┐
│  Loja Online    │
│                 │
│ Vendedor (admin)│  ◄─ Dashboard web
│ gerencia painel │
│ web             │
│                 │
│ Cliente vê      │
│ notificação     │
│ em tempo real   │
│                 │
│ Dados em banco  │
│ de dados        │
│ (servidor)      │
└─────────────────┘

```

---

**Pronto! Agora você entende TODA a arquitetura! 🚀**

Se tiver dúvidas específicas, me avisa!
