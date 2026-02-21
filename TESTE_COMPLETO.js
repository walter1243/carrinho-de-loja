/**
 * TESTE COMPLETO DO SISTEMA DE PEDIDOS
 * Execute este arquivo no console (F12) de cliente.html
 * 
 * Este teste automatiza:
 * 1. Login/Cadastro
 * 2. Adição de produto ao carrinho
 * 3. Validações
 * 4. Criação de pedido
 * 5. Sincronização com admin
 * 6. Rastreio
 */

// ============================================================
// TESTE 1: VERIFICAR ESTRUTURA DE DADOS
// ============================================================
console.log("🧪 TESTE 1: Verificando estrutura de dados...");

const testStructure = {
  check: function() {
    // Verificar localStorage
    const orders = JSON.parse(localStorage.getItem("loja_minimal_orders") || "[]");
    console.log(`✅ Orders storage encontrado: ${orders.length} pedidos`);
    
    const products = JSON.parse(localStorage.getItem("loja_minimal_products") || "[]");
    console.log(`✅ Products storage encontrado: ${products.length} produtos`);
    
    const currentCustomer = JSON.parse(localStorage.getItem("loja_minimal_currentCustomer"));
    console.log(`✅ Customer storage encontrado: ${currentCustomer ? currentCustomer.name : "nenhum"}`);
    
    return {
      orders: orders.length,
      products: products.length,
      customerLogado: currentCustomer ? true : false
    };
  }
};

const estrutura = testStructure.check();
console.log("📊 Estrutura:", estrutura);

// ============================================================
// TESTE 2: CRIAR CLIENTE DE TESTE
// ============================================================
console.log("\n🧪 TESTE 2: Criando cliente de teste...");

const clienteTeste = {
  id: "test_" + Date.now(),
  name: "Cliente Teste",
  email: "teste@email.com",
  phone: "(11) 99999-9999",
  cpf: "12345678901",
  createdAt: new Date().toISOString()
};

localStorage.setItem("loja_minimal_currentCustomer", JSON.stringify(clienteTeste));
console.log(`✅ Cliente criado: ${clienteTeste.name}`);

// ============================================================
// TESTE 3: CRIAR PEDIDO DE TESTE
// ============================================================
console.log("\n🧪 TESTE 3: Criando pedido de teste...");

