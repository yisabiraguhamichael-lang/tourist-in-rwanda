import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  const badgeColor = {
    attraction: "bg-emerald-100 text-emerald-700",
    guide: "bg-blue-100 text-blue-700",
    package: "bg-amber-100 text-amber-700",
  }[item.category];

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-52 object-cover"
        />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}>
          {item.category.toUpperCase()}
        </span>
        <span className="absolute top-3 right-3 bg-white text-dark text-xs font-bold px-2 py-1 rounded-md">
          ⭐ {item.rating}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-dark line-clamp-1">{item.title}</h3>
        <p className="text-sm text-slate-500 mt-1">📍 {item.location}</p>
        <p className="text-sm text-slate-600 mt-3 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="text-lg font-bold text-primary">
              {item.priceAdult === 0 ? "Free" : `$${item.priceAdult}`}
            </p>
          </div>
          <Link
            to={`/item/${item.id}`}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}