import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createListing, getUser } from "../lib/supabase";
import { Tag, MapPin, IndianRupee, MessageSquareCode, ArrowLeft } from "lucide-react";

export default function ListingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [component, setComponent] = useState(null);
  const [price, setPrice] = useState("");
  const [listingType, setListingType] = useState("sell");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Jaipur"];

  useEffect(() => {
    if (location.state?.component) {
      setComponent(location.state.component);
      setPrice(location.state.component.estimated_value_inr || "");
    } else {
      navigate("/profile");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!component) return;
    setLoading(true);
    setError("");
    try {
      const user = await getUser();
      if (!user) throw new Error("Please log in first!");
      await createListing({
        component_id: component.id,
        seller_id: user.id,
        price_inr: Number(price),
        listing_type: listingType,
        description,
        city: city || user.city || "Delhi",
      });
      navigate("/marketplace");
    } catch (err) {
      setError(err.message || "Failed to publish listing.");
    }
    setLoading(false);
  };

  if (!component) return null;

  return (
    <div className="min-h-screen bg-[#fafdfb] py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-slate-500 hover:text-[#0F9D8A] transition text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Back to Inventory
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#0F9D8A]" />
            Publish Marketplace Listing
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Expose your recovered hardware to regional tech enthusiasts, buyers, or students.
          </p>
        </div>

        {/* Component preview */}
        <div className="bg-white border border-[#e2ece6] rounded-2xl p-4 flex gap-4 items-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 flex-shrink-0">
            {component.image_url ? (
              <img src={component.image_url} alt={component.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">⚙️</span>
            )}
          </div>
          <div>
            <span className="text-[10px] text-[#0F9D8A] uppercase font-black tracking-wider block">Recovered Component</span>
            <h3 className="text-sm font-bold text-slate-800 mt-0.5">{component.name}</h3>
            <p className="text-xs text-slate-400 italic">{component.hindi_name}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#e2ece6] rounded-3xl p-6 space-y-5 shadow-sm">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-600 text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Asking Price (INR)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              <input
                type="number"
                required
                placeholder="Enter amount in rupees"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition"
              />
            </div>
            {price && !isNaN(price) && Number(price) > 0 && (
              <p className="text-[10px] text-[#0F9D8A] font-medium pl-1">
                * 3% platform fee applies. Your net earning: ₹{Math.round(Number(price) * 0.97)}
              </p>
            )}
          </div>

          {/* Listing type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Listing Type</label>
            <div className="flex gap-3">
              {["sell", "donate"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setListingType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition
                    ${listingType === type
                      ? "bg-[#0F9D8A] border-[#0F9D8A] text-white shadow-sm"
                      : "bg-[#f6faf8] border-[#d1e8e2] text-slate-600 hover:border-[#0F9D8A]/50"
                    }`}
                >
                  {type === "sell" ? "🏷️ Sell" : "🤝 Donate"}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Local Trading Hub / City</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-700 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition appearance-none cursor-pointer"
              >
                <option value="">Select city...</option>
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Description / Benchmarks</label>
            <div className="relative">
              <MessageSquareCode className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              <textarea
                rows={3}
                required
                placeholder="E.g. DDR4 RAM tested using MemTest86, zero errors. Contacts cleaned with isopropyl alcohol. Pulled from Dell Inspiron."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f6faf8] border border-[#d1e8e2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0F9D8A] focus:bg-white text-sm transition leading-relaxed"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F9D8A] hover:bg-[#0c7c6c] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition shadow-md shadow-[#0F9D8A]/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Publishing..." : "🏷️ Publish Listing to Marketplace"}
          </button>
        </form>
      </div>
    </div>
  );
}
