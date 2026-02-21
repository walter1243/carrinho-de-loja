// Storage Keys
const STORAGE_KEYS = {
  customers: "loja_minimal_customers",
  orders: "loja_minimal_orders",
  currentCustomer: "loja_minimal_current_customer",
  cart: "loja_minimal_cart",
  products: "loja_minimal_products",
  categories: "loja_minimal_categories",
};

// Default Products
const defaultProducts = [
  {
    id: "prod-1",
    name: "Vestido Minimal Branco",
    price: 129.9,
    category: "vestidos",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod-2",
    name: "Bolsa Clean Preta",
    price: 89.9,
    category: "promocoes",
    image: "https://images.unsplash.com/photo-1591348122449-8d32b2f252f8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod-3",
    name: "Conjunto Casual Bege",
    price: 159.9,
    category: "blusas",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod-4",
    name: "Jaqueta Urban Preta",
    price: 219.9,
    category: "jaquetas",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod-5",
    name: "Camiseta Premium Cinza",
    price: 49.9,
    category: "blusas",
    image: "https://images.unsplash.com/photo-1514259802853-8e8eb39361b9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "prod-6",
    name: "Calça Skinny Preta",
    price: 99.9,
    category: "geral",
    image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?auto=format&fit=crop&w=900&q=80",
  },
];

// DOM Elements - Header
const profileBtn = document.getElementById("profileBtn");
const openCartBtn = document.getElementById("openCartBtn");
const logoutBtn = document.getElementById("logoutBtn");
const cartCount = document.getElementById("cartCount");

