/* Noosa Food & Coffee Co — site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Header: compact logo once scrolled ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var label = toggle.querySelector(".menu-toggle__label");
    var setOpen = function (open) {
      document.body.classList.toggle("menu-open", open);
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Close" : "Menu";
      menu.inert = !open;
      if (open) {
        var first = menu.querySelector("a");
        if (first) first.focus();
      }
    };
    menu.inert = true;
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---------- Products (rendered from js/products.js) ---------- */
  var products = window.NFC_PRODUCTS || [];
  function byId(id) {
    for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i];
    return null;
  }
  function enquiryHref(p, option) {
    var q = "?product=" + encodeURIComponent(p.id);
    if (option) q += "&size=" + encodeURIComponent(option);
    return "./contact.html" + q;
  }

  function renderCard(p, idx) {
    var name = "opt-" + p.id;
    var pills = p.options.map(function (o, i) {
      return '<label class="pill"><input type="radio" name="' + name + '" value="' + esc(o.label) + '"' +
        (i === 0 ? " checked" : "") + '><span>' + esc(o.label) + "</span></label>";
    }).join("");
    var single = p.options.length === 1;
    return (
      '<article class="card reveal" id="' + esc(p.id) + '" data-delay="' + (idx % 2) + '" data-product="' + esc(p.id) + '">' +
        '<div class="card__media"><img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" width="' + p.width + '" height="' + p.height + '" loading="lazy" decoding="async"></div>' +
        '<div class="card__body">' +
          '<p class="card__brand">' + esc(p.brand) + "</p>" +
          '<h3 class="card__title">' + esc(p.name) + "</h3>" +
          '<p class="card__desc">' + esc(p.description) + "</p>" +
          '<fieldset class="card__options"><legend>' + esc(p.optionLabel) + (single ? "" : ", choose one") + "</legend>" +
            '<div class="pills">' + pills + "</div></fieldset>" +
          /* Cart slot: swap this button for "Add to cart" when the shop goes live. */
          '<div class="card__actions" data-cart-slot>' +
            '<a class="btn" data-enquire href="' + enquiryHref(p, p.options[0] && p.options[0].label) + '">Enquire ' + ARROW + "</a>" +
            '<span class="card__note">Price on enquiry</span>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function renderOrigin(p) {
    var name = "opt-" + p.id;
    var rows = p.options.map(function (o, i) {
      return '<li><label><input type="radio" name="' + name + '" value="' + esc(o.label) + '"' + (i === 0 ? " checked" : "") + ">" +
        '<span class="origin__name">' + esc(o.label) + '</span><span class="origin__mark" aria-hidden="true"></span></label></li>';
    }).join("");
    return (
      '<article class="origin" id="' + esc(p.id) + '" data-product="' + esc(p.id) + '">' +
        '<div class="origin__media reveal"><img src="' + esc(p.image) + '" alt="' + esc(p.alt) + '" width="' + p.width + '" height="' + p.height + '" loading="lazy" decoding="async"></div>' +
        '<div class="origin__body reveal" data-delay="1">' +
          '<h3 class="h3 visually-hidden">' + esc(p.name) + "</h3>" +
          '<fieldset><legend class="visually-hidden">Choose an origin</legend><ul class="origin__list">' + rows + "</ul></fieldset>" +
          '<div class="card__actions" data-cart-slot>' +
            '<a class="btn btn--light" data-enquire href="' + enquiryHref(p, p.options[0].label) + '">Enquire about this origin ' + ARROW + "</a>" +
            '<span class="card__note">Price on enquiry</span>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  document.querySelectorAll("[data-products]").forEach(function (mount) {
    var ids = mount.getAttribute("data-products").split(",");
    var variant = mount.getAttribute("data-variant");
    mount.innerHTML = ids.map(function (id, i) {
      var p = byId(id.trim());
      if (!p) return "";
      return variant === "origin" ? renderOrigin(p) : renderCard(p, i);
    }).join("");
  });

  // Keep each Enquire link in step with the chosen size / origin
  document.addEventListener("change", function (e) {
    var input = e.target;
    if (input.type !== "radio") return;
    var wrap = input.closest("[data-product]");
    if (!wrap) return;
    var p = byId(wrap.getAttribute("data-product"));
    var link = wrap.querySelector("[data-enquire]");
    if (p && link) link.setAttribute("href", enquiryHref(p, input.value));
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    var productSel = form.querySelector("#product");
    var sizeSel = form.querySelector("#size");
    var sizeLabel = form.querySelector("label[for='size']");
    var message = form.querySelector("#message");
    var extra = window.NFC_ENQUIRY_EXTRA || {};

    var optionsFor = function (enquiry) {
      // Merge the options of every product that maps to this enquiry type
      var label = "Size", seen = {}, list = [];
      products.forEach(function (p) {
        if (p.enquiry !== enquiry) return;
        label = p.optionLabel;
        p.options.forEach(function (o) {
          if (!seen[o.label]) { seen[o.label] = 1; list.push(o.label); }
        });
      });
      if (!list.length && extra[enquiry]) {
        label = extra[enquiry].optionLabel;
        list = extra[enquiry].options.map(function (o) { return o.label; });
      }
      return { label: label, list: list };
    };

    var fillSizes = function (selected) {
      var o = optionsFor(productSel.value);
      sizeLabel.innerHTML = esc(o.label) + " <small>(optional)</small>";
      sizeSel.innerHTML = '<option value="">' + (o.list.length ? "Not sure yet" : "Tell us in your message") + "</option>" +
        o.list.map(function (v) {
          return '<option value="' + esc(v) + '"' + (v === selected ? " selected" : "") + ">" + esc(v) + "</option>";
        }).join("");
      sizeSel.disabled = !o.list.length;
    };

    var params = new URLSearchParams(window.location.search);
    var pid = params.get("product");
    var chosen = params.get("size");
    var p = pid ? byId(pid) : null;
    if (p) {
      productSel.value = p.enquiry;
      if (!message.value && p.id === "green-beans" && chosen) {
        message.value = "I'm interested in green coffee beans from " + chosen + ".";
      } else if (!message.value && p.id === "blends") {
        message.value = "I'm interested in your roasted coffee blends.";
      }
    } else if (pid === "bulk") {
      productSel.value = "Bulk / café order";
    }
    fillSizes(chosen);
    productSel.addEventListener("change", function () { fillSizes(); });

    var success = document.getElementById("form-success");
    var status = form.querySelector(".form__status");
    var submit = form.querySelector("button[type='submit']");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      status.textContent = "";
      submit.disabled = true;
      submit.firstChild.textContent = "Sending… ";

      var done = function () {
        form.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      // Until the Formspree ID is added, the form runs in preview mode.
      if (form.action.indexOf("REPLACE_ME") !== -1) {
        console.warn("Formspree ID missing: enquiries are not being sent. Replace REPLACE_ME in contact.html.");
        window.setTimeout(done, 500);
        return;
      }

      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("Request failed");
          done();
        })
        .catch(function () {
          status.textContent = "Sorry, that didn't go through. Please try again in a moment.";
          submit.disabled = false;
          submit.firstChild.textContent = "Send enquiry ";
        });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
