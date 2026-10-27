/**
 * NUTRICENTER - Main Application Logic & Utility Functions
 */

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Nutricenter App Initialized');
  
  // Auto load layout components if placeholders exist
  await loadComponents();

  // Initialize Hero Carousel Slider
  initHeroCarousel();

  // Render and Initialize Category Lines Carousel Slider
  renderLineasTrackFromDB();
  initLinesSlider();

  // Initialize Brands Track (if present)
  renderBrandsTrack();

  // Initialize Featured Products ("Más Vendidos" en Home)
  renderFeaturedProducts();

  // Setup toast container
  if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
});

/**
 * Hero Carousel Slider Module (Auto-play every 5s, hover pause, prev/next, indicators)
 */
let currentSlide = 0;
let slideInterval = null;

function renderHeroSlidesFromDB() {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const indicatorsContainer = carousel.querySelector('.carousel-indicators');
  if (!track) return;

  if (typeof NutriDB !== 'undefined' && NutriDB.getHeroSlides) {
    const slides = NutriDB.getHeroSlides();
    if (slides && slides.length > 0) {
      track.innerHTML = '';
      if (indicatorsContainer) indicatorsContainer.innerHTML = '';

      slides.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
        slideDiv.style.backgroundImage = `url('${slide.bg_image || 'assets/images/fondos_hd.png'}')`;
        slideDiv.innerHTML = `
          <div class="hero-container">
            <div class="hero-text">
              <h1 class="hero-title">
                ${slide.titulo_linea1 || 'Nutrición'}<br>
                <span class="subtitle">${slide.titulo_linea2 || 'que te cambia'}</span>
                <span>${slide.titulo_linea3 || 'la vida'}</span>
              </h1>
              <p class="hero-subtitle">
                ${slide.subtitulo || 'Productos naturales certificados y con asesoría personalizada para transformar tu bienestar.'}
              </p>
              <div class="hero-buttons">
                <a href="${slide.btn1_url || 'pages/productos.html'}" class="btn-pill-red">
                  <i class="bi bi-shop-window"></i> ${slide.btn1_texto || 'Ver productos'}
                </a>
                <a href="${slide.btn2_url || 'https://wa.me/51936396907'}" target="_blank" class="btn-pill-outline">
                  <i class="bi bi-whatsapp"></i> ${slide.btn2_texto || 'Contacto'}
                </a>
              </div>
            </div>

            <div class="hero-image-wrapper">
              <img src="${slide.frontal_image || 'assets/images/carril.png'}" alt="${slide.titulo_linea1 || 'Nutricenter'}">
            </div>
          </div>
        `;
        track.appendChild(slideDiv);

        if (indicatorsContainer) {
          const span = document.createElement('span');
          span.className = `indicator ${idx === 0 ? 'active' : ''}`;
          span.onclick = () => goToSlide(idx);
          indicatorsContainer.appendChild(span);
        }
      });
    }
  }
}

function initHeroCarousel() {
  const carousel = document.getElementById('heroCarousel');
  if (!carousel) return;

  // Render slides from dynamic DB store if available
  renderHeroSlidesFromDB();

  const slides = carousel.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  startAutoSlide();

  // Pause auto-play on mouse enter, resume on mouse leave
  carousel.addEventListener('mouseenter', stopAutoSlide);
  carousel.addEventListener('mouseleave', startAutoSlide);

  // Re-render when updated from dashboard
  window.addEventListener('nutricenter:db_updated', () => {
    renderHeroSlidesFromDB();
    renderBrandsTrack();
    renderFeaturedProducts();
    renderLineasTrackFromDB();
  });
}

function updateCarousel() {
  const track = document.querySelector('.carousel-track');
  const indicators = document.querySelectorAll('.indicator');
  const slides = document.querySelectorAll('.hero-slide');
  if (!track || !slides.length) return;

  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  indicators.forEach((ind, index) => {
    if (index === currentSlide) {
      ind.classList.add('active');
    } else {
      ind.classList.remove('active');
    }
  });
}

