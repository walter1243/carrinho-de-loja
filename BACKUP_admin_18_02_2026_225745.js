// Admin.js carregado
console.log("Admin.js iniciado!");

// Storage Keys
const STORAGE_KEYS = {
  products: "loja_minimal_products",
  categories: "loja_minimal_categories",
  orders: "loja_minimal_orders",
  tracking: "loja_minimal_tracking",
  checkouts: "loja_minimal_checkouts",
  session: "loja_minimal_admin_session",
};

// State
let products = [];
let categories = [];
let orders = [];
let tracking = [];
let checkouts = [];
let currentProduct = null;
let productColors = {};

// DOM Elements (declarados aqui, inicializados no init())
let menuBtns, pageContents, pageTitle, logoutBtn, menuToggle, sidebar;
let productForm, productName, productPrice, productCategory, addColorBtn, productColorsList, productsList;
let categoryForm, categoryName, categoriesList;
let trackingForm, trackingOrderId, trackingCode, trackingList;
let checkoutsTable, exportCheckoutsBtn;

// Utility Functions
function getStorage(key, defaultValue) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : defaultValue;
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Initialize
function init() {
  console.log("Função init() chamada!");
  
  // Inicializar todos os elementos DOM
  menuBtns = document.querySelectorAll(".menu-btn");
  pageContents = document.querySelectorAll(".page-content");
  pageTitle = document.getElementById("pageTitle");
  logoutBtn = document.getElementById("logoutBtn");
  menuToggle = document.getElementById("menu-toggle");
  sidebar = document.getElementById("sidebar");
  
  productForm = document.getElementById("product-form");
  productName = document.getElementById("product-name");
  productPrice = document.getElementById("product-price");
  productCategory = document.getElementById("product-category");
  addColorBtn = document.getElementById("add-color-btn");
  productColorsList = document.getElementById("product-colors-list");
  productsList = document.getElementById("products-list");
  
  categoryForm = document.getElementById("category-form");
  categoryName = document.getElementById("category-name");
  categoriesList = document.getElementById("categories-list");
  
  trackingForm = document.getElementById("tracking-form");
  trackingOrderId = document.getElementById("tracking-order-id");
  trackingCode = document.getElementById("tracking-code");
  trackingList = document.getElementById("tracking-list");
  
  checkoutsTable = document.getElementById("checkouts-table");
  exportCheckoutsBtn = document.getElementById("export-checkouts-csv");
  
  console.log("Elementos DOM carregados. addColorBtn:", addColorBtn);
  
  // Page Navigation
  menuBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      
      menuBtns.forEach((b) => b.classList.remove("is-active", "bg-slate-800"));
      btn.classList.add("is-active", "bg-slate-800");

      pageContents.forEach((content) => content.classList.add("hidden"));
      document.getElementById(`${page}-page`).classList.remove("hidden");

      const titles = {
        dashboard: "Dashboard",
        preview: "Preview da Loja",
        products: "Produtos",
        categories: "Categorias",
        orders: "Pedidos",
        tracking: "Rastreio",
        checkouts: "Checkouts",
      };
      pageTitle.textContent = titles[page] || "Dashboard";
    });
  });
  
  products = getStorage(STORAGE_KEYS.products, []);
  categories = getStorage(STORAGE_KEYS.categories, ["Promocoes", "Vestidos", "Camisetas", "Blusas", "Jaquetas"]);
  orders = getStorage(STORAGE_KEYS.orders, []);
  tracking = getStorage(STORAGE_KEYS.tracking, []);
  checkouts = getStorage(STORAGE_KEYS.checkouts, []);
  console.log("Estado carregado. Produtos:", products.length, "Categorias:", categories.length);
  
  // Se não houver produtos, adicionar alguns de exemplo
  if (products.length === 0) {
    console.log("Nenhum produto encontrado. Você pode adicionar produtos agora.");
  }

  renderDashboard();
  renderCategorySelect();
  renderAllPages();

  // Event Listeners
  productForm.addEventListener("submit", handleAddProduct);
  categoryForm.addEventListener("submit", handleAddCategory);
  trackingForm.addEventListener("submit", handleAddTracking);
  logoutBtn.addEventListener("click", handleLogout);
  exportCheckoutsBtn.addEventListener("click", exportCheckoutsCSV);

  // Add Color Button
  if (addColorBtn) {
    console.log("addColorBtn encontrado! Adicionando event listener...");
    addColorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Botão adicionar cor clicado!");
      addProductColorInput();
    });
  } else {
    console.error("Botão add-color-btn não encontrado!");
  }

  // Mobile menu toggle
  const sidebarBackdrop = document.getElementById("sidebar-backdrop");
  const closeSidebarMobile = document.getElementById("close-sidebar-mobile");

  if (menuToggle && sidebar && sidebarBackdrop) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.remove("hidden");
      sidebarBackdrop.classList.remove("hidden");
    });
  }

  // Close sidebar on backdrop click
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", () => {
      sidebar.classList.add("hidden");
      sidebarBackdrop.classList.add("hidden");
    });
  }

  // Close sidebar on close button
  if (closeSidebarMobile) {
    closeSidebarMobile.addEventListener("click", () => {
      sidebar.classList.add("hidden");
      sidebarBackdrop.classList.add("hidden");
    });
  }

  // Close sidebar when menu item is clicked on mobile
  menuBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        sidebar.classList.add("hidden");
        if (sidebarBackdrop) sidebarBackdrop.classList.add("hidden");
      }
    });
  });
}