// DOM Elements - Auth
const authSection = document.getElementById("authSection");
const clientSection = document.getElementById("clientSection");
const closeAuthBtn = document.getElementById("closeAuthBtn");
const loginTabBtn = document.getElementById("loginTabBtn");
const signupTabBtn = document.getElementById("signupTabBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginFormBtn = document.getElementById("loginFormBtn");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupPasswordConfirm = document.getElementById("signupPasswordConfirm");
const signupFormBtn = document.getElementById("signupFormBtn");
const authMessage = document.getElementById("authMessage");

// DOM Elements - Cart & Checkout
const cartModal = document.getElementById("cartModal");
const cartBackdrop = document.getElementById("cartBackdrop");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartList = document.getElementById("cartList");
const cartItemCount = document.getElementById("cartItemCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const clientMessage = document.getElementById("clientMessage");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const backToStoreBtn = document.getElementById("backToStoreBtn");
const checkoutPrevBtn = document.getElementById("checkoutPrevBtn");
const checkoutNextBtn = document.getElementById("checkoutNextBtn");
const checkoutAddress = document.getElementById("checkoutAddress");
const checkoutCity = document.getElementById("checkoutCity");
const checkoutState = document.getElementById("checkoutState");
const paymentCardTab = document.getElementById("paymentCardTab");
const paymentPixTab = document.getElementById("paymentPixTab");
const paymentCardPanel = document.getElementById("paymentCardPanel");
const paymentPixPanel = document.getElementById("paymentPixPanel");
const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCvv = document.getElementById("cardCvv");
const generatePixBtn = document.getElementById("generatePixBtn");
const pixCode = document.getElementById("pixCode");
const pixCodeValue = document.getElementById("pixCodeValue");
const copyPixBtn = document.getElementById("copyPixBtn");
const checkoutCartList = document.getElementById("checkoutCartList");
const checkoutSummary = document.getElementById("checkoutSummary");
const checkoutTotal = document.getElementById("checkoutTotal");
const confirmOrderBtn = document.getElementById("confirmOrderBtn");
const checkoutMessage = document.getElementById("checkoutMessage");

// DOM Elements - Product
const productGrid = document.getElementById("productGrid");
const promoCardsGrid = document.getElementById("promoCardsGrid");
const productSearch = document.getElementById("productSearch");
const productModal = document.getElementById("productModal");
const productBackdrop = document.getElementById("productBackdrop");
const closeProductBtn = document.getElementById("closeProductBtn");
const productModalTitle = document.getElementById("productModalTitle");
const productModalImage = document.getElementById("productModalImage");
const productModalPrice = document.getElementById("productModalPrice");
const productColors = document.getElementById("productColors");
const productSizes = document.getElementById("productSizes");
const qtyMinusBtn = document.getElementById("qtyMinusBtn");
const qtyPlusBtn = document.getElementById("qtyPlusBtn");
const qtyValue = document.getElementById("qtyValue");
const addToCartModalBtn = document.getElementById("addToCartModalBtn");

// DOM Elements - Menu
const menuBtn = document.getElementById("menuBtn");
const logoBtn = document.getElementById("logoBtn");
const categoriesModal = document.getElementById("categoriesModal");
const categoriesBackdrop = document.getElementById("categoriesBackdrop");
const closeCategoriesBtn = document.getElementById("closeCategoriesBtn");
const categoriesList = document.getElementById("categoriesList");
const categoryCarousels = document.getElementById("categoryCarousels");
const searchWrap = document.getElementById("searchWrap");

// State
let customers = getStorage(STORAGE_KEYS.customers, []);
let orders = getStorage(STORAGE_KEYS.orders, []);
let currentCustomer = getStorage(STORAGE_KEYS.currentCustomer, null);
let cart = getStorage(STORAGE_KEYS.cart, []);
let products = getStorage(STORAGE_KEYS.products, defaultProducts);
let categories = getStorage(STORAGE_KEYS.categories, []);
let currentCheckoutStep = 0;
let selectedColor = "";
let selectedSize = "";
let selectedQty = 1;
let selectedProductId = "";

// Utility Functions
function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function saveCustomers() {
  setStorage(STORAGE_KEYS.customers, customers);
}

function saveOrders() {
  setStorage(STORAGE_KEYS.orders, orders);
}

function saveCurrentCustomer() {
  setStorage(STORAGE_KEYS.currentCustomer, currentCustomer);
}

function saveCart() {
  setStorage(STORAGE_KEYS.cart, cart);
}

function showMessage(target, message, type = "success") {
  target.textContent = message;
  if (type === "error") {
    target.classList.remove("text-emerald-600");
    target.classList.add("text-rose-600");
    return;
  }
  target.classList.remove("text-rose-600");
  target.classList.add("text-emerald-600");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Auth Functions
function showLoginForm() {
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  loginTabBtn.classList.add("border-b-2", "border-slate-900", "text-slate-900");
  loginTabBtn.classList.remove("border-b-2", "border-transparent", "text-slate-500");
  signupTabBtn.classList.add("border-b-2", "border-transparent", "text-slate-500");
  signupTabBtn.classList.remove("border-b-2", "border-slate-900", "text-slate-900");
}

function showSignupForm() {
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  signupTabBtn.classList.add("border-b-2", "border-slate-900", "text-slate-900");
  signupTabBtn.classList.remove("border-b-2", "border-transparent", "text-slate-500");
  loginTabBtn.classList.add("border-b-2", "border-transparent", "text-slate-500");
  loginTabBtn.classList.remove("border-b-2", "border-slate-900", "text-slate-900");
}

function renderByCustomer() {
  // Sempre mostrar produtos
  clientSection.classList.remove("hidden");
  renderProducts();
  renderPromoCards();
  renderCategoryCarousels();
  renderCart();

  if (currentCustomer) {
    openCartBtn.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");
    profileBtn.classList.add("hidden");
  } else {
    openCartBtn.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    profileBtn.classList.remove("hidden");
  }
}

function registerCustomer(name, email, password) {
  if (customers.some((c) => c.email === email)) {
    showMessage(authMessage, "Este email já está cadastrado.", "error");
    return false;
  }

  customers.push({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  });

  saveCustomers();
  return true;
}

function loginCustomer(email, password) {
  const customer = customers.find((c) => c.email === email && c.password === password);
  if (!customer) {
    return null;
  }
  return customer;
}

// Cart Functions
function addProductToCart(productId, color, size, qty) {
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return;
  }

  const cartItem = cart.find(
    (item) =>
      item.id === productId && item.color === color && item.size === size
  );

  if (cartItem) {
    cartItem.quantity += qty;
  } else {
    // Encontrar a imagem da cor selecionada
    let itemImage = product.image; // Fallback para imagem antiga
    if (product.colors && product.colors.length > 0) {
      const selectedColorObj = product.colors.find(c => c.name === color);
      if (selectedColorObj && selectedColorObj.image) {
        itemImage = selectedColorObj.image;
      } else {
        itemImage = product.colors[0].image; // Usar primeira cor se não encontrar
      }
    }
    
    cart.push({
      ...product,
      color,
      size,
      quantity: qty,
      image: itemImage // Garantir que tem a imagem correta
    });
  }

  saveCart();
  renderCart();
  showMessage(clientMessage, "Produto adicionado ao carrinho!", "success");
}

function renderCart() {
  cartList.innerHTML = "";
  cartItemCount.textContent = cart.length;

  let subtotal = 0;

  if (cart.length === 0) {
    cartList.innerHTML =
      '<li class="text-center text-sm text-slate-500 py-8">Seu carrinho está vazio</li>';
    cartTotal.textContent = formatCurrency(0);
    cartSubtotal.textContent = formatCurrency(0);
    return;
  }

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;

    // Garantir que item tem imagem (compatibilidade com dados antigos)
    let itemImage = item.image;
    let colorHex = "#808080"; // Cor padrão cinza
    
    const product = products.find(p => p.id === item.id);
    if (product && product.colors && product.colors.length > 0) {
      const colorObj = product.colors.find(c => c.name === item.color);
      if (colorObj) {
        itemImage = colorObj.image;
        colorHex = colorObj.hex;
      } else {
        itemImage = product.colors[0].image;
      }
    }
    
    if (!itemImage) {
      itemImage = item.image;
    }

    const li = document.createElement("li");
    li.className =
      "flex gap-3 items-start pb-3 border-b border-slate-200 last:border-0";
    li.innerHTML = `
      <img src="${itemImage || 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"80\" height=\"80\"%3E%3Crect fill=\"%23ddd\" width=\"80\" height=\"80\"/%3E%3C/svg%3E'}" alt="" class="w-20 h-20 object-cover rounded-lg" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-900 line-clamp-1">${item.name}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="w-5 h-5 rounded-full border-2 border-slate-300" style="background-color: ${colorHex};" title="${item.color}"></div>
          <span class="text-xs text-slate-500">${item.size || 'Único'} × ${item.quantity}</span>
        </div>
        <p class="text-sm font-semibold text-emerald-600 mt-1">${formatCurrency(
          item.price * item.quantity
        )}</p>
      </div>
      <div class="flex gap-1 flex-col">
        <button class="cart-action text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition" data-id="${item.id}" data-action="increase" data-color="${item.color}" data-size="${item.size}">
          +
        </button>
        <button class="cart-action text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition" data-id="${item.id}" data-action="decrease" data-color="${item.color}" data-size="${item.size}">
          −
        </button>
        <button class="cart-action text-xs px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-600 transition" data-id="${item.id}" data-action="remove" data-color="${item.color}" data-size="${item.size}">
          ✕
        </button>
      </div>
    `;
    cartList.appendChild(li);
  });

  cartSubtotal.textContent = formatCurrency(subtotal);
  const total = subtotal;
  cartTotal.textContent = formatCurrency(total);
  updateCartBadge();
}

