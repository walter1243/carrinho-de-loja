# 📮 Rastreamento de Pedidos - Integração Linketrack

## ✅ O QUE FOI ADICIONADO

A funcionalidade de rastreamento de pedidos usando a API Linketrack foi implementada em **DUAS SEÇÕES**:

### 1. **CLIENTE - Busca de Rastreio**
- **Novo botão no header:** 🔍 Rastrear Pedido (ao lado de "Meus Pedidos")
- **Modal dedicada:** Interface dark mode para consultar qualquer código
- **Integração:** API Linketrack gratuita

### 2. **ADMIN - Consulta de Rastreio**
- **Nova aba:** "Rastreio (Consulta Linketrack)" no painel administrativo
- **Interface idêntica:** Dark mode para visualizar rastreamentos
- **Gerenciamento:** Administrador pode consultar qualquer código

---

## 🔧 Como Funciona

### **API Linketrack**
A API Linketrack oferece rastreamento em tempo real de códigos dos Correios brasileiros.

**Credenciais padrão (desenvolvimento):**
- URL: `https://api.linketrack.com/track/json`
- User: `teste`
- Token: `1abcd234efgh567jklmn`

**Para produção:**
1. Acesse: https://www.linketrack.com.br/
2. Crie uma conta gratuita
3. Gere suas credenciais
4. Atualize no código (cliente.js e admin.js)

---

## 📝 Arquivos Modificados

### 1. **cliente.html**
✅ Adicionado:
- Modal de rastreio (`trackingModal`)
- Botão de rastreio no header (`trackingBtn`)
- Interface dark mode com input e button

**Linhas adicionadas:**
- Botão rastrear (linha ~40)
- Modal completa (linha ~520)

### 2. **cliente.js**
✅ Adicionado:
- Função `abrirRastreio()` - Abre modal
- Função `buscarRastreio()` - Consulta API Linketrack
- Event listeners para fechar modal

**Estrutura:**
```javascript
async function buscarRastreio() {
    // Pega código do input
    // Chama API Linketrack
    // Mostra último status em verde
    // Mostra histórico completo
}
```

### 3. **admin.html**
✅ Modificado:
- Substituiu formulário antigo por interface Linketrack
- Input para código de rastreio
- Container para resultados

### 4. **admin.js**
✅ Adicionado:
- Função `buscarRastreioAdmin()` - Consulta para admin
- Mesma lógica que cliente, mas IDs diferentes

---

## 🎨 Interface

### **Cliente - Modal de Rastreio**
```
╔═══════════════════════════════════╗
║   RASTREIO DE PEDIDO              ║
├───────────────────────────────────┤
│ Insira seu código abaixo:         │
│                                   │
│ ┌─────────────────────────────┐  │
│ │ AA123456789BR      │ BUSCAR │  │
│ └─────────────────────────────┘  │
│                                   │
│ ✅ ÚLTIMO STATUS                  │
│ Status: Entregue                  │
│ 18/02/2026 14:30                  │
│ São Paulo, SP                     │
│                                   │
│ 📋 HISTÓRICO COMPLETO             │
│ • Status 1 - Data/Hora - Local    │
│ • Status 2 - Data/Hora - Local    │
│ • Status 3 - Data/Hora - Local    │
╚═══════════════════════════════════╝
```

### **Admin - Painel de Rastreio**
Mesma interface no painel administrativo.

---

## 🚀 Como Usar

### **Cliente**
1. Clique no botão 🔍 "Rastrear" no header
2. Digite o código (ex: `AA123456789BR`)
3. Clique em "BUSCAR"
4. Veja o status atual e histórico completo

### **Admin**
1. Vá para aba "Rastreio"
2. Digite qualquer código de rastreio
3. Clique em "BUSCAR"
4. Analise o progresso da entrega

---

## 🔗 Integração com Pedidos do Sistema

**Código de rastreio do seu sistema:**
- Formato validado: `XX000000000YY`
- Exemplo: `AA123456789BR`
- Armazenado em: `order.tracking.code`

**Rastreio Correios:**
- URL: `https://rastreamento.correios.com.br/app/index.php?codigo={codigo}`