// Dashboard
function renderDashboard() {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  document.getElementById("stat-products").textContent = products.length;
  document.getElementById("stat-orders").textContent = orders.length;
  document.getElementById("stat-revenue").textContent = formatCurrency(totalRevenue);
  document.getElementById("stat-categories").textContent = categories.length;

  const recentOrdersList = document.getElementById("recent-orders");
  recentOrdersList.innerHTML = orders.slice(-5).reverse().map((order) => `
    <li class="p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div class="flex justify-between items-start">
        <div>
          <p class="font-medium">${order.customer?.name || "Cliente"}</p>
          <p class="text-xs text-slate-600">${order.items.length} item(s)</p>
        </div>
        <p class="font-bold text-emerald-600">${formatCurrency(order.total)}</p>
      </div>
    </li>
  `).join("");
}

// Categories
function renderCategorySelect() {
  productCategory.innerHTML = '<option value="">Selecione</option>' + 
    categories.map((cat, idx) => `<option value="${idx}">${cat}</option>`).join("");
}

function handleAddCategory(e) {
  e.preventDefault();
  const name = categoryName.value.trim();
  
  if (!name) return;
  
  categories.push(name);
  setStorage(STORAGE_KEYS.categories, categories);
  
  categoryName.value = "";
  renderAllPages();
}

function renderCategories() {
  categoriesList.innerHTML = categories.map((cat, idx) => `
    <li class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
      <span>${cat}</span>
      <button class="text-xs px-2 py-1 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition" onclick="deleteCategory(${idx})">
        Remover
      </button>
    </li>
  `).join("");
}

function deleteCategory(idx) {
  categories.splice(idx, 1);
  setStorage(STORAGE_KEYS.categories, categories);
  renderAllPages();
}

