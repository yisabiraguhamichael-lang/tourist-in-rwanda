import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Load bookings
  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const cancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel");
    }
  };

  const upcoming = bookings.filter((b) => b.status !== "cancelled");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const shown = tab === "upcoming" ? upcoming : cancelled;

  if (authLoading || loading) {
    return <div className="p-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark">Hi, {user?.name} 👋</h1>
          <p className="text-slate-500 mt-1">Manage your bookings and account</p>
        </div>
        <div className="flex gap-3">
          <Button to="/browse">+ New Booking</Button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:border-red-400 hover:text-red-600 text-sm font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <StatCard label="Total Bookings" value={bookings.length} icon="📅" />
        <StatCard label="Upcoming" value={upcoming.length} icon="⏳" />
        <StatCard
          label="Total Spent"
          value={`$${bookings.reduce((s, b) => s + Number(b.totalPrice), 0)}`}
          icon="💵"
        />
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6">
        {[
          { key: "upcoming", label: `Upcoming (${upcoming.length})` },
          { key: "cancelled", label: `Cancelled (${cancelled.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl">🗓️</p>
          <p className="mt-4 text-slate-600">No bookings here yet.</p>
          <div className="mt-6">
            <Button to="/browse">Browse Experiences</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <img
                src={b.Item?.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400"}
                alt={b.Item?.title}
                className="w-full sm:w-32 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-bold text-dark">{b.Item?.title || "Experience"}</h3>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  Ref: <strong>{b.reference}</strong>
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 mt-2">
                  <span>📅 {b.visitDate}</span>
                  <span>🕒 {b.visitTime}</span>
                  <span>👥 {b.adults + b.children} visitors</span>
                  <span className="font-semibold text-primary">${b.totalPrice}</span>
                </div>
              </div>

              {b.status !== "cancelled" && (
                <button
                  onClick={() => cancel(b.id)}
                  className="text-sm text-red-600 hover:underline font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-dark">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors[status] || "bg-slate-100"}`}>
      {status.toUpperCase()}
    </span>
  );
}