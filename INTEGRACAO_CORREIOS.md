# 📮 Integração Correios - Documentação Completa

## ✅ O QUE FOI CORRIGIDO

A URL que estava gerando erro foi atualizada para o endpoint correto dos Correios.

### ❌ URL Antiga (ERRADA):
```
https://www.correios.com.br/posvales/sro/leiacodigo/{codigo}
```
**Resultado:** Página não existe (erro 404)

### ✅ URL Nova (CORRETA - PRINCIPAL):
```
https://rastreamento.correios.com.br/objeto/{codigo}
```
**Resultado:** Abre o rastreamento oficial dos Correios

---

## 🔗 URLs ALTERNATIVAS (se a principal não funcionar)

### Opção 2 - URL Antiga Funcional:
```
https://www2.correios.com.br/sistemas/rastreamento/ctrl/ctrlrastreamento.cfm?objetos={codigo}
```

### Opção 3 - URL com JSP:
```
https://www2.correios.com.br/servicosonlineuv/JSP/consultaRastreamento.jsp?Objetos={codigo}
```

---

## 📝 Formato Válido de Código Rastreio

A validação aceita:
- **Padrão:** `XX000000000YY`
- **Exemplo:** `AA123456789BR`
- **Partes:**
  - `AA` = 2 letras maiúsculas (início)
  - `123456789` = 9 dígitos
  - `BR` = 2 letras maiúsculas (país - Brasil)

### ✅ Códigos Válidos:
- `AA123456789BR`
- `BB987654321BR`
- `CC111222333BR`
- `DD999888777BR`

### ❌ Códigos Inválidos:
- `12345` (muito curto)
- `AA123BR` (dígitos insuficientes)
- `aa123456789br` (minúsculas não aceitadas)
- `AA123456789` (sem país)
- `AA123456789XX` (país inválido)

---

## 🔍 COMO TESTAR

### Passo 1: Admin - Adicionar Rastreio
1. Abra Admin: `http://localhost:8000/admin.html`
2. Vá para "Pedidos"
3. Clique em um pedido
4. Clique em "Adicionar Rastreio"
5. Digite: `AA123456789BR`
6. Clique em "Salvar"

### Passo 2: Verificar URL
1. No modal do pedido, veja o rastreio
2. Clique no link "🔗 Acompanhar na Correios"
3. Deve abrir: `https://rastreamento.correios.com.br/objeto/AA123456789BR`

### Passo 3: Cliente - Ver Rastreio
1. Abra Cliente: `http://localhost:8000/cliente.html`
2. Vá para "Meus Pedidos"
3. Procure pelo pedido
4. Veja o rastreio com link
5. Clique para testar

---

## 💾 Onde as URLs São Geradas

### File: `admin.js` (Linha 788)
```javascript
order.tracking.url = `https://rastreamento.correios.com.br/objeto/${code}`;
```

### File: `teste_interface.html` (Linha 452)
```javascript
const trackingUrl = 'https://rastreamento.correios.com.br/objeto/' + trackingCode;
```

### File: `TESTE_COMPLETO.js` (Linha 205)
```javascript
pedidoTeste.tracking.url = `https://rastreamento.correios.com.br/objeto/${codigoRastreioTeste}`;
```

---

## 🚀 PRÓXIMAS MELHORIAS (Opcional)

### 1. API dos Correios (Autenticação)
Se precisar de integrações mais robustas:
- Requer credenciais da plataforma Correios
- Permite rastreamento em tempo real
- Documentação: https://www.correios.com.br/

### 2. Mock de Dados
Para testes sem código real dos Correios:
- Criar dados simulados de rastreamento
- Backend responde com progresso falso
- Útil para development

### 3. Webhooks
Para sincronização via API:
- Correios envia atualizações
- Sistema atualiza status automaticamente
- Mais profissional

---

## ✅ STATUS ATUAL

- [x] URL corrigida para endpoint correto
- [x] Validação de formato funcionando
- [x] Link clicável para Correios
- [x] Sincronização Cliente ↔ Admin
- [x] Histórico de rastreamento armazenado
- [x] Tests automatizados passando
- [ ] API real dos Correios (futuro)

---

## 📊 Estrutura de Dados de Rastreio

```javascript
tracking: {
  code: "AA123456789BR",           // Código validado
  url: "https://rastreamento...",  // Link para Correios
  carrier: "Correios",             // Transportadora
  history: [                        // Histórico de mudanças
    {
      status: "enviado",
      timestamp: "2026-02-18T...",
      message: "Rastreio adicionado..."
    }
  ]
}
```

---

## 🔧 COMO ALTERNAR URLs

Se a principal não funcionar, edite o arquivo `admin.js` na linha 788:

**Opção Principal (RECOMENDADA):**
```javascript
order.tracking.url = `https://rastreamento.correios.com.br/objeto/${code}`;
```

**Opção Alternativa 2:**
```javascript
order.tracking.url = `https://www2.correios.com.br/sistemas/rastreamento/ctrl/ctrlrastreamento.cfm?objetos=${code}`;
```

**Opção Alternativa 3:**
```javascript
order.tracking.url = `https://www2.correios.com.br/servicosonlineuv/JSP/consultaRastreamento.jsp?Objetos=${code}`;
```

---

## 🎯 RESUMO

✅ **Sistema está integrado com os Correios**
- Formato de código validado (regex)
- URL corrigida para o endpoint real
- Link funcional para acompanhamento
- Sincronização em tempo real entre Cliente e Admin
- Histórico de rastreio mantido

🚀 **Pronto para produção com rastreamento completo!**