function updateCartBadge() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
  cartCount.parentElement.classList.toggle("hidden", totalQuantity === 0);
}

// Product Modal Functions
function renderProductModal(product) {
  selectedProductId = product.id;
  selectedColor = "";
  selectedSize = "";
  selectedQty = 1;

  productModalTitle.textContent = product.name;
  productModalPrice.textContent = formatCurrency(product.price);
  qtyValue.textContent = "1";

  // Verificar se produto tem cores com imagens
  const hasColors = product.colors && product.colors.length > 0;
  
  if (hasColors) {
    // Usar imagem da primeira cor como padrão
    productModalImage.src = product.colors[0].image;
    selectedColor = product.colors[0].name; // Selecionar primeira cor automaticamente
    
    // Renderizar seletor de cores (bolinhas clicáveis)
    productColors.innerHTML = product.colors
      .map((color, idx) => {
        return `<button 
          class="product-color-btn w-8 h-8 rounded-full border-2 transition hover:scale-110 ${idx === 0 ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-300'}" 
          style="background-color: ${color.hex};"
          data-color="${color.name}"
          data-color-idx="${idx}"
          data-image="${color.image}"
          title="${color.name}"
        ></button>`;
      })
      .join("");
    
    // Event listeners para trocar imagem ao clicar na cor
    document.querySelectorAll('.product-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Remover seleção de todos
        document.querySelectorAll('.product-color-btn').forEach(b => {
          b.classList.remove('border-slate-900', 'ring-2', 'ring-slate-900');
          b.classList.add('border-slate-300');
        });
        
        // Adicionar seleção ao clicado
        e.currentTarget.classList.remove('border-slate-300');
        e.currentTarget.classList.add('border-slate-900', 'ring-2', 'ring-slate-900');
        
        // Trocar imagem
        const newImage = e.currentTarget.dataset.image;
        productModalImage.src = newImage;
        
        // Atualizar cor selecionada
        selectedColor = e.currentTarget.dataset.color;
      });
    });
  } else {
    // Produto antigo sem cores - usar imagem padrão
    productModalImage.src = product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E';
    
    // Cores padrão (compatibilidade)
    const defaultColors = getProductColors(product);
    productColors.innerHTML = defaultColors
      .map((color) => {
        return `<button class="product-color-btn px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-slate-100 transition" data-color="${color}">${color}</button>`;
      })
      .join("");
  }

  // Sizes
  const sizes = getProductSizes(product);
  productSizes.innerHTML = sizes
    .map((size) => {
      return `<button class="product-size-btn px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-slate-100 transition" data-size="${size}">${size}</button>`;
    })
    .join("");

  productModal.classList.remove("hidden");
  productModal.classList.add("flex");
}

function closeProductModal() {
  productModal.classList.add("hidden");
  productModal.classList.remove("flex");
}

function getProductColors(product) {
  if (Array.isArray(product?.colors) && product.colors.length) {
    return product.colors;
  }
  return ["Preto", "Branco", "Cinza", "Azul"];
}

function getProductSizes(product) {
  if (Array.isArray(product?.sizes) && product.sizes.length) {
    return product.sizes;
  }
  return ["P", "M", "G", "GG"];
}

