import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ItemCard from "../components/common/ItemCard";
import SectionTitle from "../components/common/SectionTitle";

const categories = [
  { value: "all", label: "All" },
  { value: "attraction", label: "Attractions" },
  { value: "guide", label: "Guides" },
  { value: "package", label: "Packages" },
];

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("popular");

  // Fetch whenever filters change
  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "all") params.category = category;
    if (search) params.search = search;
    if (maxPrice < 5000) params.maxPrice = maxPrice;
    if (sortBy !== "popular") params.sort = sortBy;

    api
      .get("/items", { params })
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [category, search, maxPrice, sortBy]);

  const handleCategory = (val) => {
    setCategory(val);
    if (val === "all") setSearchParams({});
    else setSearchParams({ category: val });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SectionTitle
        eyebrow="Explore"
        title="Browse Experiences"
        subtitle="Find the perfect Rwandan adventure for you."
      />

      <div className="mt-10 bg-white rounded-2xl shadow-sm p-6 grid md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-slate-600">Search</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or location..."
            className="mt-1 w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 w-full border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="popular">Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600">
            Max Price: <span className="text-primary">${maxPrice}</span>
          </label>
          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCategory(c.value)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${
              category === c.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-52 bg-slate-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-6xl">🔍</p>
          <p className="mt-4 text-slate-600">No experiences match your filters.</p>
        </div>
      ) : (
        <>
          <p className="mt-8 text-slate-600 text-sm">
            <strong>{items.length}</strong> result{items.length !== 1 && "s"} found
          </p>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}