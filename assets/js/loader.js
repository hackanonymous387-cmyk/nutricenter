/**
 * Nutricenter - Partial Loader
 * Inyecta header.html y footer.html dinámicamente desde /components/ según la ubicación de la página (raíz o /pages/).
 */
(function () {
  "use strict";

  var path = window.location.pathname.replace(/\\/g, "/");
  var isInPages = path.indexOf("/pages/") !== -1;

  var BASE = isInPages ? "../" : "";
  var ASSETS = isInPages ? "../" : "";
  var COMPONENTS = isInPages ? "../components/" : "components/";

  function resolvePaths(html) {
    if (!html) return "";
    return html
      .replace(/\{\{ASSETS\}\}/g, ASSETS)
      .replace(/%7B%7BASSETS%7D%7D/gi, ASSETS)
      .replace(/\{\{BASE\}\}/g, BASE)
      .replace(/%7B%7BBASE%7D%7D/gi, BASE);
  }

  function loadPartial(url, callback, fallback) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("No se pudo cargar: " + url);
        return res.text();
      })
      .then(function (html) {
        callback(resolvePaths(html));
      })
      .catch(function (err) {
        if (typeof fallback === "function") {
          fallback();
        } else {
          console.warn("[Nutricenter Loader]", err.message);
        }
      });
  }

  function injectPartialWithScripts(targetId, html) {
    var el = document.getElementById(targetId);
    if (!el) return;

    var temp = document.createElement("div");
    temp.innerHTML = html;

    var scripts = Array.from(temp.querySelectorAll("script"));
    scripts.forEach(function (s) {
      if (s.parentNode) s.parentNode.removeChild(s);
    });

    el.outerHTML = temp.innerHTML;

    scripts.forEach(function (oldScript) {
      var newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach(function (attr) {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }
      document.body.appendChild(newScript);
    });
  }

  function injectHeader() {
    loadPartial(COMPONENTS + "header.html", function (html) {
      injectPartialWithScripts("site-header-placeholder", html);
      if (window.CartDrawer && typeof window.CartDrawer.updateBadges === "function") {
        window.CartDrawer.updateBadges();
      }
    });
  }

  function injectFooter() {
    loadPartial(COMPONENTS + "footer.html", function (html) {
      injectPartialWithScripts("site-footer-placeholder", html);
    });
  }

  function injectCart() {
    if (!window.CartDrawer && !window.__NutricenterCartLoaded && !document.querySelector('script[src*="cart.js"]')) {
      var s = document.createElement("script");
      s.src = ASSETS + "assets/js/cart.js";
      s.defer = true;
      document.body.appendChild(s);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      injectHeader();
      injectFooter();
      injectCart();
    });
  } else {
    injectHeader();
    injectFooter();
    injectCart();
  }
})();