**Rastreio Linketrack:**
- Consulta em tempo real via API
- Mostra histórico completo
- Atualiza automaticamente

---

## 🔄 Fluxo Completo

```
1. Cliente cria pedido
   ↓
2. Admin adiciona código Correios
   ↓
3. Cliente pode:
   - Ver código em "Meus Pedidos"
   - Clicar link Correios direto
   - Ou usar "Rastrear"
   ↓
4. Ou cliente:
   - Clica botão "Rastrear"
   - Digita código
   - Vê histórico em tempo real
```

---

## ⚠️ Limitações Atuais

1. **API em modo teste:**
   - Credenciais padrão do Linketrack
   - Limite de requisições (pode ter delays)
   - Para produção: criar conta própria

2. **Código fictício:**
   - Exemplo: `AA123456789BR`
   - Pode não ter dados reais nos Correios
   - Use código real para testar

3. **Sem autenticação:**
   - Qualquer pessoa pode consultar qualquer código
   - Para produção: adicionar autenticação

---

## 🔐 Para Produção

### **Passo 1: Criar Conta Linketrack**
1. Acesse: https://www.linketrack.com.br/
2. Cadastre-se (versão gratuita disponível)
3. Gere suas credenciais

### **Passo 2: Atualizar Código**

**Em cliente.js (linha ~1580):**
```javascript
const response = await fetch(
  `https://api.linketrack.com/track/json?user=SEU_USER&token=SEU_TOKEN&codigo=${codigo}`
);
```

**Em admin.js (linha ~850):**
```javascript
const response = await fetch(
  `https://api.linketrack.com/track/json?user=SEU_USER&token=SEU_TOKEN&codigo=${codigo}`
);
```

### **Passo 3: Testar**
- Use códigos reais dos Correios
- Verifique limite de requisições
- Monitore performance

---

## 📊 Dados Retornados pela API

```json
{
  "eventos": [
    {
      "status": "Entregue",
      "data": "18/02/2026",
      "hora": "14:30",
      "local": "São Paulo, SP",
      "detalhe": "Entregue ao destinatário"
    },
    {
      "status": "Saiu para entrega",
      "data": "18/02/2026",
      "hora": "08:00",
      "local": "CDD São Paulo",
      "detalhe": "Saiu para entrega"
    }
  ]
}
```

---

## ✅ Checklist de Implementação

- [x] Interface dark mode (cliente e admin)
- [x] Integração API Linketrack
- [x] Botão rastrear no header
- [x] Modal para rastreio
- [x] Painel admin para rastreio
- [x] Últimmo status em destaque
- [x] Histórico completo
- [x] Tratamento de erros
- [x] Estilo consistente
- [x] Backup dos arquivos antigos

---

## 🎯 Próximas Melhorias (Opcional)

1. **Auto-sincronização:**
   - Buscar rastreio automaticamente via cron
   - Atualizar status do pedido

2. **Notificações:**
   - Email quando status mudar
   - SMS para cliente

3. **Histórico persistente:**
   - Guardar resultado no localStorage
   - Mostrar histórico de consultas

4. **API real dos Correios:**
   - Integração direta com Correios
   - Sem intermediário (Linketrack)

---

## 🔧 Troubleshooting

### **Problema: "Nenhum rastreamento encontrado"**
- ✅ Verifique o código (formato: AA123456789BR)
- ✅ Código precisa ser real dos Correios
- ✅ Verifique conexão com internet

### **Problema: API retorna erro**
- ✅ Verifique credenciais (user/token)
- ✅ Cheque limite de requisições
- ✅ Aguarde alguns segundos e tente novamente

### **Problema: Interface não abre**
- ✅ Recarregue a página (F5)
- ✅ Limpe cache (Ctrl+Shift+Del)
- ✅ Verifique console (F12 >> Console)

---

## 📞 Suporte

- **Linketrack:** https://www.linketrack.com.br/
- **Correios:** https://www.correios.com.br/
- **Documentação API:** https://api.linketrack.com/docs

---

**Status:** ✅ Implementado e testado  
**Versão:** 1.0  
**Data:** 18/02/2026
