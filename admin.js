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
let productForm, productName, productPrice, productCategory, productDescription, addColorBtn, productColorsList, productsList;
let categoryForm, categoryName, categoriesList;
let trackingForm, trackingOrderId, trackingCode, trackingList;
let checkoutsTable, exportCheckoutsBtn;

// Edit Product Modal Elements
let editProductModal, closeEditModal, cancelEditModal, editProductForm;
let editProductId, editProductName, editProductPrice, editProductCategory, editProductDescription;
let editProductColorsList, editAddColorBtn;
let editProductColors = {};

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

function formatCpf(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 11) return value || "-";
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
  productDescription = document.getElementById("product-description");
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
  
  // Edit Product Modal Elements
  editProductModal = document.getElementById("editProductModal");
  closeEditModal = document.getElementById("closeEditModal");
  cancelEditModal = document.getElementById("cancelEditModal");
  editProductForm = document.getElementById("edit-product-form");
  editProductId = document.getElementById("edit-product-id");
  editProductName = document.getElementById("edit-product-name");
  editProductPrice = document.getElementById("edit-product-price");
  editProductCategory = document.getElementById("edit-product-category");
  editProductDescription = document.getElementById("edit-product-description");
  editProductColorsList = document.getElementById("edit-product-colors-list");
  editAddColorBtn = document.getElementById("edit-add-color-btn");
  
  console.log("Elementos DOM carregados. addColorBtn:", addColorBtn);
  
  // Configurar drag-and-drop de imagens no editor de descrição
  setupDescriptionEditor();
  
  // Configurar redimensionamento de imagens
  setupImageResizing();
  
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
  
  if (trackingForm) {
    trackingForm.addEventListener("submit", handleAddTracking);
  }
  
  logoutBtn.addEventListener("click", handleLogout);
  
  if (exportCheckoutsBtn) {
    exportCheckoutsBtn.addEventListener("click", exportCheckoutsCSV);
  }
  
  // Edit Product Modal Event Listeners
  editProductForm.addEventListener("submit", handleEditProduct);
  
  if (closeEditModal) {
    closeEditModal.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEditProductModal();
    });
  }
  
  if (cancelEditModal) {
    cancelEditModal.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeEditProductModal();
    });
  }
  
  editAddColorBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addEditProductColorInput();
  });
  
  // Close modal on backdrop click
  editProductModal.addEventListener("click", (e) => {
    if (e.target === editProductModal) {
      closeEditProductModal();
    }
  });

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

function setupDescriptionEditor() {
  const editor = productDescription;
  
  // Prevenir comportamento padrão de arrastar
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    editor.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
  
  // Adicionar visual feedback quando arrastar sobre o editor
  editor.addEventListener('dragenter', () => {
    editor.classList.add('drag-over');
  });
  
  editor.addEventListener('dragleave', (e) => {
    if (e.target === editor) {
      editor.classList.remove('drag-over');
    }
  });
  
  // Processar imagens quando soltadas
  editor.addEventListener('drop', (e) => {
    editor.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    
    if (files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          
          reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.alt = file.name;
            img.contentEditable = 'false';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.margin = '8px 0';
            img.style.display = 'block';
            
            // Inserir imagem no cursor ou no final
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(img);
              
              // Mover cursor após a imagem
              range.setStartAfter(img);
              range.setEndAfter(img);
              selection.removeAllRanges();
              selection.addRange(range);
            } else {
              editor.appendChild(img);
            }
          };
          
          reader.readAsDataURL(file);
        }
      });
    }
  });
  
  // Também permitir colar imagens (Ctrl+V)
  editor.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.alt = 'Imagem colada';
          img.contentEditable = 'false';
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.borderRadius = '8px';
          img.style.margin = '8px 0';
          img.style.display = 'block';
          
          // Inserir imagem no cursor
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
          
          // Mover cursor após a imagem
          range.setStartAfter(img);
          range.setEndAfter(img);
          selection.removeAllRanges();
          selection.addRange(range);
        };
        
        reader.readAsDataURL(blob);
        break;
      }
    }
  });
}

function setupImageResizing() {
  const editor = productDescription;
  let selectedImage = null;
  
  // Deletar imagem ao pressionar Delete ou Backspace
  document.addEventListener('keydown', (e) => {
    if (selectedImage && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault();
      selectedImage.remove();
      selectedImage = null;
    }
  });
  
  // Selecionar imagem ao clicar
  editor.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      if (selectedImage) {
        selectedImage.classList.remove('selected');
      }
      selectedImage = e.target;
      selectedImage.classList.add('selected');
    } else {
      if (selectedImage) {
        selectedImage.classList.remove('selected');
        selectedImage = null;
      }
    }
  });
  
  // Desselecionar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!editor.contains(e.target) && selectedImage) {
      selectedImage.classList.remove('selected');
      selectedImage = null;
    }
  });
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
  const description = productDescription.innerHTML.trim();

  console.log("Valores:", {name, price, catIdx, description});

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
      description: description || '',
      colors: colors // Array de cores, cada uma com sua imagem
    };

    console.log("Produto criado com", product.colors.length, "cores:", product);
    products.push(product);
    setStorage(STORAGE_KEYS.products, products);
    console.log("Produto salvo! Total de produtos:", products.length);

    // Resetar form
    productForm.reset();
    productDescription.innerHTML = '';
    productColorsList.innerHTML = "";
    productColors = {};

    renderAllPages();
    alert("Produto adicionado com sucesso!");
  }).catch((error) => {
    console.error("Erro ao processar cores:", error);
  });
}

