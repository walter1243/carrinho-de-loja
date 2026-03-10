// Storage Keys
const STORAGE_KEYS = {
  customers: "loja_minimal_customers",
  orders: "loja_minimal_orders",
  checkouts: "loja_minimal_checkouts",
  currentCustomer: "loja_minimal_current_customer",
  cart: "loja_minimal_cart",
  products: "loja_minimal_products",
  categories: "loja_minimal_categories",
};

// ==================================================================================
// GERENCIAMENTO DE NOTIFICAÇÕES
// ==================================================================================

function getNotificacoes() {
  try {
    return JSON.parse(localStorage.getItem('loja_notificacoes_cliente') || '[]');
  } catch {
    return [];
  }
}

function getNotificacoesNaoLidas() {
  return getNotificacoes().filter(n => !n.lido);
}

function atualizarBadgeNotificacoes() {
  const badge = document.getElementById('notificationBadge');
  const naoLidas = getNotificacoesNaoLidas();
  
  if (naoLidas.length > 0) {
    badge?.classList.remove('hidden');
    badge.textContent = naoLidas.length;
  } else {
    badge?.classList.add('hidden');
  }
}

function mostrarNotificacoesCliente() {
  const notificacoes = getNotificacoes();
  
  if (notificacoes.length === 0) {
    alert('Nenhuma notificação no momento');
    return;
  }
  
  let html = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]" id="notificationsModal">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div class="bg-slate-900 text-white p-4 sticky top-0 flex justify-between items-center">
          <h2 class="text-lg font-semibold">📬 Notificações</h2>
          <button onclick="document.getElementById('notificationsModal')?.remove()" class="text-2xl hover:text-slate-200">✕</button>
        </div>
        
        <div class="divide-y">`;
  
  notificacoes.forEach(notif => {
    const data = new Date(notif.timestamp).toLocaleDateString('pt-BR');
    html += `
      <div class="p-4 hover:bg-slate-50 transition ${!notif.lido ? 'bg-blue-50 border-l-4 border-blue-500' : ''}">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-semibold text-slate-900">${notif.titulo}</h3>
          ${!notif.lido ? '<span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Novo</span>' : ''}
        </div>
        <p class="text-sm text-slate-600 mb-2">${notif.mensagem}</p>
        ${notif.rastreio ? `
          <div class="bg-green-50 border border-green-200 rounded p-2 mb-2">
            <div class="text-xs text-slate-500">Código:</div>
            <div class="font-mono font-bold text-green-700">${notif.rastreio}</div>
            <a href="https://rastreamento.correios.com.br/app/index.php?codigo=${notif.rastreio}" target="_blank" class="text-xs text-blue-600 hover:underline mt-1 block">
              🔗 Acompanhar no site dos Correios
            </a>
          </div>
        ` : ''}
        <div class="text-xs text-slate-500">${data}</div>
      </div>`;
  });
  
  html += `</div></div>`;
  
  document.body.insertAdjacentHTML('beforeend', html);
  
  // Marcar como lido
  const todasNotif = getNotificacoes();
  todasNotif.forEach(n => n.lido = true);
  localStorage.setItem('loja_notificacoes_cliente', JSON.stringify(todasNotif));
  atualizarBadgeNotificacoes();
}

// Monitorar mudanças nas notificações
window.addEventListener('storage', (e) => {
  if (e.key === 'loja_notificacoes_cliente') {
    atualizarBadgeNotificacoes();
  }
});

const AUTH_API = {
  providers: {
    google: "/api/auth/google",
  },
  logout: "/api/auth/logout",
};

const BACKEND_BASE_URL = window.__BACKEND_BASE_URL__ || "";

function authApiUrl(path) {
  if (!path) return BACKEND_BASE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_BASE_URL}${path}`;
}

function oauthStartUrl(provider) {
  const frontendRedirect = `${window.location.origin}${window.location.pathname}`;
  return `${authApiUrl(`/api/auth/${provider}/start`)}?frontend_redirect=${encodeURIComponent(frontendRedirect)}`;
}

async function getAuthProvidersStatus() {
  try {
    const response = await fetch(authApiUrl("/api/auth/providers/status"));
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function startSocialLogin(provider) {
  const status = await getAuthProvidersStatus();
  const providerData = status?.providers?.[provider];

  if (providerData?.mode === "disabled") {
    showMessage(profileAuthMessage, `${provider} indisponível no momento.`, "error");
    return;
  }

  window.location.href = oauthStartUrl(provider);
}

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
const productModalMessage = document.getElementById("productModalMessage");

const checkoutModal = document.getElementById("checkoutModal");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const backToStoreBtn = document.getElementById("backToStoreBtn");
const checkoutPrevBtn = document.getElementById("checkoutPrevBtn");
const checkoutNextBtn = document.getElementById("checkoutNextBtn");
const checkoutCpf = document.getElementById("checkoutCpf");
const checkoutPhone = document.getElementById("checkoutPhone");
const checkoutWhatsapp = document.getElementById("checkoutWhatsapp");
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
const storeBanner = document.getElementById("storeBanner");
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
const productDescriptionModal = document.getElementById("productDescriptionModal");
const productDescriptionBackdrop = document.getElementById("productDescriptionBackdrop");
const productDescriptionCloseBtn = document.getElementById("productDescriptionCloseBtn");
const productDescriptionModalContent = document.getElementById("productDescriptionModalContent");
const productDescriptionSheet = document.getElementById("productDescriptionSheet");
const productDescriptionDragHandle = document.getElementById("productDescriptionDragHandle");
const productDescriptionModalTitle = document.getElementById("productDescriptionModalTitle");
console.log("Debug - addToCartModalBtn:", addToCartModalBtn);
console.log("Debug - productModalMessage:", productModalMessage);

// DOM Elements - Menu
const menuBtn = document.getElementById("menuBtn");
const logoBtn = document.getElementById("logoBtn");
const categoriesModal = document.getElementById("categoriesModal");
const categoriesBackdrop = document.getElementById("categoriesBackdrop");
const closeCategoriesBtn = document.getElementById("closeCategoriesBtn");
const categoriesList = document.getElementById("categoriesList");
const categoryCarousels = document.getElementById("categoryCarousels");
const searchWrap = document.getElementById("searchWrap");

// DOM Elements - Category View Modal
const categoryViewModal = document.getElementById("categoryViewModal");
const categoryViewBackdrop = document.getElementById("categoryViewBackdrop");
const closeCategoryViewBtn = document.getElementById("closeCategoryViewBtn");
const categoryViewTitle = document.getElementById("categoryViewTitle");
const categoryViewProductsGrid = document.getElementById("categoryViewProductsGrid");

// DOM Elements - Profile Modal
const profileModal = document.getElementById("profileModal");
const profileBackdrop = document.getElementById("profileBackdrop");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const profileAvatarContainer = document.getElementById("profileAvatarContainer");
const profilePhotoInput = document.getElementById("profilePhotoInput");
const profilePhotoCameraInput = document.getElementById("profilePhotoCameraInput");
const profilePickGalleryBtn = document.getElementById("profilePickGalleryBtn");
const profilePickCameraBtn = document.getElementById("profilePickCameraBtn");
const profilePhotoPreviewWrap = document.getElementById("profilePhotoPreviewWrap");
const profilePhotoCropViewport = document.getElementById("profilePhotoCropViewport");
const profilePhotoPreviewImage = document.getElementById("profilePhotoPreviewImage");
const profilePhotoZoomRange = document.getElementById("profilePhotoZoomRange");
const profilePhotoSaveBtn = document.getElementById("profilePhotoSaveBtn");
const profilePhotoCancelBtn = document.getElementById("profilePhotoCancelBtn");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileNameInput = document.getElementById("profileNameInput");
const profileEmailInput = document.getElementById("profileEmailInput");
const profileCreatedAt = document.getElementById("profileCreatedAt");
const profileOrdersList = document.getElementById("profileOrdersList");
const profileMessage = document.getElementById("profileMessage");
const currentPassword = document.getElementById("currentPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const trackingCode = document.getElementById("trackingCode");
const trackingSearchBtn = document.getElementById("trackingSearchBtn");
const trackingResult = document.getElementById("trackingResult");
const trackingStatus = document.getElementById("trackingStatus");
const trackingEvents = document.getElementById("trackingEvents");

// DOM Elements - Profile Auth Modal
const profileAuthModal = document.getElementById("profileAuthModal");
const profileAuthBackdrop = document.getElementById("profileAuthBackdrop");
const closeProfileAuthBtn = document.getElementById("closeProfileAuthBtn");
const profileLoginTabBtn = document.getElementById("profileLoginTabBtn");
const profileSignupTabBtn = document.getElementById("profileSignupTabBtn");
const profileLoginForm = document.getElementById("profileLoginForm");
const profileSignupForm = document.getElementById("profileSignupForm");
const profileLoginEmail = document.getElementById("profileLoginEmail");
const profileLoginPassword = document.getElementById("profileLoginPassword");
const profileLoginBtn = document.getElementById("profileLoginBtn");
const profileSignupName = document.getElementById("profileSignupName");
const profileSignupEmail = document.getElementById("profileSignupEmail");
const profileSignupPassword = document.getElementById("profileSignupPassword");
const profileSignupPasswordConfirm = document.getElementById("profileSignupPasswordConfirm");
const profileSignupBtn = document.getElementById("profileSignupBtn");
const profileAuthMessage = document.getElementById("profileAuthMessage");
const profileSocialGoogleBtn = document.getElementById("profileSocialGoogleBtn");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");

// State
let customers = getStorage(STORAGE_KEYS.customers, []);
let orders = getStorage(STORAGE_KEYS.orders, []);
let checkouts = getStorage(STORAGE_KEYS.checkouts, []);
let currentCustomer = getStorage(STORAGE_KEYS.currentCustomer, null);
let cart = getStorage(STORAGE_KEYS.cart, []);
let products = getStorage(STORAGE_KEYS.products, defaultProducts);
let categories = getStorage(STORAGE_KEYS.categories, []);
let currentCheckoutStep = 0;
let selectedColor = "";
let selectedSize = "";
let selectedQty = 1;
let selectedProductId = "";
let openedFromCategory = false; // Rastrear se modal de produto foi aberto a partir da categoria
let pendingProfilePhotoData = null;
let pendingProfilePhotoImage = null;
let photoCropState = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  viewportSize: 176,
};
let photoCropDragState = {
  dragging: false,
  startX: 0,
  startY: 0,
  startOffsetX: 0,
  startOffsetY: 0,
};

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

function saveCheckouts() {
  setStorage(STORAGE_KEYS.checkouts, checkouts);
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
  loadSavedBanner(); // Carregar banner salvo do admin
  loadSavedLogo();
  renderProducts();
  renderPromoCards();
  renderCategoryCarousels();
  renderCart();
  updateCheckoutButtonVisibility(); // Atualizar visibilidade do botão de checkout

  if (currentCustomer) {
    openCartBtn.classList.remove("hidden");
    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
    }
    profileBtn.classList.remove("hidden");
  } else {
    openCartBtn.classList.add("hidden");
    if (logoutBtn) {
      logoutBtn.classList.add("hidden");
    }
    profileBtn.classList.remove("hidden");
  }
}

function loadSavedLogo() {
  const logoUrl = localStorage.getItem('loja_logo_url');
  const logoImg = document.getElementById('storeLogo');
  const logoText = document.getElementById('storeLogoText');

  if (!logoImg || !logoText) return;

  if (logoUrl) {
    logoImg.src = logoUrl;
    logoImg.classList.remove('hidden');
    logoText.classList.add('hidden');
  } else {
    logoImg.classList.add('hidden');
    logoText.classList.remove('hidden');
  }
}

async function tryLogoutApi() {
  try {
    await fetch(authApiUrl(AUTH_API.logout), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: currentCustomer?.id || null }),
    });
  } catch {
  }
}