// Colors
// Products
function addProductColorInput() {
  console.log("addProductColorInput chamada!");
  console.log("productColorsList:", productColorsList);
  
  const idx = Object.keys(productColors).length;
  console.log("Índice da nova cor:", idx);
  
  const colorHtml = `
    <div class="p-4 bg-gradient-to-br from-white to-slate-50 rounded-lg border-2 border-slate-300 shadow-sm hover:shadow-md transition" data-color-idx="${idx}">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-semibold text-sm text-slate-700">Cor ${idx + 1}</h4>
        <button type="button" class="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 active:scale-95 transition text-xs font-semibold shadow-sm" onclick="removeColorInput(${idx})" title="Remover esta cor">
          🗑️ Remover
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-semibold mb-1.5 text-slate-700">Nome da Cor</label>
          <input type="text" class="color-name-input w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-slate-400 focus:border-slate-400" placeholder="Ex: Vermelho" required>
        </div>
        <div>
          <label class="block text-xs font-semibold mb-1.5 text-slate-700">Código da Cor</label>
          <div class="flex gap-2 items-center">
            <input type="color" class="color-picker w-14 h-11 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-slate-400 transition" value="#000000" required title="Clique para escolher a cor">
            <input type="text" class="color-hex-input flex-1 border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-slate-400 focus:border-slate-400" value="#000000" placeholder="#000000" pattern="^#[0-9A-Fa-f]{6}$" title="Código hexadecimal da cor">
          </div>
        </div>
      </div>
      <div class="mt-3">
        <label class="block text-xs font-semibold mb-1.5 text-slate-700">Imagem desta Cor</label>
        <input type="file" class="color-image-input w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" accept="image/*" required>
        <div class="color-image-preview mt-2 hidden">
          <img class="w-20 h-20 object-cover rounded-lg border-2 border-slate-300" src="" alt="Preview">
        </div>
      </div>
      </div>
    </div>
  `;
  
  if (!productColorsList) {
    console.error("productColorsList não existe!");
    return;
  }
  
  productColorsList.insertAdjacentHTML("beforeend", colorHtml);
  console.log("HTML inserido com sucesso!");
  
  // Sync color picker and hex input
  const colorDiv = productColorsList.querySelector(`[data-color-idx="${idx}"]`);
  
  if (!colorDiv) {
    console.error("colorDiv não encontrado!");
    return;
  }
  
  const picker = colorDiv.querySelector('.color-picker');
  const hexInput = colorDiv.querySelector('.color-hex-input');
  const imageInput = colorDiv.querySelector('.color-image-input');
  const imagePreview = colorDiv.querySelector('.color-image-preview');
  const imagePreviewImg = colorDiv.querySelector('.color-image-preview img');
  
  console.log("Picker encontrado:", picker);
  console.log("HexInput encontrado:", hexInput);
  console.log("ImageInput encontrado:", imageInput);
  
  // Sync color picker and hex
  if (picker && hexInput) {
    picker.addEventListener('input', () => {
      hexInput.value = picker.value.toUpperCase();
      console.log("Cor alterada para:", picker.value);
    });
    
    hexInput.addEventListener('input', () => {
      const hex = hexInput.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
        picker.value = hex;
      }
    });
    
    hexInput.addEventListener('blur', () => {
      if (!hexInput.value.startsWith('#')) {
        hexInput.value = '#' + hexInput.value;
      }
      hexInput.value = hexInput.value.toUpperCase();
    });
  }
  
  // Image preview
  if (imageInput && imagePreview && imagePreviewImg) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imagePreviewImg.src = event.target.result;
          imagePreview.classList.remove('hidden');
          console.log("Preview da imagem da cor carregado");
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  productColors[idx] = null;
  console.log("Cor adicionada com sucesso! Total:", Object.keys(productColors).length);
}

function removeColorInput(idx) {
  delete productColors[idx];
  document.querySelector(`[data-color-idx="${idx}"]`).remove();
}

