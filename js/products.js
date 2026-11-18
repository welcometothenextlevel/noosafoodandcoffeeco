/*
  Noosa Food & Coffee Co — product catalogue
  ------------------------------------------------------------
  Single source of truth for every product card on the site.
  Cards on coffee.html and honey.html are rendered from this list
  by js/main.js, and the contact form reads it to fill the
  "Size" options.

  Shop-ready: when online ordering is added, give each option a
  price (e.g. { label: "250g", price: 18.5, sku: "NCC-SO-250" }) and swap
  the "Enquire" button in renderCard() for "Add to cart". No markup
  or styling needs to change.
*/
window.NFC_PRODUCTS = [
  {
    id: "sunrise-blend",
    name: "Sunrise Blend",
    brand: "Noosa Coffee Co",
    category: "roasted-coffee",
    enquiry: "Roasted coffee",
    description: "Delivers a heavy body, thick crema and an intense milk chocolate, dried fruit and hazelnut note.",
    optionLabel: "Size",
    options: [{ label: "250g" }, { label: "500g" }, { label: "1kg" }]
  },
  {
    id: "single-origin-brazilian",
    name: "Single Origin Brazilian",
    brand: "Noosa Coffee Co",
    category: "roasted-coffee",
    enquiry: "Roasted coffee",
    description: "Offers crisp lemon and orange acidity together with smooth caramel notes, which linger in a nutty finish.",
    optionLabel: "Size",
    options: [{ label: "500g" }]
  },
  {
    id: "single-origin-colombian",
    name: "Single Origin Colombian",
    brand: "Noosa Coffee Co",
    category: "roasted-coffee",
    enquiry: "Roasted coffee",
    description: "Offers milk chocolate, brown sugar and citrus notes.",
    optionLabel: "Size",
    options: [{ label: "500g" }]
  },
  {
    id: "decaf-colombian-tumbaga",
    name: "Decaf Colombian Tumbaga",
    brand: "Noosa Coffee Co",
    category: "roasted-coffee",
    enquiry: "Roasted coffee",
    description: "Offers milk chocolate, fruit and caramel notes.",
    optionLabel: "Size",
    options: [{ label: "500g" }]
  },
  {
    id: "raw-honey",
    name: "Pure raw honey",
    brand: "Noosa Tropical Farm",
    category: "honey",
    enquiry: "Raw honey",
    description: "Pure raw honey with no preservatives, colourings or additives.",
    optionLabel: "Size",
    options: [{ label: "500g" }, { label: "1kg" }, { label: "3kg" }, { label: "30kg" }],
    image: "./images/honey.webp",
    width: 683,
    height: 1024,
    alt: "Noosa Tropical Farm raw honey in two 500g jars and a tub with yellow lids, on grey stone"
  },
  {
    id: "honeycomb",
    name: "Honeycomb",
    brand: "Noosa Tropical Farm",
    category: "honey",
    enquiry: "Honeycomb",
    description: "Honeycomb, packed in 250g tubs.",
    optionLabel: "Size",
    options: [{ label: "250g" }],
    image: "./images/honeycomb.webp",
    width: 683,
    height: 670,
    alt: "Two pieces of golden honeycomb on a wooden board"
  }
];

/* Options offered in the contact form for the non-product choices. */
window.NFC_ENQUIRY_EXTRA = {
  "Bulk / café order": {
    optionLabel: "Size",
    options: [
      { label: "1kg bags of roasted coffee" },
      { label: "3kg raw honey" },
      { label: "30kg raw honey" }
    ]
  },
  Other: { optionLabel: "Size", options: [] }
};