// Products Functions
function renderProducts() {
  // Debug: garantir que há produtos
  if (!products || products.length === 0) {
    products = defaultProducts;
  }
  
  const visibleProducts = products.filter((p) => p.selected !== false);
  productGrid.innerHTML = "";

  if (visibleProducts.length === 0) {
    productGrid.innerHTML =
      '<p class="col-span-full text-center text-sm text-slate-500">Nenhum produto disponível.</p>';
    return;
  }

  visibleProducts.forEach((product) => {
    const article = document.createElement("article");
    article.className =
      "bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer";
    
    // Usar imagem da primeira cor, ou imagem padrão se não houver cores
    const productImage = product.colors && product.colors.length > 0 
      ? product.colors[0].image 
      : (product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E');
    
    article.innerHTML = `
      <img src="${productImage}" alt="${product.name}" class="w-full aspect-square object-cover" />
      <div class="p-3">
        <h3 class="text-sm font-semibold line-clamp-2">${product.name}</h3>
        <p class="text-emerald-600 font-bold mt-2">${formatCurrency(product.price)}</p>
        ${product.colors && product.colors.length > 1 ? `<p class="text-xs text-slate-500 mt-1">${product.colors.length} cores disponíveis</p>` : ''}
      </div>
    `;

    article.addEventListener("click", () => {
      // Fechar checkout se estiver aberto
      if (!checkoutModal.classList.contains("hidden")) {
        checkoutModal.classList.add("hidden");
        checkoutModal.classList.remove("flex");
      }
      renderProductModal(product);
    });

    productGrid.appendChild(article);
  });
}

function renderPromoCards() {
  // Debug: garantir que há produtos
  if (!products || products.length === 0) {
    products = defaultProducts;
  }
  
  promoCardsGrid.innerHTML = "";
  const source = products
    .filter((p) => p.selected !== false)
    .slice()
    .sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

  if (!source.length) {
    return;
  }

  const items = source.slice(0, 4);
  const card = document.createElement("article");
  card.className = "promo-single-card";
  card.innerHTML = `
    <div class="promo-card-header">
      <h4>Oversized Bulk Basica</h4>
    </div>
    <div class="promo-products-grid-2x2">
      ${items
        .map(
          (product) => {
            const productImage = product.colors && product.colors.length > 0 
              ? product.colors[0].image 
              : (product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E');
            
            return `
          <div class="promo-product" data-id="${product.id}">
            <img src="${productImage}" alt="${product.name}" />
            <div class="promo-product-body">
              <p class="promo-product-name">${product.name}</p>
              <p class="promo-product-price">${formatCurrency(product.price)}</p>
            </div>
          </div>
        `;
          }
        )
        .join("")}
    </div>
  `;
  promoCardsGrid.appendChild(card);

  card.querySelectorAll(".promo-product").forEach((item) => {
    item.addEventListener("click", () => {
      const productId = item.dataset.id;
      const product = products.find((p) => p.id === productId);
      if (product) {
        renderProductModal(product);
      }
    });
  });
}

function renderCategoryCarousels() {
  // Debug: garantir que há produtos
  if (!products || products.length === 0) {
    products = defaultProducts;
  }
  
  const container = document.getElementById("categoryCarousels");
  if (!container) {
    return;
  }

  container.innerHTML = "";
  const visibleProducts = products.filter((p) => p.selected !== false);
  const categoriesMap = new Map();

  visibleProducts.forEach((product) => {
    const category = getProductCategory(product);
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, []);
    }
    categoriesMap.get(category).push(product);
  });

  categoriesMap.forEach((categoryProducts, category) => {
    if (categoryProducts.length === 0) {
      return;
    }

    const section = document.createElement("section");
    section.className = "category-carousel-section";
    const carouselId = `carousel-${category}`;
    const prevBtnId = `prev-${category}`;
    const nextBtnId = `next-${category}`;

    section.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-slate-900">${formatCategoryLabel(category)}</h3>
      </div>
      <div class="category-carousel-wrap">
        <button id="${prevBtnId}" class="category-nav category-prev" type="button" aria-label="Anterior">
          <span aria-hidden="true">&#8249;</span>
        </button>
        <div id="${carouselId}" class="category-carousel">
          ${categoryProducts
            .map(
              (product) => {
                const productImage = product.colors && product.colors.length > 0 
                  ? product.colors[0].image 
                  : (product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E');
                
                return `
              <div class="category-product" data-id="${product.id}">
                <img src="${productImage}" alt="${product.name}" />
                <div class="category-product-body">
                  <p class="category-product-name">${product.name}</p>
                  <p class="category-product-price">${formatCurrency(product.price)}</p>
                </div>
              </div>
            `;
              }
            )
            .join("")}
        </div>
        <button id="${nextBtnId}" class="category-nav category-next" type="button" aria-label="Proximo">
          <span aria-hidden="true">&#8250;</span>
        </button>
      </div>
    `;

    container.appendChild(section);

    const carousel = document.getElementById(carouselId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);

    if (carousel && prevBtn && nextBtn) {
      const updateNavState = () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        prevBtn.disabled = carousel.scrollLeft <= 0;
        nextBtn.disabled = carousel.scrollLeft >= maxScroll - 2;
      };

      carousel.addEventListener("scroll", updateNavState);

      prevBtn.addEventListener("click", () => {
        const scrollStep = carousel.firstElementChild?.getBoundingClientRect().width || 200;
        carousel.scrollBy({ left: -(scrollStep + 16), behavior: "smooth" });
      });

      nextBtn.addEventListener("click", () => {
        const scrollStep = carousel.firstElementChild?.getBoundingClientRect().width || 200;
        carousel.scrollBy({ left: scrollStep + 16, behavior: "smooth" });
      });

      updateNavState();
    }

    carousel.querySelectorAll(".category-product").forEach((item) => {
      item.addEventListener("click", () => {
        const productId = item.dataset.id;
        const product = products.find((p) => p.id === productId);
        if (product) {
          renderProductModal(product);
        }
      });
    });
  });
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function inferCategoryByName(name) {
  const value = normalizeText(name);
  if (value.includes("jaqueta") || value.includes("casaco")) {
    return "jaquetas";
  }
  if (value.includes("promo") || value.includes("oferta") || value.includes("sale")) {
    return "promocoes";
  }
  if (value.includes("blusa") || value.includes("camisa") || value.includes("top") || value.includes("conjunto")) {
    return "blusas";
  }
  if (value.includes("vestido")) {
    return "vestidos";
  }
  return "geral";
}

function formatCategoryLabel(category) {
  const labels = {
    promocoes: "Promoções",
    jaquetas: "Jaquetas",
    blusas: "Blusas",
    vestidos: "Vestidos",
    geral: "Geral",
  };
  return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

function getProductCategory(product) {
  return normalizeText(product.category || inferCategoryByName(product.name));
}

// Categories Menu
function renderCategories() {
  categoriesList.innerHTML = "";
  const uniqueCategories = [...new Set(products.map((p) => getProductCategory(p)))];

  uniqueCategories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="category-select w-full text-left text-sm font-medium py-2 px-3 rounded-lg hover:bg-slate-100 transition" data-category="${category}">
        ${formatCategoryLabel(category)}
      </button>
    `;
    categoriesList.appendChild(li);
  });
}

// Event Listeners - Auth
loginTabBtn.addEventListener("click", showLoginForm);
signupTabBtn.addEventListener("click", showSignupForm);

