import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllListings, getUser, recordPurchase } from "../lib/supabase";
import MarketplaceCard from "../components/MarketplaceCard";
import ChatBox from "../components/ChatBox";
import { Search, Filter, SlidersHorizontal, MapPin, Award, CheckCircle, ChevronDown, Activity, ChevronRight, Tags } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [filters, setFilters] = useState({
    category: "", grade: "", minPrice: "", maxPrice: "", city: "", condition: "", verifiedOnly: false
  });
  const [sortBy, setSortBy] = useState("Newest");
  const [searchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur"];
  const categories = ["IC Chips", "Capacitors", "Resistors", "Motors", "Sensors", "Connectors", "Motherboards", "RAM", "Other"];

  useEffect(() => {
    // Pre-fill search from URL query param (e.g. from navbar search)
    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    loadListings();
  }, [filters]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      if (user) setCurrentUser(user);
      
      const data = await getAllListings(filters);
      setListings(data || []);
    } catch (err) {
      console.error("Error loading listings: ", err);
    }
    setLoading(false);
  };

  const filteredAndSorted = listings
    .filter(l => l.components?.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "Lowest Price") return a.price_inr - b.price_inr;
      if (sortBy === "Highest Price") return b.price_inr - a.price_inr;
      // Mocking Best Eco Impact and Most Trusted with Newest for now
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const handleBuy = async (listing) => {
    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SrVRaaDyufAVIb";
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

    try {
      const orderAmountPaise = Math.max(100, Math.round(listing.price_inr * 100));
      const orderResponse = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: orderAmountPaise, currency: "INR", receipt: `receipt_${listing.id}_${Date.now()}` })
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok || !orderData.success) throw new Error(orderData.error || "Failed to create order on server");

      const { order_id, amount, currency } = orderData;

      if (window.Razorpay) {
        const options = {
          key: razorpayKeyId, amount: amount, currency: currency, name: "ReCupare Marketplace",
          description: `Purchase ${listing.components?.name || "Hardware Component"}`,
          image: "https://api.dicebear.com/7.x/bottts/svg?seed=recupare", order_id: order_id,
          handler: async function (response) {
            try {
              const verifyResponse = await fetch(`${BACKEND_URL}/api/verify-payment`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature
                })
              });
              const verifyData = await verifyResponse.json();
              if (verifyResponse.ok && verifyData.success) {
                const user = await getUser();
                if (user) {
                  await recordPurchase({
                    buyer_id: user.id, listing_id: listing.id, razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id, amount_inr: listing.price_inr
                  }).catch(e => console.error("Could not record purchase in DB:", e));
                }
                setListings(prev => prev.filter(l => l.id !== listing.id));
                alert(`🎉 Payment Successful & Verified!\nPayment ID: ${response.razorpay_payment_id}\n\nThank you for choosing recovery! The seller will ship your component.`);
              } else {
                alert(`❌ Payment Verification Failed: ${verifyData.error || "Invalid Signature"}`);
              }
            } catch (verifyErr) {
              alert(`❌ Verification Request Failed: ${verifyErr.message}`);
            }
          },
          prefill: { name: "ReCupare Buyer", email: "buyer@recupare.com", contact: "9999999999" },
          theme: { color: "#0F9D8A" },
          modal: { ondismiss: function () { console.log("Razorpay checkout modal dismissed by user."); } }
        };
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) { alert(`❌ Payment Failed!\nReason: ${response.error.description}\nCode: ${response.error.code}`); });
        rzp.open();
      } else {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
      }
    } catch (err) {
      alert(`❌ Payment initialization failed: ${err.message}`);
    }
  };

  return (
    <div className="bg-[#fafdfb] min-h-screen text-slate-800 font-sans">
      
      {/* Top Floating Stats Banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 py-2.5 px-4 text-center flex items-center justify-center gap-2 relative z-10">
        <Activity size={16} className="text-[#0F9D8A]" />
        <p className="text-xs font-bold text-slate-700 tracking-wide">
          <span className="text-[#0F9D8A]">12,000+ Components Reused</span> This Month. Join the revolution!
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Left Sidebar Filters */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-3 lg:space-y-6 lg:sticky lg:top-[90px]">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setFiltersOpen(prev => !prev)}
            className="lg:hidden w-full flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Filter size={16} className="text-[#0F9D8A]" />
              Filters & Categories
              {(filters.category || filters.grade || filters.city || filters.minPrice || filters.maxPrice || filters.verifiedOnly) && (
                <span className="bg-[#0F9D8A] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">Active</span>
              )}
            </div>
            <SlidersHorizontal size={16} className={`text-slate-400 transition-transform duration-200 ${filtersOpen ? 'rotate-90' : ''}`} />
          </button>
          <div className={`bg-white rounded-3xl border border-slate-100 p-6 shadow-sm ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="hidden lg:flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Filter size={18} className="text-[#0F9D8A]" />
              <h2 className="text-base font-black text-slate-800 tracking-tight">Filters</h2>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
              <div className="space-y-2.5">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={filters.category === cat}
                      onChange={() => setFilters({ ...filters, category: cat })}
                      className="w-4 h-4 text-[#0F9D8A] bg-slate-50 border-slate-300 focus:ring-[#0F9D8A] focus:ring-2 rounded-sm cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#0F9D8A] transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quality Grade</h3>
              <select
                value={filters.grade}
                onChange={e => setFilters({ ...filters, grade: e.target.value })}
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#0F9D8A] focus:ring-1 focus:ring-[#0F9D8A]/20 text-sm transition appearance-none cursor-pointer"
              >
                <option value="">All Grades</option>
                <option value="A">Grade A (Like New)</option>
                <option value="B">Grade B (Functional)</option>
                <option value="C">Grade C (For Parts)</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range (₹)</h3>
               <div className="flex items-center gap-3">
                 <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0F9D8A]" />
                 <span className="text-slate-400">-</span>
                 <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0F9D8A]" />
               </div>
            </div>

             {/* City */}
             <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Location</h3>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <select
                  value={filters.city}
                  onChange={e => setFilters({ ...filters, city: e.target.value })}
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#0F9D8A] text-sm transition appearance-none cursor-pointer"
                >
                  <option value="">Anywhere in India</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Verified Sellers Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><CheckCircle size={16} className="text-[#0F9D8A]" /> Verified Sellers</span>
              <button 
                onClick={() => setFilters({...filters, verifiedOnly: !filters.verifiedOnly})}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.verifiedOnly ? 'bg-[#0F9D8A]' : 'bg-slate-200'}`}
              >
                <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${filters.verifiedOnly ? 'left-[22px]' : 'left-[3px]'}`}></div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Top Searching & Sorting Bar */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-3 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search components (e.g. RAM, Sensor, IC...)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F9D8A] focus:ring-1 focus:ring-[#0F9D8A]/20 text-sm transition"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap hidden lg:block">Sort By:</span>
              {["Newest", "Most Trusted", "Lowest Price", "Best Eco Impact"].map(sortOption => (
                <button
                  key={sortOption}
                  onClick={() => setSortBy(sortOption)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border
                    ${sortBy === sortOption 
                      ? "bg-[#0F9D8A]/10 text-[#0F9D8A] border-[#0F9D8A]/30 shadow-sm" 
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  {sortOption}
                </button>
              ))}
            </div>
          </div>

          {/* Breadcrumb / Active filters info */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 px-2">
            <Link to="/" className="hover:text-[#0F9D8A] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-slate-800 font-bold">Marketplace</span>
            {search && (
              <>
                <ChevronRight size={12} />
                <span>Search: "{search}"</span>
              </>
            )}
            <span className="ml-auto bg-[#0F9D8A]/10 text-[#0F9D8A] px-2 py-0.5 rounded-full font-bold">
              {filteredAndSorted.length} Results
            </span>
          </div>

          {/* Grid of Listings */}
          {loading ? (
            <div className="py-24">
              <LoadingSpinner message="Consulting platform ledger..." subtitle="Fetching active marketplace offers" />
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl py-24 px-6 text-center text-slate-500 max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                <Tags className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No Listings Identified</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                No listed hardware components matched your current search filters. Try widening your criteria or check back later!
              </p>
              <button 
                onClick={() => {setSearch(""); setFilters({category: "", grade: "", minPrice: "", maxPrice: "", city: "", condition: "", verifiedOnly: false})}}
                className="mt-4 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredAndSorted.map(listing => (
                <MarketplaceCard
                  key={listing.id}
                  listing={listing}
                  isOwner={currentUser && currentUser.id === listing.seller_id}
                  onBuy={handleBuy}
                  onChat={setActiveChat}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Real-time floating Chat Box Drawer */}
      {activeChat && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md shadow-2xl">
            <ChatBox listing={activeChat} onClose={() => setActiveChat(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
