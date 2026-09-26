import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition ${
      isActive ? "text-primary" : "text-slate-600 hover:text-primary"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          🌍 Tourist in Rwanda
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/browse" className={linkClass}>Browse</NavLink>
          {isAuthenticated && <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold text-slate-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 font-medium text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-primary font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}