async function logoutCustomer() {
  await tryLogoutApi();
  currentCustomer = null;
  saveCurrentCustomer();
  cart = [];
  saveCart();

  products = getStorage(STORAGE_KEYS.products, defaultProducts);
  if (!products || products.length === 0) {
    products = defaultProducts;
    setStorage(STORAGE_KEYS.products, products);
  }

  closeProfileModal();
  closeProfileAuthModal();
  renderByCustomer();
  showLoginForm();
  authMessage.textContent = "";
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

  const normalizedColor = normalizeText(color || "");

  const cartItem = cart.find(
    (item) =>
      item.id === productId && item.color === color && item.size === size
  );

  if (cartItem) {
    cartItem.quantity += qty;
  } else {
    // Encontrar a imagem e cor selecionadas
    let itemImage = product.image || "";
    let itemColorHex = "";
    let itemColorName = color;

    if (product.colors && product.colors.length > 0) {
      const selectedColorObj = product.colors.find(
        (c) => normalizeText(c.name || "") === normalizedColor
      );

      if (selectedColorObj) {
        itemImage = selectedColorObj.image || itemImage;
        itemColorHex = selectedColorObj.hex || getColorHex(selectedColorObj.name || itemColorName) || "";
        itemColorName = selectedColorObj.name || itemColorName;
      } else {
        if (!itemColorHex && itemColorName) {
          itemColorHex = getColorHex(itemColorName) || "";
        }
        if (!itemImage && product.colors[0] && product.colors[0].image) {
          itemImage = product.colors[0].image;
        }
      }
    } else if (itemColorName) {
      itemColorHex = getColorHex(itemColorName) || "";
    }

    cart.push({
      ...product,
      color: itemColorName,
      colorHex: itemColorHex,
      size,
      quantity: qty,
      image: itemImage
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

  let cartUpdated = false;

  const itemsToRender = [...cart].reverse();

  itemsToRender.forEach((item) => {
    // Buscar preço atual do produto (caso tenha sido atualizado)
    const currentProduct = products.find(p => p.id === item.id);
    const currentPrice = currentProduct ? currentProduct.price : item.price;
    
    subtotal += currentPrice * item.quantity;

    // Garantir que item tem imagem e cor correta
    let itemImage = item.image || "";
    let colorHex = item.colorHex || "";
    
    const product = products.find(p => p.id === item.id);
    if (product && product.colors && product.colors.length > 0) {
      // Buscar cor do item no array de cores do produto
      const colorObj = product.colors.find(
        (c) => normalizeText(c.name || "") === normalizeText(item.color || "")
      );

      if (colorObj) {
        itemImage = colorObj.image || itemImage;
        colorHex = colorObj.hex || colorHex || getColorHex(colorObj.name || item.color) || "";

        if (item.color !== (colorObj.name || item.color)) {
          item.color = colorObj.name || item.color;
          cartUpdated = true;
        }
      } else if (!colorHex && item.color) {
        colorHex = getColorHex(item.color) || "";
      }
    } else if (!colorHex && item.color) {
      colorHex = getColorHex(item.color) || "";
    }

    if (!colorHex) {
      colorHex = "#808080";
    }

    if (!itemImage) {
      itemImage = item.image || product?.image || product?.colors?.[0]?.image || "";
    }

    if (item.colorHex !== colorHex) {
      item.colorHex = colorHex;
      cartUpdated = true;
    }

    if (item.image !== itemImage) {
      item.image = itemImage;
      cartUpdated = true;
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
          currentPrice * item.quantity
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

  if (cartUpdated) {
    saveCart();
  }

  cartSubtotal.textContent = formatCurrency(subtotal);
  const total = subtotal;
  cartTotal.textContent = formatCurrency(total);
  updateCartBadge();
  updateCheckoutButtonVisibility(); // Atualizar visibilidade do botão de checkout
}

function updateCartBadge() {
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalQuantity;
  cartCount.parentElement.classList.toggle("hidden", totalQuantity === 0);
}

function updateCheckoutButtonVisibility() {
  if (!currentCustomer) {
    // Usuário não logado - esconder botão
    checkoutBtn.classList.add("hidden");
  } else {
    // Usuário logado - mostrar botão
    checkoutBtn.classList.remove("hidden");
  }
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
    
    // Event listener global irá lidar com o clique (não adicionar inline para evitar duplicação)
  } else {
    // Produto antigo sem cores - usar imagem padrão
    productModalImage.src = product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E';
    
    // Cores padrão com bolinhas (compatibilidade)
    const defaultColors = getProductColors(product);
    selectedColor = defaultColors[0].name || defaultColors[0]; // Selecionar primeira cor
    
    productColors.innerHTML = defaultColors
      .map((color, idx) => {
        const colorName = typeof color === 'string' ? color : color.name;
        const colorHex = typeof color === 'string' ? getColorHex(color) : color.hex;
        
        return `<button 
          class="product-color-btn w-8 h-8 rounded-full border-2 transition hover:scale-110 ${idx === 0 ? 'border-slate-900 ring-2 ring-slate-900' : 'border-slate-300'}" 
          style="background-color: ${colorHex};"
          data-color="${colorName}"
          title="${colorName}"
        ></button>`;
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

  // Renderizar descrição do produto (se existir)
  const descriptionSection = document.getElementById('productDescriptionSection');
  const hasDescription = product.description && product.description.trim() !== '';

  if (descriptionSection) {
    if (hasDescription) {
      descriptionSection.classList.remove('hidden');
    } else {
      descriptionSection.classList.add('hidden');
    }
  }

  if (productDescriptionModalTitle) {
    productDescriptionModalTitle.textContent = hasDescription
      ? `Descrição do Produto · ${product.name}`
      : "Descrição do Produto";
  }

  if (productDescriptionModalContent) {
    productDescriptionModalContent.innerHTML = hasDescription ? product.description : '';
  }

  productModal.classList.remove("hidden");
  productModal.classList.add("flex");
  productModal.style.display = "flex";
  productModal.setAttribute("aria-hidden", "false");
}

function closeProductModal() {
  console.log("[modal] closeProductModal: before", {
    classes: productModal?.className,
    display: productModal?.style?.display,
    ariaHidden: productModal?.getAttribute("aria-hidden")
  });
  productModal.classList.add("hidden");
  productModal.classList.remove("flex");
  productModal.style.display = "none";
  productModal.setAttribute("aria-hidden", "true");
  if (productDescriptionModal) {
    productDescriptionModal.classList.add("hidden");
    productDescriptionModal.classList.remove("flex");
  }
  console.log("[modal] closeProductModal: after", {
    classes: productModal?.className,
    display: productModal?.style?.display,
    ariaHidden: productModal?.getAttribute("aria-hidden")
  });
  
  // Se veio da categoria, reabrir modal de categoria
  if (openedFromCategory) {
    categoryViewModal.classList.remove("hidden");
    categoryViewModal.classList.add("flex");
    openedFromCategory = false;
  }
}

function getProductColors(product) {
  if (Array.isArray(product?.colors) && product.colors.length) {
    return product.colors;
  }
  // Retornar cores padrão com hex codes
  return [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#FFFFFF" },
    { name: "Cinza", hex: "#808080" },
    { name: "Azul", hex: "#3B82F6" }
  ];
}

// Função helper para converter nome de cor em hex
function getColorHex(colorName) {
  const colorMap = {
    "Preto": "#000000",
    "Branco": "#FFFFFF",
    "Cinza": "#808080",
    "Azul": "#3B82F6",
    "Vermelho": "#EF4444",
    "Verde": "#10B981",
    "Amarelo": "#F59E0B",
    "Rosa": "#EC4899",
    "Roxo": "#8B5CF6",
    "Laranja": "#F97316",
    "Marrom": "#92400E",
    "Bege": "#D4A574"
  };
  return colorMap[colorName] || "#808080";
}

function getProductSizes(product) {
  if (Array.isArray(product?.sizes) && product.sizes.length) {
    return product.sizes;
  }
  return ["P", "M", "G", "GG"];
}

// Products Functions - Ordenação
function applySavedProductOrder(productList) {
  // Carregar ordem salva do admin
  const savedOrder = localStorage.getItem('loja_products_order');
  if (!savedOrder) {
    return productList; // Se não houver ordem salva, retorna original
  }

  try {
    const orderArray = JSON.parse(savedOrder);
    if (!Array.isArray(orderArray) || orderArray.length === 0) {
      return productList;
    }

    // Ordenar produtos pela ordem salva
    const sorted = [...productList].sort((a, b) => {
      const indexA = orderArray.indexOf(a.id);
      const indexB = orderArray.indexOf(b.id);
      
      // Se ambos estão na ordem, comparar índices
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      
      // Se apenas um está na ordem, esse vem primeiro
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // Se nenhum está na ordem, manter ordem original
      return 0;
    });

    return sorted;
  } catch (e) {
    console.warn('Erro ao aplicar ordem de produtos:', e);
    return productList;
  }
}

let bannerRotationTimer = null;

function loadSavedBanner() {
  // Carregar banner salvo do admin (suporte a multiplos banners)
  const storeBanner = document.getElementById('storeBanner');
  if (!storeBanner) return;

  const bannerUrlsKey = 'loja_banner_urls';
  const legacyBannerKey = 'loja_banner_url';
  let bannerUrls = [];

  const stored = localStorage.getItem(bannerUrlsKey);
  if (stored) {
    try {
      const list = JSON.parse(stored);
      if (Array.isArray(list)) {
        bannerUrls = list.filter(Boolean);
      }
    } catch (e) {
      bannerUrls = [];
    }
  }

  if (!bannerUrls.length) {
    const legacy = localStorage.getItem(legacyBannerKey);
    if (legacy) {
      bannerUrls = [legacy];
    }
  }

  if (bannerRotationTimer) {
    window.clearInterval(bannerRotationTimer);
    bannerRotationTimer = null;
  }

  if (!bannerUrls.length) {
    return;
  }

  let index = 0;
  storeBanner.style.backgroundImage = `url('${bannerUrls[0]}')`;
  storeBanner.style.backgroundSize = 'cover';
  storeBanner.style.backgroundPosition = 'center';

  if (bannerUrls.length > 1) {
    bannerRotationTimer = window.setInterval(() => {
      index = (index + 1) % bannerUrls.length;
      storeBanner.style.backgroundImage = `url('${bannerUrls[index]}')`;
    }, 4000);
  }
}

function renderProducts() {
  // Debug: garantir que há produtos
  if (!products || products.length === 0) {
    products = defaultProducts;
  }
  
  let visibleProducts = products.filter((p) => p.selected !== false);
  visibleProducts = applySavedProductOrder(visibleProducts);
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
      openedFromCategory = false;
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
        openedFromCategory = false;
        renderProductModal(product);
      }
    });
  });
}

function applySavedCategoryOrder(categoriesMap) {
  // Carregar ordem salva do admin
  const savedOrder = localStorage.getItem('loja_categories_order');
  if (!savedOrder) {
    return categoriesMap; // Se não houver ordem salva, retorna original
  }

  try {
    const orderArray = JSON.parse(savedOrder);
    if (!Array.isArray(orderArray) || orderArray.length === 0) {
      return categoriesMap;
    }

    // Converter Map para Array, ordenar, e converter de volta
    const entries = Array.from(categoriesMap.entries());
    const sorted = entries.sort((a, b) => {
      const indexA = orderArray.indexOf(a[0]); // a[0] é a categoria
      const indexB = orderArray.indexOf(b[0]);
      
      // Se ambas estão na ordem, comparar índices
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      
      // Se apenas uma está na ordem, essa vem primeiro
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // Se nenhuma está na ordem, manter ordem original
      return 0;
    });

    return new Map(sorted);
  } catch (e) {
    console.warn('Erro ao aplicar ordem de categorias:', e);
    return categoriesMap;
  }
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

  // Aplicar ordem salva do admin
  const orderedCategoriesMap = applySavedCategoryOrder(categoriesMap);

  orderedCategoriesMap.forEach((categoryProducts, category) => {
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
          openedFromCategory = false;
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
    
    const btn = li.querySelector(".category-select");
    btn.addEventListener("click", () => {
      // Abrir modal da categoria
      openCategoryViewModal(category);
    });
    
    categoriesList.appendChild(li);
  });
}

// Abrir modal de visualização de categoria
function openCategoryViewModal(category) {
  // Atualizar titulo
  categoryViewTitle.textContent = formatCategoryLabel(category);
  
  // Fechar menu de categorias
  categoriesModal.classList.add("hidden");
  categoriesModal.classList.remove("flex");
  
  // Filtrar produtos da categoria
  const categoryProducts = products.filter((p) => {
    return p.selected !== false && getProductCategory(p) === category;
  });
  
  // Renderizar produtos no modal
  categoryViewProductsGrid.innerHTML = "";
  
  if (categoryProducts.length === 0) {
    categoryViewProductsGrid.innerHTML = '<p class="col-span-full text-center text-sm text-slate-500">Nenhum produto nesta categoria.</p>';
  } else {
    categoryProducts.forEach((product) => {
      const productImage = product.colors && product.colors.length > 0 
        ? product.colors[0].image 
        : (product.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3C/svg%3E');
      
      const article = document.createElement("article");
      article.className = "bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer";
      article.innerHTML = `
        <img src="${productImage}" alt="${product.name}" class="w-full aspect-square object-cover" />
        <div class="p-3">
          <h3 class="text-sm font-semibold line-clamp-2">${product.name}</h3>
          <p class="text-emerald-600 font-bold mt-2">${formatCurrency(product.price)}</p>
          ${product.colors && product.colors.length > 1 ? `<p class="text-xs text-slate-500 mt-1">${product.colors.length} cores disponíveis</p>` : ''}
        </div>
      `;
      
      article.addEventListener("click", () => {
        openedFromCategory = true;
        renderProductModal(product);
      });
      
      categoryViewProductsGrid.appendChild(article);
    });
  }
  
  // Abrir modal
  categoryViewModal.classList.remove("hidden");
  categoryViewModal.classList.add("flex");
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

// OLD - Removido para usar novo perfil modal
// profileBtn.addEventListener("click", () => {
//   loginTabBtn.click();
// });

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

closeCheckoutBtn.addEventListener("click", () => {
  checkoutModal.classList.add("hidden");
  checkoutModal.classList.remove("flex");
});

checkoutBackdrop.addEventListener("click", () => {
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
    // Remover seleção de todos os botões de cor
    document.querySelectorAll(".product-color-btn").forEach((btn) => {
      btn.classList.remove("border-slate-900", "ring-2", "ring-slate-900");
      btn.classList.add("border-slate-300");
    });
    
    // Adicionar seleção ao botão clicado
    colorBtn.classList.remove("border-slate-300");
    colorBtn.classList.add("border-slate-900", "ring-2", "ring-slate-900");
    selectedColor = colorBtn.dataset.color;
    
    // Se tiver imagem associada, trocar
    if (colorBtn.dataset.image) {
      productModalImage.src = colorBtn.dataset.image;
    }
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

// Descricao do produto (modal inferior)
const toggleDescriptionBtn = document.getElementById('toggleDescriptionBtn');
const descriptionDragState = {
  active: false,
  startY: 0,
  currentY: 0,
};

const resetDescriptionSheet = () => {
  if (!productDescriptionSheet) return;
  productDescriptionSheet.style.transition = "transform 0.18s ease";
  productDescriptionSheet.style.transform = "translateY(0)";
  window.setTimeout(() => {
    if (productDescriptionSheet) {
      productDescriptionSheet.style.transition = "";
    }
  }, 180);
};

const openDescriptionModal = () => {
  if (!productDescriptionModal) return;
  productDescriptionModal.classList.remove('hidden');
  productDescriptionModal.classList.add('flex');
  resetDescriptionSheet();
};

const closeDescriptionModal = () => {
  if (!productDescriptionModal) return;
  productDescriptionModal.classList.add('hidden');
  productDescriptionModal.classList.remove('flex');
  if (productDescriptionSheet) {
    productDescriptionSheet.style.transform = "translateY(0)";
  }
};

if (toggleDescriptionBtn) {
  toggleDescriptionBtn.addEventListener('click', openDescriptionModal);
}

if (productDescriptionBackdrop) {
  productDescriptionBackdrop.addEventListener('click', closeDescriptionModal);
}

if (productDescriptionCloseBtn) {
  productDescriptionCloseBtn.addEventListener('click', closeDescriptionModal);
}

if (productDescriptionDragHandle) {
  productDescriptionDragHandle.addEventListener('pointerdown', (event) => {
    if (!productDescriptionSheet) return;
    descriptionDragState.active = true;
    descriptionDragState.startY = event.clientY;
    descriptionDragState.currentY = event.clientY;
    productDescriptionSheet.setPointerCapture(event.pointerId);
  });

  productDescriptionDragHandle.addEventListener('pointermove', (event) => {
    if (!descriptionDragState.active || !productDescriptionSheet) return;
    const deltaY = Math.max(0, event.clientY - descriptionDragState.startY);
    descriptionDragState.currentY = event.clientY;
    productDescriptionSheet.style.transform = `translateY(${deltaY}px)`;
  });

  const endDrag = (event) => {
    if (!descriptionDragState.active) return;
    descriptionDragState.active = false;
    const deltaY = Math.max(0, descriptionDragState.currentY - descriptionDragState.startY);

    if (deltaY > 90) {
      closeDescriptionModal();
    } else {
      resetDescriptionSheet();
    }

    if (productDescriptionSheet && event?.pointerId !== undefined) {
      productDescriptionSheet.releasePointerCapture(event.pointerId);
    }
  };

  productDescriptionDragHandle.addEventListener('pointerup', endDrag);
  productDescriptionDragHandle.addEventListener('pointercancel', endDrag);
  productDescriptionDragHandle.addEventListener('pointerleave', endDrag);
}

addToCartModalBtn.addEventListener("click", () => {
  console.log("[add-to-cart] click", {
    selectedProductId,
    selectedColor,
    selectedSize,
    selectedQty
  });
  if (!selectedColor) {
    showMessage(productModalMessage, "Selecione uma cor.", "error");
    return;
  }
  if (!selectedSize) {
    showMessage(productModalMessage, "Selecione um tamanho.", "error");
    return;
  }

  addProductToCart(selectedProductId, selectedColor, selectedSize, selectedQty);
  openedFromCategory = false;
  closeProductModal();
  console.log("[add-to-cart] after", {
    productModal: {
      classes: productModal?.className,
      display: productModal?.style?.display,
      ariaHidden: productModal?.getAttribute("aria-hidden")
    },
    cartModal: {
      classes: cartModal?.className
    }
  });
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

// Event Listeners - Category View Modal
categoryViewBackdrop.addEventListener("click", () => {
  categoryViewModal.classList.add("hidden");
  categoryViewModal.classList.remove("flex");
});

closeCategoryViewBtn.addEventListener("click", () => {
  categoryViewModal.classList.add("hidden");
  categoryViewModal.classList.remove("flex");
});

// Event Listeners - Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutCustomer();
  });
}

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
    // Buscar preço atual do produto
    const product = products.find(p => p.id === item.id);
    const currentPrice = product ? product.price : item.price;
    
    // Garantir que item tem imagem e cor hex
    let itemImage = item.image;
    let colorHex = "#808080"; // Cor padrão cinza
    
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
          currentPrice * item.quantity
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
    // Buscar preço atual do produto
    const currentProduct = products.find(p => p.id === item.id);
    const currentPrice = currentProduct ? currentProduct.price : item.price;
    
    const itemTotal = currentPrice * item.quantity;
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
  const cpfRaw = checkoutCpf ? checkoutCpf.value.trim() : "";
  const cpfDigits = cpfRaw.replace(/\D/g, "");
  const phone = checkoutPhone ? checkoutPhone.value.trim() : "";
  const whatsapp = checkoutWhatsapp ? checkoutWhatsapp.value.trim() : "";
  const address = checkoutAddress.value.trim();
  const city = checkoutCity.value.trim();
  const state = checkoutState.value.trim();
  
  // Validar campos obrigatórios
  if (!cpfDigits || !phone || !whatsapp || !address || !city || !state) {
    showMessage(checkoutMessage, "Preencha todos os campos incluindo WhatsApp.", "error");
    return;
  }

  if (cpfDigits.length !== 11) {
    showMessage(checkoutMessage, "CPF inválido. Verifique os 11 dígitos.", "error");
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
      whatsapp: whatsapp,
      cpf: cpfDigits,
      authProvider: currentCustomer.authProvider || "email",
      authMethod: currentCustomer.authMethod || "password",
    },
    
    // Endereço de envio
    shipping: {
      address: address,
      city: city,
      state: state,
      country: "Brasil",
    },
    
    // Items do pedido
    items: cart.map(item => {
      // Buscar preço atual do produto
      const currentProduct = products.find(p => p.id === item.id);
      const currentPrice = currentProduct ? currentProduct.price : item.price;
      
      return {
        id: item.id,
        name: item.name,
        price: currentPrice,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        subtotal: currentPrice * item.quantity,
      };
    }),
    
    // Totais
    subtotal: cart.reduce((sum, item) => {
      const currentProduct = products.find(p => p.id === item.id);
      const currentPrice = currentProduct ? currentProduct.price : item.price;
      return sum + currentPrice * item.quantity;
    }, 0),
    shipping_cost: 0, // Será adicionado depois
    total: cart.reduce((sum, item) => {
      const currentProduct = products.find(p => p.id === item.id);
      const currentPrice = currentProduct ? currentProduct.price : item.price;
      return sum + currentPrice * item.quantity;
    }, 0),
    
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

  const checkoutLead = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    orderId: order.id,
    customer: {
      id: currentCustomer.id,
      name: currentCustomer.name,
      email: currentCustomer.email,
      phone,
      cpf: cpfDigits,
      authProvider: currentCustomer.authProvider || "email",
      authMethod: currentCustomer.authMethod || "password",
    },
    items: order.items,
    total: order.total,
  };
  checkouts.push(checkoutLead);
  saveCheckouts();

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
const trackingModal = document.getElementById("trackingModal");
const trackingBackdrop = document.getElementById("trackingBackdrop");
const closeTrackingBtn = document.getElementById("closeTrackingBtn");

// Abrir modal de pedidos
if (ordersBtn && ordersModal) {
  ordersBtn.addEventListener("click", () => {
    renderMyOrders();
    ordersModal.classList.remove("hidden");
  });
}

// Fechar modal de pedidos
if (ordersBackdrop && ordersModal) {
  ordersBackdrop.addEventListener("click", () => {
    ordersModal.classList.add("hidden");
  });
}

if (closeOrdersBtn && ordersModal) {
  closeOrdersBtn.addEventListener("click", () => {
    ordersModal.classList.add("hidden");
  });
}

// Abrir modal de rastreio
function abrirRastreio() {
  trackingModal.classList.remove("hidden");
  document.getElementById("codigo_rastreio").value = "";
  document.getElementById("status-container").classList.add("hidden");
}

// Fechar modal de rastreio
if (trackingBackdrop && trackingModal) {
  trackingBackdrop.addEventListener("click", () => {
    trackingModal.classList.add("hidden");
  });
}

if (closeTrackingBtn && trackingModal) {
  closeTrackingBtn.addEventListener("click", () => {
    trackingModal.classList.add("hidden");
  });
}

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
            <div class="flex items-center justify-between">
              <p class="text-slate-600">📮 Rastreio: <span class="font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded">${order.tracking.code}</span></p>
              <button onclick="copiarRastreio('${order.tracking.code}')" class="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs" title="Copiar código">📋 Copiar</button>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }).join("");
}

// Copiar código de rastreio para área de transferência
function copiarRastreio(codigo) {
  navigator.clipboard.writeText(codigo).then(() => {
    // Mostrar feedback visual
    alert("✅ Código copiado: " + codigo);
  }).catch(err => {
    // Fallback para navegadores antigos
    const textarea = document.createElement("textarea");
    textarea.value = codigo;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("✅ Código copiado: " + codigo);
  });
}

// Copiar rastreio
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
                  <div class="flex items-center gap-2 mb-2">
                    <code class="bg-white px-3 py-2 rounded border border-slate-300 text-sm font-mono flex-1">${order.tracking.code}</code>
                    <button onclick="copiarRastreio('${order.tracking.code}')" class="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium" title="Copiar para área de transferência">
                      📋 Copiar
                    </button>
                  </div>
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
let handleSearchChange;

if (productSearch) {
  handleSearchChange = (event) => {
    const rawValue = (event.target.value || "").trim();
    const searchTerm = normalizeText(rawValue);

    // Se campo vazio, mostrar todos os produtos
    if (!rawValue || searchTerm === "") {
      // Mostrar promos e carrosséis novamente
      if (promoCardsGrid) promoCardsGrid.style.display = "";
      if (categoryCarousels) categoryCarousels.style.display = "";
      if (storeBanner) storeBanner.classList.remove("is-minimized");
      renderProducts();
      return;
    }

    // Esconder promos e carrosséis durante busca
    if (promoCardsGrid) promoCardsGrid.style.display = "none";
    if (categoryCarousels) categoryCarousels.style.display = "none";
    if (storeBanner) storeBanner.classList.add("is-minimized");

    // Filtrar produtos visíveis que coincidem com a busca
    const filtered = products
      .filter((product) => product.selected !== false)
      .filter((product) => {
        const productName = normalizeText(product.name);
        const productCategory = normalizeText(getProductCategory(product));
        const categoryLabel = normalizeText(formatCategoryLabel(getProductCategory(product)));

        // Buscar por nome de produto ou coleção/categoria
        return productName.includes(searchTerm) ||
               productCategory.includes(searchTerm) ||
               categoryLabel.includes(searchTerm);
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
          ${product.colors && product.colors.length > 1 ? `<p class="text-xs text-slate-500 mt-1">${product.colors.length} cores disponíveis</p>` : ''}
        </div>
      `;

      article.addEventListener("click", () => {
        openedFromCategory = false;
        renderProductModal(product);
      });

      productGrid.appendChild(article);
    });
  };

  productSearch.addEventListener("input", handleSearchChange);
  productSearch.addEventListener("search", handleSearchChange);
}

if (logoBtn) {
  logoBtn.addEventListener("click", () => {
    if (productSearch) {
      productSearch.value = "";
    }
    renderProducts();
  });
}

// Fetch products from API
async function loadProducts() {
  // API comentada - usando apenas localStorage
  /*
  try {
    const response = await fetch("/api/products");
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

// Função de rastreamento via API Linketrack
async function buscarRastreio() {
    const codigo = document.getElementById('codigo_rastreio').value.trim();
    const container = document.getElementById('status-container');
    const listaEventos = document.getElementById('lista-eventos');
    const ultimoStatus = document.getElementById('ultimo-status');

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

        // Mostra últimmo status
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

// Initial render
window.addEventListener('storage', (event) => {
  // Detectar mudanças no localStorage (banner ou produtos) feitas pelo admin em outra aba
  if (event.key === 'loja_banner_url') {
    loadSavedBanner();
    console.log('✓ Banner atualizado via Storage Event');
  } else if (event.key === 'loja_products_order') {
    renderProducts();
    console.log('✓ Ordem de produtos atualizada via Storage Event');
  } else if (event.key === 'loja_categories_order') {
    renderCategoryCarousels();
    console.log('✓ Ordem de categorias atualizada via Storage Event');
  }
});

// ========== PROFILE MODAL FUNCTIONS ==========
function openProfileModal() {
  if (!currentCustomer) {
    // Se não houver cliente logado, mostrar modal de autenticação
    openProfileAuthModal();
    return;
  }
  
  // Se houver cliente logado, mostrar modal de perfil completo
  openProfileDetailsModal();
}

function openProfileAuthModal() {
  // Limpar formulários
  profileLoginEmail.value = "";
  profileLoginPassword.value = "";
  profileSignupName.value = "";
  profileSignupEmail.value = "";
  profileSignupPassword.value = "";
  profileSignupPasswordConfirm.value = "";
  profileAuthMessage.textContent = "";
  profileAuthMessage.classList.remove("text-emerald-600", "text-rose-600");
  
  // Mostrar aba de login
  showProfileLoginForm();
  
  profileAuthModal.classList.remove("hidden");
  profileAuthModal.classList.add("flex");
}

async function tryProviderApiLogin(provider) {
  const endpoint = AUTH_API.providers[provider];
  if (!endpoint) return null;

  const response = await fetch(authApiUrl(endpoint), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "profile_modal" }),
  });

  if (!response.ok) {
    throw new Error("Falha na autenticação social");
  }

  const data = await response.json();
  return data?.user || null;
}

function upsertSocialCustomer(provider, userData) {
  const providerEmail = userData?.email || `${provider}_${Date.now()}@social.local`;
  const providerName = userData?.name || `Cliente ${provider}`;

  let customer = customers.find((item) => item.email === providerEmail);
  if (!customer) {
    customer = {
      id: crypto.randomUUID(),
      name: providerName,
      email: providerEmail,
      password: "",
      authProvider: provider,
      authMethod: "social",
      createdAt: new Date().toISOString(),
    };
    customers.push(customer);
    saveCustomers();
  } else {
    customer.authProvider = provider;
    customer.authMethod = "social";
    saveCustomers();
  }

  currentCustomer = customer;
  saveCurrentCustomer();
  renderByCustomer();
}

function processOAuthCallbackFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const socialLogin = params.get("social_login");
  if (!socialLogin) return;

  const provider = params.get("provider") || "social";

  if (socialLogin === "error") {
    const errorMessage = params.get("social_error") || "Falha na autenticação social.";
    showMessage(clientMessage, `${provider}: ${errorMessage}`, "error");
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  const userData = {
    id: params.get("external_id") || undefined,
    name: params.get("name") || `Cliente ${provider}`,
    email: params.get("email") || `${provider}_${Date.now()}@social.local`,
    picture: params.get("picture") || null,
  };

  upsertSocialCustomer(provider, userData);
  renderByCustomer();
  window.history.replaceState({}, document.title, window.location.pathname);

  showMessage(clientMessage, `Login com ${provider} realizado com sucesso!`, "success");
}

async function handleSocialLogin(provider) {
  showMessage(profileAuthMessage, `Conectando com ${provider}...`, "success");
  try {
    const apiUser = await tryProviderApiLogin(provider);
    upsertSocialCustomer(provider, apiUser);
    closeProfileAuthModal();
    setTimeout(() => openProfileDetailsModal(), 250);
  } catch {
    const fallbackUser = {
      name: `Cliente ${provider}`,
      email: `${provider}_${Date.now()}@social.local`,
    };
    upsertSocialCustomer(provider, fallbackUser);
    closeProfileAuthModal();
    setTimeout(() => openProfileDetailsModal(), 250);
  }
}

function closeProfileAuthModal() {
  profileAuthModal.classList.add("hidden");
  profileAuthModal.classList.remove("flex");
}

function showProfileLoginForm() {
  profileLoginForm.classList.remove("hidden");
  profileSignupForm.classList.add("hidden");
  profileLoginTabBtn.classList.add("border-slate-900", "text-slate-900");
  profileLoginTabBtn.classList.remove("border-transparent", "text-slate-500");
  profileSignupTabBtn.classList.add("border-transparent", "text-slate-500");
  profileSignupTabBtn.classList.remove("border-slate-900", "text-slate-900");
}

function showProfileSignupForm() {
  profileSignupForm.classList.remove("hidden");
  profileLoginForm.classList.add("hidden");
  profileSignupTabBtn.classList.add("border-slate-900", "text-slate-900");
  profileSignupTabBtn.classList.remove("border-transparent", "text-slate-500");
  profileLoginTabBtn.classList.add("border-transparent", "text-slate-500");
  profileLoginTabBtn.classList.remove("border-slate-900", "text-slate-900");
}

function handleProfileLogin() {
  const email = profileLoginEmail.value.trim();
  const password = profileLoginPassword.value.trim();
  
  if (!email || !password) {
    showMessage(profileAuthMessage, "Preencha todos os campos.", "error");
    return;
  }
  
  const customer = customers.find(c => c.email === email && c.password === password);
  if (!customer) {
    showMessage(profileAuthMessage, "Email ou senha inválidos.", "error");
    return;
  }
  
  // Login realizado com sucesso
  currentCustomer = customer;
  saveCurrentCustomer();
  currentCustomer.authProvider = currentCustomer.authProvider || "email";
  currentCustomer.authMethod = currentCustomer.authMethod || "password";
  saveCurrentCustomer();
  renderByCustomer();
  
  closeProfileAuthModal();
  
  // Abrir modal de perfil já com cliente logado
  setTimeout(() => {
    openProfileDetailsModal();
  }, 300);
}

function handleProfileSignup() {
  const name = profileSignupName.value.trim();
  const email = profileSignupEmail.value.trim();
  const password = profileSignupPassword.value.trim();
  const confirmPassword = profileSignupPasswordConfirm.value.trim();
  
  if (!name || !email || !password || !confirmPassword) {
    showMessage(profileAuthMessage, "Preencha todos os campos.", "error");
    return;
  }
  
  if (password !== confirmPassword) {
    showMessage(profileAuthMessage, "As senhas não conferem.", "error");
    return;
  }
  
  if (password.length < 6) {
    showMessage(profileAuthMessage, "A senha deve ter pelo menos 6 caracteres.", "error");
    return;
  }
  
  if (customers.some(c => c.email === email)) {
    showMessage(profileAuthMessage, "Este email já está cadastrado.", "error");
    return;
  }
  
  // Criar nova conta
  const newCustomer = {
    id: crypto.randomUUID(),
    name,
    email,
    password,
    authProvider: "email",
    authMethod: "password",
    createdAt: new Date().toISOString(),
  };
  
  customers.push(newCustomer);
  saveCustomers();
  
  // Fazer login automaticamente
  currentCustomer = newCustomer;
  saveCurrentCustomer();
  renderByCustomer();
  
  closeProfileAuthModal();
  
  // Abrir modal de perfil já com cliente logado
  setTimeout(() => {
    openProfileDetailsModal();
  }, 300);
}

function openProfileDetailsModal() {
  if (!currentCustomer) return;
  
  profileName.textContent = currentCustomer.name;
  profileEmail.textContent = currentCustomer.email;
  profileNameInput.value = currentCustomer.name;
  profileEmailInput.value = currentCustomer.email;
  
  // Formatar data de criação
  const createdDate = new Date(currentCustomer.createdAt);
  profileCreatedAt.value = createdDate.toLocaleDateString("pt-BR");
  
  // Restaurar foto de perfil se existir
  const savedPhoto = getStorage("loja_profile_photo_" + currentCustomer.id, null);
  if (savedPhoto) {
    profileAvatarContainer.innerHTML = `<img src="${savedPhoto}" alt="${currentCustomer.name}" class="w-full h-full rounded-full object-cover" />`;
  }
  
  // Carregar histórico de compras
  loadProfileOrders();
  
  // Limpar campos
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  profileMessage.textContent = "";
  trackingCode.value = "";
  trackingResult.classList.add("hidden");
  clearProfilePhotoPreview();
  
  profileModal.classList.remove("hidden");
  profileModal.classList.add("flex");
  
  // Resetar para primeira aba
  switchProfileTab("info");
}

function closeProfileModal() {
  profileModal.classList.add("hidden");
  profileModal.classList.remove("flex");
}

function switchProfileTab(tabName) {
  // Atualizar botões das abas
  document.querySelectorAll(".profile-tab-btn").forEach(btn => {
    btn.classList.remove("active", "border-slate-900", "text-slate-900");
    btn.classList.add("border-transparent", "text-slate-500");
  });
  
  const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeBtn) {
    activeBtn.classList.add("active", "border-slate-900", "text-slate-900");
  }
  
  // Mostrar/ocultar conteúdo das abas
  document.querySelectorAll(".profile-tab-content").forEach(content => {
    content.classList.add("hidden");
  });
  
  const activeContent = document.getElementById(`profile-${tabName}-tab`);
  if (activeContent) {
    activeContent.classList.remove("hidden");
  }
}

function loadProfileOrders() {
  if (!currentCustomer) return;
  
  const customerOrders = orders.filter(o => o.customer?.id === currentCustomer.id);
  
  if (customerOrders.length === 0) {
    profileOrdersList.innerHTML = '<p class="text-center text-slate-500 py-8">Nenhum pedido realizado ainda.</p>';
    return;
  }
  
  profileOrdersList.innerHTML = customerOrders.map(order => `
    <div class="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
      <div class="flex justify-between items-start gap-4 mb-3">
        <div>
          <p class="font-semibold text-slate-900">Pedido #${order.id}</p>
          <p class="text-sm text-slate-500">${new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-medium ${
          order.status === "confirmado" ? "bg-emerald-100 text-emerald-700" :
          order.status === "enviado" ? "bg-blue-100 text-blue-700" :
          "bg-slate-100 text-slate-700"
        }">${order.status || "Confirmado"}</span>
      </div>
      <div class="space-y-2 mb-3">
        <p class="text-sm"><span class="text-slate-600">Items:</span> ${order.items.length}</p>
        <p class="text-sm"><span class="text-slate-600">Total:</span> <strong>${formatCurrency(order.total)}</strong></p>
      </div>
      ${order.trackingCode ? `
        <p class="text-xs text-slate-500">Rastreio: <code class="bg-slate-50 px-2 py-1 rounded">${order.trackingCode}</code></p>
      ` : ""}
    </div>
  `).join("");
}

function handleChangePassword() {
  if (!currentCustomer) return;
  
  const current = currentPassword.value.trim();
  const newPass = newPassword.value.trim();
  const confirmPass = confirmPassword.value.trim();
  
  if (!current || !newPass || !confirmPass) {
    showMessage(profileMessage, "Preencha todos os campos.", "error");
    return;
  }
  
  if (current !== currentCustomer.password) {
    showMessage(profileMessage, "Senha atual incorreta.", "error");
    return;
  }
  
  if (newPass.length < 6) {
    showMessage(profileMessage, "A nova senha deve ter pelo menos 6 caracteres.", "error");
    return;
  }
  
  if (newPass !== confirmPass) {
    showMessage(profileMessage, "As senhas não conferem.", "error");
    return;
  }
  
  // Atualizar senha
  const customerIndex = customers.findIndex(c => c.id === currentCustomer.id);
  if (customerIndex !== -1) {
    customers[customerIndex].password = newPass;
    currentCustomer.password = newPass;
    saveCustomers();
    saveCurrentCustomer();
    
    showMessage(profileMessage, "Senha alterada com sucesso! 🎉", "success");
    setTimeout(() => {
      currentPassword.value = "";
      newPassword.value = "";
      confirmPassword.value = "";
    }, 1500);
  }
}

function handleProfilePhotoChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    const photoData = e.target.result;

    // Exibir pré-visualização antes de salvar
    pendingProfilePhotoData = photoData;
    pendingProfilePhotoImage = await loadImageFromDataUrl(photoData);
    resetPhotoCropState();
    renderPhotoCropPreview();
    if (profilePhotoPreviewImage) {
      profilePhotoPreviewImage.src = photoData;
    }
    if (profilePhotoPreviewWrap) {
      profilePhotoPreviewWrap.classList.remove("hidden");
    }
    showMessage(profileMessage, "Confira a prévia e clique em Salvar foto.", "success");
  };
  reader.readAsDataURL(file);
  
  // Reset dos inputs
  profilePhotoInput.value = "";
  if (profilePhotoCameraInput) {
    profilePhotoCameraInput.value = "";
  }
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Falha ao carregar imagem"));
    image.src = dataUrl;
  });
}

function resetPhotoCropState() {
  const viewportSize = profilePhotoCropViewport?.clientWidth || 176;
  photoCropState = {
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
    viewportSize,
  };
  if (profilePhotoZoomRange) {
    profilePhotoZoomRange.value = "1";
  }
}

function getCropMetrics() {
  if (!pendingProfilePhotoImage) return null;

  const viewportSize = profilePhotoCropViewport?.clientWidth || photoCropState.viewportSize || 176;
  const naturalWidth = pendingProfilePhotoImage.naturalWidth;
  const naturalHeight = pendingProfilePhotoImage.naturalHeight;
  const baseScale = Math.max(viewportSize / naturalWidth, viewportSize / naturalHeight);
  const displayScale = baseScale * photoCropState.zoom;
  const displayWidth = naturalWidth * displayScale;
  const displayHeight = naturalHeight * displayScale;
  const maxOffsetX = Math.max(0, (displayWidth - viewportSize) / 2);
  const maxOffsetY = Math.max(0, (displayHeight - viewportSize) / 2);

  return {
    viewportSize,
    naturalWidth,
    naturalHeight,
    displayScale,
    displayWidth,
    displayHeight,
    maxOffsetX,
    maxOffsetY,
  };
}

function clampPhotoCropOffsets() {
  const metrics = getCropMetrics();
  if (!metrics) return;

  photoCropState.offsetX = Math.min(metrics.maxOffsetX, Math.max(-metrics.maxOffsetX, photoCropState.offsetX));
  photoCropState.offsetY = Math.min(metrics.maxOffsetY, Math.max(-metrics.maxOffsetY, photoCropState.offsetY));
}

function renderPhotoCropPreview() {
  if (!pendingProfilePhotoImage || !profilePhotoPreviewImage) return;

  clampPhotoCropOffsets();
  const metrics = getCropMetrics();
  if (!metrics) return;

  profilePhotoPreviewImage.src = pendingProfilePhotoData;
  profilePhotoPreviewImage.style.width = `${metrics.displayWidth}px`;
  profilePhotoPreviewImage.style.height = `${metrics.displayHeight}px`;
  profilePhotoPreviewImage.style.left = `${(metrics.viewportSize - metrics.displayWidth) / 2 + photoCropState.offsetX}px`;
  profilePhotoPreviewImage.style.top = `${(metrics.viewportSize - metrics.displayHeight) / 2 + photoCropState.offsetY}px`;
}

function clearProfilePhotoPreview() {
  pendingProfilePhotoData = null;
  pendingProfilePhotoImage = null;
  if (profilePhotoPreviewWrap) {
    profilePhotoPreviewWrap.classList.add("hidden");
  }
  if (profilePhotoPreviewImage) {
    profilePhotoPreviewImage.src = "";
  }
}

function createCircularCroppedPhoto(dataUrl, size = 512) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const sourceSize = Math.min(image.width, image.height);
      const sourceX = (image.width - sourceSize) / 2;
      const sourceY = (image.height - sourceSize) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas não suportado"));
        return;
      }

      context.clearRect(0, 0, size, size);
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.closePath();
      context.clip();

      context.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        size,
        size
      );

      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = () => reject(new Error("Falha ao carregar imagem para recorte"));
    image.src = dataUrl;
  });
}

async function savePendingProfilePhoto() {
  if (!currentCustomer || !pendingProfilePhotoData) {
    showMessage(profileMessage, "Nenhuma foto selecionada para salvar.", "error");
    return;
  }

  let finalPhotoData = pendingProfilePhotoData;
  try {
    const metrics = getCropMetrics();
    if (metrics && pendingProfilePhotoImage) {
      const imageLeft = (metrics.viewportSize - metrics.displayWidth) / 2 + photoCropState.offsetX;
      const imageTop = (metrics.viewportSize - metrics.displayHeight) / 2 + photoCropState.offsetY;
      const srcX = Math.max(0, -imageLeft / metrics.displayScale);
      const srcY = Math.max(0, -imageTop / metrics.displayScale);
      const srcSize = Math.min(
        pendingProfilePhotoImage.naturalWidth - srcX,
        pendingProfilePhotoImage.naturalHeight - srcY,
        metrics.viewportSize / metrics.displayScale
      );

      const canvas = document.createElement("canvas");
      const outputSize = 512;
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, outputSize, outputSize);
        context.beginPath();
        context.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
        context.closePath();
        context.clip();
        context.drawImage(
          pendingProfilePhotoImage,
          srcX,
          srcY,
          srcSize,
          srcSize,
          0,
          0,
          outputSize,
          outputSize
        );
        finalPhotoData = canvas.toDataURL("image/png");
      }
    } else {
      finalPhotoData = await createCircularCroppedPhoto(pendingProfilePhotoData, 512);
    }
  } catch {
    finalPhotoData = pendingProfilePhotoData;
  }

  setStorage("loja_profile_photo_" + currentCustomer.id, finalPhotoData);
  profileAvatarContainer.innerHTML = `<img src="${finalPhotoData}" alt="${currentCustomer.name}" class="w-full h-full rounded-full object-cover" />`;
  clearProfilePhotoPreview();

  showMessage(profileMessage, "Foto de perfil atualizada! ✅", "success");
  setTimeout(() => {
    profileMessage.textContent = "";
  }, 1500);
}

async function handleTrackingSearch() {
  const code = trackingCode.value.trim();
  if (!code) {
    alert("Digite um código de rastreio válido");
    return;
  }
  
  trackingStatus.textContent = "Buscando...";
  trackingEvents.innerHTML = "";
  trackingResult.classList.remove("hidden");
  
  try {
    // Fazer requisição para a API Linketrack
    const response = await fetch(`https://api.linketrack.com/track/json?user=teste&token=1abcd234efgh567jklmn&codigo=${code}`);
    const data = await response.json();
    
    if (!data.eventos || data.eventos.length === 0) {
      trackingStatus.textContent = "❌ Nenhum rastreamento encontrado para este código.";
      trackingEvents.innerHTML = "";
      return;
    }
    
    // Mostrar status
    const lastEvent = data.eventos[0];
    trackingStatus.innerHTML = `<div class="text-lg">📦 ${lastEvent.status}</div><p class="text-sm text-slate-600">${lastEvent.data}</p>`;
    
    // Mostrar histórico de eventos
    trackingEvents.innerHTML = data.eventos.map(event => `
      <div class="border-l-2 border-slate-300 pl-3 pb-3">
        <p class="font-medium text-sm">${event.status}</p>
        <p class="text-xs text-slate-600">${event.data}</p>
        ${event.local ? `<p class="text-xs text-slate-500">${event.local}</p>` : ""}
      </div>
    `).join("");
  } catch (error) {
    trackingStatus.innerHTML = '<div style="color: #ff6b6b;">Erro ao buscar rastreamento. Tente novamente.</div>';
    console.error("Erro ao buscar rastreamento:", error);
  }
}

// Event Listeners - Profile Modal
if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    const naoLidas = getNotificacoesNaoLidas();
    if (naoLidas.length > 0) {
      mostrarNotificacoesCliente();
    } else {
      openProfileModal();
    }
  });
}

if (profileBackdrop) {
  profileBackdrop.addEventListener("click", closeProfileModal);
}

if (closeProfileBtn) {
  closeProfileBtn.addEventListener("click", closeProfileModal);
}

// Event Listeners - Profile Auth Modal
if (profileAuthBackdrop) {
  profileAuthBackdrop.addEventListener("click", closeProfileAuthModal);
}

if (closeProfileAuthBtn) {
  closeProfileAuthBtn.addEventListener("click", closeProfileAuthModal);
}

// Profile Auth Tabs
if (profileLoginTabBtn) {
  profileLoginTabBtn.addEventListener("click", showProfileLoginForm);
}

if (profileSignupTabBtn) {
  profileSignupTabBtn.addEventListener("click", showProfileSignupForm);
}

// Profile Auth Forms
if (profileLoginBtn) {
  profileLoginBtn.addEventListener("click", handleProfileLogin);
}

if (profileSignupBtn) {
  profileSignupBtn.addEventListener("click", handleProfileSignup);
}

if (profileSocialGoogleBtn) {
  profileSocialGoogleBtn.addEventListener("click", () => {
    startSocialLogin("google");
  });
}

// Enter key for login/signup
if (profileLoginPassword) {
  profileLoginPassword.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleProfileLogin();
  });
}

