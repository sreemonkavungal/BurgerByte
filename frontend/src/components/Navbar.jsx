import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const isAdminActive = isActive("/admin");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-lg font-semibold tracking-tight text-slate-800">
              BurgerByte
            </span>
          </Link>
        </div>

        {/* Center: Icon nav (only when logged in) */}
        {user && (
          <nav className="flex flex-1 justify-center">
            <div className="flex items-center gap-4 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              {/* Cart icon */}
              <Link
                to="/cart"
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
                  isActive("/cart")
                    ? "bg-amber-100 text-amber-600 border border-amber-300"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                🛒
              </Link>

              {/* Favorites icon */}
              <Link
                to="/favorites"
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
                  isActive("/favorites")
                    ? "bg-amber-100 text-amber-600 border border-amber-300"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ❤️
              </Link>

              {/* Orders icon */}
              <Link
                to="/orders"
                className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
                  isActive("/orders")
                    ? "bg-amber-100 text-amber-600 border border-amber-300"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                📦
              </Link>
            </div>
          </nav>
        )}

        {/* Right: Auth + Admin */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Admin dashboard button for admins */}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    isAdminActive
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base">📊</span>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              <span className="hidden sm:inline text-sm text-slate-700">
                Hi, <span className="font-medium">{user.name}</span>
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-amber-400 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