function renderProducts() {
  productsList.innerHTML = products.map((prod) => {
    // Extrair texto da descrição (sem HTML/imagens) para preview
    const descriptionText = prod.description 
      ? prod.description.replace(/<img[^>]*>/g, '[imagem]').replace(/<[^>]+>/g, '').trim()
      : '';
    
    return `
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
          ${descriptionText ? `<p class="text-xs text-slate-600 mt-1 line-clamp-2">${descriptionText}</p>` : ''}
        </div>
        <div class="flex gap-2 self-start">
          <button class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition whitespace-nowrap" onclick="editProduct('${prod.id}')" title="Editar produto">
            ✏️
          </button>
          <button class="text-xs px-2 py-1 bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition whitespace-nowrap" onclick="deleteProduct('${prod.id}')" title="Remover produto">
            ×
          </button>
        </div>
      </div>
    </li>
  `;
  }).join("");
}

function deleteProduct(id) {
  products = products.filter((p) => p.id !== id);
  setStorage(STORAGE_KEYS.products, products);
  renderAllPages();
}

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  
  // Resetar cores de edição
  editProductColors = {};
  
  // Popular campos do formulário
  editProductId.value = product.id;
  editProductName.value = product.name;
  editProductPrice.value = product.price;
  editProductDescription.innerHTML = product.description || '';
  
  // Popular select de categorias
  editProductCategory.innerHTML = categories.map((cat, idx) => 
    `<option value="${idx}" ${product.category === cat ? 'selected' : ''}>${cat}</option>`
  ).join('');
  
  // Popular cores existentes
  editProductColorsList.innerHTML = '';
  if (product.colors && product.colors.length > 0) {
    product.colors.forEach((color, idx) => {
      editProductColors[idx] = {
        name: color.name,
        hex: color.hex || '#000000',
        image: color.image
      };
      renderEditProductColor(idx, color.name, color.image, color.hex || '#000000');
    });
  }
  
  // Abrir modal
  editProductModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeEditProductModal() {
  editProductModal.classList.add('hidden');
  document.body.style.overflow = '';
  editProductColors = {};
  editProductColorsList.innerHTML = '';
  editProductForm.reset();
}

function handleEditProduct(e) {
  e.preventDefault();
  
  console.log('=== INICIANDO EDIÇÃO DE PRODUTO ===');
  
  const id = editProductId.value;
  const name = editProductName.value.trim();
  const price = parseFloat(editProductPrice.value);
  const catIdx = parseInt(editProductCategory.value);
  const description = editProductDescription.innerHTML.trim();
  
  console.log('Dados capturados:', {
    id,
    name,
    price,
    catIdx,
    description: description.substring(0, 50) + '...',
    categoriesLength: categories.length,
    categoryValue: editProductCategory.value
  });
  
  if (!name) {
    alert('⚠️ Nome do produto é obrigatório');
    return;
  }
  
  if (!price || isNaN(price) || price <= 0) {
    alert('⚠️ Preço inválido. Digite um valor válido.');
    return;
  }
  
  if (isNaN(catIdx) || catIdx < 0 || catIdx >= categories.length) {
    alert('⚠️ Selecione uma categoria válida');
    console.log('Categoria inválida:', { catIdx, categories });
    return;
  }
  
  // Coletar cores
  const colors = [];
  Object.values(editProductColors).forEach(color => {
    if (color && color.name && color.image) {
      colors.push({
        name: color.name,
        hex: color.hex || '#000000',
        image: color.image
      });
    }
  });
  
  console.log('Cores coletadas:', colors.length);
  
  // Encontrar e atualizar produto
  const productIndex = products.findIndex(p => p.id === id);
  console.log('Índice do produto:', productIndex);
  
  if (productIndex !== -1) {
    const oldProduct = { ...products[productIndex] };
    
    products[productIndex] = {
      ...products[productIndex],
      name,
      price,
      category: categories[catIdx],
      description,
      colors
    };
    
    console.log('Produto ANTES:', oldProduct);
    console.log('Produto DEPOIS:', products[productIndex]);
    
    setStorage(STORAGE_KEYS.products, products);
    console.log('✅ Produto salvo no localStorage');
    
    renderAllPages();
    console.log('✅ Páginas renderizadas');
    
    closeEditProductModal();
    alert('✅ Produto atualizado com sucesso!');
  } else {
    alert('❌ Produto não encontrado!');
    console.error('Produto não encontrado com ID:', id);
  }
}

function addEditProductColorInput() {
  const idx = Date.now();
  editProductColors[idx] = { name: '', hex: '#000000', image: '' };
  renderEditProductColor(idx, '', '', '#000000');
}