closeAuthBtn.addEventListener("click", () => {
  authSection.classList.add("hidden");
  clientSection.classList.remove("hidden");
});

loginFormBtn.addEventListener("click", () => {
  authMessage.textContent = "";
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showMessage(authMessage, "Preencha todos os campos.", "error");
    return;
  }

  const customer = loginCustomer(email, password);
  if (!customer) {
    showMessage(authMessage, "Email ou senha inválidos.", "error");
    return;
  }

  currentCustomer = customer;
  saveCurrentCustomer();
  loginEmail.value = "";
  loginPassword.value = "";
  renderByCustomer();

  // Ir para checkout automaticamente se tem carrinho
  if (cart.length > 0) {
    authSection.classList.add("hidden");
    currentCheckoutStep = 0;
    checkoutModal.classList.remove("hidden");
    checkoutModal.classList.add("flex");
    renderCheckoutPanel(0);
  }
});

signupFormBtn.addEventListener("click", () => {
  authMessage.textContent = "";
  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const passwordConfirm = signupPasswordConfirm.value.trim();

  if (!name || !email || !password || !passwordConfirm) {
    showMessage(authMessage, "Preencha todos os campos.", "error");
    return;
  }

  if (password !== passwordConfirm) {
    showMessage(authMessage, "As senhas não coincidem.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage(authMessage, "A senha deve ter pelo menos 6 caracteres.", "error");
    return;
  }

  if (registerCustomer(name, email, password)) {
    showMessage(authMessage, "Conta criada com sucesso! Faça login para continuar.", "success");
    showLoginForm();
    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupPasswordConfirm.value = "";
  }
});

profileBtn.addEventListener("click", () => {
  loginTabBtn.click();
});

// Event Listeners - Cart
openCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
});

cartBackdrop.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
});

backToStoreBtn.addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
  checkoutModal.classList.remove("flex");
});

cartList.addEventListener("click", (event) => {
  const button = event.target.closest(".cart-action");
  if (!button) {
    return;
  }

  const { id, action, color, size } = button.dataset;
  const item = cart.find(
    (cartItem) => cartItem.id === id && cartItem.color === color && cartItem.size === size
  );

  if (!item) {
    return;
  }

  if (action === "increase") {
    item.quantity += 1;
  } else if (action === "decrease") {
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
  } else if (action === "remove") {
    cart = cart.filter(
      (cartItem) =>
        !(cartItem.id === id && cartItem.color === color && cartItem.size === size)
    );
  }

  saveCart();
  renderCart();
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showMessage(clientMessage, "Adicione produtos ao carrinho para continuar.", "error");
    return;
  }

  // Exigir login no checkout
  if (!currentCustomer) {
    // Mostrar tela de login
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
    authSection.classList.remove("hidden");
    return;
  }

  // Se autenticado, ir para checkout
  currentCheckoutStep = 0;
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
  checkoutModal.classList.remove("hidden");
  checkoutModal.classList.add("flex");
  renderCheckoutPanel(0);
});

// Event Listeners - Product Modal
productBackdrop.addEventListener("click", closeProductModal);
closeProductBtn.addEventListener("click", closeProductModal);

document.addEventListener("click", (event) => {
  const colorBtn = event.target.closest(".product-color-btn");
  if (colorBtn) {
    document.querySelectorAll(".product-color-btn").forEach((btn) => {
      btn.classList.remove("bg-slate-900", "text-white");
    });
    colorBtn.classList.add("bg-slate-900", "text-white");
    selectedColor = colorBtn.dataset.color;
  }

  const sizeBtn = event.target.closest(".product-size-btn");
  if (sizeBtn) {
    document.querySelectorAll(".product-size-btn").forEach((btn) => {
      btn.classList.remove("bg-slate-900", "text-white");
    });
    sizeBtn.classList.add("bg-slate-900", "text-white");
    selectedSize = sizeBtn.dataset.size;
  }
});

qtyMinusBtn.addEventListener("click", () => {
  if (selectedQty > 1) {
    selectedQty -= 1;
    qtyValue.textContent = selectedQty;
  }
});

qtyPlusBtn.addEventListener("click", () => {
  selectedQty += 1;
  qtyValue.textContent = selectedQty;
});

addToCartModalBtn.addEventListener("click", () => {
  if (!selectedColor) {
    showMessage(clientMessage, "Selecione uma cor.", "error");
    return;
  }
  if (!selectedSize) {
    showMessage(clientMessage, "Selecione um tamanho.", "error");
    return;
  }

  addProductToCart(selectedProductId, selectedColor, selectedSize, selectedQty);
  closeProductModal();
});

// Event Listeners - Menu
menuBtn.addEventListener("click", () => {
  renderCategories();
  categoriesModal.classList.remove("hidden");
  categoriesModal.classList.add("flex");
});

categoriesBackdrop.addEventListener("click", () => {
  categoriesModal.classList.add("hidden");
  categoriesModal.classList.remove("flex");
});

closeCategoriesBtn.addEventListener("click", () => {
  categoriesModal.classList.add("hidden");
  categoriesModal.classList.remove("flex");
});

// Event Listeners - Logout
logoutBtn.addEventListener("click", () => {
  currentCustomer = null;
  saveCurrentCustomer();
  cart = [];
  saveCart();
  renderByCustomer();
  showLoginForm();
  authMessage.textContent = "";
});

