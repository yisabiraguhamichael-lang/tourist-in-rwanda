import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import ItemCard from "../components/common/ItemCard";
import SectionTitle from "../components/common/SectionTitle";
import Button from "../components/common/Button";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/items")
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .catch((err) => console.error("Failed to load items:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO — unchanged */}
      <section className="relative bg-dark text-white overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1600"
          alt="Rwanda"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <p className="text-secondary font-semibold uppercase tracking-widest text-sm mb-4">
            🌍 Land of a Thousand Hills
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight max-w-3xl">
            Discover Rwanda.<br />
            Book Unforgettable Experiences.
          </h1>
          <p className="mt-6 text-lg text-slate-200 max-w-2xl">
            From mountain gorillas to serene lakes — book your visits, guides,
            and tour packages in one place, from anywhere in the world.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/browse" size="lg" variant="secondary">
              Browse Experiences →
            </Button>
            <Button
              to="/register"
              size="lg"
              variant="outline"
              className="!border-white !text-white hover:!bg-white hover:!text-primary"
            >
              Create Free Account
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {[
              { value: "50+", label: "Experiences" },
              { value: "10K+", label: "Happy Visitors" },
              { value: "4.9★", label: "Avg. Rating" },
              { value: "24/7", label: "Support" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-secondary">{s.value}</p>
                <p className="text-sm text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <SectionTitle
            eyebrow="Featured"
            title="Popular in Rwanda"
            subtitle="Hand-picked experiences loved by our visitors."
          />
          <Link to="/browse" className="text-primary font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <SectionTitle
            center
            eyebrow="Simple Process"
            title="How It Works"
            subtitle="Book your Rwandan adventure in three easy steps."
          />
          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {[
              { icon: "🔍", title: "1. Discover", text: "Browse attractions, guides, and packages across Rwanda." },
              { icon: "📅", title: "2. Book", text: "Choose your date and time slot, confirm in seconds." },
              { icon: "✈️", title: "3. Enjoy", text: "Receive instant confirmation and enjoy your trip." },
            ].map((step) => (
              <div key={step.title} className="text-center p-8 rounded-2xl bg-slate-50 hover:bg-primary/5 transition">
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <SectionTitle
          center
          eyebrow="Explore"
          title="What Would You Like to Book?"
          subtitle="Three ways to experience Rwanda."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { emoji: "🏞️", title: "Attractions", text: "National parks, memorials, lakes, cultural sites.", to: "/browse?category=attraction" },
            { emoji: "🧑‍🏫", title: "Tour Guides", text: "Certified local guides for a personalized experience.", to: "/browse?category=guide" },
            { emoji: "📦", title: "Tour Packages", text: "All-inclusive multi-day trips designed for you.", to: "/browse?category=package" },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-primary hover:shadow-lg transition group"
            >
              <div className="text-5xl mb-4">{c.emoji}</div>
              <h3 className="text-xl font-bold text-dark group-hover:text-primary transition">{c.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{c.text}</p>
              <p className="mt-4 text-primary font-semibold text-sm">Explore →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Experience Rwanda?</h2>
          <p className="mt-4 text-slate-100">Create your free account and book your first experience today.</p>
          <div className="mt-8">
            <Button to="/register" size="lg" variant="secondary">Get Started — It's Free</Button>
          </div>
        </div>
      </section>
    </div>
  );
}