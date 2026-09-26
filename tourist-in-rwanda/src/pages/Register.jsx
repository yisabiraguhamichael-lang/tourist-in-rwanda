import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    country: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (f, v) => setForm((s) => ({ ...s, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("Please fill in all required fields.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (form.password !== form.confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        country: form.country,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <Link to="/" className="text-2xl font-bold text-primary block text-center">
          🌍 Tourist in Rwanda
        </Link>
        <h1 className="text-2xl font-bold text-dark text-center mt-6">Create Your Account</h1>
        <p className="text-slate-500 text-center text-sm mt-1">
          Start booking your Rwandan adventure
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Full Name *" value={form.name} onChange={(v) => update("name", v)} placeholder="John Doe" />
          <Input label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="you@example.com" />
          <Input label="Password *" type="password" value={form.password} onChange={(v) => update("password", v)} placeholder="At least 6 characters" />
          <Input label="Confirm Password *" type="password" value={form.confirm} onChange={(v) => update("confirm", v)} placeholder="Re-enter password" />
          <Input label="Country" value={form.country} onChange={(v) => update("country", v)} placeholder="e.g. United States" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}