// Checkout Functions
function renderCheckoutPanel(step) {
  const panels = document.querySelectorAll("[data-panel]");
  panels.forEach((panel) => {
    panel.classList.add("hidden");
  });
  document.querySelector(`[data-panel="${step}"]`).classList.remove("hidden");

  const stepButtons = document.querySelectorAll(".checkout-step");
  stepButtons.forEach((btn, index) => {
    if (index === step) {
      btn.classList.add("border-b-2", "border-slate-900", "text-slate-900");
      btn.classList.remove("border-transparent", "text-slate-500");
    } else {
      btn.classList.remove("border-b-2", "border-slate-900", "text-slate-900");
      btn.classList.add("border-transparent", "text-slate-500");
    }
  });

  if (step === 0) {
    renderCheckoutItems();
  } else if (step === 3) {
    renderCheckoutSummary();
  }
}

function renderCheckoutItems() {
  checkoutCartList.innerHTML = "";
  cart.forEach((item) => {
    // Garantir que item tem imagem e cor hex
    let itemImage = item.image;
    let colorHex = "#808080"; // Cor padrão cinza
    
    const product = products.find(p => p.id === item.id);
    if (product && product.colors && product.colors.length > 0) {
      const colorObj = product.colors.find(c => c.name === item.color);
      if (colorObj) {
        itemImage = colorObj.image;
        colorHex = colorObj.hex;
      } else {
        itemImage = product.colors[0].image;
      }
    }
    
    if (!itemImage) {
      itemImage = item.image;
    }
    
    const li = document.createElement("li");
    li.className =
      "flex gap-3 items-start pb-3 border-b border-slate-200 last:border-0";
    li.innerHTML = `
      <img src="${itemImage || 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"64\" height=\"64\"%3E%3Crect fill=\"%23ddd\" width=\"64\" height=\"64\"/%3E%3C/svg%3E'}" alt="" class="w-16 h-16 object-cover rounded-lg" />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-slate-900">${item.name}</p>
        <div class="flex items-center gap-2 mt-0.5">
          <div class="w-5 h-5 rounded-full border-2 border-slate-300" style="background-color: ${colorHex};" title="${item.color}"></div>
          <span class="text-xs text-slate-500">${item.size || 'Único'} × ${item.quantity}</span>
        </div>
        <p class="text-sm font-semibold text-emerald-600 mt-1">${formatCurrency(
          item.price * item.quantity
        )}</p>
      </div>
    `;
    checkoutCartList.appendChild(li);
  });
}

function renderCheckoutSummary() {
  checkoutSummary.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "flex justify-between text-sm";
    li.innerHTML = `
      <span class="text-slate-600">${item.name} (${item.quantity}x)</span>
      <span class="font-medium">${formatCurrency(itemTotal)}</span>
    `;
    checkoutSummary.appendChild(li);
  });

  checkoutTotal.textContent = formatCurrency(total);
}

checkoutPrevBtn.addEventListener("click", () => {
  if (currentCheckoutStep > 0) {
    currentCheckoutStep -= 1;
    renderCheckoutPanel(currentCheckoutStep);
  }
});

checkoutNextBtn.addEventListener("click", () => {
  checkoutMessage.textContent = "";

  if (currentCheckoutStep === 1) {
    const address = checkoutAddress.value.trim();
    const city = checkoutCity.value.trim();
    const state = checkoutState.value.trim();

    if (!address || !city || !state) {
      showMessage(checkoutMessage, "Preencha todos os dados de envio.", "error");
      return;
    }
  } else if (currentCheckoutStep === 2) {
    const activeTab =
      paymentCardPanel.classList.contains("hidden") === false;

    if (activeTab) {
      const name = cardName.value.trim();
      const number = cardNumber.value.trim();
      const expiry = cardExpiry.value.trim();
      const cvv = cardCvv.value.trim();

      if (!name || !number || !expiry || !cvv) {
        showMessage(checkoutMessage, "Preencha todos os dados do cartão.", "error");
        return;
      }
    } else {
      if (!pixCodeValue.textContent) {
        showMessage(checkoutMessage, "Gere a chave PIX primeiro.", "error");
        return;
      }
    }
  }

  if (currentCheckoutStep < 3) {
    currentCheckoutStep += 1;
    renderCheckoutPanel(currentCheckoutStep);
  }
});