if (profileSignupPasswordConfirm) {
  profileSignupPasswordConfirm.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleProfileSignup();
  });
}

// Abas do perfil
const profileTabButtons = document.querySelectorAll(".profile-tab-btn");
profileTabButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const tab = e.target.dataset.tab || e.target.closest("[data-tab]")?.dataset.tab;
    switchProfileTab(tab);
  });
});

// Foto de perfil
if (profileAvatarContainer) {
  profileAvatarContainer.addEventListener("click", () => {
    profilePhotoInput.click();
  });
}

if (profilePhotoInput) {
  profilePhotoInput.addEventListener("change", handleProfilePhotoChange);
}

if (profilePhotoCameraInput) {
  profilePhotoCameraInput.addEventListener("change", handleProfilePhotoChange);
}

if (profilePickGalleryBtn) {
  profilePickGalleryBtn.addEventListener("click", () => {
    profilePhotoInput.click();
  });
}

if (profilePickCameraBtn) {
  profilePickCameraBtn.addEventListener("click", () => {
    if (profilePhotoCameraInput) {
      profilePhotoCameraInput.click();
      return;
    }
    profilePhotoInput.click();
  });
}

if (profilePhotoZoomRange) {
  profilePhotoZoomRange.addEventListener("input", () => {
    photoCropState.zoom = Number(profilePhotoZoomRange.value || 1);
    renderPhotoCropPreview();
  });
}

