import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { getUser } from "../lib/supabase";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const u = await getUser();
      setUser(u);
    }
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: "/",            label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/scan",        label: "Recycle" },
    { to: "/disassembly", label: "Disassembly Guide" },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b bg-[#fafdfb]/95 border-[#e2ece6] shadow-sm px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <img
            src="/logo.png"
            alt="ReCupare"
            className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          {/* Fallback text logo shown if image fails to load */}
          <div className="hidden flex-col">
            <span className="font-extrabold text-lg leading-none tracking-tight text-[#0F9D8A]">ReCupare</span>
            <span className="text-[8px] font-medium tracking-wider uppercase leading-none mt-0.5 text-slate-500">
              Recycle. Reuse. Rebuild.
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1.5 text-sm font-semibold tracking-wide transition-colors
                  ${isActive ? "text-[#0F9D8A]" : "text-slate-600 hover:text-[#0F9D8A]"}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#0F9D8A]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Search + Cart */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs font-medium border bg-[#f1f6f3] border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#0F9D8A] focus:bg-white focus:outline-none transition-all"
            />
          </form>
          <Link
            to="/marketplace"
            className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Marketplace"
          >
            <ShoppingCart size={16} />
          </Link>
        </div>

        {/* Auth buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Link to="/profile" className="flex items-center gap-2.5 group">
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || user.email || "user")}`}
                alt={user.name || "User"}
                className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-[#0F9D8A] transition-colors object-cover"
              />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0F9D8A] transition-colors">
                {(user.name || user.email || "User").split(" ")[0]}
              </span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-1.5 text-xs font-bold rounded-full border border-[#0F9D8A] text-[#0F9D8A] hover:bg-[#0F9D8A]/5 transition-all">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-1.5 text-xs font-bold rounded-full bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white shadow-sm shadow-[#0F9D8A]/20 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/marketplace" className="p-2 rounded-full border border-slate-200 text-slate-600 transition-colors">
            <ShoppingCart size={16} />
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 border-b border-slate-100 bg-white/95 backdrop-blur-lg lg:hidden flex flex-col p-5 gap-4 shadow-2xl">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs font-medium border bg-[#f1f6f3] border-slate-200 text-slate-800 focus:bg-white focus:outline-none transition-all"
            />
          </form>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition
                    ${isActive ? "bg-[#0F9D8A]/10 text-[#0F9D8A]" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <hr className="border-slate-100" />

          {user ? (
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 py-2.5 px-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition"
            >
              <img
                src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || user.email || "user")}`}
                alt={user.name || "User"}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{user.name || user.email || "Hub Member"}</p>
                <p className="text-xs text-slate-500">{user.city || "Delhi"}</p>
              </div>
            </Link>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 rounded-full font-bold text-sm text-center border border-[#0F9D8A] text-[#0F9D8A] hover:bg-[#0F9D8A]/5 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="py-2.5 rounded-full font-bold text-sm text-center text-white bg-[#0F9D8A] hover:bg-[#0c7c6c] transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
