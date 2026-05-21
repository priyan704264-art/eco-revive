import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUser, getUserComponents, signOut,
  getUserListings, getUserPurchases, getUserImpact
} from "../lib/supabase";
import ComponentCard from "../components/ComponentCard";
import DisassemblyGuide from "../components/DisassemblyGuide";
import {
  Mail, MapPin, Database, LogOut, ShoppingBag,
  ShieldAlert, CheckCircle, Leaf, Cpu, TrendingUp,
  Zap, Award, Trophy, BarChart2
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [components, setComponents] = useState([]);
  const [listings, setListings]   = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [impact, setImpact]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [dbError, setDbError]     = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [activeTab, setActiveTab] = useState("impact");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setDbError(null);
      try {
        const u = await getUser();
        if (!u) { navigate("/login"); return; }
        setUser(u);
        const [compData, listData, purchData, impactData] = await Promise.all([
          getUserComponents(u.id),
          getUserListings(u.id),
          getUserPurchases(u.id),
          getUserImpact(u.id),
        ]);
        setComponents(compData   || []);
        setListings(listData     || []);
        setPurchases(purchData   || []);
        if (impactData) {
          setImpact({
            total_components:   impactData.total_components   ?? impactData.components_recovered   ?? 0,
            total_co2_saved_kg: impactData.total_co2_saved_kg ?? impactData.co2_saved_kg           ?? 0,
            total_earned_inr:   impactData.total_earned_inr   ?? impactData.total_earnings_inr     ?? 0,
            waste_diverted_kg:  (impactData.total_components  ?? impactData.components_recovered   ?? 0) * 0.15,
          });
        } else {
          setImpact({ total_components: 0, total_co2_saved_kg: 0, total_earned_inr: 0, waste_diverted_kg: 0 });
        }
      } catch (err) {
        const msg = err.message || JSON.stringify(err);
        setDbError(msg.includes("schema cache") || msg.includes("relation") || msg.includes("PGRST205")
          ? "schema_cache" : msg);
      }
      setLoading(false);
    }
    load();
  }, [navigate]);

  const handleLogout = async () => {
    try { await signOut(); window.dispatchEvent(new Event("storage")); navigate("/login"); }
    catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner message="Opening member vault..." subtitle="Loading profile assets" />;
  if (!user) return null;

  const level = Math.floor((impact?.total_components || 0) / 10) + 1;
  const progressToNext = ((impact?.total_components || 0) % 10) * 10;

  const tabs = [
    { id: "impact",    label: "Impact",           icon: <Leaf size={15} /> },
    { id: "inventory", label: "Inventory",         icon: <Database size={15} />,   count: components.length },
    { id: "listings",  label: "My Listings",       icon: <ShoppingBag size={15} />, count: listings.length },
    { id: "purchases", label: "Purchases",         icon: <CheckCircle size={15} />, count: purchases.length },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 bg-[#fafdfb] min-h-screen">

      {/* DB error banner */}
      {dbError === "schema_cache" && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
          <ShieldAlert className="text-amber-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-amber-700 font-bold text-sm">Database Tables Not Initialized</h4>
            <p className="text-amber-600 text-xs mt-1">
              Run <code className="bg-amber-100 px-1 rounded">supabase_schema.sql</code> in your Supabase SQL editor.
            </p>
          </div>
        </div>
      )}

      {/* ── Profile card ── */}
      <div className="bg-white border border-[#e2ece6] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name || user.email || "user")}`}
              alt={user.name || "User"}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#0F9D8A]/20 shadow"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name || user.email || "Hub Member"}</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#0F9D8A]/10 border border-[#0F9D8A]/20 text-[#0F9D8A]">
                  Eco Level {level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user.city || "Delhi"} · Hub Member</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto md:mx-0">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium bg-[#f6faf8] rounded-xl px-3 py-2 border border-[#e2ece6]">
                <Mail size={13} className="text-slate-400" /><span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium bg-[#f6faf8] rounded-xl px-3 py-2 border border-[#e2ece6]">
                <MapPin size={13} className="text-slate-400" /><span>Hub: <strong className="text-slate-700">{user.city || "Delhi"}</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex-shrink-0 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-rose-500 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 group"
          >
            <LogOut size={14} className="group-hover:rotate-12 transition-transform" />Logout
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white border border-[#e2ece6] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-[#e2ece6] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold tracking-wide transition-all border-b-2 -mb-px whitespace-nowrap
                ${activeTab === tab.id
                  ? "border-[#0F9D8A] text-[#0F9D8A] bg-[#0F9D8A]/5"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-500 font-bold">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── IMPACT TAB ── */}
          {activeTab === "impact" && impact && (
            <div className="space-y-6">
              {/* Level progress banner */}
              <div className="bg-gradient-to-r from-emerald-800 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#0F9D8A]/30 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-0.5">Eco Level {level}</p>
                        <h3 className="text-lg font-black">Sustainability Pioneer</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-0.5">Score</p>
                        <p className="text-xl font-black">{impact.total_components * 15} <span className="text-emerald-400 text-sm">PTS</span></p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-[#0F9D8A] rounded-full transition-all duration-700"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">Recover {10 - (impact.total_components % 10)} more components to reach Level {level + 1}</p>
                  </div>
                  <div className="hidden sm:flex gap-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400"><Award size={22} /></div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400"><Leaf size={22} /></div>
                    <div className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-500"><Trophy size={22} /></div>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Components Recovered", value: impact.total_components,                          unit: "",   icon: <Cpu size={20} />,        color: "text-blue-500",    bg: "bg-blue-50" },
                  { label: "CO₂ Saved",             value: impact.total_co2_saved_kg.toFixed(1),            unit: "kg", icon: <Leaf size={20} />,       color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "E-Waste Diverted",      value: impact.waste_diverted_kg.toFixed(1),             unit: "kg", icon: <TrendingUp size={20} />, color: "text-teal-500",    bg: "bg-teal-50" },
                  { label: "Total Earnings",         value: `₹${impact.total_earned_inr}`,                  unit: "",   icon: <BarChart2 size={20} />,  color: "text-indigo-500",  bg: "bg-indigo-50" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#e2ece6] rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-black text-slate-800">{stat.value}<span className="text-base text-slate-400 ml-1">{stat.unit}</span></p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/scan")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white text-sm font-bold rounded-xl transition shadow-sm shadow-[#0F9D8A]/20"
                >
                  <Zap size={15} /> New Scan
                </button>
                <button
                  onClick={() => navigate("/marketplace")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e2ece6] hover:border-[#0F9D8A]/30 text-slate-700 text-sm font-bold rounded-xl transition"
                >
                  Browse Marketplace
                </button>
              </div>
            </div>
          )}

          {/* ── INVENTORY TAB ── */}
          {activeTab === "inventory" && (
            components.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                <Database className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="text-base font-bold text-slate-500">Vault Inventory Empty</h3>
                <p className="text-xs text-slate-400">You haven't scanned or saved components yet.</p>
                <button onClick={() => navigate("/scan")} className="px-5 py-2 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white text-xs font-bold rounded-xl transition">
                  Scan Component
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {components.map((comp) => (
                  <ComponentCard
                    key={comp.id}
                    component={comp}
                    onDisassemble={setActiveGuide}
                    onList={(c) => navigate("/list", { state: { component: c } })}
                  />
                ))}
              </div>
            )
          )}

          {/* ── LISTINGS TAB ── */}
          {activeTab === "listings" && (
            listings.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="text-base font-bold text-slate-500">No Active Listings</h3>
                <p className="text-xs text-slate-400">You haven't listed any recovered hardware yet.</p>
                <button onClick={() => setActiveTab("inventory")} className="px-5 py-2 border border-[#e2ece6] bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition">
                  Choose from Inventory
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((list) => {
                  const isSold = list.status === "sold";
                  return (
                    <div key={list.id} className={`bg-white border rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden transition
                      ${isSold ? "border-amber-200 opacity-75" : "border-[#e2ece6] hover:border-[#0F9D8A]/30 hover:shadow-sm"}`}>
                      {isSold && (
                        <div className="absolute -right-8 top-6 bg-amber-400 text-white text-[10px] font-black uppercase tracking-widest py-1 px-10 rotate-45 shadow">SOLD</div>
                      )}
                      <div>
                        <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded w-fit mb-3 block
                          ${isSold ? "text-amber-600 bg-amber-50 border border-amber-200" : "text-[#0F9D8A] bg-[#0F9D8A]/5 border border-[#0F9D8A]/20"}`}>
                          {isSold ? "Sold" : "Active"}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm leading-snug">{list.components?.name}</h4>
                        <p className="text-xs text-slate-400 italic mt-0.5">{list.components?.hindi_name}</p>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{list.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e2ece6]">
                        <div>
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Net (after 3% fee)</span>
                          <strong className={`text-base font-extrabold ${isSold ? "text-amber-500" : "text-[#0F9D8A]"}`}>₹{Math.round(list.price_inr * 0.97)}</strong>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl flex items-center gap-1.5">
                          <MapPin size={11} />{list.city}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ── PURCHASES TAB ── */}
          {activeTab === "purchases" && (
            purchases.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
                <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                <h3 className="text-base font-bold text-slate-500">No Purchases Yet</h3>
                <p className="text-xs text-slate-400">Items you buy from the marketplace will appear here.</p>
                <button onClick={() => navigate("/marketplace")} className="px-5 py-2 bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white text-xs font-bold rounded-xl transition">
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {purchases.map((p) => (
                  <div key={p.id} className="bg-white border border-[#e2ece6] rounded-2xl p-5 hover:border-[#0F9D8A]/30 hover:shadow-sm transition flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-[#0F9D8A] uppercase font-black tracking-wider bg-[#0F9D8A]/5 border border-[#0F9D8A]/20 px-2 py-0.5 rounded w-fit mb-3 block">
                        Order: {p.razorpay_order_id?.substring(0, 14)}...
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{p.listings?.components?.name || "Hardware Component"}</h4>
                      <p className="text-xs text-slate-400 italic mt-0.5">{p.listings?.components?.hindi_name}</p>
                      <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                        <p className="text-[10px] text-slate-400">TXN: <span className="text-slate-600">{p.razorpay_payment_id}</span></p>
                        <p className="text-[10px] text-slate-400">Date: <span className="text-slate-600">{new Date(p.created_at).toLocaleDateString()}</span></p>
                        <p className="text-[10px] text-slate-400">Status: <span className="text-[#0F9D8A] font-bold">{p.status?.toUpperCase()}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#e2ece6]">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Amount Paid</span>
                        <strong className="text-base text-[#0F9D8A] font-extrabold">₹{p.amount_inr}</strong>
                      </div>
                      <CheckCircle size={18} className="text-[#0F9D8A]" />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>

      {/* Disassembly guide overlay */}
      {activeGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8">
            <DisassemblyGuide componentName={activeGuide.name} deviceType="Laptop/PC" onClose={() => setActiveGuide(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