function handleAddProduct(e) {
  e.preventDefault();
  console.log("handleAddProduct chamado!");

  const name = productName.value.trim();
  const price = parseFloat(productPrice.value);
  const catIdx = parseInt(productCategory.value);

  console.log("Valores:", {name, price, catIdx});

  if (!name || !price || isNaN(catIdx) || catIdx < 0) {
    alert("Preencha nome, preço e categoria");
    console.log("Validação falhou!");
    return;
  }
  
  // Coletar cores
  const colorDivs = document.querySelectorAll("[data-color-idx]");
  console.log("Cores encontradas:", colorDivs.length);
  
  if (colorDivs.length === 0) {
    alert("Adicione pelo menos uma cor com sua imagem!");
    return;
  }
  
  // Validar que todas as cores têm nome, hex e imagem
  const colorPromises = [];
  
  colorDivs.forEach((colorDiv, idx) => {
    const nameInput = colorDiv.querySelector('.color-name-input');
    const hexInput = colorDiv.querySelector('.color-hex-input');
    const imageInput = colorDiv.querySelector('.color-image-input');
    
    if (!nameInput || !hexInput || !imageInput) {
      console.error("Inputs não encontrados para cor", idx);
      return;
    }
    
    const colorName = nameInput.value.trim();
    const colorHex = hexInput.value;
    const imageFile = imageInput.files[0];
    
    if (!colorName || !colorHex || !imageFile) {
      alert(`Preencha todos os campos da Cor ${idx + 1} (nome, cor e imagem)`);
      throw new Error("Validação de cor falhou");
    }
    
    // Criar promise para ler a imagem
    const promise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({
          id: `color-${Date.now()}-${idx}`,
          name: colorName,
          hex: colorHex,
          image: event.target.result // Base64
        });
      };
      reader.readAsDataURL(imageFile);
    });
    
    colorPromises.push(promise);
  });
  
  console.log("Lendo", colorPromises.length, "imagens...");
  
  // Aguardar todas as imagens serem lidas
  Promise.all(colorPromises).then((colors) => {
    console.log("Todas as imagens carregadas!");
    
    const product = {
      id: `prod-${Date.now()}`,
      name,
      price,
      category: categories[catIdx],
      colors: colors // Array de cores, cada uma com sua imagem
    };

    console.log("Produto criado com", product.colors.length, "cores:", product);
    products.push(product);
    setStorage(STORAGE_KEYS.products, products);
    console.log("Produto salvo! Total de produtos:", products.length);

    // Resetar form
    productForm.reset();
    productColorsList.innerHTML = "";
    productColors = {};

    renderAllPages();
    alert("Produto adicionado com sucesso!");
  }).catch((error) => {
    console.error("Erro ao processar cores:", error);
  });
}

function renderProducts() {
  productsList.innerHTML = products.map((prod) => `
    <li class="p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div class="flex gap-3">
        <div class="flex-shrink-0">
          ${prod.colors && prod.colors.length > 0 ? 
            `<img src="${prod.colors[0].image}" alt="${prod.name}" class="w-16 h-16 object-cover rounded-lg border border-slate-300">` 
            : '<div class="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">Sem imagem</div>'
          }
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm">${prod.name}</p>
          <p class="text-xs text-slate-600">${formatCurrency(prod.price)}</p>
          <p class="text-xs text-slate-500 mt-1">
            ${prod.colors && prod.colors.length > 0 
              ? `<span class="font-semibold">${prod.colors.length} cor${prod.colors.length > 1 ? 'es' : ''}:</span> ${prod.colors.map((c) => c.name).join(", ")}`
              : 'Sem cores'
            }
          </p>
        </div>
        <button class="text-xs px-2 py-1 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition whitespace-nowrap self-start" onclick="deleteProduct('${prod.id}')">
          Remover
        </button>
      </div>
    </li>
  `).join("");
}

function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  setStorage(STORAGE_KEYS.products, products);
  renderAllPages();
}

// Tracking
function handleAddTracking(e) {
  e.preventDefault();

  const orderId = trackingOrderId.value.trim();
  const code = trackingCode.value.trim();

  if (!orderId || !code) return;

  tracking.push({
    id: Date.now(),
    orderId,
    code,
    url: `https://www.correios.com.br/posvales/sro/leiacodigo/${code}`,
  });

  setStorage(STORAGE_KEYS.tracking, tracking);
  trackingForm.reset();
  renderAllPages();
}

