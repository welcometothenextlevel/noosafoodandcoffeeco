#!/usr/bin/env python3
"""Builds the four pages of the Noosa Food & Coffee Co site.

Shared head, header, call to action and footer live here once, so every
page stays consistent. Run from anywhere:  python3 _build/build.py
Output goes to the repo root (index.html, coffee.html, honey.html, contact.html).
All links and asset paths are relative so the site works on GitHub Pages.

Motion hooks used by js/motion.js (content stays visible without JS):
  data-intro      first-screen element, hidden only while the intro plays
  data-lines      heading made of .ln > .ln__in lines that rise into place
  data-fade       fades and lifts in on scroll
  data-veil       image frame revealed by a sliding veil
  data-parallax   element drifts at its own speed while scrolling
  data-drips      honey drips that lengthen as the section arrives
  data-draw       inline SVG whose strokes draw themselves
  data-rise       size silhouettes that rise from their baseline
  data-stagger    children fade in one after another
  data-pop        small element that scales into place
"""
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://noosafoodandcoffeeco.com.au/"
ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
CUR = ' aria-current="page"'
import hashlib


def ver(rel):
    """Short content hash, so browsers fetch the new file after each change."""
    return hashlib.md5((ROOT / rel).read_bytes()).hexdigest()[:8]


def clean(page):
    """Public URL path for a page file: index.html -> "", coffee.html -> "coffee"."""
    return "" if page == "index.html" else page[:-5]


NAV = [("index.html", "Home"), ("coffee.html", "Coffee"), ("honey.html", "Honey"), ("contact.html", "Contact")]


def lines(*parts, tag="h2", cls="h2", id_="", intro=False):
    """Heading split into fixed lines so each can rise from behind a mask."""
    inner = " ".join(f'<span class="ln"><span class="ln__in">{p}</span></span>' for p in parts)
    attrs = f' id="{id_}"' if id_ else ""
    attrs += " data-intro" if intro else ""
    return f'<{tag} class="{cls}"{attrs} data-lines>{inner}</{tag}>'


def drips(seed, count=14, max_len=120, band=True):
    """Honey drips hanging from a band. Positions are fixed at build time."""
    rnd = random.Random(seed)
    out = []
    xs = sorted(rnd.uniform(2, 98) for _ in range(count))
    for x in xs:
        w = rnd.uniform(10, 22)
        h = rnd.uniform(18, max_len)
        drop = rnd.random() < 0.35
        out.append(
            f'<span class="drip" style="left:{x:.1f}%;--w:{w:.0f}px;--h:{h:.0f}px">'
            + ('<i class="drip__drop"></i>' if drop else "")
            + "</span>"
        )
    b = '<span class="drips__band"></span>' if band else ""
    return '<div class="drips" aria-hidden="true" data-drips>' + b + "".join(out) + "</div>"


# Fern from Nicky's leaf pattern: drawn on scroll, then filled (js/motion.js)
FERN = (ROOT / "images" / "fern.svg").read_text().strip()
SPRIG_INLINE = FERN.replace("<svg ", '<svg class="cta__sprig" aria-hidden="true" focusable="false" data-draw ', 1)


def head(title, desc, page):
    url = SITE + clean(page)
    return f"""<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#151515">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Noosa Food &amp; Coffee Co">
<meta property="og:locale" content="en_AU">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}images/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Noosa Food &amp; Coffee Co logo beside Noosa Coffee Co coffee bags">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="icon" href="./images/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="./images/apple-touch-icon.png">
<script>
(function (h) {{
  h.classList.add("js");
  // Old links to /coffee.html etc: show the clean URL in the address bar
  if (/\.html$/.test(location.pathname) && history.replaceState) {{
    history.replaceState(null, "", location.pathname.replace(/(index)?\.html$/, "") + location.search + location.hash);
  }}
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  h.classList.add("pre-intro");
  // Internal link: the curtain. Any other arrival (link, typed URL, reload): the logo intro.
  // Back/forward skips it.
  var entering = false, back = false;
  try {{
    entering = sessionStorage.getItem("nfc-t") === "1";
    sessionStorage.removeItem("nfc-t");
    var nav = performance.getEntriesByType("navigation")[0];
    back = !!nav && nav.type === "back_forward";
  }} catch (e) {{}}
  if (entering) h.classList.add("is-entering");
  else if (!back) h.classList.add("has-loader");
}})(document.documentElement);
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..600&amp;family=Fraunces:opsz,wght,SOFT@9..144,300..500,0..100&amp;display=swap">
<link rel="stylesheet" href="./css/style.css?v={ver('css/style.css')}">
</head>
"""


