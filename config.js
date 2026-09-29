// ============================================
// GHANSHYAM INDUSTRY - edit everything from here
// --------------------------------------------
// Edit only this file, the whole site updates automatically.
// 1. OWNER_PHONE: currently empty "". Add number later e.g. "919876543210"
// 2. For new product: copy-paste into the products array
// 3. To change phase / condition options: edit phases / conditions below
// ============================================
module.exports = {
  company: "Ghanshyam Industry",
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

  products: [
    {
      icon: "wrench",
      name: "Manual Two In One Machine",
      desc: "Manually operated — two jobs in one machine. Best for small factories and single artisans: simple, sturdy and low maintenance.",
      points: ["Manual — low power bill", "Two-in-one work", "Live demo available"],
      phases: ["Single Phase", "Three Phase"],
      conditions: ["New Machine", "Second-Hand Machine"]
    },
    {
      icon: "layers",
      name: "Dori Machine",
      desc: "Built for diamond dori work. Higher speed, easy to operate — perfect for everyday production.",
      points: ["Easy to operate", "Made for daily use", "Live demo available"]
    },
    {
      icon: "diamond",
      name: "Russian Bruter Diamond Cutting Machine",
      desc: "Russian-system machine for diamond cutting and bruting. Clean round shape, fine finish — used by factories and artisans alike.",
      points: ["Best round shape", "Heavy-duty body", "Live demo available"],
      phases: ["Single Phase", "Three Phase"],
      conditions: ["New Machine", "Second-Hand Machine"]
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