function renderEditProductColor(idx, colorName = '', imageData = '', colorHex = '#000000') {
  const div = document.createElement('div');
  div.className = 'p-4 bg-gradient-to-br from-white to-slate-50 rounded-lg border-2 border-slate-300 shadow-sm';
  div.dataset.colorIdx = idx;
  
  div.innerHTML = `
    <div class="flex justify-between items-center mb-3">
      <h4 class="font-semibold text-sm text-slate-700">Cor ${idx + 1}</h4>
      <button 
        type="button"
        class="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition text-xs font-semibold"
        onclick="removeEditProductColor(${idx})"
      >🗑️ Remover</button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
      <div>
        <label class="block text-xs font-semibold mb-1.5 text-slate-700">Nome da Cor</label>
        <input 
          type="text" 
          placeholder="Ex: Vermelho" 
          value="${colorName}"
          class="edit-color-name w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          onchange="updateEditProductColor(${idx}, 'name', this.value)"
        >
      </div>
      
      <div>
        <label class="block text-xs font-semibold mb-1.5 text-slate-700">Código da Cor</label>
        <div class="flex gap-2 items-center">
          <input 
            type="color" 
            value="${colorHex}"
            class="edit-color-picker w-14 h-11 border-2 border-slate-300 rounded-lg cursor-pointer"
            onchange="updateEditProductColor(${idx}, 'hex', this.value); this.nextElementSibling.value = this.value;"
            title="Clique para escolher a cor"
          >
          <input 
            type="text" 
            value="${colorHex}"
            placeholder="#000000"
            class="edit-color-hex flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
            pattern="^#[0-9A-Fa-f]{6}$"
            onchange="updateEditProductColor(${idx}, 'hex', this.value); this.previousElementSibling.value = this.value;"
          >
        </div>
      </div>
    </div>
    
    <div>
      <label class="block text-xs font-semibold mb-1.5 text-slate-700">Imagem desta Cor</label>
      <input 
        type="file" 
        accept="image/*"
        class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
        onchange="handleEditProductColorImage(${idx}, this)"
      >
      ${imageData ? `<img src="${imageData}" class="mt-2 w-20 h-20 object-cover rounded-lg border-2 border-slate-300">` : ''}
    </div>
  `;
  
  editProductColorsList.appendChild(div);
}

function updateEditProductColor(idx, field, value) {
  if (!editProductColors[idx]) {
    editProductColors[idx] = { name: '', hex: '#000000', image: '' };
  }
  editProductColors[idx][field] = value;
  console.log(`Cor ${idx} atualizada - ${field}:`, value);
}

function handleEditProductColorImage(idx, input) {
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!editProductColors[idx]) {
        editProductColors[idx] = { name: '', hex: '#000000', image: '' };
      }
      editProductColors[idx].image = e.target.result;
      
      // Re-render para mostrar preview
      const currentName = editProductColors[idx].name || '';
      const currentHex = editProductColors[idx].hex || '#000000';
      const container = document.querySelector(`[data-color-idx="${idx}"]`);
      if (container) {
        container.remove();
      }
      renderEditProductColor(idx, currentName, e.target.result, currentHex);
    };
    
    reader.readAsDataURL(file);
  }
}