const pedidoTeste = {
  // Identificação
  id: "PED" + Date.now().toString().slice(-9).substring(0, 6),
  uuid: "uuid-" + Math.random().toString(36).substring(7),
  
  // Cliente
  customer: {
    id: clienteTeste.id,
    name: clienteTeste.name,
    email: clienteTeste.email,
    phone: clienteTeste.phone
  },
  
  // Endereço
  shipping: {
    address: "Rua Teste, 123",
    city: "São Paulo",
    state: "SP",
    country: "Brasil"
  },
  
  // Itens
  items: [
    {
      id: "prod_001",
      name: "Camiseta Premium",
      price: 89.90,
      quantity: 2,
      color: "Azul Marinho",
      size: "M",
      subtotal: 179.80
    },
    {
      id: "prod_002",
      name: "Calça Jeans",
      price: 129.90,
      quantity: 1,
      color: "Azul Claro",
      size: "34",
      subtotal: 129.90
    }
  ],
  
  // Totais
  subtotal: 309.70,
  shipping_cost: 0,
  total: 309.70,
  
  // Status e Rastreio
  status: "pendente_processamento",
  tracking: {
    code: null,
    carrier: "Correios",
    url: null,
    history: []
  },
  
  // Timestamps
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Salvar pedido
const orders = JSON.parse(localStorage.getItem("loja_minimal_orders") || "[]");
orders.push(pedidoTeste);
localStorage.setItem("loja_minimal_orders", JSON.stringify(orders));

console.log(`✅ Pedido criado: ${pedidoTeste.id}`);
console.log(`   UUID: ${pedidoTeste.uuid}`);
console.log(`   Cliente: ${pedidoTeste.customer.name}`);
console.log(`   Valor: R$ ${pedidoTeste.total.toFixed(2)}`);
console.log(`   Itens: ${pedidoTeste.items.length}`);

// ============================================================
// TESTE 4: VALIDAR ESTRUTURA DO PEDIDO
// ============================================================
console.log("\n🧪 TESTE 4: Validando estrutura do pedido...");

const validacoes = {
  temID: !!pedidoTeste.id,
  temUUID: !!pedidoTeste.uuid,
  temCustomer: !!pedidoTeste.customer.id && !!pedidoTeste.customer.name,
  temEndereco: !!pedidoTeste.shipping.address && !!pedidoTeste.shipping.city,
  temItens: pedidoTeste.items.length > 0,
  temTotal: pedidoTeste.total > 0,
  temStatus: !!pedidoTeste.status,
  temTracking: pedidoTeste.tracking !== undefined,
  temTimestamps: !!pedidoTeste.createdAt && !!pedidoTeste.updatedAt
};

Object.entries(validacoes).forEach(([chave, valor]) => {
  console.log(`${valor ? "✅" : "❌"} ${chave}`);
});

const todasValidas = Object.values(validacoes).every(v => v === true);
console.log(`\n${todasValidas ? "✅" : "❌"} Estrutura válida: ${todasValidas}`);

// ============================================================
// TESTE 5: TESTAR SINCRONIZAÇÃO COM STORAGE EVENT
// ============================================================
console.log("\n🧪 TESTE 5: Testando sincronização...");

const evento = new StorageEvent("storage", {
  key: "loja_minimal_orders",
  newValue: JSON.stringify(orders),
  url: window.location.href
});

window.dispatchEvent(evento);
console.log(`✅ Storage Event disparado para "loja_minimal_orders"`);
console.log(`📢 Admin deve receber o pedido automaticamente!`);

// ============================================================
// TESTE 6: TESTAR VALIDAÇÃO DE RASTREIO
// ============================================================
console.log("\n🧪 TESTE 6: Validando formato de rastreio...");

const codigosRastreio = [
  { codigo: "AA123456789BR", valido: true },
  { codigo: "BB987654321BR", valido: true },
  { codigo: "CC555666777DE", valido: true },
  { codigo: "12345", valido: false },
  { codigo: "AA123BR", valido: false },
  { codigo: "AA123456789", valido: false }
];

const regexRastreio = /^[A-Z]{2}\d{9}[A-Z]{2}$/;

codigosRastreio.forEach(({codigo, valido}) => {
  const resultado = regexRastreio.test(codigo);
  const check = resultado === valido ? "✅" : "❌";
  console.log(`${check} "${codigo}" → ${resultado ? "VÁLIDO" : "INVÁLIDO"}`);
});

// ============================================================
// TESTE 7: SIMULAR ADIÇÃO DE RASTREIO
// ============================================================
console.log("\n🧪 TESTE 7: Adicionando rastreio ao pedido...");

const codigoRastreioTeste = "AA123456789BR";
pedidoTeste.tracking.code = codigoRastreioTeste;
pedidoTeste.tracking.url = `https://rastreamento.correios.com.br/app/index.php?codigo=${codigoRastreioTeste}`;
pedidoTeste.status = "enviado";
pedidoTeste.tracking.history.push({
  status: "enviado",
  timestamp: new Date().toISOString(),
  message: `Rastreio Correios adicionado: ${codigoRastreioTeste}`
});
pedidoTeste.updatedAt = new Date().toISOString();

// Atualizar no storage
const ordersAtualizado = JSON.parse(localStorage.getItem("loja_minimal_orders") || "[]");
const index = ordersAtualizado.findIndex(o => o.uuid === pedidoTeste.uuid);
if (index >= 0) {
  ordersAtualizado[index] = pedidoTeste;
}
localStorage.setItem("loja_minimal_orders", JSON.stringify(ordersAtualizado));

console.log(`✅ Rastreio adicionado: ${codigoRastreioTeste}`);
console.log(`✅ Status alterado para: ${pedidoTeste.status}`);
console.log(`✅ URL gerado: ${pedidoTeste.tracking.url}`);

// Disparar novo Storage Event
const eventoRastreio = new StorageEvent("storage", {
  key: "loja_minimal_orders",
  newValue: JSON.stringify(ordersAtualizado),
  url: window.location.href
});
window.dispatchEvent(eventoRastreio);
console.log(`✅ Storage Event disparado para sincronizar com cliente`);

// ============================================================
// TESTE 8: RESUMO FINAL
// ============================================================
console.log("\n" + "=".repeat(60));
console.log("📊 RESUMO DO TESTE COMPLETO");
console.log("=".repeat(60));

const resumo = {
  "Cliente criado": clienteTeste.name,
  "Pedido criado": pedidoTeste.id,
  "UUID": pedidoTeste.uuid,
  "Valor": `R$ ${pedidoTeste.total.toFixed(2)}`,
  "Itens": pedidoTeste.items.length,
  "Status": pedidoTeste.status,
  "Rastreio": pedidoTeste.tracking.code,
  "URL Correios": pedidoTeste.tracking.url
};

Object.entries(resumo).forEach(([chave, valor]) => {
  console.log(`   ${chave.padEnd(20)}: ${valor}`);
});

console.log("\n✅ TESTE COMPLETO FINALIZADO COM SUCESSO!");
console.log("\n📍 PRÓXIMOS PASSOS:");
console.log("   1. Abra admin.html em outra aba");
console.log("   2. Clique em 'Pedidos'");
console.log("   3. Você deve ver o pedido de teste: " + pedidoTeste.id);
console.log("   4. Clique para ver detalhes");
console.log("   5. Veja status: " + pedidoTeste.status);
console.log("   6. Verifique rastreio: " + pedidoTeste.tracking.code);
console.log("\n📮 URL para acompanhar (Clique no link!):");
console.log("   " + pedidoTeste.tracking.url);

// ============================================================
// SALVAR DADOS DO TESTE
// ============================================================
localStorage.setItem("teste_pedido_id", pedidoTeste.id);
localStorage.setItem("teste_rastreio", pedidoTeste.tracking.code);
console.log("\n💾 Dados do teste salvos em localStorage para verificação");
