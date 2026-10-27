/**
 * NUTRICENTER - Official Shopping Cart Module (TU CARRITO)
 * Manages cart state, dynamic drawer rendering, quantity adjustment, and checkout.
 */

(function (window, document) {
  "use strict";

  // Prevent multiple executions / duplicate event listener registrations
  if (window.__NutricenterCartLoaded) {
    return;
  }
  window.__NutricenterCartLoaded = true;

  const STORAGE_KEY = "nutricenter_cart";

  // Purge any old test items from earlier testing sessions so cart starts 100% clean
  const PURGE_KEY = "nutricenter_cart_v4_clean";
  if (!localStorage.getItem(PURGE_KEY)) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(PURGE_KEY, "true");
    } catch (e) {
      console.warn("[CartDrawer] Storage purge notice", e);
    }
  }

  // Helper to escape HTML characters preventing XSS
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Helper to resolve asset paths based on whether current page is in /pages/ or at root
  function getAssetPath(path) {
    if (!path) return "";
    const isInPages = window.location.pathname.replace(/\\/g, "/").indexOf("/pages/") !== -1;
    // Strip leading ../ or assets/
    const clean = path.replace(/^(\.\.\/)+/, "").replace(/^assets\//, "assets/");
    return (isInPages ? "../" : "") + clean;
  }

  const CartDrawer = {
    // Get stored items (strictly returns empty array if no user additions)
    getItems: function () {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn("[CartDrawer] Error reading localStorage", e);
      }
      return [];
    },

    saveItems: function (items) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("[CartDrawer] Error writing localStorage", e);
      }
      this.updateBadges();
      this.render();
    },

    addItem: function (product) {
      if (!product || !product.name) return;

      const cleanName = product.name.trim().toUpperCase();
      if (!cleanName || cleanName === "PRODUCTO" || cleanName === "SUPLEMENTO NUTRICENTER") {
        return; // Reject invalid/placeholder products
      }

      const items = this.getItems();
      const existing = items.find(
        (item) =>
          (product.id && item.id === product.id) ||
          item.name.trim().toLowerCase() === cleanName.toLowerCase()
      );

      const addQty = parseInt(product.qty, 10) || 1;

      if (existing) {
        existing.qty = (parseInt(existing.qty, 10) || 1) + addQty;
      } else {
        items.push({
          id: product.id || "prod-" + cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: cleanName,
          subtitle: (product.subtitle || "").trim().toUpperCase(),
          price: parseFloat(product.price) || 0.0,
          qty: addQty,
          image: product.image || "assets/images/BOTELLA-XTREMO-HOT-ROJO-1-300x300.webp"
        });
      }

      this.saveItems(items);
      this.animateBadge();
      this.open();

      if (typeof showToast === "function") {
        showToast("Producto añadido al carrito", "success");
      }
    },

    removeItem: function (index) {
      const items = this.getItems();
      if (index >= 0 && index < items.length) {
        items.splice(index, 1);
        this.saveItems(items);
      }
    },

    updateQty: function (index, delta) {
      const items = this.getItems();
      if (index >= 0 && index < items.length) {
        const currentQty = parseInt(items[index].qty, 10) || 1;
        const newQty = currentQty + delta;
        if (newQty <= 0) {
          this.removeItem(index);
        } else {
          items[index].qty = newQty;
          this.saveItems(items);
        }
      }
    },

    clearCart: function () {
      this.saveItems([]);
      if (typeof showToast === "function") {
        showToast("Carrito vaciado", "info");
      }
    },

    getSubtotal: function () {
      const items = this.getItems();
      return items.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (parseInt(item.qty, 10) || 1), 0);
    },

    getTotalCount: function () {
      const items = this.getItems();
      return items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
    },

    // Updates all badge indicators on the page
    updateBadges: function () {
      const total = this.getTotalCount();
      const badges = document.querySelectorAll(".cart-badge, #header-cart-badge");
      badges.forEach((b) => {
        b.textContent = total;
        if (total > 0) {
          b.style.display = "flex";
        } else {
          b.style.display = "none";
        }
      });
    },

    // Continuously ensures badges stay in sync even when header is injected asynchronously
    ensureBadgeSync: function () {
      this.updateBadges();
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        this.updateBadges();
        if (attempts >= 12 || document.getElementById("header-cart-badge")) {
          clearInterval(interval);
        }
      }, 150);
    },

    animateBadge: function () {
      const badges = document.querySelectorAll(".cart-badge, #header-cart-badge");
      badges.forEach((b) => {
        b.classList.remove("pulse");
        void b.offsetWidth; // trigger reflow
        b.classList.add("pulse");
      });
    },

    // Opens the drawer strictly to VIEW current contents (NEVER adds items)
    open: function () {
      let drawer = document.getElementById("cartDrawer");
      let overlay = document.getElementById("cartDrawerOverlay");
      if (!drawer || !overlay) {
        this.injectHTML();
        drawer = document.getElementById("cartDrawer");
        overlay = document.getElementById("cartDrawerOverlay");
      }
      this.render();
      if (drawer && overlay) {
        drawer.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    },

    close: function () {
      const drawer = document.getElementById("cartDrawer");
      const overlay = document.getElementById("cartDrawerOverlay");
      if (drawer && overlay) {
        drawer.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    },

    toggle: function () {
      const drawer = document.getElementById("cartDrawer");
      if (drawer && drawer.classList.contains("active")) {
        this.close();
      } else {
        this.open();
      }
    },

    checkout: function () {
      const items = this.getItems();
      if (!items || items.length === 0) {
        if (typeof showToast === "function") {
          showToast("Tu carrito está vacío. Agrega productos para finalizar tu compra.", "info");
        } else {
          alert("Tu carrito está vacío. Agrega productos para finalizar tu compra.");
        }
        return;
      }

      this.close();
      const isInPages = window.location.pathname.replace(/\\/g, "/").indexOf("/pages/") !== -1;
      window.location.href = isInPages ? "checkout.html" : "pages/checkout.html";
    },

    sendWhatsAppOrder: function () {
      const items = this.getItems();
      if (!items || items.length === 0) return;
      const subtotal = this.getSubtotal().toFixed(2);
      let message = "¡Hola Nutricenter! 👋 Deseo finalizar mi compra:\n\n";
      items.forEach((item, i) => {
        message += `${i + 1}. *${item.name}* ${item.subtitle ? "(" + item.subtitle + ")" : ""} - Cant: ${item.qty} x S/ ${parseFloat(item.price).toFixed(2)}\n`;
      });
      message += `\n*Subtotal: S / ${subtotal}*\n`;
      message += "Por favor, indíquenme los métodos de pago y detalles de envío. ¡Muchas gracias!";

      const phone = "51936396907";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    },

    // Injects the drawer DOM markup into document.body
    injectHTML: function () {
      if (document.getElementById("cartDrawer")) return;

      const overlay = document.createElement("div");
      overlay.id = "cartDrawerOverlay";
      overlay.className = "cart-drawer-overlay";
      overlay.setAttribute("onclick", "CartDrawer.close()");

      const drawer = document.createElement("aside");
      drawer.id = "cartDrawer";
      drawer.className = "cart-drawer";
      drawer.setAttribute("role", "dialog");
      drawer.setAttribute("aria-label", "Tu Carrito de Compras");

      drawer.innerHTML = `
        <div class="cart-drawer-header">
          <h2 class="cart-drawer-title">TU CARRITO</h2>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button type="button" class="cart-drawer-clear-btn" onclick="CartDrawer.clearCart()" title="Vaciar carrito" style="background: none; border: 1px solid #e2e8f0; color: #64748b; font-size: 0.75rem; font-weight: 600; padding: 4px 9px; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;">
              Vaciar
            </button>
            <button type="button" class="cart-drawer-close" onclick="CartDrawer.close()" aria-label="Cerrar Carrito">
              <span class="cart-drawer-close-symbol">✕</span> Cerrar
            </button>
          </div>
        </div>
        
        <div class="cart-drawer-body" id="cartDrawerBody">
          <!-- Dynamic Content Injected in render() -->
        </div>

        <div class="cart-drawer-footer" id="cartDrawerFooter">
          <button type="button" class="cart-drawer-checkout-btn" onclick="CartDrawer.checkout()">
            FINALIZAR COMPRA
          </button>
          <a href="${window.location.pathname.indexOf('/pages/') !== -1 ? 'carrito.html' : 'pages/carrito.html'}" onclick="CartDrawer.close()" style="display: block; text-align: center; color: #ff0000; font-weight: 700; font-size: 0.85rem; margin-top: 0.75rem; text-decoration: underline;">
            Ver Página del Carrito
          </a>
        </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(drawer);
    },

    // Renders items, divider, subtotal and checkout button safely (escaped)
    render: function () {
      const body = document.getElementById("cartDrawerBody");
      const footer = document.getElementById("cartDrawerFooter");
      if (!body) return;

      const items = this.getItems();
      const isInPages = window.location.pathname.replace(/\\/g, "/").indexOf("/pages/") !== -1;
      const catalogLink = isInPages ? "productos.html" : "pages/productos.html";

      if (items.length === 0) {
        body.innerHTML = `
          <div class="cart-drawer-empty-state">
            <div class="cart-empty-icon">
              <i class="bi bi-bag"></i>
            </div>
            <div class="cart-empty-text">Tu carrito está vacío</div>
            <div class="cart-empty-subtext">No tienes ningún producto en tu carrito. Explora nuestro catálogo y agrega tus favoritos.</div>
            <a href="${catalogLink}" class="cart-empty-btn" onclick="CartDrawer.close()">Ver Catálogo</a>
          </div>
        `;
        if (footer) footer.style.display = "none";
        this.updateBadges();
        return;
      }

      if (footer) footer.style.display = "block";

      let itemsHtml = '<div class="cart-items-list">';
      items.forEach((item, index) => {
        const itemImg = escapeHTML(getAssetPath(item.image));
        const itemSubtotal = (parseFloat(item.price) || 0).toFixed(2);
        const itemName = escapeHTML(item.name);
        const itemSubtitle = escapeHTML(item.subtitle || "");
        const itemQty = parseInt(item.qty, 10) || 1;
        const itemId = escapeHTML(item.id || String(index));

        itemsHtml += `
          <div class="cart-item-row" data-id="${itemId}">
            <div class="cart-item-image-wrap">
              <img src="${itemImg}" alt="${itemName}" class="cart-item-image" onerror="this.src='${escapeHTML(
          getAssetPath("assets/images/BOTELLA-XTREMO-HOT-ROJO-1-300x300.webp")
        )}'">
            </div>

            <div class="cart-item-details">
              <h3 class="cart-item-title">${itemName}</h3>
              <div class="cart-item-subtitle">${itemSubtitle}</div>
              
              <div class="cart-item-qty-row">
                <button type="button" class="cart-qty-btn" onclick="CartDrawer.updateQty(${index}, -1)" aria-label="Disminuir cantidad">-</button>
                <span class="cart-qty-number">${itemQty}</span>
                <button type="button" class="cart-qty-btn" onclick="CartDrawer.updateQty(${index}, 1)" aria-label="Aumentar cantidad">+</button>
              </div>

              <div class="cart-item-unit-subtotal">
                ${itemQty} x S / ${itemSubtotal}
              </div>
            </div>

            <button type="button" class="cart-item-remove-btn" onclick="CartDrawer.removeItem(${index})" title="Eliminar producto" aria-label="Eliminar ${itemName}">
              ✕
            </button>
          </div>
        `;
      });
      itemsHtml += "</div>";

      // Divider and Subtotal
      const subtotalFormatted = this.getSubtotal().toFixed(2);
      itemsHtml += `
        <hr class="cart-drawer-divider">
        <div class="cart-drawer-subtotal-wrap">
          <div class="cart-drawer-subtotal">Subtotal: S / ${subtotalFormatted}</div>
        </div>
      `;

      body.innerHTML = itemsHtml;
      this.updateBadges();
    },

    // Setup global click listeners
    initListeners: function () {
      // Escape key to close
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          CartDrawer.close();
        }
      });

      let clickLock = false;

      // Delegate clicks for opening the cart or adding products
      document.addEventListener("click", function (e) {
        // 1. OPEN CART from header bag icon or any trigger with cart-action / data-cart-open
        const cartAction = e.target.closest(".cart-action, [data-cart-open]");
        if (cartAction) {
          e.preventDefault();
          e.stopPropagation();
          CartDrawer.open();
          return;
        }

        // 2. ADD TO CART ONLY from valid catalog buttons with .btn-add-cart
        const addBtn = e.target.closest(".btn-add-cart");
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();
          if (clickLock) return;
          clickLock = true;
          setTimeout(() => {
            clickLock = false;
          }, 400);

          const card =
            addBtn.closest(".product-card") ||
            addBtn.closest("[data-elementor-type='loop-item']") ||
            addBtn.closest(".card");

          if (!card) {
            console.warn("[CartDrawer] No product card found for add button");
            return;
          }

          const nameEl = card.querySelector(".product-title") || card.querySelector("h3") || card.querySelector("h2");
          const priceEl = card.querySelector(".price-current") || card.querySelector(".price");
          const descEl = card.querySelector(".product-desc") || card.querySelector(".product-subtitle");
          const imgEl = card.querySelector("img");

          const rawName = card.dataset.name || (nameEl ? nameEl.textContent : "");
          if (!rawName || !rawName.trim()) {
            return;
          }

          let price = 50.0;
          if (card.dataset.price) {
            price = parseFloat(card.dataset.price);
          } else if (priceEl) {
            const cleanedPrice = priceEl.textContent.replace(/[^\d.]/g, "");
            if (cleanedPrice) price = parseFloat(cleanedPrice);
          }

          const product = {
            id: card.dataset.id || "prod-" + rawName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: rawName.trim().toUpperCase(),
            subtitle: (card.dataset.presentation || (descEl ? descEl.textContent : "")).trim().toUpperCase(),
            price: price,
            qty: 1,
            image: imgEl ? imgEl.getAttribute("src") : ""
          };

          CartDrawer.addItem(product);
        }
      });
    },

    init: function () {
      this.injectHTML();
      this.ensureBadgeSync();
      this.render();
      this.initListeners();
    }
  };

  // Expose globally
  window.CartDrawer = CartDrawer;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      CartDrawer.init();
    });
  } else {
    CartDrawer.init();
  }
})(window, document);
