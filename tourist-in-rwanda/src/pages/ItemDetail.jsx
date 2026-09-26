import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Button from "../components/common/Button";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setError("Experience not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
        <div className="h-96 bg-slate-200 rounded-2xl" />
        <div className="mt-8 h-8 bg-slate-200 rounded w-1/2" />
        <div className="mt-4 h-4 bg-slate-200 rounded w-1/3" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-6xl">❌</p>
        <h1 className="text-2xl font-bold mt-4">{error || "Not found"}</h1>
        <Link to="/browse" className="text-primary underline mt-4 inline-block">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  const badgeColor = {
    attraction: "bg-emerald-100 text-emerald-700",
    guide: "bg-blue-100 text-blue-700",
    package: "bg-amber-100 text-amber-700",
  }[item.category];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/browse" className="hover:text-primary">Browse</Link> /{" "}
        <span className="text-slate-700">{item.title}</span>
      </p>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-96 object-cover" />
          </div>

          <div className="mt-8">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}>
              {item.category.toUpperCase()}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-dark mt-3">{item.title}</h1>
            <p className="text-slate-500 mt-2">📍 {item.location}</p>

            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-slate-600">
              <span>⭐ <strong>{item.rating}</strong> ({item.reviewsCount} reviews)</span>
              <span>⏱ {item.duration}</span>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-dark mb-3">About this experience</h2>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>

          {item.highlights?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-dark mb-3">Highlights</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {item.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-slate-600">
                    <span className="text-primary mt-0.5">✔</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <p className="text-sm text-slate-500">Starting from</p>
            <p className="text-3xl font-bold text-primary mt-1">
              {item.priceAdult === 0 ? "Free" : `$${item.priceAdult}`}
              <span className="text-sm text-slate-500 font-normal"> / adult</span>
            </p>
            {item.priceChild > 0 && (
              <p className="text-sm text-slate-500 mt-1">
                Child: <strong>${item.priceChild}</strong>
              </p>
            )}

            <hr className="my-5" />

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-semibold">{item.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-semibold text-right">{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Rating</span>
                <span className="font-semibold">⭐ {item.rating}</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={() => navigate(`/book/${item.id}`)}
                className="w-full"
                size="lg"
              >
                Book This Experience
              </Button>
            </div>

            <p className="text-xs text-slate-500 text-center mt-3">
              ✅ Free cancellation up to 24h before
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}