if (profilePhotoCropViewport) {
  profilePhotoCropViewport.addEventListener("pointerdown", (event) => {
    if (!pendingProfilePhotoData) return;
    photoCropDragState.dragging = true;
    photoCropDragState.startX = event.clientX;
    photoCropDragState.startY = event.clientY;
    photoCropDragState.startOffsetX = photoCropState.offsetX;
    photoCropDragState.startOffsetY = photoCropState.offsetY;
    profilePhotoCropViewport.setPointerCapture(event.pointerId);
  });

  profilePhotoCropViewport.addEventListener("pointermove", (event) => {
    if (!photoCropDragState.dragging) return;
    const deltaX = event.clientX - photoCropDragState.startX;
    const deltaY = event.clientY - photoCropDragState.startY;
    photoCropState.offsetX = photoCropDragState.startOffsetX + deltaX;
    photoCropState.offsetY = photoCropDragState.startOffsetY + deltaY;
    renderPhotoCropPreview();
  });

  const stopDrag = (event) => {
    if (!photoCropDragState.dragging) return;
    photoCropDragState.dragging = false;
    if (event && event.pointerId !== undefined) {
      profilePhotoCropViewport.releasePointerCapture(event.pointerId);
    }
  };

  profilePhotoCropViewport.addEventListener("pointerup", stopDrag);
  profilePhotoCropViewport.addEventListener("pointercancel", stopDrag);
  profilePhotoCropViewport.addEventListener("pointerleave", stopDrag);
}