function removeEditProductColor(idx) {
  delete editProductColors[idx];
  document.querySelector(`[data-color-idx="${idx}"]`).remove();
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
  if (!trackingList) return; // Elemento não existe na página
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
      <td class="px-4 py-2 text-sm">${checkout.customer?.authProvider || "email"}</td>
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
  let csv = "Data,Cliente,Email,Telefone,Origem_Login,Itens,Total\n";
  
  checkouts.forEach((checkout) => {
    const date = new Date(checkout.date).toLocaleDateString("pt-BR");
    const name = checkout.customer?.name || "";
    const email = checkout.customer?.email || "";
    const phone = checkout.customer?.phone || "";
    const authProvider = checkout.customer?.authProvider || "email";
    const items = checkout.items.length;
    const total = checkout.total.toString().replace(".", ",");
    
    csv += `"${date}","${name}","${email}","${phone}","${authProvider}",${items},"${total}"\n`;
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
        <div class="flex justify-between items-end text-sm mb-3">
          <div class="text-slate-600">${order.items.length} item(ns) • ${order.shipping.city}, ${order.shipping.state}</div>
          <div class="font-semibold text-slate-900">${formatCurrency(order.total)}</div>
        </div>
        <button onclick="event.stopPropagation(); enviarListaProdutosWpp('${order.uuid}');" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition text-sm">
          📦 Enviar Lista para Separação
        </button>
      </li>
    `;
  }).join("");
}

// Função para enviar lista de separação via WhatsApp
function enviarListaProdutosWpp(orderUuid) {
  const pedido = orders.find(o => o.uuid === orderUuid);
  if (!pedido) {
    alert("❌ Pedido não encontrado!");
    return;
  }
  
  const numeroDono = "5563991133386"; // Celular do dono
  
  let mensagem = `*📦 SEPARAÇÃO DE PEDIDO - ID: ${pedido.id}*%0A`;
  mensagem += `================================%0A%0A`;

  // Dados do Cliente
  mensagem += `*👤 CLIENTE*%0A`;
  mensagem += `Nome: ${pedido.customer.name}%0A`;
  mensagem += `Telefone: ${pedido.customer.phone || 'N/A'}%0A`;
  mensagem += `Email: ${pedido.customer.email || 'N/A'}%0A%0A`;

  // Endereço de Entrega
  mensagem += `*🏠 ENDEREÇO DE ENTREGA*%0A`;
  mensagem += `${pedido.shipping.address}%0A`;
  mensagem += `${pedido.shipping.city}, ${pedido.shipping.state}%0A%0A`;

  // Lista de Produtos
  mensagem += `*📋 PRODUTOS PARA SEPARAR*%0A`;
  mensagem += `--------------------------------%0A`;

  // Percorrer cada item do pedido
  pedido.items.forEach((produto, index) => {
    mensagem += `*${index + 1}.* ${produto.name}%0A`;
    mensagem += `   Qnt: ${produto.quantity}`;
    if(produto.color) mensagem += ` | Cor: ${produto.color}`;
    if(produto.size) mensagem += ` | Tam: ${produto.size}`;
    mensagem += `%0A`;
  });

  mensagem += `%0A--------------------------------%0A`;
  mensagem += `*Total: R$ ${(pedido.total || 0).toFixed(2).replace('.', ',')}*%0A`;
  
  const url = `https://wa.me/${numeroDono}?text=${mensagem}`;
  window.open(url, '_blank');
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
              <div><span class="font-medium">CPF:</span> ${formatCpf(order.customer.cpf)}</div>
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

          <!-- Recibo -->
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">🧾 Recibo</h3>
            <button onclick="gerarRecibo('${order.uuid}')" class="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition">
              Emitir recibo
            </button>
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

function gerarRecibo(orderUuid) {
  const order = orders.find(o => o.uuid === orderUuid);
  if (!order) return;

  const receiptWindow = window.open("", "_blank", "width=900,height=700");
  if (!receiptWindow) {
    alert("Permita pop-ups para gerar o recibo.");
    return;
  }

  const itemsHtml = order.items.map((item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.color || '-'}</td>
      <td>${item.size || '-'}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${formatCurrency(item.subtotal)}</td>
    </tr>
  `).join("");

  const bannerUrls = (() => {
    const stored = localStorage.getItem('loja_banner_urls');
    if (stored) {
      try {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) return list.filter(Boolean);
      } catch (e) {
        return [];
      }
    }
    const legacy = localStorage.getItem('loja_banner_url');
    return legacy ? [legacy] : [];
  })();

  const logoUrl = localStorage.getItem('loja_logo_url') || bannerUrls[0] || "";
  const receiptTitle = `Recibo ${order.id}`;
  const emailBody = [
    `Recibo de compra ${order.id}`,
    `Data: ${new Date(order.createdAt).toLocaleDateString("pt-BR")} ${new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
    `Cliente: ${order.customer.name}`,
    `CPF: ${formatCpf(order.customer.cpf)}`,
    `Telefone: ${order.customer.phone}`,
    `Endereco: ${order.shipping.address}, ${order.shipping.city} - ${order.shipping.state}`,
    ``,
    `Itens:`,
    ...order.items.map(item => `- ${item.name} | Cor: ${item.color || '-'} | Tam: ${item.size || '-'} | Qtd: ${item.quantity} | Preco: ${formatCurrency(item.price)}`),
    ``,
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Frete: ${formatCurrency(order.shipping_cost)}`,
    `Total: ${formatCurrency(order.total)}`,
    ``,
    ...(order.tracking?.code ? [
      `RASTREIO:`,
      `Código: ${order.tracking.code}`,
      `Transportadora: ${order.tracking.carrier || 'Correios'}`,
      `Acompanhe em: https://rastreamento.correios.com.br/`
    ] : [
      `Rastreio ainda não foi adicionado. Fique atento para receber o código de rastreio.`
    ]),
  ].join("\n");

  receiptWindow.document.write(`
    <html>
      <head>
        <title>Recibo ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0f172a; padding: 24px; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          h2 { font-size: 16px; margin-top: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #f8fafc; }
          .row { display: flex; justify-content: space-between; margin-top: 6px; font-size: 13px; }
          .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
          .muted { color: #64748b; font-size: 12px; }
          .actions { margin-top: 18px; }
          .btn { background: #0f172a; color: #fff; padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="row" style="align-items:center;">
          <div>
            <h1>Recibo de Compra</h1>
            <div class="muted">Pedido ${order.id} • ${new Date(order.createdAt).toLocaleDateString("pt-BR")} às ${new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
          ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="height:48px;border-radius:8px;object-fit:cover;" />` : ''}
        </div>

        <h2>Cliente</h2>
        <div class="row"><span>Nome:</span><span>${order.customer.name}</span></div>
        <div class="row"><span>CPF:</span><span>${formatCpf(order.customer.cpf)}</span></div>
        <div class="row"><span>Email:</span><span>${order.customer.email}</span></div>
        <div class="row"><span>Telefone:</span><span>${order.customer.phone}</span></div>

        <h2>Endereco</h2>
        <div class="row"><span>${order.shipping.address}</span><span>${order.shipping.city} - ${order.shipping.state}</span></div>

        <h2>Itens</h2>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Cor</th>
              <th>Tamanho</th>
              <th>Qtd</th>
              <th>Preco</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <h2>Totais</h2>
        <div class="row"><span>Subtotal:</span><span>${formatCurrency(order.subtotal)}</span></div>
        <div class="row"><span>Frete:</span><span>${formatCurrency(order.shipping_cost)}</span></div>
        <div class="row total"><span>Total:</span><span>${formatCurrency(order.total)}</span></div>

        ${order.tracking?.code ? `
          <h2>Rastreio</h2>
          <div class="row"><span>Código:</span><span style="font-weight:bold; font-family:monospace;">${order.tracking.code}</span></div>
          <div class="row"><span>Transportadora:</span><span>${order.tracking.carrier || 'Correios'}</span></div>
          <div class="row"><span>Acompanhe seu pedido em:</span><span><a href="https://rastreamento.correios.com.br/" target="_blank" style="color:#0f172a; text-decoration:underline;">correios.com.br</a></span></div>
        ` : `
          <h2>Rastreio</h2>
          <div class="row" style="color:#64748b;">Rastreio ainda não foi adicionado. Fique atento ao seu email para atualizações.</div>
        `}

        <div class="actions">
          <button class="btn" onclick="window.print()">Imprimir recibo</button>
          <button class="btn" onclick="window.print()" style="margin-left:8px;">Baixar PDF</button>
          <a class="btn" href="mailto:${order.customer.email}?subject=${encodeURIComponent(receiptTitle)}&body=${encodeURIComponent(emailBody)}" style="margin-left:8px; text-decoration:none; display:inline-block;">Enviar por email</a>
        </div>
      </body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.setTimeout(() => receiptWindow.print(), 300);
}

// Adicionar código de rastreio Correios
// Gerar código de rastreio válido Correios com dígito verificador
// (Função removida - usar apenas código manual da agência)

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
  if (!/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(code)) {
    alert("Formato inválido. Use: AA000000000BR");
    return;
  }
  
  aplicarRastreio(order, code);
}

// Gerar automático e aplicar rastreio
function gerarRastreioAutomatico(orderUuid) {
  const order = orders.find(o => o.uuid === orderUuid);
  if (!order) return;
  
  const codigoValido = gerarCodigoRastreioValido();
  aplicarRastreio(order, codigoValido);
}

// Aplicar rastreio no pedido
function aplicarRastreio(order, code) {
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
  
  // Enviar WhatsApp para o cliente
  enviarWhatsAppRastreio(order, code);
  
  // Enviar notificação para o cliente
  enviarNotificacaoRastreioCliente(order, code);
  
  // Atualizar
  document.getElementById("order-detail-modal")?.remove();
  renderOrders();
  
  // Notificação
  alert(`✓ Rastreio adicionado: ${code}`);
}

// Enviar WhatsApp com código de rastreio
function enviarWhatsAppRastreio(order, code) {
  // Usar o número de WhatsApp do cliente se disponível, senão usar telefone
  const numeroCliente = order.customer.whatsapp || order.customer.phone;
  
  // Validar se tem número de WhatsApp
  if (!numeroCliente) {
    console.warn("Cliente não tem WhatsApp cadastrado");
    return;
  }
  
  // Remover caracteres especiais do número
  const numeroLimpo = numeroCliente.replace(/\D/g, "");
  
  let mensagem = `*📦 SEU PEDIDO FOI DESPACHADO!*%0A%0A`;
  mensagem += `Olá ${order.customer.name},%0A%0A`;
  mensagem += `Seu pedido *${order.id}* acaba de sair para entrega!%0A%0A`;
  mensagem += `*🎯 Código de Rastreio:*%0A`;
  mensagem += `${code}%0A%0A`;
  mensagem += `*📍 Link para acompanhar:*%0A`;
  mensagem += `https://rastreamento.correios.com.br/app/index.php?codigo=${code}%0A%0A`;
  mensagem += `Acompanhe seu pedido em tempo real no link acima!`;
  
  const url = `https://wa.me/55${numeroLimpo}?text=${mensagem}`;
  // Abrir em nova aba
  window.open(url, '_blank');
}

// Enviar notificação para o cliente no site
function enviarNotificacaoRastreioCliente(order, code) {
  // Salvar notificação no localStorage
  const notificacoes = JSON.parse(localStorage.getItem('loja_notificacoes_cliente') || '[]');
  
  notificacoes.push({
    id: order.uuid,
    tipo: 'rastreio',
    orderId: order.id,
    orderUuid: order.uuid,
    titulo: 'Seu pedido foi despachado!',
    mensagem: `Código de rastreio: ${code}`,
    rastreio: code,
    lido: false,
    timestamp: new Date().toISOString(),
  });
  
  localStorage.setItem('loja_notificacoes_cliente', JSON.stringify(notificacoes));
  
  // Disparar evento de sincronização
  const event = new StorageEvent("storage", {
    key: 'loja_notificacoes_cliente',
    newValue: JSON.stringify(notificacoes),
    url: window.location.href,
  });
  window.dispatchEvent(event);
}

// Render All Pages
// ==================================================================================
// PREVIEW LOJA - DRAG AND DROP
// ==================================================================================

function renderPreviewLoja() {
  setupBannerUpload();
  setupLogoUpload();
  renderProductsDragGrid();
  renderCategoriesDragGrid();
}

// Setup Logo Upload
function setupLogoUpload() {
  const logoImage = document.getElementById('logo-image');
  const logoUpload = document.getElementById('logo-upload');
  if (!logoUpload) return;

  const savedLogo = localStorage.getItem('loja_logo_url');
  if (savedLogo && logoImage) {
    logoImage.src = savedLogo;
  }

  logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      if (logoImage) {
        logoImage.src = imageUrl;
        localStorage.setItem('loja_logo_url', imageUrl);
        alert('✅ Logo atualizada com sucesso!');
      }
    };
    reader.readAsDataURL(file);
  });
}

