import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    date: "",
    slotId: null,
    slotTime: "",
    adults: 1,
    children: 0,
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    country: user?.country || "",
  });
  const [confirmed, setConfirmed] = useState(null);

  // Load item
  useEffect(() => {
    api
      .get(`/items/${id}`)
      .then((res) => setItem(res.data))
      .catch(() => setError("Experience not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // Load slots when date changes
  useEffect(() => {
    if (!form.date) return;
    api
      .get(`/slots/item/${id}`, { params: { date: form.date } })
      .then((res) => setSlots(res.data))
      .catch((err) => console.error(err));
  }, [form.date, id]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const todayStr = new Date().toISOString().split("T")[0];

  const canGoStep2 = form.date && form.slotId && form.adults >= 1;
  const canGoStep3 =
    form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim();

  const total =
    item ? form.adults * item.priceAdult + form.children * item.priceChild : 0;

  const handleConfirm = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/bookings", {
        itemId: Number(id),
        slotId: form.slotId,
        adults: form.adults,
        children: form.children,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        customerCountry: form.country,
      });
      setConfirmed(data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  if (!item) {
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

  // Confirmation
  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-dark">Booking Confirmed!</h1>
        <p className="text-slate-600 mt-3">
          Thank you, <strong>{confirmed.customerName}</strong>. A confirmation has been sent to{" "}
          <strong>{confirmed.customerEmail}</strong>.
        </p>

        <div className="mt-8 bg-white rounded-2xl shadow p-6 text-left">
          <Row label="Booking Reference" value={confirmed.reference} highlight />
          <Row label="Experience" value={item.title} />
          <Row label="Date" value={confirmed.visitDate} />
          <Row label="Time" value={confirmed.visitTime} />
          <Row
            label="Visitors"
            value={`${confirmed.adults} adult${confirmed.adults > 1 ? "s" : ""}${
              confirmed.children > 0 ? `, ${confirmed.children} child${confirmed.children > 1 ? "ren" : ""}` : ""
            }`}
          />
          <div className="flex justify-between py-3">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary text-lg">${confirmed.totalPrice}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button to="/dashboard">Go to Dashboard</Button>
          <Button to="/browse" variant="outline">Browse More</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Link to={`/item/${item.id}`} className="text-sm text-slate-500 hover:text-primary">
        ← Back to {item.title}
      </Link>

      <h1 className="text-3xl font-bold text-dark mt-3">Book Your Experience</h1>
      <p className="text-slate-600 mt-1">{item.title} · {item.location}</p>

      {!isAuthenticated && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          🔐 Please <Link to="/login" className="underline font-semibold">log in</Link> before confirming your booking.
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Progress */}
      <div className="mt-8 flex items-center gap-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= n ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {n}
            </div>
            {n < 3 && <div className={`h-1 flex-1 rounded ${step > n ? "bg-primary" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-5">Select Date & Time</h2>

              <label className="block text-sm font-semibold text-slate-600 mb-2">Visit Date</label>
              <input
                type="date"
                min={todayStr}
                value={form.date}
                onChange={(e) => {
                  update("date", e.target.value);
                  update("slotId", null);
                  update("slotTime", "");
                }}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              {form.date && (
                <>
                  <label className="block text-sm font-semibold text-slate-600 mt-6 mb-2">
                    Available Time Slots
                  </label>
                  {slots.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">No slots available for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {slots.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          disabled={s.isFull}
                          onClick={() => {
                            update("slotId", s.id);
                            update("slotTime", s.startTime);
                          }}
                          className={`py-3 rounded-lg border text-sm font-semibold transition ${
                            s.isFull
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                              : form.slotId === s.id
                              ? "bg-primary text-white border-primary"
                              : "bg-white text-slate-600 border-slate-200 hover:border-primary"
                          }`}
                        >
                          {s.startTime}
                          <span className="block text-xs font-normal mt-0.5">
                            {s.isFull ? "Full" : `${s.available} left`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Adults (${item.priceAdult} each)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.adults}
                    onChange={(e) => update("adults", Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">
                    Children (${item.priceChild} each)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.children}
                    onChange={(e) => update("children", Number(e.target.value))}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button disabled={!canGoStep2} onClick={() => setStep(2)}>Continue →</Button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-5">Your Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+250 ..."
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-600 mb-2">Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button disabled={!canGoStep3} onClick={() => setStep(3)}>Continue →</Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-dark mb-5">Review & Confirm</h2>
              <div className="space-y-3 text-slate-700">
                <Row label="Experience" value={item.title} />
                <Row label="Date" value={form.date} />
                <Row label="Time" value={form.slotTime} />
                <Row label="Adults" value={form.adults} />
                <Row label="Children" value={form.children} />
                <Row label="Name" value={form.name} />
                <Row label="Email" value={form.email} />
                <Row label="Phone" value={form.phone} />
                {form.country && <Row label="Country" value={form.country} />}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                💳 Payment gateway will be integrated later. Click "Confirm Booking" to reserve your slot.
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                <Button onClick={handleConfirm} disabled={submitting}>
                  {submitting ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <img src={item.image} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="font-bold text-dark mt-4">{item.title}</h3>
            <p className="text-sm text-slate-500">📍 {item.location}</p>

            <hr className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Adults × {form.adults}</span>
                <span>${form.adults * item.priceAdult}</span>
              </div>
              {form.children > 0 && (
                <div className="flex justify-between">
                  <span>Children × {form.children}</span>
                  <span>${form.children * item.priceChild}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-2">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold text-right ${highlight ? "text-primary" : ""}`}>
        {value}
      </span>
    </div>
  );
}