confirmOrderBtn.addEventListener("click", () => {
  checkoutMessage.textContent = "";

  // Validação robusta dos dados
  const address = checkoutAddress.value.trim();
  const city = checkoutCity.value.trim();
  const state = checkoutState.value.trim();
  const phone = checkoutPhone.value.trim();
  
  // Validar campos obrigatórios
  if (!address || !city || !state || !phone) {
    showMessage(checkoutMessage, "Preencha todos os dados de envio.", "error");
    return;
  }
  
  // Validar itens do carrinho
  if (!cart || cart.length === 0) {
    showMessage(checkoutMessage, "Carrinho vazio. Adicione produtos para continuar.", "error");
    return;
  }
  
  // Validar que cada item tem cor, tamanho e quantidade
  const hasInvalidItems = cart.some(item => !item.color || !item.size || !item.quantity || item.quantity < 1);
  if (hasInvalidItems) {
    showMessage(checkoutMessage, "Dados de produto incompletos. Revise seu carrinho.", "error");
    return;
  }

  // Gerar ID do pedido único (6 caracteres)
  const orderId = 'PED' + Date.now().toString().slice(-9).substring(0, 6);
  
  // Criar objeto do pedido com estrutura robusta
  const order = {
    // Identificação
    id: orderId,
    uuid: crypto.randomUUID(), // UUID para sincronização
    
    // Cliente
    customer: {
      id: currentCustomer.id,
      name: currentCustomer.name,
      email: currentCustomer.email,
      phone: phone,
    },
    
    // Endereço de envio
    shipping: {
      address: address,
      city: city,
      state: state,
      country: "Brasil",
    },
    
    // Items do pedido
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      subtotal: item.price * item.quantity,
    })),
    
    // Totais
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    shipping_cost: 0, // Será adicionado depois
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    
    // Status e rastreio
    status: "pendente_processamento", // Estados: pendente_processamento → processando → enviado → entregue
    tracking: {
      code: null, // Código dos Correios
      carrier: "Correios",
      url: null, // URL de rastreio
      history: [],
    },
    
    // Timestamps
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Salvar na lista de pedidos do cliente
  orders.push(order);
  saveOrders();
  
  // Sincronizar com admin (loja_minimal_orders)
  const adminOrders = JSON.parse(localStorage.getItem("loja_minimal_orders") || "[]");
  adminOrders.push(order);
  localStorage.setItem("loja_minimal_orders", JSON.stringify(adminOrders));
  
  // Trigger de sincronização (storage event)
  const event = new StorageEvent("storage", {
    key: "loja_minimal_orders",
    newValue: JSON.stringify(adminOrders),
    url: window.location.href,
  });
  window.dispatchEvent(event);
  
  cart = [];
  saveCart();

  showMessage(checkoutMessage, "✓ Pedido confirmado! Número: " + order.id, "success");
  setTimeout(() => {
    checkoutModal.classList.add("hidden");
    checkoutModal.classList.remove("flex");
    renderCart();
    renderCheckoutPanel(0);
  }, 2000);
});

// ============ SISTEMA DE PEDIDOS DO CLIENTE ============

// Elementos DOM - Pedidos
const ordersBtn = document.getElementById("ordersBtn");
const ordersModal = document.getElementById("ordersModal");
const ordersBackdrop = document.getElementById("ordersBackdrop");
const closeOrdersBtn = document.getElementById("closeOrdersBtn");
const ordersList = document.getElementById("ordersList");

// Abrir modal de pedidos
ordersBtn.addEventListener("click", () => {
  renderMyOrders();
  ordersModal.classList.remove("hidden");
});

// Fechar modal de pedidos
ordersBackdrop.addEventListener("click", () => {
  ordersModal.classList.add("hidden");
});

closeOrdersBtn.addEventListener("click", () => {
  ordersModal.classList.add("hidden");
});