// Setup Banner Upload
function setupBannerUpload() {
  const bannerImage = document.getElementById('banner-image');
  const bannerUpload = document.getElementById('banner-upload');
  const bannerThumbs = document.getElementById('banner-thumbs');

  if (!bannerUpload) return;

  const bannerUrlsKey = 'loja_banner_urls';
  const legacyBannerKey = 'loja_banner_url';
  let rotationTimer = null;

  const getBannerUrls = () => {
    const stored = localStorage.getItem(bannerUrlsKey);
    if (stored) {
      try {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) return list.filter(Boolean);
      } catch (e) {
        return [];
      }
    }

    const legacy = localStorage.getItem(legacyBannerKey);
    return legacy ? [legacy] : [];
  };

  const setBannerUrls = (list) => {
    const next = Array.isArray(list) ? list.filter(Boolean) : [];
    localStorage.setItem(bannerUrlsKey, JSON.stringify(next));
    if (next.length === 1) {
      localStorage.setItem(legacyBannerKey, next[0]);
    } else if (next.length === 0) {
      localStorage.removeItem(legacyBannerKey);
    }
  };

  const startRotation = (list) => {
    if (rotationTimer) {
      window.clearInterval(rotationTimer);
      rotationTimer = null;
    }
    if (!bannerImage || list.length === 0) return;
    let index = 0;
    bannerImage.src = list[0];
    if (list.length <= 1) return;

    rotationTimer = window.setInterval(() => {
      index = (index + 1) % list.length;
      bannerImage.src = list[index];
    }, 4000);
  };

  const renderThumbs = (list) => {
    if (!bannerThumbs) return;
    if (list.length === 0) {
      bannerThumbs.innerHTML = '';
      return;
    }

    bannerThumbs.innerHTML = list.map((url, idx) => `
      <div class="relative group">
        <img src="${url}" alt="Banner ${idx + 1}" class="w-full h-16 object-cover rounded border border-slate-200" />
        <button type="button" data-remove-banner="${idx}" class="absolute top-1 right-1 bg-black/70 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition" aria-label="Remover banner">✕</button>
      </div>
    `).join('');

    bannerThumbs.querySelectorAll('[data-remove-banner]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const removeIndex = Number(btn.dataset.removeBanner);
        const next = list.filter((_, i) => i !== removeIndex);
        setBannerUrls(next);
        renderThumbs(next);
        startRotation(next);
      });
    });
  };

  const initialBanners = getBannerUrls();
  if (bannerImage && initialBanners.length > 0) {
    bannerImage.src = initialBanners[0];
  }
  renderThumbs(initialBanners);
  startRotation(initialBanners);

  // Upload de novas imagens (multiplas)
  bannerUpload.addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const promises = files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(file);
    }));

    Promise.all(promises).then((newUrls) => {
      const merged = [...getBannerUrls(), ...newUrls];
      setBannerUrls(merged);
      renderThumbs(merged);
      startRotation(merged);
      alert('✅ Banners atualizados com sucesso!');
    });
  });
}

