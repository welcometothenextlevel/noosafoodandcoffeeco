/* Noosa Food & Coffee Co — motion.
   GSAP + ScrollTrigger + Lenis, vendored in js/vendor.
   Rules this file follows:
   - Content is visible without it. Only this script sets hidden start states.
   - Reveals are driven by scroll position (ScrollTrigger), never by an
     IntersectionObserver on a clipped element.
   - Images are revealed by sliding a veil off them, not by clipping them.
   - Whenever yPercent replaces a CSS translate, y is zeroed too. */
(function () {
  "use strict";

  var html = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var loader = document.querySelector(".loader");
  var curtain = document.querySelector(".curtain");

  function release() {
    html.classList.remove("pre-intro", "has-loader", "is-entering");
  }

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    release();
    return;
  }

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });

  var hadLoader = html.classList.contains("has-loader");
  var entering = html.classList.contains("is-entering");
  // If this runs after the CSS failsafe has already shown the page, leave it alone.
  var late = (window.performance && performance.now() > 2300);
  var desktop = matchMedia("(min-width: 1024px) and (pointer: fine)").matches;

  /* ---------- Smooth scroll (desktop only) ---------- */
  var lenis = null;
  if (desktop && window.Lenis) {
    lenis = new window.Lenis({ lerp: 0.095, anchors: { offset: -96 } });
    lenis.on("scroll", ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Helpers ---------- */
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function isIntro(el) { return !!el.closest("[data-intro]"); }
  function bgOf(el) {
    for (var n = el.parentElement; n; n = n.parentElement) {
      var c = getComputedStyle(n).backgroundColor;
      if (c && c !== "transparent" && c.indexOf("rgba(0, 0, 0, 0)") !== 0) return c;
    }
    return "#F7F5F0";
  }

  /* ---------- Build veils ---------- */
  $$("[data-veil]").forEach(function (frame) {
    var v = document.createElement("span");
    v.className = "veil";
    v.style.backgroundColor = bgOf(frame);
    frame.appendChild(v);
  });

  /* ---------- Start states ---------- */
  var introEls = late ? [] : $$("[data-intro]");

  $$("[data-lines] .ln__in").forEach(function (el) {
    if (late && isIntro(el)) return;
    gsap.set(el, { y: 0, yPercent: 112 });
  });
  $$("[data-fade]").forEach(function (el) {
    if (late && isIntro(el)) return;
    gsap.set(el, { autoAlpha: 0, y: 26 });
  });
  $$("[data-veil]").forEach(function (frame) {
    var v = frame.querySelector(".veil");
    if (late && isIntro(frame)) { v.remove(); return; }
    var img = frame.querySelector("img");
    if (img) gsap.set(img, { scale: 1.16 });
  });
  $$("[data-pop]").forEach(function (el) {
    if (late && isIntro(el)) return;
    gsap.set(el, { autoAlpha: 0, scale: 0.82 });
  });
  $$("[data-stagger]").forEach(function (el) {
    gsap.set(el.children, { autoAlpha: 0, y: 22 });
  });

  /* ---------- Intro: loader, page curtain, first screen ---------- */
  var intro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

  introEls.forEach(function (el) {
    if (el.hasAttribute("data-lines")) {
      intro.to(el.querySelectorAll(".ln__in"), { yPercent: 0, duration: 1.35, stagger: 0.1 }, 0);
    }
    $$("[data-veil]", el).concat(el.hasAttribute("data-veil") ? [el] : []).forEach(function (frame, i) {
      intro.to(frame.querySelector(".veil"), { yPercent: -101, duration: 1.4, ease: "expo.inOut" }, 0.1 + i * 0.12);
      var img = frame.querySelector("img");
      if (img) intro.to(img, { scale: 1, duration: 2, ease: "expo.out" }, 0.25 + i * 0.12);
    });
    if (el.hasAttribute("data-fade")) {
      intro.to(el, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.45);
    }
    $$("[data-pop]", el).forEach(function (p) {
      intro.to(p, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "back.out(1.6)" }, 0.9);
    });
    $$("figcaption", el).forEach(function (c) {
      intro.from(c, { autoAlpha: 0, duration: 1 }, 1.1);
    });
  });
  // offset the honey card so the two photos land one after the other
  var honeyCard = document.querySelector(".hero__card--honey .veil");
  if (honeyCard) intro.getChildren().forEach(function (t) {
    if (t.targets && t.targets()[0] === honeyCard) t.startTime(t.startTime() + 0.25);
  });

  var master = gsap.timeline();
  if (hadLoader && loader && !late) {
    var mark = loader.querySelector(".loader__mark img");
    gsap.set(loader, { visibility: "visible", y: 0, yPercent: 0 });
    gsap.set(mark, { y: 0, yPercent: 105 });
    master
      .to(mark, { yPercent: 0, duration: 1.1, ease: "expo.out" }, 0.15)
      .to(mark, { yPercent: -105, duration: 0.7, ease: "expo.in" }, 2.4)
      .to(loader, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 2.8)
      .set(loader, { visibility: "hidden" })
      .add(function () { intro.play(); }, 3.2);
    try { sessionStorage.setItem("nfc-seen", "1"); } catch (e) {}
  } else if (entering && curtain && !late) {
    gsap.set(curtain, { y: 0, yPercent: 0 });
    master
      .to(curtain, { yPercent: -100, duration: 0.95, ease: "expo.inOut" }, 0.05)
      .set(curtain, { yPercent: 100 })
      .add(function () { intro.play(); }, 0.4);
  } else {
    if (loader) gsap.set(loader, { visibility: "hidden" });
    if (curtain) gsap.set(curtain, { y: 0, yPercent: 100 });
    if (late) intro.progress(1); else master.add(function () { intro.play(); }, 0.05);
    try { sessionStorage.setItem("nfc-seen", "1"); } catch (e) {}
  }
  release();

  /* ---------- Scroll reveals ---------- */
  function once(trigger, start, fn) {
    ST.create({ trigger: trigger, start: start || "top 88%", once: true, onEnter: fn });
  }

  $$("[data-lines]").forEach(function (h) {
    if (isIntro(h)) return;
    once(h, "top 90%", function () {
      gsap.to(h.querySelectorAll(".ln__in"), { yPercent: 0, duration: 1.3, stagger: 0.1, ease: "expo.out" });
    });
  });

  $$("[data-fade]").forEach(function (el) {
    if (isIntro(el)) return;
    once(el, "top 92%", function () {
      gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", delay: 0.08 });
    });
  });

  $$("[data-stagger]").forEach(function (el) {
    once(el, "top 88%", function () {
      gsap.to(el.children, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" });
    });
  });

  $$("[data-veil]").forEach(function (frame) {
    if (isIntro(frame)) return;
    var v = frame.querySelector(".veil");
    var img = frame.querySelector("img");
    once(frame, "top 86%", function () {
      gsap.to(v, { yPercent: -101, duration: 1.4, ease: "expo.inOut" });
      if (img) gsap.to(img, { scale: 1, duration: 2.1, ease: "expo.out", delay: 0.12 });
    });
  });

  $$("[data-pop]").forEach(function (el) {
    if (isIntro(el)) return;
    once(el, "top 90%", function () {
      gsap.to(el, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "back.out(1.5)", delay: 0.35 });
    });
  });

  /* ---------- Parallax ---------- */
  $$("[data-parallax]").forEach(function (el) {
    var amt = parseFloat(el.getAttribute("data-parallax")) || -0.1;
    var hero = el.closest(".hero, .page-hero, .honey-hero");
    gsap.to(el, {
      yPercent: amt * 100, ease: "none",
      scrollTrigger: hero
        ? { trigger: hero, start: "top top", end: "bottom top", scrub: true }
        : { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  $$(".parallax-img").forEach(function (img) {
    var frame = img.closest(".frame") || img.parentElement;
    gsap.fromTo(img, { y: 0, yPercent: -7 }, {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  // Home hero text drifts and dims as it leaves
  var heroText = document.querySelector(".hero__text, .hero__brand, .hero__center");
  if (heroText) {
    gsap.to(heroText, {
      y: 90, opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  // Noosa band: the photo settles from a slow zoom as it passes
  var place = document.querySelector(".place__img");
  if (place) {
    gsap.fromTo(place, { scale: 1.22 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".place", start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  /* ---------- Honey drips ---------- */
  $$("[data-drips]").forEach(function (box) {
    var drips = $$(".drip", box);
    drips.forEach(function (d) {
      var h = parseFloat(getComputedStyle(d).getPropertyValue("--h")) || 60;
      gsap.fromTo(d, { height: 6 }, {
        height: h, ease: "none",
        scrollTrigger: { trigger: box, start: "top 95%", end: "top 15%", scrub: 1.2 }
      });
    });
    var band = box.querySelector(".drips__band");
    if (band) gsap.fromTo(band, { scaleX: 0 }, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: box, start: "top 100%", end: "top 55%", scrub: 1 }
    });
  });

  /* ---------- Self-drawing botanical sprig ---------- */
  $$("[data-draw]").forEach(function (svg) {
    var paths = $$("path", svg);
    paths.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len + " " + len;
      p.style.strokeDashoffset = len;
    });
    var tl = gsap.timeline({
      scrollTrigger: { trigger: svg.parentElement, start: "top 85%", end: "bottom 75%", scrub: 1 }
    });
    gsap.set(paths, { fillOpacity: 0 });
    paths.forEach(function (p, i) {
      tl.to(p, { strokeDashoffset: 0, ease: "none", duration: 1 }, i * (2.2 / paths.length));
    });
    tl.to(paths, { fillOpacity: 1, ease: "none", duration: 0.8 }, 2.6);
  });

  /* ---------- Size silhouettes rise from their shelf ---------- */
  $$("[data-rise]").forEach(function (group, gi) {
    var figs = $$(".size__fig svg", group);
    var labels = $$(".size__w, .size__t", group);
    var shelf = $$(".size__fig", group);
    gsap.set(figs, { y: 0, yPercent: 108 });
    gsap.set(labels, { autoAlpha: 0, y: 10 });
    gsap.set(shelf, { "--shelf": 0 });
    gsap.set(group.querySelector("h3"), { autoAlpha: 0, y: 14 });
    once(group, "top 85%", function () {
      var tl = gsap.timeline({ delay: gi * 0.12 });
      tl.to(group.querySelector("h3"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out" }, 0)
        .to(shelf, { "--shelf": 1, duration: 1.1, ease: "expo.inOut", stagger: 0.06 }, 0.05)
        .to(figs, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.09 }, 0.45)
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", stagger: 0.04 }, 0.75);
    });
  });

  /* ---------- Hero photos follow the pointer a little ---------- */
  if (desktop) {
    $$(".hero, .page-hero").forEach(function (sec) {
      var cards = $$(".hero__card .frame, .hero__beans .frame, .page-hero__media .frame", sec);
      var movers = cards.map(function (c, i) {
        var k = i === 0 ? 10 : 22;
        return {
          x: gsap.quickTo(c, "--mx", { duration: 1.2, ease: "power3" }),
          y: gsap.quickTo(c, "--my", { duration: 1.2, ease: "power3" }),
          k: k
        };
      });
      sec.addEventListener("pointermove", function (e) {
        var r = sec.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        movers.forEach(function (m) { m.x(-nx * m.k); m.y(-ny * m.k); });
      });
      sec.addEventListener("pointerleave", function () {
        movers.forEach(function (m) { m.x(0); m.y(0); });
      });
    });
  }

  /* ---------- Page transitions ---------- */
  if (curtain) {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if ((a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      var url;
      try { url = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (!/(\.html|\/[^.\/]*)$/.test(url.pathname)) return; // pages, not files
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / anchor
      e.preventDefault();
      try { sessionStorage.setItem("nfc-t", "1"); } catch (err) {}
      var go = function () { window.location.href = url.href; };
      gsap.fromTo(curtain, { y: 0, yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut", onComplete: go });
      window.setTimeout(go, 1300);
    });
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) gsap.set(curtain, { y: 0, yPercent: 100 });
    });
  }

  /* ---------- Keep measurements right once fonts and images settle ---------- */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
  window.addEventListener("load", function () { ST.refresh(); });

  // Expose for testing
  window.__nfcMotion = { lenis: lenis, ST: ST };
})();