def header(page):
    links = "".join(f'<a href="./{clean(href)}"{CUR if href == page else ""}>{label}</a>' for href, label in NAV)
    mlinks = "".join(f'<li><a href="./{clean(href)}"{CUR if href == page else ""}>{label}</a></li>' for href, label in NAV)
    return f"""<body>
<a class="skip" href="#main">Skip to content</a>
<div class="loader" aria-hidden="true">
  <div class="loader__disc"><div class="loader__mark"><img src="./images/logo-light.svg" alt="" width="550" height="557"></div></div>
</div>
<div class="curtain" aria-hidden="true"></div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="./" aria-label="Noosa Food &amp; Coffee Co, home">
      <img src="./images/logo-light.svg" alt="" width="550" height="557">
    </a>
    <nav class="nav" aria-label="Main">
      {links}
      <a class="btn btn--light-line btn--sm" href="./contact"><span>Enquire</span></a>
    </nav>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu">
      <span class="menu-toggle__label">Menu</span><span class="menu-toggle__icon" aria-hidden="true"></span>
    </button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu">
  <nav aria-label="Mobile">
    <ul>{mlinks}</ul>
  </nav>
  <div class="mobile-menu__foot">
    <a class="btn btn--light" href="./contact"><span>Contact us</span> {ARROW}</a>
    <p>Noosa Heads, Queensland, Australia</p>
  </div>
</div>
"""


CTA = f"""
<section class="cta section" aria-labelledby="cta-title">
  {SPRIG_INLINE}
  <div class="wrap cta__grid">
    <div>
      {lines("Tell us what", "you&rsquo;re after.", id_="cta-title", cls="h2 h2--xl")}
      <p class="cta__text" data-fade>Questions, orders or bulk enquiries. Send us a message and we&rsquo;ll get back to you.</p>
    </div>
    <div data-fade>
      <a class="btn btn--lg" href="./contact"><span>Contact us</span> {ARROW}</a>
    </div>
  </div>
</section>
"""


def footer():
    links = "".join(f'<li><a href="./{clean(href)}">{label}</a></li>' for href, label in NAV)
    return f"""<footer class="site-footer on-dark">
  <div class="footer__band" aria-hidden="true"></div>
  <div class="wrap">
    <div class="footer__grid">
      <div class="footer__brand"><img class="footer__logo" src="./images/logo-light.svg" alt="Noosa Food &amp; Coffee Co" width="550" height="557" loading="lazy"></div>
      <div class="footer__col">
        <h2>Where we are</h2>
        <p>Noosa Heads,<br>Queensland, Australia</p>
      </div>
      <div class="footer__col">
        <h2>Pages</h2>
        <ul>{links}</ul>
      </div>
      <div class="footer__col">
        <h2>Our labels</h2>
        <ul>
          <li><a class="footer__label" href="./coffee"><img src="./images/noosa-coffee-co.svg" alt="" width="350" height="350" loading="lazy">Noosa Coffee Co</a></li>
          <li><a class="footer__label" href="./honey"><img src="./images/noosa-tropical-farm-honey.svg" alt="" width="350" height="350" loading="lazy">Noosa Tropical Farm</a></li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <p>&copy; <span data-year>2026</span> Noosa Food &amp; Coffee Co</p>
      <p>Website by <a href="https://nextdigitalevel.com">Next Digital Level</a></p>
    </div>
  </div>
</footer>
<script src="./js/products.js?v={ver('js/products.js')}"></script>
<script src="./js/main.js?v={ver('js/main.js')}"></script>
<script src="./js/vendor/gsap.min.js" defer></script>
<script src="./js/vendor/ScrollTrigger.min.js" defer></script>
<script src="./js/vendor/lenis.min.js" defer></script>
<script src="./js/motion.js?v={ver('js/motion.js')}" defer></script>
</body>
</html>
"""


