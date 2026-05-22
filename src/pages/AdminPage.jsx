import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUser, isAdmin,
  getAdminStats, adminGetAllUsers, adminGetAllListings,
  adminGetAllPurchases, adminDeleteListing,
  adminToggleUserBan, adminToggleVerified, adminUpdateListingStatus
} from "../lib/supabase";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  Users, ShoppingBag, BarChart2, Trash2, CheckCircle,
  XCircle, ShieldCheck, ShieldAlert, TrendingUp, Cpu,
  Leaf, IndianRupee, Activity, RefreshCw, Eye, Ban,
  Package, CreditCard, Search, ChevronDown, AlertTriangle
} from "lucide-react";

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, unit = "", icon, color, bg }) {
  return (
    <div className="bg-white border border-[#e2ece6] rounded-2xl p-5 flex items-start gap-4 shadow-sm">
      <div className={`w-11 h-11 rounded-xl ${bg} ${color} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800 leading-none">
          {value}<span className="text-sm text-slate-400 ml-1 font-medium">{unit}</span>
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ label, color }) {
  const map = {
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    red:    "bg-rose-50 text-rose-700 border-rose-200",
    amber:  "bg-amber-50 text-amber-700 border-amber-200",
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[color] || map.slate}`}>
      {label}
    </span>
  );
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading]     = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [listings, setListings]   = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch]       = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      setLoading(true);
      const user = await getUser();
      if (!user) { navigate("/login"); return; }
      const admin = await isAdmin();
      if (!admin) { navigate("/"); return; }
      setAuthorized(true);
      await loadAll();
      setLoading(false);
    }
    init();
  }, []);

  async function loadAll() {
    const [s, u, l, p] = await Promise.all([
      getAdminStats(),
      adminGetAllUsers(),
      adminGetAllListings(),
      adminGetAllPurchases(),
    ]);
    setStats(s);
    setUsers(u || []);
    setListings(l || []);
    setPurchases(p || []);
  }

  async function handleDeleteListing(id) {
    if (!confirm("Delete this listing permanently?")) return;
    setActionLoading(id);
    await adminDeleteListing(id);
    setListings(prev => prev.filter(l => l.id !== id));
    setActionLoading(null);
  }

  async function handleBanUser(userId, banned) {
    setActionLoading(userId);
    await adminToggleUserBan(userId, banned);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_banned: banned } : u));
    setActionLoading(null);
  }

  async function handleVerifyUser(userId, verified) {
    setActionLoading(userId);
    await adminToggleVerified(userId, verified);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified } : u));
    setActionLoading(null);
  }

  async function handleListingStatus(id, status) {
    setActionLoading(id);
    await adminUpdateListingStatus(id, status);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    setActionLoading(null);
  }

  if (loading) return <LoadingSpinner message="Verifying admin access..." subtitle="Checking permissions" />;
  if (!authorized) return null;

  const tabs = [
    { id: "dashboard", label: "Dashboard",  icon: <BarChart2 size={15} /> },
    { id: "users",     label: "Users",       icon: <Users size={15} />,      count: users.length },
    { id: "listings",  label: "Listings",    icon: <ShoppingBag size={15} />, count: listings.length },
    { id: "purchases", label: "Purchases",   icon: <CreditCard size={15} />,  count: purchases.length },
  ];

  // ── Filtered data ─────────────────────────────────────────────────────────
  const q = search.toLowerCase();
  const filteredUsers    = users.filter(u =>
    u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.city?.toLowerCase().includes(q)
  );
  const filteredListings = listings.filter(l =>
    l.components?.name?.toLowerCase().includes(q) || l.users?.name?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q)
  );
  const filteredPurchases = purchases.filter(p =>
    p.users?.name?.toLowerCase().includes(q) || p.users?.email?.toLowerCase().includes(q) ||
    p.razorpay_payment_id?.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-screen bg-[#f4f7f5]">

      {/* Top admin bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#0F9D8A] flex items-center justify-center">
            <ShieldCheck size={14} />
          </div>
          <div>
            <p className="text-xs font-black tracking-wider uppercase">ReCupare Admin</p>
            <p className="text-[9px] text-slate-400 font-medium">Control Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAll}
            className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-[10px] font-bold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            ← Back to App
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Tabs */}
        <div className="bg-white border border-[#e2ece6] rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-[#e2ece6] overflow-x-auto hide-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch(""); }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 -mb-px whitespace-nowrap
                  ${activeTab === tab.id
                    ? "border-[#0F9D8A] text-[#0F9D8A] bg-[#0F9D8A]/5"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-500 font-bold">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">

            {/* ── DASHBOARD ── */}
            {activeTab === "dashboard" && stats && (
              <div className="space-y-6">
                <h2 className="text-lg font-black text-slate-800">Platform Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Total Users"      value={stats.total_users}      icon={<Users size={18}/>}       color="text-blue-500"    bg="bg-blue-50" />
                  <StatCard label="Active Listings"  value={stats.active_listings}  icon={<ShoppingBag size={18}/>} color="text-emerald-500" bg="bg-emerald-50" />
                  <StatCard label="Total Sales"      value={stats.sold_listings}    icon={<TrendingUp size={18}/>}  color="text-violet-500"  bg="bg-violet-50" />
                  <StatCard label="Total Revenue"    value={`₹${stats.total_revenue_inr?.toLocaleString()}`} icon={<IndianRupee size={18}/>} color="text-amber-500" bg="bg-amber-50" />
                  <StatCard label="Components"       value={stats.total_components} icon={<Cpu size={18}/>}         color="text-teal-500"    bg="bg-teal-50" />
                  <StatCard label="CO₂ Saved"        value={Number(stats.total_co2_saved || 0).toFixed(1)} unit="kg" icon={<Leaf size={18}/>} color="text-green-600" bg="bg-green-50" />
                  <StatCard label="Total Purchases"  value={stats.total_purchases}  icon={<CreditCard size={18}/>}  color="text-indigo-500"  bg="bg-indigo-50" />
                  <StatCard label="All Listings"     value={stats.total_listings}   icon={<Package size={18}/>}     color="text-slate-500"   bg="bg-slate-100" />
                </div>

                {/* Recent activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
                  {/* Recent users */}
                  <div className="bg-[#f6faf8] rounded-2xl border border-[#e2ece6] p-4">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users size={13} className="text-[#0F9D8A]" /> Recent Users
                    </h3>
                    <div className="space-y-2">
                      {users.slice(0, 5).map(u => (
                        <div key={u.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-[#e2ece6]">
                          <img src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.email}`}
                            alt={u.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{u.name || u.email}</p>
                            <p className="text-[9px] text-slate-400">{u.city || "—"}</p>
                          </div>
                          {u.is_banned && <Badge label="Banned" color="red" />}
                          {u.verified && <Badge label="Verified" color="green" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent listings */}
                  <div className="bg-[#f6faf8] rounded-2xl border border-[#e2ece6] p-4">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShoppingBag size={13} className="text-[#0F9D8A]" /> Recent Listings
                    </h3>
                    <div className="space-y-2">
                      {listings.slice(0, 5).map(l => (
                        <div key={l.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-[#e2ece6]">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <Package size={13} className="text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{l.components?.name || "Component"}</p>
                            <p className="text-[9px] text-slate-400">{l.users?.name || "Seller"} · {l.city}</p>
                          </div>
                          <span className="text-xs font-black text-[#0F9D8A]">₹{l.price_inr}</span>
                          <Badge label={l.status} color={l.status === "active" ? "green" : l.status === "sold" ? "blue" : "amber"} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {activeTab === "users" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-800">All Users <span className="text-slate-400 font-medium text-sm">({filteredUsers.length})</span></h2>
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search name, email, city..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F9D8A]" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#e2ece6]">
                  <table className="w-full text-xs">
                    <thead className="bg-[#f6faf8] border-b border-[#e2ece6]">
                      <tr>
                        {["User", "Email", "City", "Joined", "Status", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2ece6] bg-white">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className={`hover:bg-slate-50 transition ${u.is_banned ? "opacity-60" : ""}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.email}`}
                                alt={u.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                              <div>
                                <p className="font-bold text-slate-800">{u.name || "—"}</p>
                                {u.is_admin && <Badge label="Admin" color="blue" />}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{u.email}</td>
                          <td className="px-4 py-3 text-slate-500">{u.city || "—"}</td>
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {u.is_banned  && <Badge label="Banned"   color="red" />}
                              {u.verified   && <Badge label="Verified" color="green" />}
                              {!u.is_banned && !u.verified && <Badge label="Active" color="slate" />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {/* Ban / Unban */}
                              <button
                                onClick={() => handleBanUser(u.id, !u.is_banned)}
                                disabled={actionLoading === u.id || u.is_admin}
                                title={u.is_banned ? "Unban user" : "Ban user"}
                                className={`p-1.5 rounded-lg border transition disabled:opacity-40
                                  ${u.is_banned
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    : "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100"}`}
                              >
                                {actionLoading === u.id
                                  ? <RefreshCw size={12} className="animate-spin" />
                                  : u.is_banned ? <CheckCircle size={12} /> : <Ban size={12} />}
                              </button>
                              {/* Verify / Unverify */}
                              <button
                                onClick={() => handleVerifyUser(u.id, !u.verified)}
                                disabled={actionLoading === u.id}
                                title={u.verified ? "Remove verification" : "Verify seller"}
                                className={`p-1.5 rounded-lg border transition disabled:opacity-40
                                  ${u.verified
                                    ? "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                                    : "border-[#0F9D8A]/30 bg-[#0F9D8A]/5 text-[#0F9D8A] hover:bg-[#0F9D8A]/10"}`}
                              >
                                <ShieldCheck size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">No users found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── LISTINGS ── */}
            {activeTab === "listings" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-800">All Listings <span className="text-slate-400 font-medium text-sm">({filteredListings.length})</span></h2>
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search component, seller, city..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F9D8A]" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#e2ece6]">
                  <table className="w-full text-xs">
                    <thead className="bg-[#f6faf8] border-b border-[#e2ece6]">
                      <tr>
                        {["Component", "Seller", "Price", "City", "Status", "Listed On", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2ece6] bg-white">
                      {filteredListings.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-800 max-w-[140px] truncate">{l.components?.name || "—"}</p>
                            <p className="text-[9px] text-slate-400">Grade {l.components?.grade || "?"}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-[120px] truncate">{l.users?.name || "—"}</td>
                          <td className="px-4 py-3 font-black text-[#0F9D8A]">₹{l.price_inr}</td>
                          <td className="px-4 py-3 text-slate-500">{l.city || "—"}</td>
                          <td className="px-4 py-3">
                            <Badge
                              label={l.status}
                              color={l.status === "active" ? "green" : l.status === "sold" ? "blue" : "amber"}
                            />
                          </td>
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{new Date(l.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {/* Toggle active/inactive */}
                              {l.status !== "sold" && (
                                <button
                                  onClick={() => handleListingStatus(l.id, l.status === "active" ? "inactive" : "active")}
                                  disabled={actionLoading === l.id}
                                  title={l.status === "active" ? "Deactivate" : "Activate"}
                                  className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100 transition disabled:opacity-40"
                                >
                                  {actionLoading === l.id
                                    ? <RefreshCw size={12} className="animate-spin" />
                                    : <Eye size={12} />}
                                </button>
                              )}
                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteListing(l.id)}
                                disabled={actionLoading === l.id}
                                title="Delete listing"
                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 transition disabled:opacity-40"
                              >
                                {actionLoading === l.id
                                  ? <RefreshCw size={12} className="animate-spin" />
                                  : <Trash2 size={12} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredListings.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">No listings found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── PURCHASES ── */}
            {activeTab === "purchases" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-800">All Purchases <span className="text-slate-400 font-medium text-sm">({filteredPurchases.length})</span></h2>
                  <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Search buyer, payment ID..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0F9D8A]" />
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#e2ece6]">
                  <table className="w-full text-xs">
                    <thead className="bg-[#f6faf8] border-b border-[#e2ece6]">
                      <tr>
                        {["Buyer", "Component", "Amount", "Payment ID", "Date", "Status"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2ece6] bg-white">
                      {filteredPurchases.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-800">{p.users?.name || "—"}</p>
                            <p className="text-[9px] text-slate-400 truncate max-w-[120px]">{p.users?.email || ""}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">
                            {p.listings?.components?.name || "Component"}
                          </td>
                          <td className="px-4 py-3 font-black text-[#0F9D8A]">₹{p.amount_inr}</td>
                          <td className="px-4 py-3 text-slate-400 font-mono text-[9px] max-w-[140px] truncate">
                            {p.razorpay_payment_id || "—"}
                          </td>
                          <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <Badge label={p.status || "completed"} color="green" />
                          </td>
                        </tr>
                      ))}
                      {filteredPurchases.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 text-sm">No purchases found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