// Renderizar Produtos com Drag and Drop
function renderProductsDragGrid() {
  const grid = document.getElementById('products-drag-grid');
  if (!grid) return;

  // Carregando ordem salva
  const productsOrder = JSON.parse(localStorage.getItem('loja_products_order') || '[]');
  const allProducts = getStorage(STORAGE_KEYS.products, []);
  const categoriesOrder = JSON.parse(localStorage.getItem('loja_categories_order') || '[]');
  const allCategories = getStorage(STORAGE_KEYS.categories, []);

  // Ordenar produtos de acordo com a ordem salva
  const sortedProducts = [...allProducts].sort((a, b) => {
    const indexA = productsOrder.indexOf(a.id);
    const indexB = productsOrder.indexOf(b.id);
    return (indexA === -1 ? allProducts.length : indexA) - (indexB === -1 ? allProducts.length : indexB);
  });

  // Ordenar categorias conforme a ordem salva
  const sortedCategories = [...allCategories].sort((a, b) => {
    const indexA = categoriesOrder.indexOf(a);
    const indexB = categoriesOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });

  // Incluir categorias que existam em produtos mas nao estao cadastradas
  const extraCategories = sortedProducts
    .map((product) => product.category)
    .filter((category) => category && !sortedCategories.includes(category));
  const finalCategories = [...sortedCategories, ...extraCategories];

  grid.innerHTML = finalCategories.map((categoryName) => {
    const categoryProducts = sortedProducts.filter((product) => product.category === categoryName);
    if (!categoryProducts.length) {
      return '';
    }

    const categoryItems = categoryProducts.map((product, idx) => `
      <div class="product-drag-item" draggable="true" data-product-id="${product.id}" style="cursor: move;">
        <div class="bg-white border-2 border-slate-300 rounded-lg overflow-hidden hover:border-blue-500 transition p-3">
          <div class="relative w-full h-32 bg-slate-100 rounded mb-2 flex items-center justify-center">
            ${product.colors && product.colors[0] && product.colors[0].image
              ? `<img src="${product.colors[0].image}" alt="${product.name}" class="w-full h-full object-cover">`
              : `<svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
            }
          </div>
          <h4 class="font-semibold text-sm text-slate-900 truncate">${product.name}</h4>
          <p class="text-xs text-slate-600 font-medium">${formatCurrency(Number(product.price) || 0)}</p>
          <p class="text-xs text-blue-600 mt-1 font-medium">🔢 Ordem: ${idx + 1}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="col-span-full">
        <h5 class="text-sm font-semibold text-slate-800 mb-2">${categoryName}</h5>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${categoryItems}
        </div>
      </div>
    `;
  }).join('');

  setupProductDragListeners();
}

// Renderizar Categorias com Drag and Drop
function renderCategoriesDragGrid() {
  const grid = document.getElementById('categories-drag-grid');
  if (!grid) return;

  // Carregando ordem salva
  const categoriesOrder = JSON.parse(localStorage.getItem('loja_categories_order') || '[]');
  const allCategories = getStorage(STORAGE_KEYS.categories, []);

  // Ordenar categorias de acordo com a ordem salva (categorias são strings, não objetos)
  const sortedCategories = [...allCategories].sort((a, b) => {
    const indexA = categoriesOrder.indexOf(a);
    const indexB = categoriesOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
  });

  grid.innerHTML = sortedCategories.map((categoryName, idx) => `
    <div class="category-drag-item" draggable="true" data-category-name="${categoryName}" style="cursor: move;">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg overflow-hidden hover:shadow-lg transition p-4 text-center text-white min-h-[100px] flex flex-col items-center justify-center">
        <div class="text-3xl mb-2">📁</div>
        <h4 class="font-bold text-sm truncate w-full px-2">${categoryName}</h4>
        <p class="text-xs opacity-90 mt-2 font-medium">🖱️ Ordem: ${idx + 1}</p>
      </div>
    </div>
  `).join('');

  setupCategoryDragListeners();
}

// Setup Drag Listeners para Produtos - VERSÃO SIMPLIFICADA
function setupProductDragListeners() {
  const grid = document.getElementById('products-drag-grid');
  if (!grid) return;

  let draggedItem = null;

  // Permitir drop na grid
  grid.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    grid.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
  });

  grid.addEventListener('dragleave', (e) => {
    if (e.target === grid) {
      grid.style.backgroundColor = 'transparent';
    }
  });

  // Soltar na grid
  grid.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    grid.style.backgroundColor = 'transparent';
  });

  // Listeners em cada item
  const items = grid.querySelectorAll('.product-drag-item');
  items.forEach((item) => {
    item.draggable = true;

    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      item.classList.add('opacity-50');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.innerHTML);
    });

    item.addEventListener('dragend', (e) => {
      item.classList.remove('opacity-50');
      item.classList.remove('scale-95');
      draggedItem = null;
      
      // Reset de todos os items
      grid.querySelectorAll('.product-drag-item').forEach(el => {
        el.classList.remove('scale-95', 'border-2', 'border-blue-500');
        el.style.borderTop = '';
      });
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (draggedItem && draggedItem !== item) {
        item.classList.add('scale-95', 'border-2', 'border-blue-500');
      }
    });

    item.addEventListener('dragleave', (e) => {
      if (draggedItem && draggedItem !== item) {
        item.classList.remove('scale-95', 'border-2', 'border-blue-500');
      }
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedItem && draggedItem !== item) {
        // Inserir antes do item alvo
        item.parentNode.insertBefore(draggedItem, item);
        
        // Salvar nova ordem
        salvarOdensProdutos();
      }

      // Limpar estilos
      item.classList.remove('scale-95', 'border-2', 'border-blue-500');
    });
  });
}


// Setup Drag Listeners para Categorias - VERSÃO SIMPLIFICADA
function setupCategoryDragListeners() {
  const grid = document.getElementById('categories-drag-grid');
  if (!grid) return;

  let draggedItem = null;

  // Permitir drop na grid
  grid.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    grid.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
  });

  grid.addEventListener('dragleave', (e) => {
    if (e.target === grid) {
      grid.style.backgroundColor = 'transparent';
    }
  });

  // Soltar na grid
  grid.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    grid.style.backgroundColor = 'transparent';
  });

  // Listeners em cada item
  const items = grid.querySelectorAll('.category-drag-item');
  items.forEach((item) => {
    item.draggable = true;

    item.addEventListener('dragstart', (e) => {
      draggedItem = item;
      item.classList.add('opacity-50');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', item.innerHTML);
    });

    item.addEventListener('dragend', (e) => {
      item.classList.remove('opacity-50');
      item.classList.remove('scale-95');
      draggedItem = null;
      
      // Reset de todos os items
      grid.querySelectorAll('.category-drag-item').forEach(el => {
        el.classList.remove('scale-95', 'border-2', 'border-blue-500');
        el.style.borderTop = '';
      });
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';

      if (draggedItem && draggedItem !== item) {
        item.classList.add('scale-95', 'border-2', 'border-blue-500');
      }
    });

    item.addEventListener('dragleave', (e) => {
      if (draggedItem && draggedItem !== item) {
        item.classList.remove('scale-95', 'border-2', 'border-blue-500');
      }
    });

    item.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedItem && draggedItem !== item) {
        // Inserir antes do item alvo
        item.parentNode.insertBefore(draggedItem, item);
        
        // Salvar nova ordem
        salvarOdensCategorias();
      }

      // Limpar estilos
      item.classList.remove('scale-95', 'border-2', 'border-blue-500');
    });
  });
}

// Salvar Ordem dos Produtos
function salvarOdensProdutos() {
  const items = document.querySelectorAll('.product-drag-item');
  const order = Array.from(items).map((item) => item.dataset.productId);
  localStorage.setItem('loja_products_order', JSON.stringify(order));
  console.log('✅ Ordem de produtos salva:', order);
  
  // Disparar evento de storage para sincronizar com cliente
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'loja_products_order',
    newValue: JSON.stringify(order),
    storageArea: localStorage
  }));
}

// Salvar Ordem das Categorias
function salvarOdensCategorias() {
  const items = document.querySelectorAll('.category-drag-item');
  const order = Array.from(items).map((item) => item.dataset.categoryName);
  localStorage.setItem('loja_categories_order', JSON.stringify(order));
  console.log('✅ Ordem de categorias salva:', order);
  
  // Disparar evento de storage para sincronizar com cliente
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'loja_categories_order',
    newValue: JSON.stringify(order),
    storageArea: localStorage
  }));
}

// ==================================================================================
// FIM PREVIEW LOJA
// ==================================================================================

function renderAllPages() {
  renderDashboard();
  renderCategorySelect();
  renderCategories();
  renderProducts();
  renderOrders();
  renderTracking();
  renderCheckouts();
  renderPreviewLoja();
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

// Função de rastreamento via API Linketrack para Admin
async function buscarRastreioAdmin() {
    const codigo = document.getElementById('codigo_rastreio_admin').value.trim();
    const container = document.getElementById('status-container-admin');
    const listaEventos = document.getElementById('lista-eventos-admin');
    const ultimoStatus = document.getElementById('ultimo-status-admin');

    if (!codigo) {
        alert("Digite o código!");
        return;
    }

    try {
        // Chamada para a API Linketrack
        const response = await fetch(`https://api.linketrack.com/track/json?user=teste&token=1abcd234efgh567jklmn&codigo=${codigo}`);
        const data = await response.json();

        container.classList.remove('hidden');
        listaEventos.innerHTML = ""; // Limpa busca anterior
        ultimoStatus.innerHTML = "";

        // Verifica se há eventos
        if (!data.eventos || data.eventos.length === 0) {
            ultimoStatus.innerHTML = `<div style="color: #ff6b6b; text-align: center; padding: 20px;">Nenhum rastreamento encontrado para este código.</div>`;
            return;
        }

        // Mostra último status
        const ultimoEvento = data.eventos[0];
        ultimoStatus.innerHTML = `
            <div style="background: #1e1e1e; border: 2px solid #00ff00; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="color: #00ff00; font-weight: bold; font-size: 16px;">✅ ÚLTIMO STATUS</div>
                <div style="color: #fff; margin-top: 10px;">
                    <div><strong>${ultimoEvento.status}</strong></div>
                    <div style="color: #888; font-size: 14px;">${ultimoEvento.data} ${ultimoEvento.hora}</div>
                    <div style="color: #ccc; margin-top: 5px;">${ultimoEvento.local}</div>
                </div>
            </div>
        `;

        // Mapeia os eventos retornados
        listaEventos.innerHTML += `<div style="color: #00ff00; font-weight: bold; margin-bottom: 15px;">📋 HISTÓRICO COMPLETO</div>`;
        data.eventos.forEach(evento => {
            listaEventos.innerHTML += `
                <div class="evento" style="border-left: 2px solid #fff; padding-left: 15px; margin-bottom: 20px; color: #fff;">
                    <div style="font-size: 0.8rem; color: #888;">${evento.data} ${evento.hora}</div>
                    <div style="font-weight: bold; margin-top: 5px;">${evento.status}</div>
                    <div style="color: #ccc; margin-top: 5px;">${evento.local}</div>
                </div>
            `;
        });
    } catch (error) {
        alert("Erro ao buscar rastreio. Verifique o código.");
        console.error("Erro:", error);
    }
}

// Initialize on Load
window.addEventListener("DOMContentLoaded", init);