# ---------- Size silhouettes (home) ----------
SIZE_DEFS = """
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <defs>
    <symbol id="s-bag" viewBox="0 0 64 100">
      <path d="M6 12h52v84a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <path d="M49 12h9v84a3 3 0 0 1-3 3h-6z" fill="#151515"/>
      <path d="M51.5 30c2 2 3 5 2 8M52 52c2.4 1.4 3.4 4 2.6 7M51.6 74c2 2 2.6 4.6 1.8 7" fill="none" stroke="#F7F5F0" stroke-width=".7" opacity=".7"/>
      <rect x="6" y="3" width="52" height="9" rx="1" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <path d="M11 5v5M15 5v5M19 5v5M23 5v5M27 5v5M31 5v5M35 5v5M39 5v5M43 5v5M47 5v5M51 5v5M55 5v5" stroke="#151515" stroke-width=".5" opacity=".45"/>
      <circle cx="27.5" cy="42" r="12" fill="#151515"/>
      <path d="M36 29c3-2 5-1 6 0-2 2-4 3-6 0z" fill="#9BC53D"/>
      <path d="M17 62h21M20 66h15" stroke="#151515" stroke-width="1.6" opacity=".55"/>
    </symbol>
    <symbol id="s-jar" viewBox="0 0 56 78">
      <rect x="9" y="1" width="38" height="13" rx="2" fill="#F2C230" stroke="#151515" stroke-width="1.3"/>
      <rect x="4" y="16" width="48" height="61" rx="7" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <circle cx="28" cy="46" r="15" fill="#151515"/>
      <path d="M22 46h12" stroke="#F2C230" stroke-width="1.6"/>
    </symbol>
    <symbol id="s-tub" viewBox="0 0 96 72">
      <rect x="1" y="1" width="94" height="13" rx="3" fill="#F2C230" stroke="#151515" stroke-width="1.3"/>
      <path d="M6 14h84l-5 54a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3z" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <ellipse cx="48" cy="42" rx="22" ry="14" fill="#151515"/>
      <path d="M40 42h16" stroke="#F2C230" stroke-width="1.6"/>
    </symbol>
    <symbol id="s-pail" viewBox="0 0 120 150">
      <path d="M12 52C10 8 110 8 108 52" fill="none" stroke="#151515" stroke-width="1.3"/>
      <rect x="3" y="30" width="114" height="15" rx="3" fill="#F2C230" stroke="#151515" stroke-width="1.3"/>
      <path d="M8 45h104l-7 100a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <path d="M10 58h100M14 134h92" stroke="#151515" stroke-width=".8" opacity=".5"/>
      <circle cx="60" cy="96" r="24" fill="#151515"/>
      <path d="M50 96h20" stroke="#F2C230" stroke-width="1.6"/>
    </symbol>
    <symbol id="s-comb" viewBox="0 0 84 48">
      <rect x="1" y="1" width="82" height="9" rx="2" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <path d="M4 10h76l-2 34a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#fff" stroke="#151515" stroke-width="1.3"/>
      <g fill="#F2C230" stroke="#151515" stroke-width=".8">
        <path d="M22 18l6 3.5v7L22 32l-6-3.5v-7z"/><path d="M34 18l6 3.5v7L34 32l-6-3.5v-7z"/><path d="M46 18l6 3.5v7L46 32l-6-3.5v-7z"/><path d="M58 18l6 3.5v7L58 32l-6-3.5v-7z"/>
        <path d="M28 28.5l6 3.5v7l-6 3.5-6-3.5v-7z"/><path d="M40 28.5l6 3.5v7l-6 3.5-6-3.5v-7z"/><path d="M52 28.5l6 3.5v7l-6 3.5-6-3.5v-7z"/>
      </g>
    </symbol>
  </defs>
</svg>
"""


def size(sym, h, ratio, weight, note):
    return (f'<li class="size"><div class="size__fig"><svg style="--h:{h}px;aspect-ratio:{ratio}" aria-hidden="true"><use href="#{sym}"/></svg></div>'
            f'<p class="size__w">{weight}</p><p class="size__t">{note}</p></li>')


NO_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 19L19 5" stroke="currentColor" stroke-width="1.5"/></svg>'
HEX_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" fill="currentColor"/></svg>'

COFFEE_ALT = "Noosa Coffee Co single origin roasted Arabica coffee beans in a 1kg and a 250g bag, with eucalyptus leaves and roasted beans on a sand backdrop"
HONEY_ALT = "Noosa Tropical Farm raw honey in two 500g jars and a tub with yellow lids, on grey stone"

