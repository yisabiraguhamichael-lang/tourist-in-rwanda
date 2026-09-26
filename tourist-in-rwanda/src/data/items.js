// src/data/items.js

export const items = [
  // ---------- ATTRACTIONS ----------
  {
    id: 1,
    category: "attraction",
    title: "Volcanoes National Park",
    location: "Musanze, Northern Province",
    image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800",
    priceAdult: 1500,
    priceChild: 750,
    duration: "Full day (6h)",
    rating: 4.9,
    reviews: 312,
    description:
      "Home to the famous mountain gorillas. Trek through the rainforest with expert rangers and meet these gentle giants up close.",
    highlights: ["Gorilla trekking", "Golden monkeys", "Volcano hiking", "Ranger-guided"],
  },
  {
    id: 2,
    category: "attraction",
    title: "Kigali Genocide Memorial",
    location: "Kigali City",
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800",
    priceAdult: 0,
    priceChild: 0,
    duration: "2 hours",
    rating: 4.8,
    reviews: 540,
    description:
      "A powerful and moving memorial honoring the victims of the 1994 genocide. A place of remembrance and education.",
    highlights: ["Free entry", "Audio guide", "Educational exhibits", "Memorial gardens"],
  },
  {
    id: 3,
    category: "attraction",
    title: "Lake Kivu Boat Tour",
    location: "Rubavu, Western Province",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    priceAdult: 80,
    priceChild: 40,
    duration: "3 hours",
    rating: 4.7,
    reviews: 198,
    description:
      "Sail across one of Africa's Great Lakes. Visit islands, see fishing villages, and enjoy stunning sunset views.",
    highlights: ["Sunset cruise", "Island hopping", "Local fishing villages", "Refreshments included"],
  },
  {
    id: 4,
    category: "attraction",
    title: "Nyungwe Forest Canopy Walk",
    location: "Nyungwe, Southern Province",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    priceAdult: 60,
    priceChild: 30,
    duration: "Half day (4h)",
    rating: 4.8,
    reviews: 220,
    description:
      "Walk 70 meters above the rainforest floor on a suspension bridge. Spot primates, birds, and rare orchids.",
    highlights: ["Canopy bridge", "Chimpanzee tracking", "Bird watching", "Nature walks"],
  },

  // ---------- GUIDES ----------
  {
    id: 5,
    category: "guide",
    title: "Jean Bosco — Certified Guide",
    location: "Kigali (available nationwide)",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
    priceAdult: 60,
    priceChild: 30,
    duration: "Per day",
    rating: 5.0,
    reviews: 87,
    description:
      "Fluent in English, French and Kinyarwanda. 8 years of experience guiding gorilla trekking and cultural tours.",
    highlights: ["English / French / Kinyarwanda", "8 years experience", "Cultural expert", "Photography-friendly"],
  },
  {
    id: 6,
    category: "guide",
    title: "Aline Uwase — City Guide",
    location: "Kigali",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    priceAdult: 45,
    priceChild: 20,
    duration: "Per half-day",
    rating: 4.9,
    reviews: 64,
    description:
      "Specialist in Kigali city tours — markets, coffee shops, art galleries, and the best local food spots.",
    highlights: ["Kigali expert", "Food & markets", "Art galleries", "Flexible schedule"],
  },

  // ---------- PACKAGES ----------
  {
    id: 7,
    category: "package",
    title: "3-Day Gorilla Trekking Package",
    location: "Musanze & Kigali",
    image: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800",
    priceAdult: 3200,
    priceChild: 1800,
    duration: "3 days / 2 nights",
    rating: 5.0,
    reviews: 142,
    description:
      "All-inclusive: gorilla permit, lodge, meals, transport, and a personal guide. The ultimate Rwanda experience.",
    highlights: ["Gorilla permit included", "Luxury lodge", "All meals", "Private transport"],
  },
  {
    id: 8,
    category: "package",
    title: "5-Day Rwanda Highlights",
    location: "Kigali → Nyungwe → Kivu → Musanze",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
    priceAdult: 4500,
    priceChild: 2500,
    duration: "5 days / 4 nights",
    rating: 4.9,
    reviews: 98,
    description:
      "The full Rwandan experience — city, rainforest, lake, and gorillas. Perfect for first-time visitors.",
    highlights: ["Genocide Memorial", "Canopy walk", "Lake Kivu cruise", "Gorilla trekking"],
  },
];

// Helper to get unique categories
export const categories = [
  { value: "all", label: "All" },
  { value: "attraction", label: "Attractions" },
  { value: "guide", label: "Guides" },
  { value: "package", label: "Packages" },
];