function renderTracking() {
  trackingList.innerHTML = tracking.map((track) => `
    <li class="p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div class="flex-1">
          <p class="font-semibold text-slate-900">Pedido: ${track.orderId}</p>
          <p class="text-sm text-slate-600 mt-1">Código: <span class="font-mono font-medium">${track.code}</span></p>
          <a href="${track.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Rastrear nos Correios
          </a>
        </div>
        <button class="text-sm px-4 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition font-medium" onclick="deleteTracking(${track.id})">
          Remover
        </button>
      </div>
    </li>
  `).join("");
}

function deleteTracking(id) {
  tracking = tracking.filter((t) => t.id !== id);
  setStorage(STORAGE_KEYS.tracking, tracking);
  renderAllPages();
}

// Checkouts
function renderCheckouts() {
  checkoutsTable.innerHTML = checkouts.map((checkout) => `
    <tr class="hover:bg-slate-50">
      <td class="px-4 py-2 text-sm">${new Date(checkout.date).toLocaleDateString("pt-BR")}</td>
      <td class="px-4 py-2 text-sm">${checkout.customer?.name || "-"}</td>
      <td class="px-4 py-2 text-sm">${checkout.items.length}</td>
      <td class="px-4 py-2 text-sm font-bold">${formatCurrency(checkout.total)}</td>
      <td class="px-4 py-2 text-sm">
        <a href="https://wa.me/55${checkout.customer?.phone?.replace(/\D/g, "") || ""}" target="_blank" class="text-blue-600 hover:underline">
          ${checkout.customer?.phone || "-"}
        </a>
      </td>
    </tr>
  `).join("");
}