COFFEES = [
    ("Sunrise Blend", "Delivers a heavy body, thick crema and an intense milk chocolate, dried fruit and hazelnut note."),
    ("Single Origin Brazilian", "Offers crisp lemon and orange acidity together with smooth caramel notes, which linger in a nutty finish."),
    ("Single Origin Colombian", "Offers milk chocolate, brown sugar and citrus notes."),
    ("Decaf Colombian Tumbaga", "Offers milk chocolate, fruit and caramel notes."),
]
COFFEE_LIST = "".join(
    f'<li class="coffees__item"><h3 class="coffees__name">{n}</h3><p class="coffees__notes">{t}</p></li>' for n, t in COFFEES
)

INDEX = f"""
<main id="main">
  <section class="hero hero--home on-dark" aria-labelledby="hero-title">
    <h1 class="visually-hidden" id="hero-title">Noosa Food &amp; Coffee Co: coffee roasted in Noosa and raw honey from Noosa</h1>
    <div class="hero__bg frame" data-intro data-veil>
      <img class="parallax-img" src="./images/coffee-beans-hero.webp" alt="" width="1600" height="2409" fetchpriority="high">
      <span class="hero__shade" aria-hidden="true"></span>
    </div>
    <div class="hero__center">
      <img class="hero__logo" src="./images/logo-light.svg" alt="Noosa Food &amp; Coffee Co" width="550" height="557" data-intro data-fade>
      <div class="actions hero__actions" data-intro data-fade>
        <a class="btn btn--light btn--lg" href="./coffee"><span>Our Coffee</span> {ARROW}</a>
        <a class="btn btn--light-line btn--lg" href="./honey"><span>Our Honey</span> {ARROW}</a>
      </div>
    </div>
    <a class="scroll-cue" href="#coffee-title" data-intro data-fade><span>Scroll</span><i aria-hidden="true"></i></a>
  </section>

  <section class="chapter chapter--coffee" aria-labelledby="coffee-title">
    <div class="wrap">
      <div class="coffee-head">
        <div class="coffee-head__title">
          <img class="coffee-head__badge" src="./images/noosa-coffee-co.svg" alt="Noosa Coffee Co" width="350" height="350" loading="lazy" data-pop>
          <div>
            <p class="label" data-fade>Noosa Coffee Co</p>
            {lines("Our coffee", id_="coffee-title", cls="h2 h2--xl")}
          </div>
        </div>
        <p data-fade><a class="link" href="./coffee">See the coffee {ARROW}</a></p>
      </div>
      <ul class="coffees" data-stagger>{COFFEE_LIST}</ul>
    </div>
  </section>

  <section class="chapter chapter--honey on-dark" aria-labelledby="honey-title">
    {drips(11)}
    <div class="wrap chapter__grid">
      <div class="chapter__body">
        <p class="label" data-fade>Noosa Tropical Farm</p>
        {lines("Our honey", id_="honey-title", cls="h2 h2--xl")}
        <p data-fade>Pure raw honey in 500g, 1kg, 3kg and 30kg. Also honeycomb, packed in 250g tubs.</p>
        <ul class="nothing" data-stagger>
          <li>{NO_ICON}No preservatives</li>
          <li>{NO_ICON}No colourings</li>
          <li>{NO_ICON}No additives</li>
        </ul>
        <p data-fade><a class="link link--honey" href="./honey">See the honey {ARROW}</a></p>
      </div>
      <div class="chapter__media chapter__media--honey">
        <img class="honey-badge honey-badge--chapter" src="./images/noosa-tropical-farm-honey.svg" alt="Noosa Tropical Farm Honey" width="350" height="350" loading="lazy" data-pop>
        <div class="frame frame--honey" data-veil><img src="./images/honey.webp" alt="{HONEY_ALT}" width="683" height="1024" loading="lazy" decoding="async"></div>
        <div class="inset" data-parallax="-.18"><div class="frame" data-veil><img src="./images/honeycomb.webp" alt="Golden honeycomb on a wooden board" width="683" height="670" loading="lazy" decoding="async"></div></div>
      </div>
    </div>
  </section>

  <figure class="place">
    <div class="place__frame"><img class="place__img" src="./images/noosa-headland.webp" alt="Noosa Heads coastline with the headland, beach and clear water on a sunny day" width="1600" height="1082" loading="lazy" decoding="async"></div>
    <figcaption class="place__note" data-fade><strong>Noosa Heads, Queensland</strong>Home of Noosa Food &amp; Coffee Co, where our coffee is roasted and where our honey is sourced.</figcaption>
  </figure>
{CTA}
</main>
"""