function moveSlide(direction) {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  updateCarousel();
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function startAutoSlide() {
  stopAutoSlide();
  slideInterval = setInterval(() => {
    moveSlide(1);
  }, 5000); // Automatically transitions every 5 seconds
}

function stopAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

/**
 * Dynamic Brands Strip Renderer
 */
function renderBrandsTrack() {
  const track = document.getElementById('brandsTrack');
  if (!track || typeof NutriDB === 'undefined' || !NutriDB.getMarcas) return;

  const marcas = NutriDB.getMarcas().filter(m => m.estado !== 0);
  if (!marcas.length) return;

  // Duplicate list for seamless infinite loop animation
  const loopMarcas = [...marcas, ...marcas];

  track.innerHTML = '';
  loopMarcas.forEach(m => {
    const a = document.createElement('a');
    a.href = `pages/productos.html?marca=${encodeURIComponent(m.nombre)}`;
    a.className = 'brand-pill-card';
    a.title = m.nombre;
    a.innerHTML = `
      <img src="${m.logo || 'assets/images/marca 1.webp'}" alt="${m.nombre}" onerror="this.src='assets/images/marca 1.webp'">
    `;
    track.appendChild(a);
  });
}

/**
 * Dynamic Category Lines Renderer (Loads from NutriDB.getLineasSuplementos)
 */
function renderLineasTrackFromDB() {
  const track = document.getElementById('linesTrack');
  if (!track || typeof NutriDB === 'undefined' || !NutriDB.getLineasSuplementos) return;

  const lineas = NutriDB.getLineasSuplementos().filter(l => l.estado !== 0);
  if (!lineas || !lineas.length) return;

  track.innerHTML = '';
  lineas.forEach(l => {
    const a = document.createElement('a');
    a.href = `pages/productos.html?cat=${encodeURIComponent(l.slug)}`;
    a.className = 'line-card';
    a.innerHTML = `
      <img src="${l.imagen || 'assets/images/proteinas.webp'}" alt="${l.nombre}" onerror="this.src='assets/images/proteinas.webp'">
      <h3>${l.nombre}</h3>
    `;
    track.appendChild(a);
  });
}

/**
 * Dynamic Featured Products Renderer ("Más Vendidos" en Home)
 */
function renderFeaturedProducts() {
  const grid = document.getElementById('featuredProductsGrid');
  if (!grid || typeof NutriDB === 'undefined' || !NutriDB.getProductosDestacados) return;

  const prods = NutriDB.getProductosDestacados();
  if (!prods || !prods.length) return;

  grid.innerHTML = '';
  prods.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', p.id);

    const imgPath = p.imagen.startsWith('http') || p.imagen.startsWith('/') ? p.imagen : (p.imagen.includes('assets/') ? p.imagen : `assets/images/${p.imagen}`);
    const precio = parseFloat(p.precio || 0).toFixed(2);
    const precioAntiguo = p.precio_antiguo ? parseFloat(p.precio_antiguo).toFixed(2) : null;
    const descBadge = p.descuento ? `<span class="badge-discount" style="position: absolute; top: 12px; left: 12px; background: #e60000; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; z-index: 2;">${p.descuento}</span>` : '';

    card.innerHTML = `
      <div class="product-img-box" style="cursor: pointer; position: relative;" onclick="window.location.href='pages/producto-detalle.html?id=${p.id}'" title="Ver ficha de ${p.nombre}">
        ${descBadge}
        <img src="${imgPath}" alt="${p.nombre}" onerror="this.src='assets/images/creatina.png'">
      </div>
      <div class="product-title" style="cursor: pointer;" onclick="window.location.href='pages/producto-detalle.html?id=${p.id}'">${p.nombre}</div>
      <div class="product-desc">${p.servicios || p.marca || 'Fórmula Avanzada'} - ${p.categoria || 'Suplementos'}</div>
      <div class="product-prices">
        ${precioAntiguo ? `<span class="price-old">S/ ${precioAntiguo}</span>` : ''}
        <span class="price-current">S/ ${precio}</span>
      </div>
      <div class="product-card-actions">
        <button class="btn-add-cart" onclick="quickAddToCart(${p.id})">
          <i class="bi bi-cart-plus me-1"></i> Añadir al carrito
        </button>
        <button onclick="toggleWishlist(this)" class="btn-wishlist" title="Añadir a lista de deseos">
          <i class="bi bi-heart"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function quickAddToCart(productId) {
  if (typeof NutriDB === 'undefined') return;
  const db = NutriDB.getDB();
  const prod = (db.productos || []).find(p => p.id === parseInt(productId));
  if (prod && typeof Cart !== 'undefined' && Cart.add) {
    Cart.add({
      id: prod.id,
      name: prod.nombre,
      price: prod.precio,
      image: prod.imagen.includes('/') ? prod.imagen : `assets/images/${prod.imagen}`,
      quantity: 1
    });
    if (typeof showToast === 'function') {
      showToast(`¡${prod.nombre} añadido al carrito!`, 'success');
    }
  }
}

/**
 * Category Lines Continuous Infinite Marquee / Slider
 * Features:
 * - Constant seamless movement (no seconds delay, 60fps continuous glide)
 * - Pause on hover so the user can easily select categories
 * - Interactive arrow controls (Prev/Next advance smoothly)
 * - Mouse drag & touch swipe with seamless resumption
 */
function initLinesSlider() {
  const track = document.getElementById('linesTrack');
  if (!track) return;

  // Duplicate cards for seamless infinite scroll
  const originalCards = Array.from(track.querySelectorAll('.line-card'));
  if (!originalCards.length) return;

  // Clone cards so we have 2 complete sets for seamless infinite wrapping
  originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
  });

  let scrollPos = 0;
  const speed = 0.9; // Constant smooth speed (pixels per frame)
  let isPaused = false;
  let isDragging = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  function getHalfWidth() {
    return track.scrollWidth / 2;
  }

  function loop() {
    if (!isPaused && !isDragging) {
      scrollPos += speed;
      const halfWidth = getHalfWidth();
      if (halfWidth > 0) {
        if (scrollPos >= halfWidth) {
          scrollPos -= halfWidth;
        } else if (scrollPos < 0) {
          scrollPos += halfWidth;
        }
      }
      track.scrollLeft = scrollPos;
    }
    requestAnimationFrame(loop);
  }

  // Start continuous infinite loop immediately
  requestAnimationFrame(loop);

  // Pause on hover
  const section = track.closest('.lines-section') || track;
  section.addEventListener('mouseenter', () => {
    isPaused = true;
    scrollPos = track.scrollLeft;
  });

  section.addEventListener('mouseleave', () => {
    if (!isDragging) {
      scrollPos = track.scrollLeft;
      isPaused = false;
    }
  });

  // Navigation Arrows (Nudge forward or backward)
  const prevBtns = [
    document.getElementById('linesPrevBtn'),
    document.getElementById('linesSidePrev')
  ].filter(Boolean);

  const nextBtns = [
    document.getElementById('linesNextBtn'),
    document.getElementById('linesSideNext')
  ].filter(Boolean);

  function nudge(amount) {
    scrollPos += amount;
    const halfWidth = getHalfWidth();
    if (halfWidth > 0) {
      if (scrollPos >= halfWidth) scrollPos -= halfWidth;
      if (scrollPos < 0) scrollPos += halfWidth;
    }
    track.scrollLeft = scrollPos;
  }

  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      nudge(-240);
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      nudge(240);
    });
  });

  // Mouse Drag to Scroll
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasDragged = false;
    isPaused = true;
    track.classList.add('is-dragging');
    startX = e.pageX;
    scrollStart = track.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    scrollPos = track.scrollLeft;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const walk = (e.pageX - startX) * 1.3;
    if (Math.abs(walk) > 5) {
      hasDragged = true;
    }
    let newScroll = scrollStart - walk;
    const halfWidth = getHalfWidth();
    if (halfWidth > 0) {
      if (newScroll >= halfWidth) newScroll -= halfWidth;
      if (newScroll < 0) newScroll += halfWidth;
    }
    track.scrollLeft = newScroll;
    scrollPos = newScroll;
  });

  // Touch Swipe for Mobile
  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    hasDragged = false;
    isPaused = true;
    if (e.touches && e.touches[0]) {
      startX = e.touches[0].pageX;
      scrollStart = track.scrollLeft;
    }
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches || !e.touches[0]) return;
    const walk = (e.touches[0].pageX - startX) * 1.3;
    if (Math.abs(walk) > 5) hasDragged = true;
    let newScroll = scrollStart - walk;
    const halfWidth = getHalfWidth();
    if (halfWidth > 0) {
      if (newScroll >= halfWidth) newScroll -= halfWidth;
      if (newScroll < 0) newScroll += halfWidth;
    }
    track.scrollLeft = newScroll;
    scrollPos = newScroll;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    scrollPos = track.scrollLeft;
    isPaused = false;
  }, { passive: true });

  // Prevent link click if user dragged
  track.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);
}

/**
 * Loads reusable HTML components into elements with data-component attributes or specific IDs
 */
async function loadComponents() {
  const componentMap = {
    'navbar-placeholder': '../components/navbar.html',
    'header-placeholder': '../components/header.html',
    'site-header-placeholder': '../components/header.html',
    'sidebar-placeholder': '../components/sidebar.html',
    'modal-placeholder': '../components/modal.html',
    'footer-placeholder': '../components/footer.html'
  };

  for (const [id, path] of Object.entries(componentMap)) {
    const el = document.getElementById(id);
    if (el) {
      try {
        const response = await fetch(path);
        const isInPages = window.location.pathname.replace(/\\/g, "/").indexOf("/pages/") !== -1;
        const BASE = isInPages ? "../" : "";
        const ASSETS = isInPages ? "../" : "";

        if (response.ok) {
          let text = await response.text();
          text = text.split("{{ASSETS}}").join(ASSETS).split("{{BASE}}").join(BASE);
          el.innerHTML = text;
        } else {
          // Fallback to relative path from root
          const rootPath = path.replace('../', '');
          const fallbackResp = await fetch(rootPath);
          if (fallbackResp.ok) {
            let text = await fallbackResp.text();
            text = text.split("{{ASSETS}}").join(ASSETS).split("{{BASE}}").join(BASE);
            el.innerHTML = text;
          }
        }
      } catch (err) {
        console.warn(`Could not load component from ${path}:`, err);
      }
    }
  }

  // Highlight active link in sidebar or navbar
  highlightActiveNav();

  // Update header user state based on current session
  updateHeaderUserUI();
}

/**
 * Dynamic Header User Authentication Display
 */
function updateHeaderUserUI() {
  const container = document.getElementById('header-user-container');
  if (!container) return;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('nutri_user'));
  } catch (e) {
    user = null;
  }

  const isInPages = window.location.pathname.replace(/\\/g, "/").indexOf("/pages/") !== -1;
  const BASE = isInPages ? "../" : "";

  if (user && user.nombre) {
    const firstName = user.nombre.split(' ')[0];
    const roleBadge = user.rol || 'Cliente';
    
    container.innerHTML = `
      <div class="header-user-dropdown-wrapper" style="position: relative; display: inline-flex; align-items: center;">
        <button type="button" class="action-item header-user-btn" onclick="toggleHeaderUserMenu(event)" style="background: none; border: none; color: #ffffff; cursor: pointer; display: inline-flex; align-items: center; gap: 0.45rem; font-family: 'Inter', sans-serif; font-size: 0.85rem; font-weight: 600; padding: 0.35rem 0.6rem; border-radius: 9999px; transition: background 0.2s ease;">
          <span style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Hola, ${escapeHTML(firstName)}</span>
          <i class="bi bi-person-check-fill" style="font-size: 1.25rem; color: #e60000;"></i>
          <i class="bi bi-chevron-down" style="font-size: 0.7rem; color: #94a3b8;"></i>
        </button>
        <div class="header-user-menu" id="headerUserMenu" style="display: none; position: absolute; top: calc(100% + 8px); right: 0; background: #ffffff; border: 2px solid #e60000; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.18); min-width: 230px; z-index: 1050; padding: 0.6rem 0; color: #1e293b; text-align: left;">
          <div style="padding: 0.5rem 1rem 0.6rem; border-bottom: 1px solid #f1f5f9;">
            <div style="font-weight: 700; font-size: 0.88rem; color: #0f172a;">${escapeHTML(user.nombre)}</div>
            <div style="font-size: 0.75rem; color: #64748b; word-break: break-all;">${escapeHTML(user.email)}</div>
            <span style="display: inline-block; margin-top: 4px; font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 9999px; background: #fee2e2; color: #e60000;">
              ${escapeHTML(roleBadge)}
            </span>
          </div>
          <div style="padding: 0.35rem 0;">
            <a href="${BASE}pages/pedidos.html" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 1rem; color: #334155; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: background 0.15s ease;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <i class="bi bi-box-seam" style="color: #e60000;"></i> Mis Pedidos / Compras
            </a>
            <a href="${BASE}pages/checkout.html" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 1rem; color: #334155; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: background 0.15s ease;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <i class="bi bi-credit-card" style="color: #e60000;"></i> Finalizar Compra
            </a>
            ${(user.rol === 'Admin' || user.rol === 'Vendedor') ? `
            <a href="${BASE}pages/dashboard.html" style="display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 1rem; color: #334155; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: background 0.15s ease;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <i class="bi bi-speedometer2" style="color: #e60000;"></i> Panel de Control
            </a>` : ''}
          </div>
          <div style="border-top: 1px solid #f1f5f9; padding-top: 0.35rem;">
            <button type="button" onclick="handleHeaderLogout()" style="width: 100%; display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 1rem; background: none; border: none; color: #ef4444; font-size: 0.85rem; font-weight: 600; cursor: pointer; text-align: left; transition: background 0.15s ease;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'">
              <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <a href="${BASE}pages/login.html" class="action-item" id="header-user-link">
        <span>Acceder</span>
        <i class="bi bi-person-circle" style="font-size: 1.25rem;"></i>
      </a>
    `;
  }
}

function handleHeaderLogout() {
  if (typeof Auth !== 'undefined' && Auth.logout) {
    Auth.logout();
  } else {
    localStorage.removeItem('nutri_user');
    window.location.reload();
  }
}

function toggleHeaderUserMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('headerUserMenu');
  if (menu) {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  }
}

// Close user dropdown if clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('headerUserMenu');
  if (menu && !e.target.closest('.header-user-dropdown-wrapper')) {
    menu.style.display = 'none';
  }
});

// Listen to auth changes dynamically
window.addEventListener('nutri_auth_changed', () => {
  updateHeaderUserUI();
});

/**
 * Highlights active menu item based on current location
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href)) {
      link.classList.add('active');
    }
  });
}

/**
 * Universal Fetch API Wrapper for Backend Communication
 */
async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const user = JSON.parse(localStorage.getItem('nutri_user') || 'null');
  if (user && user.token) {
    defaultHeaders['Authorization'] = `Bearer ${user.token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  const baseUrl = window.location.pathname.includes('/pages/') 
    ? '../backend/routes/api.php' 
    : 'backend/routes/api.php';

  const url = `${baseUrl}?action=${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * Safe HTML Escaping Helper to Prevent XSS
 */
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
window.escapeHTML = escapeHTML;

/**
 * Toast Notification System
 */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

/**
 * Generic Modal Helpers
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

/**
 * Toggle Wishlist Heart Button & Synchronize with localStorage
 */
function toggleWishlist(btn, customData = null) {
  const icon = btn.querySelector('i');
  if (!icon) return;

  const card = btn.closest('.product-card') || btn.closest('.wishlist-card');
  let product = customData;

  if (!product && card) {
    const titleEl = card.querySelector('.product-title') || card.querySelector('.wishlist-card-title') || card.querySelector('h3');
    const priceEl = card.querySelector('.price-current') || card.querySelector('.wishlist-price-current');
    const descEl = card.querySelector('.product-desc') || card.querySelector('.wishlist-card-subtitle');
    const imgEl = card.querySelector('img');

    product = {
      name: titleEl ? titleEl.textContent.trim() : 'Suplemento Deportivo',
      subtitle: descEl ? descEl.textContent.trim() : '',
      price: priceEl ? priceEl.textContent.replace(/[^\d.]/g, '') : '50.00',
      image: imgEl ? imgEl.getAttribute('src') : ''
    };
  }

  let wishlist = [];
  try {
    wishlist = JSON.parse(localStorage.getItem('nutricenter_wishlist') || '[]');
  } catch (e) {
    wishlist = [];
  }

  if (icon.classList.contains('bi-heart')) {
    icon.classList.remove('bi-heart');
    icon.classList.add('bi-heart-fill');
    btn.classList.add('active');

    if (product && !wishlist.some(w => w.name === product.name)) {
      wishlist.push(product);
      localStorage.setItem('nutricenter_wishlist', JSON.stringify(wishlist));
    }
    showToast('Añadido a lista de deseos', 'success');
  } else {
    icon.classList.remove('bi-heart-fill');
    icon.classList.add('bi-heart');
    btn.classList.remove('active');

    if (product) {
      wishlist = wishlist.filter(w => w.name !== product.name);
      localStorage.setItem('nutricenter_wishlist', JSON.stringify(wishlist));
    }
    showToast('Removido de lista de deseos', 'info');
  }

  if (typeof window.renderWishlistPage === 'function') {
    window.renderWishlistPage();
  }
}

/**
 * Toggle Categories Hamburger Dropdown Menu
 */
function toggleCategoriesMenu(e) {
  if (e) e.stopPropagation();
  const wrapper = document.querySelector('.categories-dropdown-wrapper');
  if (wrapper) {
    wrapper.classList.toggle('open');
  }
}

// Close dropdown when clicking anywhere outside
document.addEventListener('click', (e) => {
  const wrapper = document.querySelector('.categories-dropdown-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove('open');
  }
});