function exportCheckoutsCSV() {
  let csv = "Data,Cliente,Email,Telefone,Itens,Total\n";
  
  checkouts.forEach((checkout) => {
    const date = new Date(checkout.date).toLocaleDateString("pt-BR");
    const name = checkout.customer?.name || "";
    const email = checkout.customer?.email || "";
    const phone = checkout.customer?.phone || "";
    const items = checkout.items.length;
    const total = checkout.total.toString().replace(".", ",");
    
    csv += `"${date}","${name}","${email}","${phone}",${items},"${total}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `checkouts_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

// ============ SISTEMA DE PEDIDOS ============

// Renderizar lista de pedidos
function renderOrders() {
  const ordersList = document.getElementById("orders-list");
  if (!ordersList) return;
  
  orders = getStorage(STORAGE_KEYS.orders, []);
  
  if (!orders || orders.length === 0) {
    ordersList.innerHTML = '<li class="text-slate-500 py-4">Nenhum pedido ainda.</li>';
    return;
  }
  
  // Ordenar por data (mais recentes primeiro)
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  ordersList.innerHTML = sorted.map((order) => {
    const statusColors = {
      "pendente_processamento": "bg-amber-100 text-amber-800",
      "processando": "bg-blue-100 text-blue-800",
      "enviado": "bg-purple-100 text-purple-800",
      "entregue": "bg-green-100 text-green-800",
      "cancelado": "bg-red-100 text-red-800",
    };
    
    const statusLabels = {
      "pendente_processamento": "⏳ Pendente",
      "processando": "⚙️ Processando",
      "enviado": "📦 Enviado",
      "entregue": "✓ Entregue",
      "cancelado": "✕ Cancelado",
    };
    
    const date = new Date(order.createdAt).toLocaleDateString("pt-BR");
    const statusClass = statusColors[order.status] || "bg-slate-100 text-slate-800";
    const statusLabel = statusLabels[order.status] || order.status;
    
    return `
      <li class="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer hover:bg-slate-100 transition" onclick="showOrderDetail('${order.uuid}')">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="font-semibold text-slate-900">${order.id}</div>
            <div class="text-sm text-slate-600">${order.customer.name} • ${date}</div>
          </div>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${statusClass}">${statusLabel}</span>
        </div>
        <div class="flex justify-between items-end text-sm">
          <div class="text-slate-600">${order.items.length} item(ns) • ${order.shipping.city}, ${order.shipping.state}</div>
          <div class="font-semibold text-slate-900">${formatCurrency(order.total)}</div>
        </div>
      </li>
    `;
  }).join("");
}

// Mostrar detalhe do pedido
function showOrderDetail(orderUuid) {
  const order = orders.find(o => o.uuid === orderUuid);
  if (!order) return;
  
  const detail = `
    <div id="order-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="bg-slate-900 text-white p-6 sticky top-0">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">${order.id}</h2>
              <p class="text-slate-300 text-sm">${new Date(order.createdAt).toLocaleDateString("pt-BR")} às ${new Date(order.createdAt).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})}</p>
            </div>
            <button onclick="document.getElementById('order-detail-modal').remove()" class="text-2xl hover:text-slate-200">✕</button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Cliente -->
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">👤 Cliente</h3>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div><span class="font-medium">Nome:</span> ${order.customer.name}</div>
              <div><span class="font-medium">Email:</span> ${order.customer.email}</div>
              <div><span class="font-medium">Telefone:</span> ${order.customer.phone}</div>
            </div>
          </div>
          
          <!-- Endereço -->
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">📍 Endereço de Envio</h3>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
              <div>${order.shipping.address}</div>
              <div>${order.shipping.city}, ${order.shipping.state}</div>
              <div>${order.shipping.country}</div>
            </div>
          </div>
          
          <!-- Itens -->
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">📦 Itens do Pedido</h3>
            <div class="space-y-2">
              ${order.items.map(item => `
                <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center text-sm">
                  <div class="flex-1">
                    <div class="font-medium">${item.name}</div>
                    <div class="text-slate-600">Cor: <strong>${item.color}</strong> • Tamanho: <strong>${item.size}</strong></div>
                    <div class="text-slate-600">Quantidade: ${item.quantity}x • Preço: ${formatCurrency(item.price)}</div>
                  </div>
                  <div class="text-right font-semibold">${formatCurrency(item.subtotal)}</div>
                </div>
              `).join("")}
            </div>
          </div>
          
          <!-- Totais -->
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div class="flex justify-between"><span>Subtotal:</span> <span>${formatCurrency(order.subtotal)}</span></div>
            <div class="flex justify-between"><span>Frete:</span> <span>${formatCurrency(order.shipping_cost)}</span></div>
            <div class="flex justify-between text-lg font-bold border-t border-slate-300 pt-2"><span>Total:</span> <span>${formatCurrency(order.total)}</span></div>
          </div>
          
          <!-- Status e Rastreio -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Atualizar Status -->
            <div>
              <h3 class="font-semibold text-slate-900 mb-3">Status do Pedido</h3>
              <select id="order-status-select" onchange="updateOrderStatus('${order.uuid}', this.value)" class="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm">
                <option value="pendente_processamento" ${order.status === "pendente_processamento" ? "selected" : ""}>⏳ Pendente Processamento</option>
                <option value="processando" ${order.status === "processando" ? "selected" : ""}>⚙️ Processando</option>
                <option value="enviado" ${order.status === "enviado" ? "selected" : ""}>📦 Enviado</option>
                <option value="entregue" ${order.status === "entregue" ? "selected" : ""}>✓ Entregue</option>
                <option value="cancelado" ${order.status === "cancelado" ? "selected" : ""}>✕ Cancelado</option>
              </select>
            </div>
            
            <!-- Rastreio Correios -->
            <div>
              <h3 class="font-semibold text-slate-900 mb-3">📮 Rastreio Correios</h3>
              ${order.tracking?.code ? `
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div class="text-sm font-mono bg-white p-2 rounded mb-2">${order.tracking.code}</div>
                  <a href="${order.tracking.url}" target="_blank" class="text-sm text-blue-600 hover:underline">🔗 Acompanhar na Correios</a>
                </div>
              ` : `
                <div class="space-y-2">
                  <input type="text" id="tracking-code-input" placeholder="Ex: AA000000000BR" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  <button onclick="addTrackingCode('${order.uuid}')" class="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                    ✓ Adicionar Rastreio
                  </button>
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML("beforeend", detail);
}

// Atualizar status do pedido
function updateOrderStatus(orderUuid, newStatus) {
  const order = orders.find(o => o.uuid === orderUuid);
  if (!order) return;
  
  // Adicionar evento ao histórico
  const statusLabels = {
    "pendente_processamento": "Pendente",
    "processando": "Processando",
    "enviado": "Enviado",
    "entregue": "Entregue",
    "cancelado": "Cancelado",
  };
  
  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  order.tracking.history.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    message: `Status alterado para ${statusLabels[newStatus]}`,
  });
  
  // Salvar
  setStorage(STORAGE_KEYS.orders, orders);
  
  // Sincronizar com cliente via storage event
  const event = new StorageEvent("storage", {
    key: STORAGE_KEYS.orders,
    newValue: JSON.stringify(orders),
    url: window.location.href,
  });
  window.dispatchEvent(event);
  
  // Fechar modal e atualizar
  document.getElementById("order-detail-modal")?.remove();
  renderOrders();
  
  // Notificação
  alert(`✓ Pedido ${order.id} atualizado para ${statusLabels[newStatus]}`);
}

// Adicionar código de rastreio Correios
function addTrackingCode(orderUuid) {
  const trackingCodeInput = document.getElementById("tracking-code-input");
  const code = trackingCodeInput?.value?.trim();
  
  if (!code) {
    alert("Digite o código de rastreio");
    return;
  }
  
  const order = orders.find(o => o.uuid === orderUuid);
  if (!order) return;
  
  // Validar formato básico (Correios utiliza 13 caracteres: 2 letras + 9 dígitos + 2 letras)
  if (!/^[A-Z]{2}\\d{9}[A-Z]{2}$/.test(code)) {
    alert("Formato inválido. Use: AA000000000BR");
    return;
  }
  
  order.tracking.code = code;
  order.tracking.url = `https://rastreamento.correios.com.br/app/index.php?codigo=${code}`;
  order.status = "enviado";
  order.tracking.history.push({
    status: "enviado",
    timestamp: new Date().toISOString(),
    message: `Rastreio Correios adicionado: ${code}`,
  });
  order.updatedAt = new Date().toISOString();
  
  // Salvar
  setStorage(STORAGE_KEYS.orders, orders);
  
  // Sincronizar
  const event = new StorageEvent("storage", {
    key: STORAGE_KEYS.orders,
    newValue: JSON.stringify(orders),
    url: window.location.href,
  });
  window.dispatchEvent(event);
  
  // Atualizar
  document.getElementById("order-detail-modal")?.remove();
  renderOrders();
  
  alert(`✓ Rastreio adicionado! Código: ${code}`);
}

// Render All Pages
function renderAllPages() {
  renderDashboard();
  renderCategorySelect();
  renderCategories();
  renderProducts();
  renderOrders();
  renderTracking();
  renderCheckouts();
}

// Logout
function handleLogout() {
  localStorage.removeItem(STORAGE_KEYS.session);
  window.location.href = "admin.html";
}

// Sync with Cliente
window.addEventListener("storage", () => {
  products = getStorage(STORAGE_KEYS.products, []);
  orders = getStorage(STORAGE_KEYS.orders, []);
  checkouts = getStorage(STORAGE_KEYS.checkouts, []);
  renderAllPages();
});

// Initialize on Load
window.addEventListener("DOMContentLoaded", init);