COFFEE = f"""
<main id="main">
  <section class="page-hero page-hero--coffee" aria-labelledby="page-title">
    <div class="wrap page-hero__grid">
      <div class="page-hero__text">
        <p class="label" data-intro data-fade>Noosa Coffee Co</p>
        {lines("Coffee,", "roasted in Noosa", tag="h1", cls="h1", id_="page-title", intro=True)}
        <ul class="coffees coffees--stack" data-intro data-stagger>{COFFEE_LIST}</ul>
      </div>
      <figure class="page-hero__media" data-intro data-parallax="-.06">
        <div class="frame" data-veil><img src="./images/coffee-bags.webp" alt="{COFFEE_ALT}" width="683" height="738" fetchpriority="high"></div>
        <img class="page-hero__badge" src="./images/noosa-coffee-co.svg" alt="Noosa Coffee Co" width="350" height="350" data-pop>
      </figure>
    </div>
  </section>

  <section class="section" id="roasted" aria-labelledby="roasted-title">
    <div class="wrap">
      <div class="section-head">
        {lines("Roasted coffee", id_="roasted-title", cls="h2 h2--xl")}
        <p class="lede" data-fade>Choose a size and send us an enquiry. We&rsquo;ll reply with price and availability.</p>
      </div>
      <div class="cards cards--2" data-products="sunrise-blend,single-origin-brazilian,single-origin-colombian,decaf-colombian-tumbaga">
        <noscript><p>See our roasted coffee range, or <a href="./contact">send an enquiry</a>.</p></noscript>
      </div>
    </div>
  </section>


{CTA}
</main>
"""

HONEY = f"""
<main id="main">
  <section class="honey-hero on-dark" aria-labelledby="page-title">
    <div class="honey-hero__grid">
      <div class="honey-hero__text">
        <p class="label" data-intro data-fade>Noosa Tropical Farm</p>
        {lines("Pure raw honey,", "with nothing added", tag="h1", cls="h1", id_="page-title", intro=True)}
        <p class="lede" data-intro data-fade>Raw honey from Noosa Tropical Farm, in 500g, 1kg, 3kg and 30kg. Also honeycomb, packed in 250g tubs.</p>
        <div class="actions" data-intro data-fade>
          <a class="btn btn--honey" href="./contact?product=raw-honey"><span>Enquire about honey</span> {ARROW}</a>
          <a class="btn btn--light-line" href="#raw-honey"><span>See sizes</span></a>
        </div>
      </div>
      <figure class="honey-hero__media" data-intro>
        <div class="frame" data-veil><img class="parallax-img" src="./images/honey.webp" alt="{HONEY_ALT}" width="683" height="1024" fetchpriority="high"></div>
        <img class="honey-badge honey-badge--hero" src="./images/noosa-tropical-farm-honey.svg" alt="Noosa Tropical Farm Honey" width="350" height="350" data-pop>
      </figure>
    </div>
  </section>

  <section class="label-strip" aria-label="What is in the jar">
    <div class="wrap">
      <ul data-stagger>
        <li>{NO_ICON}No preservatives</li>
        <li>{NO_ICON}No colourings</li>
        <li>{NO_ICON}No additives</li>
        <li>{HEX_ICON}Pure raw honey</li>
      </ul>
    </div>
    {drips(5, count=18, max_len=150, band=False)}
  </section>

  <section class="section section--after-drips" id="honey" aria-labelledby="honey-title">
    <div class="wrap">
      <div class="section-head">
        {lines("Honey and honeycomb", id_="honey-title", cls="h2 h2--xl")}
        <p class="lede" data-fade>Choose a size and send us an enquiry. We&rsquo;ll reply with price and availability.</p>
      </div>
      <div class="cards cards--2 cards--honey" data-products="raw-honey,honeycomb">
        <noscript><p>Raw honey in 500g, 1kg, 3kg and 30kg; honeycomb in 250g tubs. <a href="./contact">Send an enquiry</a>.</p></noscript>
      </div>
    </div>
  </section>
{CTA}
</main>
"""