if (profilePhotoSaveBtn) {
  profilePhotoSaveBtn.addEventListener("click", savePendingProfilePhoto);
}

if (profilePhotoCancelBtn) {
  profilePhotoCancelBtn.addEventListener("click", () => {
    clearProfilePhotoPreview();
    showMessage(profileMessage, "Alteração da foto cancelada.", "error");
  });
}

// Trocar senha
if (changePasswordBtn) {
  changePasswordBtn.addEventListener("click", handleChangePassword);
}

// Rastreio
if (trackingSearchBtn) {
  trackingSearchBtn.addEventListener("click", handleTrackingSearch);
}

if (trackingCode) {
  trackingCode.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleTrackingSearch();
  });
}

if (profileLogoutBtn) {
  profileLogoutBtn.addEventListener("click", logoutCustomer);
}

loadProducts();
processOAuthCallbackFromUrl();

const clearSearchField = () => {
  if (!productSearch) return;
  productSearch.value = "";
  productSearch.defaultValue = "";
  productSearch.setAttribute("value", "");
  productSearch.autocomplete = "off";
  productSearch.blur();

  if (typeof handleSearchChange === "function") {
    handleSearchChange({ target: productSearch });
  } else {
    productSearch.dispatchEvent(new Event("input", { bubbles: true }));
  }
};

const hardResetSearch = () => {
  if (!productSearch) return;
  productSearch.readOnly = true;
  clearSearchField();
  window.setTimeout(() => {
    if (productSearch) {
      productSearch.readOnly = false;
    }
  }, 0);
};

const forceClearSearch = () => {
  let attempts = 0;
  const maxAttempts = 3;
  const intervalId = window.setInterval(() => {
    attempts += 1;
    hardResetSearch();
    if (!productSearch || productSearch.value === "" || attempts >= maxAttempts) {
      window.clearInterval(intervalId);
    }
  }, 120);
};

// Garantir que o campo de busca inicie vazio
forceClearSearch();

// Inicializar notificações
atualizarBadgeNotificacoes();

window.addEventListener("pageshow", (event) => {
  if (event?.persisted) {
    forceClearSearch();
    return;
  }
  forceClearSearch();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    forceClearSearch();
  }
});
window.addEventListener("focus", hardResetSearch);
setTimeout(forceClearSearch, 0);
