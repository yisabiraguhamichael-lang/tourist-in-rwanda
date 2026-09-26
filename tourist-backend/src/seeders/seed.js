require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Item, TimeSlot } = require("../models");

const items = [
  {
    title: "Volcanoes National Park",
    category: "attraction",
    location: "Musanze, Northern Province",
    image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=800",
    priceAdult: 1500, priceChild: 750,
    duration: "Full day (6h)",
    description: "Home to the famous mountain gorillas. Trek through the rainforest with expert rangers.",
    highlights: ["Gorilla trekking", "Golden monkeys", "Volcano hiking", "Ranger-guided"],
    rating: 4.9, reviewsCount: 312,
  },
  {
    title: "Kigali Genocide Memorial",
    category: "attraction",
    location: "Kigali City",
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800",
    priceAdult: 0, priceChild: 0,
    duration: "2 hours",
    description: "A powerful memorial honoring the victims of the 1994 genocide.",
    highlights: ["Free entry", "Audio guide", "Educational exhibits", "Memorial gardens"],
    rating: 4.8, reviewsCount: 540,
  },
  {
    title: "Lake Kivu Boat Tour",
    category: "attraction",
    location: "Rubavu, Western Province",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800",
    priceAdult: 80, priceChild: 40,
    duration: "3 hours",
    description: "Sail across one of Africa's Great Lakes. Visit islands, see fishing villages.",
    highlights: ["Sunset cruise", "Island hopping", "Local fishing villages", "Refreshments included"],
    rating: 4.7, reviewsCount: 198,
  },
  {
    title: "Nyungwe Forest Canopy Walk",
    category: "attraction",
    location: "Nyungwe, Southern Province",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    priceAdult: 60, priceChild: 30,
    duration: "Half day (4h)",
    description: "Walk 70 meters above the rainforest floor on a suspension bridge.",
    highlights: ["Canopy bridge", "Chimpanzee tracking", "Bird watching", "Nature walks"],
    rating: 4.8, reviewsCount: 220,
  },
  {
    title: "Jean Bosco — Certified Guide",
    category: "guide",
    location: "Kigali (available nationwide)",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800",
    priceAdult: 60, priceChild: 30,
    duration: "Per day",
    description: "Fluent in English, French and Kinyarwanda. 8 years of experience.",
    highlights: ["English / French / Kinyarwanda", "8 years experience", "Cultural expert", "Photography-friendly"],
    rating: 5.0, reviewsCount: 87,
  },
  {
    title: "Aline Uwase — City Guide",
    category: "guide",
    location: "Kigali",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    priceAdult: 45, priceChild: 20,
    duration: "Per half-day",
    description: "Specialist in Kigali city tours — markets, coffee shops, art galleries.",
    highlights: ["Kigali expert", "Food & markets", "Art galleries", "Flexible schedule"],
    rating: 4.9, reviewsCount: 64,
  },
  {
    title: "3-Day Gorilla Trekking Package",
    category: "package",
    location: "Musanze & Kigali",
    image: "https://images.unsplash.com/photo-1521651201144-634f700b36ef?w=800",
    priceAdult: 3200, priceChild: 1800,
    duration: "3 days / 2 nights",
    description: "All-inclusive: gorilla permit, lodge, meals, transport, personal guide.",
    highlights: ["Gorilla permit included", "Luxury lodge", "All meals", "Private transport"],
    rating: 5.0, reviewsCount: 142,
  },
  {
    title: "5-Day Rwanda Highlights",
    category: "package",
    location: "Kigali → Nyungwe → Kivu → Musanze",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800",
    priceAdult: 4500, priceChild: 2500,
    duration: "5 days / 4 nights",
    description: "The full Rwandan experience — city, rainforest, lake, and gorillas.",
    highlights: ["Genocide Memorial", "Canopy walk", "Lake Kivu cruise", "Gorilla trekking"],
    rating: 4.9, reviewsCount: 98,
  },
];

// Generate next 30 days of slots for an item
function generateSlots(itemId) {
  const times = ["09:00", "11:00", "14:00", "16:00"];
  const slots = [];
  const today = new Date();
  for (let d = 1; d <= 30; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().split("T")[0];
    for (const t of times) {
      slots.push({
        itemId, date: dateStr, startTime: t,
        capacity: 20, bookedCount: 0, status: "open",
      });
    }
  }
  return slots;
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");

    await sequelize.sync({ force: true });
    console.log("✅ Tables reset");

    // Admin user
    const adminPass = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin", email: "admin@tourist.rw",
      password: adminPass, role: "admin", country: "Rwanda",
    });

    // Demo tourist
    const userPass = await bcrypt.hash("tourist123", 10);
    await User.create({
      name: "Demo Tourist", email: "tourist@demo.com",
      password: userPass, role: "tourist", country: "USA",
    });

    // Items
    const createdItems = await Item.bulkCreate(items);
    console.log(`✅ Created ${createdItems.length} items`);

    // Slots
    let totalSlots = 0;
    for (const it of createdItems) {
      const slots = generateSlots(it.id);
      await TimeSlot.bulkCreate(slots);
      totalSlots += slots.length;
    }
    console.log(`✅ Created ${totalSlots} time slots`);

    console.log("\n🎉 Seeding complete!\n");
    console.log("Admin login:   admin@tourist.rw / admin123");
    console.log("Tourist login: tourist@demo.com / tourist123\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
})();