CONTACT = f"""
<main id="main">
  <section class="contact" aria-labelledby="page-title">
    <div class="wrap contact__grid">
      <div class="contact__aside">
        {lines("Get in touch", tag="h1", cls="h1", id_="page-title", intro=True)}
        <p class="lede" data-intro data-fade>Questions, orders or bulk enquiries, send us a message and we&rsquo;ll get back to you.</p>
        <div class="contact__place" data-intro data-fade>
          <span>Location</span>
          <strong>Noosa Heads, Queensland, Australia</strong>
        </div>
        <div class="frame frame--contact" data-veil><img src="./images/eucalyptus.webp" alt="Sprigs of round eucalyptus leaves against a pale background" width="1200" height="800" loading="lazy" decoding="async"></div>
      </div>

      <div data-intro data-fade>
        <!-- Enquiries go to Formspree form xeagdwgd (Next Digital Level account), which emails them on. -->
        <form class="form" id="enquiry-form" action="https://formspree.io/f/xeagdwgd" method="POST" novalidate>
          <input type="hidden" name="_subject" value="New enquiry from the Noosa Food &amp; Coffee Co website">
          <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">
          <div class="form__row form__row--2">
            <div class="field">
              <label for="name">Name</label>
              <input id="name" name="name" type="text" autocomplete="name" required>
              <span class="field__error">Please add your name.</span>
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" required>
              <span class="field__error">Please add a valid email address.</span>
            </div>
          </div>
          <div class="field">
            <label for="phone">Phone <small>(optional)</small></label>
            <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">
          </div>
          <div class="form__row form__row--2">
            <div class="field">
              <label for="product">Product</label>
              <select id="product" name="product" required>
                <option value="">Choose a product</option>
                <option>Roasted coffee</option>
                <option>Raw honey</option>
                <option>Honeycomb</option>
                <option>Bulk / café order</option>
                <option>Other</option>
              </select>
              <span class="field__error">Please choose a product.</span>
            </div>
            <div class="field">
              <label for="size">Size <small>(optional)</small></label>
              <select id="size" name="size">
                <option value="">Not sure yet</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="6" required></textarea>
            <span class="field__error">Please add a short message.</span>
          </div>
          <div class="form__foot">
            <button class="btn btn--lg" type="submit"><span>Send enquiry</span> {ARROW}</button>
            <p class="form__status" role="status" aria-live="polite"></p>
          </div>
        </form>

        <div class="success" id="form-success" tabindex="-1" hidden>
          <span class="success__tick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg></span>
          <h2 class="h3">Thanks, your message is on its way.</h2>
          <p>We&rsquo;ve got your enquiry and we&rsquo;ll get back to you by email.</p>
          <p><a class="link" href="./" style="color:var(--paper)">Back to the home page {ARROW}</a></p>
        </div>
      </div>
    </div>
  </section>
</main>
"""

PAGES = {
    "index.html": ("Noosa Roasted Coffee &amp; Raw Honey | Noosa Food &amp; Coffee Co",
                   "Sunrise Blend and single origin coffees roasted in Noosa, and pure raw honey and honeycomb sourced from Noosa, Queensland.",
                   INDEX),
    "coffee.html": ("Roasted Coffee from Noosa | Noosa Coffee Co",
                    "Sunrise Blend, Single Origin Brazilian, Single Origin Colombian and Decaf Colombian Tumbaga, roasted in Noosa by Noosa Coffee Co. In 250g, 500g and 1kg bags.",
                    COFFEE),
    "honey.html": ("Pure Raw Honey &amp; Honeycomb | Noosa Tropical Farm",
                   "Pure raw honey with no preservatives, colourings or additives, in 500g, 1kg, 3kg and 30kg, and honeycomb in 250g tubs. From Noosa Heads, Queensland.",
                   HONEY),
    "contact.html": ("Contact &amp; Enquiries | Noosa Food &amp; Coffee Co",
                     "Questions, orders or bulk and café enquiries for roasted coffee, raw honey and honeycomb. Noosa Heads, Queensland, Australia.",
                     CONTACT),
}

for page, (title, desc, body) in PAGES.items():
    html = head(title, desc, page) + header(page) + body + footer()
    (ROOT / page).write_text(html, encoding="utf-8")
    print("wrote", page)
