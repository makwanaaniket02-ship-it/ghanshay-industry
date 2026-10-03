// ============================================
// PRIYAL INDUSTRY - edit everything from here
// --------------------------------------------
// Edit only this file, the whole site updates automatically.
// 1. OWNER_PHONE: currently empty "". Add number later e.g. "919876543210"
// 2. For new product: copy-paste into the products array
// 3. To change phase / condition options: edit phases / conditions below
// ============================================
module.exports = {
  company: "Priyal Industry",
  tagline: "Diamond processing machines — see the live demo before you decide.",
  address1: "Opp. Patel Wadi,",
  address2: "Dhasa Road, Damnagar, Gujarat",
  city: "Damnagar",
  owners: ["Bholabhai Makwana", "Pankajbhai Makwana"],
  shopHoursMorning: "Morning 8:00 AM – 1:00 PM",
  shopHoursEvening: "Evening 2:00 PM – 8:00 PM",
  timings: "Mon–Sat: 8 AM–1 PM & 2–8 PM • Sunday closed",
  OWNER_PHONE: "", // <-- add number here later, e.g. "919876543210"
  mapLink: "https://maps.google.com/?q=Dhasa+Road+Damnagar",

  // admin panel (/admin) password - please change it
  ADMIN_PASSWORD: "ghanshyam123",

  // options for the booking form
  phases: ["Single Phase", "Three Phase"],
  conditions: ["New Machine", "Second-Hand Machine"],

  // PHOTOS: to add a machine photo later, copy the file into public/images/
  // and set photo: "/images/your-file.jpg" on that product. Empty = placeholder box.

  products: [
    {
      icon: "wrench",
      slug: "manual-two-in-one-machine",
      name: "Manual Two In One Machine",
      photo: "",
      desc: "Manually operated — two jobs in one machine. Best for small factories and single artisans: simple, sturdy and low maintenance.",
      points: ["Manual — low power bill", "Two-in-one work", "Live demo available"],
      phases: ["Single Phase", "Three Phase"],
      conditions: ["New Machine", "Second-Hand Machine"],
      details: [
        ["Operation", "Fully manual — no heavy electrical load"],
        ["Function", "Used to give diamonds a perfect round shape"],
        ["Diamond size", "Round shape possible for diamonds from 1 mm to 10 mm in size"],
        ["Power options", "Single Phase / Three Phase"],
        ["Available as", "New Machine / Second-Hand Machine"],
        ["Best for", "Small factories, single artisans, job-work units"],
        ["Maintenance", "Simple, low-cost upkeep"],
        ["Support", "Live demo, training and service at our Damnagar workshop"]
      ],
      advantages: [
        "Gives an excellent round shape to diamonds",
        "Slides from the best company, made of top-quality material",
        "Fitted with a genuine Sony camera and lens",
        "Pure copper motor for a long working life",
        "Full copper wiring throughout the machine",
        "Very low maintenance",
        "HCH company bearings used in all machine parts",
        "Excellent after-sales service"
      ]
    },
    {
      icon: "layers",
      slug: "dori-machine",
      name: "Dori Machine",
      photo: "",
      desc: "Built for diamond dori work. Higher speed, easy to operate — perfect for everyday production.",
      points: ["Easy to operate", "Made for daily use", "Live demo available"],
      details: [
        ["Purpose", "Diamond dori work"],
        ["Operation", "Easy to operate, steady speed"],
        ["Best for", "Everyday production, artisans and small units"],
        ["Maintenance", "Simple upkeep"],
        ["Support", "Live demo, training and service at our Damnagar workshop"]
      ]
    },
    {
      icon: "diamond",
      slug: "russian-bruter-diamond-cutting-machine",
      name: "Russian Bruter Diamond Cutting Machine",
      photo: "",
      desc: "Russian-system machine for diamond cutting and bruting. Clean round shape, fine finish — used by factories and artisans alike.",
      points: ["Best round shape", "Heavy-duty body", "Live demo available"],
      phases: ["Single Phase", "Three Phase"],
      conditions: ["New Machine", "Second-Hand Machine"],
      details: [
        ["Purpose", "Diamond cutting and bruting (Russian system)"],
        ["Output", "Clean round shape, fine girdle finish"],
        ["Power options", "Single Phase / Three Phase"],
        ["Available as", "New Machine / Second-Hand Machine"],
        ["Best for", "Factories and artisans"],
        ["Body", "Heavy-duty build for daily workshop use"],
        ["Support", "Live demo, training and service at our Damnagar workshop"]
      ],
      advantages: [
        "Gives an excellent round shape to diamonds",
        "Slides from the best company, made of top-quality material",
        "Fitted with a genuine Sony camera and lens",
        "Pure copper motor for a long working life",
        "Full copper wiring throughout the machine",
        "Very low maintenance",
        "NACHI Japan bearings used in all machine parts",
        "Excellent after-sales service",
        "Pistons come perfectly aligned for accurate cutting",
        "Best-quality stainless steel collets for a long working life"
      ]
    }
    // NEXT PRODUCT: copy here -
    // ,{ icon: "box", name: "New Machine Name", desc: "Short description...", points: ["Point 1","Point 2"] }
  ],

  timeSlots: [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM"
  ]
};
