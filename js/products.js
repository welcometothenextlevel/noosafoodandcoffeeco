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
    id: "single-origin",
    name: "Single origin roasted Arabica",
    brand: "Noosa Coffee Co",
    category: "roasted-coffee",
    enquiry: "Roasted coffee",
    description: "Single origin roasted Arabica coffee beans, roasted in Noosa.",
    optionLabel: "Size",
    options: [{ label: "250g" }, { label: "500g" }, { label: "1kg" }],
    image: "./images/coffee-bags.webp",
    width: 683,
    height: 738,
    alt: "Noosa Coffee Co single origin roasted Arabica coffee beans in a 1kg and a 250g bag, with eucalyptus leaves and roasted beans on a sand backdrop"
  },
  {
    id: "blends",
    name: "Roasted coffee blends",
    brand: "Noosa Coffee Co",
    category: "roasted-coffee",
    enquiry: "Roasted coffee",
    description: "Blends of roasted coffee beans, roasted in Noosa.",
    optionLabel: "Size",
    options: [{ label: "250g" }, { label: "500g" }, { label: "1kg" }],
    image: "./images/roasted-beans-cooling.webp",
    width: 1200,
    height: 800,
    alt: "Freshly roasted coffee beans turning in the cooling tray of a roaster"
  },
  {
    id: "green-beans",
    name: "Green coffee beans",
    brand: "Noosa Food & Coffee Co",
    category: "green-coffee",
    enquiry: "Green coffee beans",
    description: "Green, unroasted coffee beans from five origins.",
    optionLabel: "Origin",
    options: [
      { label: "Brazil" },
      { label: "Vietnam" },
      { label: "Colombia" },
      { label: "Papua New Guinea" },
      { label: "India" }
    ],
    image: "./images/green-beans.webp",
    width: 684,
    height: 456,
    alt: "A close view of green, unroasted coffee beans"
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
      { label: "Green coffee beans" },
      { label: "3kg raw honey" },
      { label: "30kg raw honey" }
    ]
  },
  Other: { optionLabel: "Size", options: [] }
};