// Renderizar meus pedidos
function renderMyOrders() {
  const myOrders = orders.filter(o => o.customer.id === (currentCustomer?.id));
  
  if (!myOrders || myOrders.length === 0) {
    ordersList.innerHTML = '<div class="text-center py-8 text-slate-500"><p>Você ainda não fez nenhum pedido.</p></div>';
    return;
  }
  
  // Ordenar por data (mais recentes primeiro)
  const sorted = [...myOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  ordersList.innerHTML = sorted.map((order) => {
    const statusEmojis = {
      "pendente_processamento": "⏳",
      "processando": "⚙️",
      "enviado": "📦",
      "entregue": "✓",
      "cancelado": "✕",
    };
    
    const statusLabels = {
      "pendente_processamento": "Pendente",
      "processando": "Processando",
      "enviado": "Enviado",
      "entregue": "Entregue",
      "cancelado": "Cancelado",
    };
    
    const statusColors = {
      "pendente_processamento": "bg-amber-100 text-amber-800",
      "processando": "bg-blue-100 text-blue-800",
      "enviado": "bg-purple-100 text-purple-800",
      "entregue": "bg-green-100 text-green-800",
      "cancelado": "bg-red-100 text-red-800",
    };
    
    const date = new Date(order.createdAt).toLocaleDateString("pt-BR");
    const statusColor = statusColors[order.status] || "bg-slate-100 text-slate-800";
    const statusLabel = statusLabels[order.status] || order.status;
    const statusEmoji = statusEmojis[order.status] || "?";
    
    return `
      <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 cursor-pointer hover:bg-slate-100 transition" onclick="showMyOrderDetail('${order.uuid}')">
        <div class="flex justify-between items-start mb-3">
          <div class="flex-1">
            <div class="font-semibold text-slate-900">${order.id}</div>
            <div class="text-sm text-slate-600">${date}</div>
          </div>
          <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">${statusEmoji} ${statusLabel}</span>
        </div>
        <div class="flex justify-between items-end text-sm">
          <div class="text-slate-600">${order.items.length} item(ns)</div>
          <div class="font-semibold text-slate-900">${formatCurrency(order.total)}</div>
        </div>
        ${order.tracking?.code ? `
          <div class="mt-3 pt-3 border-t border-slate-200 text-xs">
            <p class="text-slate-600">📮 Rastreio: <span class="font-mono text-slate-900">${order.tracking.code}</span></p>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");
}

// Mostrar detalhes do meu pedido
function showMyOrderDetail(orderUuid) {
  const order = orders.find(o => o.uuid === orderUuid);
  if (!order) return;
  
  const statusLabels = {
    "pendente_processamento": "Pendente Processamento",
    "processando": "Processando",
    "enviado": "Enviado",
    "entregue": "Entregue",
    "cancelado": "Cancelado",
  };
  
  const detail = `
    <div id="order-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="bg-slate-900 text-white p-6 sticky top-0">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold">Pedido ${order.id}</h2>
              <p class="text-slate-300 text-sm">${new Date(order.createdAt).toLocaleDateString("pt-BR")} às ${new Date(order.createdAt).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"})}</p>
            </div>
            <button onclick="document.getElementById('order-detail-modal').remove()" class="text-2xl hover:text-slate-200">✕</button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Status -->
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">Status do Pedido</h3>
            <div class="bg-slate-100 rounded-lg p-4">
              <div class="text-lg font-semibold text-slate-900">→ ${statusLabels[order.status]}</div>
              ${order.tracking?.code ? `
                <div class="mt-3 pt-3 border-t border-slate-300">
                  <p class="text-sm text-slate-600 mb-2">📮 Rastreio Correios:</p>
                  <code class="bg-white px-3 py-2 rounded border border-slate-300 text-sm font-mono block mb-2">${order.tracking.code}</code>
                  <a href="${order.tracking.url}" target="_blank" class="text-blue-600 hover:underline text-sm">🔗 Acompanhar na Correios</a>
                </div>
              ` : ""}
            </div>
          </div>
          
          <!-- Endereço -->
          <div>
            <h3 class="font-semibold text-slate-900 mb-3">📍 Endereço de Entrega</h3>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-1 text-sm">
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
                <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                  <div class="font-medium">${item.name}</div>
                  <div class="text-slate-600 mt-1">Cor: <strong>${item.color}</strong> • Tamanho: <strong>${item.size}</strong></div>
                  <div class="flex justify-between items-center mt-2">
                    <div class="text-slate-600">Quantidade: ${item.quantity}x</div>
                    <div class="font-semibold">${formatCurrency(item.subtotal)}</div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
          
          <!-- Totais -->
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
            <div class="flex justify-between"><span>Subtotal:</span> <span class="font-medium">${formatCurrency(order.subtotal)}</span></div>
            <div class="flex justify-between"><span>Frete:</span> <span class="font-medium">${formatCurrency(order.shipping_cost)}</span></div>
            <div class="flex justify-between text-base font-bold border-t border-slate-300 pt-2 mt-2"><span>Total:</span> <span>${formatCurrency(order.total)}</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML("beforeend", detail);
}

// ============ FIM DO SISTEMA DE PEDIDOS DO CLIENTE ============

// Payment Options
paymentCardTab.addEventListener("click", () => {
  paymentCardPanel.classList.remove("hidden");
  paymentPixPanel.classList.add("hidden");
  paymentCardTab.classList.add("border-b-2", "border-slate-900", "text-slate-900");
  paymentCardTab.classList.remove("border-transparent", "text-slate-500");
  paymentPixTab.classList.remove("border-b-2", "border-slate-900", "text-slate-900");
  paymentPixTab.classList.add("border-transparent", "text-slate-500");
});

paymentPixTab.addEventListener("click", () => {
  paymentPixPanel.classList.remove("hidden");
  paymentCardPanel.classList.add("hidden");
  paymentPixTab.classList.add("border-b-2", "border-slate-900", "text-slate-900");
  paymentPixTab.classList.remove("border-transparent", "text-slate-500");
  paymentCardTab.classList.remove("border-b-2", "border-slate-900", "text-slate-900");
  paymentCardTab.classList.add("border-transparent", "text-slate-500");
});

generatePixBtn.addEventListener("click", () => {
  const pixKey = crypto.randomUUID();
  pixCodeValue.textContent = pixKey;
  pixCode.classList.remove("hidden");
});

copyPixBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(pixCodeValue.textContent);
  showMessage(checkoutMessage, "PIX copiado!", "success");
});

// Close modals on Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
    checkoutModal.classList.add("hidden");
    checkoutModal.classList.remove("flex");
    closeProductModal();
    categoriesModal.classList.add("hidden");
    categoriesModal.classList.remove("flex");
  }
});

// Search
productSearch.addEventListener("input", (event) => {
  const searchTerm = normalizeText(event.target.value);
  const filtered = products.filter((product) => {
    const productName = normalizeText(product.name);
    return productName.includes(searchTerm);
  });

  productGrid.innerHTML = "";
  if (filtered.length === 0) {
    productGrid.innerHTML = '<p class="col-span-full text-center text-sm text-slate-500">Nenhum produto encontrado.</p>';
    return;
  }

  filtered.forEach((product) => {
    const article = document.createElement("article");
    article.className =
      "bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer";
    
    const productImage = product.colors && product.colors.length > 0 
      ? product.colors[0].image 
      : (product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E');
    
    article.innerHTML = `
      <img src="${productImage}" alt="${product.name}" class="w-full aspect-square object-cover" />
      <div class="p-3">
        <h3 class="text-sm font-semibold line-clamp-2">${product.name}</h3>
        <p class="text-emerald-600 font-bold mt-2">${formatCurrency(product.price)}</p>
      </div>
    `;

    article.addEventListener("click", () => {
      renderProductModal(product);
    });

    productGrid.appendChild(article);
  });
});

logoBtn.addEventListener("click", () => {
  productSearch.value = "";
  renderProducts();
});

// Fetch products from API
async function loadProducts() {
  // API comentada - usando apenas localStorage
  /*
  try {
    const response = await fetch("http://localhost:8000/api/products");
    if (response.ok) {
      const data = await response.json();
      const apiProducts = Array.isArray(data) ? data : data.products || [];
      if (apiProducts.length > 0) {
        products = apiProducts;
        setStorage(STORAGE_KEYS.products, products);
      }
    }
  } catch (error) {
    console.log("API not available, using local products");
  }
  */
  
  // Garantir que sempre há produtos
  if (!products || products.length === 0) {
    products = defaultProducts;
    setStorage(STORAGE_KEYS.products, products);
  }
  
  renderByCustomer();
}

// Initial render
loadProducts();
